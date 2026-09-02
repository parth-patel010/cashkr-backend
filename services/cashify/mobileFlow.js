import { openSessionPage, readMeta } from './sessionManager.js';
import {
  acquireQuoteLock,
  releaseQuoteLock,
  saveDebug,
  findPriceInObject,
  startCalculator,
  openProductPage,
  runQuoteLoop,
  ensureDir,
  config,
  clickLabel,
  clickYesNo,
  clickContinue,
} from './flowHelpers.js';
import {
  classifyMobileQuestion,
  MOBILE_AGE,
  MOBILE_AGE_CASHIFY_LABELS,
  ageLabelsForQuiz,
  MOBILE_PHYSICAL_LABELS,
  MOBILE_TECHNICAL_LABELS,
  MOBILE_SCREEN_PHYSICAL_DEFAULT,
  MOBILE_SCREEN_PHYSICAL_DETAIL_LABELS,
  MOBILE_PANEL_CONDITION_LABELS,
  MOBILE_BENT_CONDITION_LABELS,
  looksLikeAgeQuestion,
  looksLikeGeneralScreenPage,
  looksLikeScreenSpotDetailPage,
  looksLikeScreenScratchDetailPage,
  looksLikeResultSummary,
  looksLikeEsimQuestion,
  hasAgeOptionLabels,
} from './selectors.js';

async function cardText(page, modelName) {
  const text = await page.locator('body').innerText().catch(() => '');
  const marker = modelName ? `\n${modelName}` : '';
  const start = text.indexOf('\nMore\n');
  const end = marker ? text.indexOf(marker) : -1;
  if (start >= 0 && end > start) return text.slice(start + 6, end).trim();
  return text.slice(0, 1200);
}

function normalizeStorageKey(storage) {
  return String(storage || '')
    .replace(/\s*\/\s*/g, '/')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Parse quiz storage into comparable parts. Supports "8 GB/256 GB", "256GB", "1 TB". */
function parseStorageParts(storage) {
  const norm = normalizeStorageKey(storage);
  const compact = norm.replace(/\s+/g, '').toLowerCase();
  const ramStorageMatch = norm.match(/(\d+)\s*GB\s*\/\s*(\d+)\s*(GB|TB)/i)
    || compact.match(/^(\d+)gb\/(\d+)(gb|tb)$/i);
  const storageOnlyMatch = norm.match(/^(\d+(?:\.\d+)?)\s*(GB|TB)$/i)
    || compact.match(/^(\d+(?:\.\d+)?)(gb|tb)$/i);

  const ramGb = ramStorageMatch?.[1] || null;
  const storageAmount = ramStorageMatch?.[2] || storageOnlyMatch?.[1] || null;
  const storageUnit = (ramStorageMatch?.[3] || storageOnlyMatch?.[2] || 'GB').toUpperCase();

  const labels = [];
  if (ramGb && storageAmount) {
    labels.push(`${ramGb} GB/${storageAmount} ${storageUnit}`);
    labels.push(`${ramGb}GB/${storageAmount}${storageUnit}`);
  }
  if (storageAmount) {
    labels.push(`${storageAmount} ${storageUnit}`);
    labels.push(`${storageAmount}${storageUnit}`);
  }

  return {
    ramGb,
    storageAmount,
    storageUnit,
    storageCompact: compact,
    preferredLabels: [...new Set(labels)],
  };
}

export async function pickMobileVariant(page, modelName, storage) {
  const body = await page.locator('body').innerText().catch(() => '');
  if (!/choose a variant|select variant|pick a variant/i.test(body)) return false;

  const parts = parseStorageParts(storage);
  const beforeUrl = page.url();

  const result = await page.evaluate(({ parts }) => {
    const normalize = (s) => String(s || '').replace(/\s+/g, ' ').trim();
    const compact = (s) => normalize(s).replace(/\s+/g, '').toLowerCase();
    const visible = (n) => n && (n.offsetParent || n.getClientRects().length);
    const nodes = [...document.querySelectorAll('a, button, div, span, p, li, label')];

    const headerIdx = nodes.findIndex((n) => /choose a variant/i.test(normalize(n.innerText)));
    let endIdx = nodes.length;
    if (headerIdx >= 0) {
      const nextIdx = nodes.findIndex((n, i) => i > headerIdx && /get exact value|top selling|top models|follow us on/i.test(normalize(n.innerText)));
      if (nextIdx >= 0) endIdx = nextIdx;
    }
    const sectionNodes = headerIdx >= 0 ? nodes.slice(headerIdx, endIdx) : nodes;

    const isRamStorage = (t) => /^\d+\s*GB\s*\/\s*\d+(?:\.\d+)?\s*(GB|TB)$/i.test(t);
    const isStorageOnly = (t) => /^\d+(?:\.\d+)?\s*(GB|TB)$/i.test(t);
    const isVariantLabel = (t) => isRamStorage(t) || isStorageOnly(t);

    const scoreNode = (n) => {
      const t = normalize(n.innerText || n.textContent || '');
      if (!isVariantLabel(t) || !visible(n)) return 0;
      // Prefer leaf-ish labels (exact text) over huge wrappers
      if (t.length > 40) return 0;
      const c = compact(t);
      let score = 1;

      for (const label of parts.preferredLabels || []) {
        if (c === compact(label)) score = Math.max(score, 200);
      }

      if (parts.ramGb && parts.storageAmount) {
        const m = t.match(/(\d+)\s*GB\s*\/\s*(\d+(?:\.\d+)?)\s*(GB|TB)/i);
        if (m && m[1] === parts.ramGb && m[2] === parts.storageAmount
          && m[3].toUpperCase() === parts.storageUnit) {
          score = Math.max(score, 180);
        }
      }

      if (parts.storageAmount) {
        const m = t.match(/^(\d+(?:\.\d+)?)\s*(GB|TB)$/i);
        if (m && m[1] === parts.storageAmount && m[2].toUpperCase() === parts.storageUnit) {
          score = Math.max(score, 160);
        }
        const ramM = t.match(/(\d+)\s*GB\s*\/\s*(\d+(?:\.\d+)?)\s*(GB|TB)/i);
        if (ramM && ramM[2] === parts.storageAmount
          && ramM[3].toUpperCase() === parts.storageUnit) {
          score = Math.max(score, 140);
        }
      }

      if (parts.storageCompact && c === parts.storageCompact) score = Math.max(score, 150);
      // Prefer real links (iPhone navigates to variant slug pages)
      if (n.closest?.('a[href]') || n.tagName === 'A') score += 15;
      return score;
    };

    const scored = sectionNodes
      .map((n) => ({ n, score: scoreNode(n) }))
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score);

    const best = scored.find((x) => x.score >= 140) || scored[0];
    if (!best) return { clicked: false };

    const clickTarget = best.n.closest?.('a[href]') || best.n;
    const href = clickTarget.tagName === 'A' ? clickTarget.href : (clickTarget.closest?.('a')?.href || null);
    clickTarget.scrollIntoView({ block: 'center', inline: 'center' });
    clickTarget.click();
    return { clicked: true, href };
  }, { parts });

  if (!result?.clicked) {
    for (const label of parts.preferredLabels) {
      try {
        await clickLabel(page, label);
        await page.waitForTimeout(600);
        return true;
      } catch {
        // try next label
      }
    }
    return false;
  }

  // iPhone-style variants navigate to used-...-12-gb-256-gb pages
  if (result.href && result.href !== beforeUrl) {
    try {
      await page.waitForURL((url) => String(url) !== beforeUrl, { timeout: 8000 });
    } catch {
      if (page.url() === beforeUrl) {
        await page.goto(result.href, { waitUntil: 'domcontentloaded' });
      }
    }
  } else {
    await page.waitForTimeout(800);
  }

  return true;
}

async function clickYesNoByIndex(page, questionIndex, yes) {
  const label = yes ? 'Yes' : 'No';
  const locator = page.getByText(label, { exact: true });
  const count = await locator.count();
  if (questionIndex < count) {
    await locator.nth(questionIndex).click({ force: true, timeout: 5000 });
  } else {
    await clickYesNo(page, yes);
  }
  await page.waitForTimeout(300);
}

async function clickYesNoNearText(page, questionSnippet, yes) {
  const clicked = await page.evaluate(({ questionSnippet, yes }) => {
    const normalize = (s) => String(s || '').replace(/\s+/g, ' ').trim();
    const wantQ = normalize(questionSnippet).toLowerCase();
    const wantA = yes ? 'Yes' : 'No';
    const nodes = [...document.querySelectorAll('div, span, p, h1, h2, h3, h4, label, button')];
    const qNode = nodes.find((n) => {
      const t = normalize(n.innerText || '');
      return t.length < 180 && t.toLowerCase().includes(wantQ) && (n.offsetParent || n.getClientRects().length);
    });
    if (!qNode) return false;

    let container = qNode;
    for (let i = 0; i < 8 && container; i += 1) {
      const answers = [...container.querySelectorAll('div, span, button, label, p')].filter((n) => {
        const t = normalize(n.innerText || '');
        return t === wantA && (n.offsetParent || n.getClientRects().length);
      });
      if (answers.length) {
        const target = answers[answers.length - 1];
        target.scrollIntoView({ block: 'center' });
        target.click();
        return true;
      }
      container = container.parentElement;
    }
    return false;
  }, { questionSnippet, yes });

  if (!clicked) {
    // fallback: leave to index-based caller
    return false;
  }
  await page.waitForTimeout(250);
  return true;
}

async function clickLabelNearText(page, questionSnippet, labels) {
  const list = Array.isArray(labels) ? labels : [labels];
  for (const label of list) {
    const clicked = await page.evaluate(({ questionSnippet, label }) => {
      const normalize = (s) => String(s || '').replace(/\s+/g, ' ').trim();
      const wantQ = normalize(questionSnippet).toLowerCase();
      const wantA = normalize(label);
      const nodes = [...document.querySelectorAll('div, span, p, h1, h2, h3, h4, label, button')];
      const qNode = nodes.find((n) => {
        const t = normalize(n.innerText || '');
        return t.length < 220 && t.toLowerCase().includes(wantQ) && (n.offsetParent || n.getClientRects().length);
      });
      if (!qNode) return false;
      let container = qNode;
      for (let i = 0; i < 8 && container; i += 1) {
        const answers = [...container.querySelectorAll('div, span, button, label, p, a')].filter((n) => {
          const t = normalize(n.innerText || '');
          return t === wantA && (n.offsetParent || n.getClientRects().length);
        });
        if (answers.length) {
          const target = answers[answers.length - 1];
          target.scrollIntoView({ block: 'center' });
          target.click();
          return true;
        }
        container = container.parentElement;
      }
      return false;
    }, { questionSnippet, label });
    if (clicked) {
      await page.waitForTimeout(250);
      return true;
    }
  }
  return false;
}

async function answerDeviceConditionQuestions(page, quiz) {
  const text = await page.locator('body').innerText().catch(() => '');
  const hasCalls = /make and receive calls|able to make calls/i.test(text);
  const hasTouch = /touch screen/i.test(text);
  const hasOriginal = /screen original|original screen/i.test(text);
  const hasWarranty = /under manufacturer warranty|under warranty/i.test(text);
  const hasGstBill = /gst valid bill|bill with the same imei/i.test(text);
  const hasEsimCount = /how many esims|dual esim|single esim/i.test(text);

  // Prefer question-scoped clicks — multiple Yes/No pairs share the same page.
  if (hasCalls) {
    const ok = await clickYesNoNearText(page, 'make and receive calls', quiz.ableToMakeCalls !== false);
    if (!ok) {
      const ok2 = await clickYesNoNearText(page, 'able to make calls', quiz.ableToMakeCalls !== false);
      if (!ok2) await clickYesNoByIndex(page, 0, quiz.ableToMakeCalls !== false);
    }
  }
  if (hasTouch) {
    const ok = await clickYesNoNearText(page, 'touch screen', quiz.isTouchScreenWorking !== false);
    if (!ok) await clickYesNoByIndex(page, 1, quiz.isTouchScreenWorking !== false);
  }
  if (hasOriginal) {
    const ok = await clickYesNoNearText(page, 'screen original', quiz.isScreenOriginal !== false);
    if (!ok) {
      const ok2 = await clickYesNoNearText(page, 'original screen', quiz.isScreenOriginal !== false);
      if (!ok2) await clickYesNoByIndex(page, 2, quiz.isScreenOriginal !== false);
    }
  }
  if (hasWarranty) {
    const ok = await clickYesNoNearText(page, 'manufacturer warranty', !!quiz.underWarranty);
    if (!ok) await clickYesNoByIndex(page, 3, !!quiz.underWarranty);
  }
  if (hasGstBill) {
    const accessories = quiz.accessories || [];
    const hasBill = Array.isArray(accessories)
      ? accessories.some((a) => /bill/i.test(String(a)))
      : /bill/i.test(String(accessories));
    const wantBill = !!quiz.underWarranty && hasBill;
    let ok = await clickYesNoNearText(page, 'Do you have GST valid bill', wantBill);
    if (!ok) ok = await clickYesNoNearText(page, 'bill with the same IMEI', wantBill);
    if (!ok) await clickYesNoByIndex(page, 4, wantBill);
  }
  if (hasEsimCount) {
    const mode = String(quiz.eSIMSupport || quiz.esimSupport || '').toLowerCase();
    const dual = /dual/.test(mode);
    await clickLabelNearText(page, 'eSIM', dual ? ['Dual eSIM'] : ['Single eSIM']);
  }

  await page.waitForTimeout(400);
  await clickContinue(page);
}

async function answerGeneralScreen(page, quiz) {
  await answerDeviceConditionQuestions(page, quiz);
}

async function answerAge(page, quiz) {
  const labels = ageLabelsForQuiz(quiz.deviceAge);
  let clicked = await clickFirstVisible(page, labels);
  if (!clicked) {
    for (const label of labels) {
      clicked = await clickLabel(page, label);
      if (clicked) break;
    }
  }
  if (!clicked) {
    for (const want of labels) {
      await page.evaluate((label) => {
        const normalize = (s) => String(s || '').replace(/\s+/g, ' ').trim();
        const wantNorm = normalize(label).toLowerCase();
        const nodes = [...document.querySelectorAll('div, span, button, label, p, li')];
        const target = nodes.find((n) => {
          const t = normalize(n.innerText || n.textContent || '');
          return (t.toLowerCase() === wantNorm || t.toLowerCase().startsWith(wantNorm))
            && (n.offsetParent || n.getClientRects().length);
        });
        target?.scrollIntoView({ block: 'center' });
        target?.click();
      }, want);
      await page.waitForTimeout(300);
      clicked = true;
      break;
    }
  }
  await page.waitForTimeout(700);
  await clickContinue(page);
  await page.waitForTimeout(900);
}

async function questionHead(page) {
  const scoped = await page.evaluate(() => {
    const normalize = (s) => String(s || '').replace(/\s+/g, ' ').trim();
    const visible = (n) => n && (n.offsetParent || n.getClientRects().length);
    const continueBtn = [...document.querySelectorAll('button')].find((b) =>
      /^continue$/i.test(normalize(b.innerText)),
    );

    if (continueBtn) {
      let container = continueBtn.parentElement;
      for (let depth = 0; depth < 14 && container; depth += 1) {
        const text = normalize(container.innerText || '');
        if (
          text.length >= 20
          && text.length <= 2500
          && (/make and receive calls|touch screen|original screen|select the|tell us more|functional or physical|do you have the following|choose a variant|age of your|age of the|what is your mobile age|how old|under warranty|screen\/body defects|spots on screen|visible line|discoloration|screen physical|screen cracked|outer screen|0 - 3 month|below 3 month|6 - 11 month|6 months - 11 month|above 11 month|physical sim|dual esim|single esim|esim/i.test(text))
        ) {
          return text.slice(0, 900);
        }
        container = container.parentElement;
      }
    }

    const body = document.body?.innerText || '';
    const moreIdx = body.indexOf('\nMore\n');
    if (moreIdx < 0) return body.slice(0, 500);
    let afterMore = body.slice(moreIdx + 6);
    afterMore = afterMore.replace(/Please answer the .*?\n+/gi, '');
    const stops = ['\nContinue\n', '\nDevice Evaluation\n', '\nFollow us on\n'];
    let end = afterMore.length;
    for (const stop of stops) {
      const idx = afterMore.indexOf(stop);
      if (idx >= 0 && idx < end) end = idx;
    }
    return afterMore.slice(0, end).slice(0, 900);
  }).catch(() => '');

  const lines = String(scoped).split('\n').map((l) => l.trim()).filter(Boolean);
  const questionLine = lines.find((l) => (
    /\?$/.test(l)
    || /^(how old|what is the age|age of your|select the|tell us more|do you have the following|make and receive|functional or physical|choose a variant)/i.test(l)
  ));
  if (questionLine) return questionLine;
  return lines.slice(0, 8).join('\n');
}

async function answerIssueList(page, issues, labelMap) {
  const list = Array.isArray(issues) ? issues : [];
  if (!list.length) {
    const noIssueLabels = [
      'No Issues',
      'No issues',
      'No functional issues',
      'No Functional Issues',
      'My device is working fine',
      'Working Fine',
      'None of the above',
    ];
    for (const label of noIssueLabels) {
      const hit = await clickLabel(page, label);
      if (hit) break;
    }
    await clickContinue(page);
    return;
  }
  for (const id of list) {
    const label = labelMap[id];
    if (!label) continue;
    const hit = await clickLabel(page, label);
    if (!hit) {
      // try shorter/legacy aliases
      const aliases = {
        'Broken/scratch on device screen': ['Glass Crack', 'Broken/scratch on device screen'],
        'Scratch/Dent on device body': ['Back Panel Damage', 'Scratch/Dent on device body'],
        'Device panel missing/broken': ['Device panel missing/broken', 'Panel Missing'],
        'Camera Glass Broken': ['Camera Glass Broken'],
      };
      for (const alt of aliases[label] || []) {
        // eslint-disable-next-line no-await-in-loop
        if (await clickLabel(page, alt)) break;
      }
    }
  }
  await page.waitForTimeout(400);
  await clickContinue(page);
}

async function answerAccessories(page, quiz) {
  const accessories = quiz.accessories || [];
  const accList = Array.isArray(accessories) ? accessories : [accessories].filter(Boolean);
  const hasBill = accList.some((a) => /bill/i.test(String(a)));
  const hasBox = quiz.hasBox || accList.some((a) => /box/i.test(String(a)));
  const hasCharger = quiz.hasCharger || accList.some((a) => /charger/i.test(String(a)));

  if (hasBill) {
    await clickLabel(page, 'Bill Available').catch(() =>
      clickLabel(page, 'Valid Bill Available'),
    );
  } else {
    await clickLabel(page, 'Bill Not Available').catch(() =>
      clickLabel(page, 'Valid Bill Not Available'),
    );
  }

  if (hasBox) {
    await clickLabel(page, 'Original Box with same IMEI').catch(() =>
      clickLabel(page, 'Original Box'),
    );
  } else {
    await clickLabel(page, 'Box Not Available').catch(() =>
      clickLabel(page, 'Box Not Available or Damaged'),
    );
  }

  if (hasCharger) {
    await clickLabel(page, 'Original Charger of Device').catch(() =>
      clickLabel(page, 'Original Charger'),
    );
  } else {
    await clickLabel(page, 'Charger Not Available').catch(() => {});
  }

  await page.waitForTimeout(400);
  await clickContinue(page);
}

async function clickOptionNearSection(page, sectionSnippet, labels) {
  const list = Array.isArray(labels) ? labels : [labels];
  for (const label of list) {
    // eslint-disable-next-line no-await-in-loop
    const ok = await clickLabelNearText(page, sectionSnippet, label);
    if (ok) return true;
  }
  return clickFirstVisible(page, list);
}

async function pickSpotLineDiscolorationSections(page, quiz = {}) {
  const physical = quiz.physicalIssues || [];
  const hasGlass = physical.includes('glass_crack');
  const hasSpot = physical.includes('screen_spot');
  const detail = quiz.screenPhysicalDetail;

  let spotPick = 'No spots on screen';
  if (hasSpot) {
    if (detail === 'more2') spotPick = '3 or more minor spots on screen';
    else if (detail === 'minor12') spotPick = '1-2 minor spots on screen';
    else spotPick = 'Large/ heavy visible spots on screen';
  }

  const linePick = hasSpot ? 'Visible line(s) on display' : 'No line(s) on Display';
  const discPick = hasSpot ? 'Minor Discoloration' : 'No Discoloration';

  const spotSnippets = ['Dead Pixels', 'Spots on Screen', 'spots on screen', 'Dead Spot', 'Visible spot'];
  let spotClicked = false;
  for (const snippet of spotSnippets) {
    // eslint-disable-next-line no-await-in-loop
    spotClicked = await clickOptionNearSection(page, snippet, [
      spotPick,
      'Large/ heavy visible spots on screen',
      '3 or more minor spots on screen',
      '1-2 minor spots on screen',
      'No spots on screen',
    ]);
    if (spotClicked) break;
  }
  if (!spotClicked) {
    await clickFirstVisible(page, [spotPick, '1-2 minor spots on screen', 'No spots on screen']);
  }

  const lineSnippets = ['Visible Lines', 'Visible line', 'line(s) on Display', 'Lines on'];
  let lineClicked = false;
  for (const snippet of lineSnippets) {
    // eslint-disable-next-line no-await-in-loop
    lineClicked = await clickOptionNearSection(page, snippet, [
      linePick,
      'Visible line(s) on display',
      'No line(s) on Display',
    ]);
    if (lineClicked) break;
  }
  if (!lineClicked) {
    await clickFirstVisible(page, [linePick, 'No line(s) on Display', 'Visible line(s) on display']);
  }

  const discSnippets = ['Discoloration', 'discoloration'];
  let discClicked = false;
  for (const snippet of discSnippets) {
    // eslint-disable-next-line no-await-in-loop
    discClicked = await clickOptionNearSection(page, snippet, [
      discPick,
      'Minor Discoloration',
      'Major Discoloration',
      'No Discoloration',
      'No Discolouration',
      'No Discolouration ',
    ]);
    if (discClicked) break;
  }
  if (!discClicked) {
    await clickFirstVisible(page, [discPick, 'No Discoloration', 'Minor Discoloration']);
  }

  const body = await page.locator('body').innerText().catch(() => '');
  if (/outer screen condition/i.test(body)) {
    const outerPick = hasGlass || hasSpot
      ? 'Outer screen damaged/line/ broken or Spot'
      : 'No issue with outer screen';
    await clickOptionNearSection(page, 'Outer Screen', [outerPick, 'No issue with outer screen'])
      || await clickFirstVisible(page, [outerPick, 'No issue with outer screen']);
  }
}

async function answerSpotLineDiscolorationSections(page, quiz = {}) {
  await pickSpotLineDiscolorationSections(page, quiz);
  await page.waitForTimeout(500);
  await clickContinue(page);
}

async function answerMultiSectionScreenDetail(page, quiz = {}) {
  await answerSpotLineDiscolorationSections(page, quiz);
}

async function pickSingleScreenScratch(page, quiz = {}) {
  const physical = quiz.physicalIssues || [];
  const hasGlass = physical.includes('glass_crack');
  const detail = quiz.screenPhysicalDetail;
  const picks = [];
  if (hasGlass) {
    picks.push('Screen cracked/ glass broken', 'Chipped/cracked outside display area');
  }
  if (detail && MOBILE_SCREEN_PHYSICAL_DETAIL_LABELS[detail]) {
    picks.push(MOBILE_SCREEN_PHYSICAL_DETAIL_LABELS[detail]);
  }
  picks.push(
    MOBILE_SCREEN_PHYSICAL_DEFAULT,
    'More than 2 scratches on screen',
    '1-2 scratches on screen',
  );
  const clicked = await clickFirstVisible(page, [...new Set(picks.filter(Boolean))]);
  if (!clicked) {
    await clickLabel(page, '1-2 scratches on screen').catch(() => {});
  }
}

async function answerSingleScreenPhysicalCondition(page, quiz = {}) {
  await pickSingleScreenScratch(page, quiz);
  await page.waitForTimeout(400);
  await clickContinue(page);
}

async function answerScreenPhysicalDetail(page, quiz = {}) {
  const head = await questionHead(page);
  const physical = quiz.physicalIssues || [];
  const hasGlass = physical.includes('glass_crack');
  const hasSpot = physical.includes('screen_spot');

  const hasScratchUi = looksLikeScreenScratchDetailPage(head);
  const hasSpotUi = looksLikeScreenSpotDetailPage(head);

  if (hasScratchUi && hasGlass) {
    await pickSingleScreenScratch(page, quiz);
  }

  if (hasSpotUi || hasSpot) {
    await pickSpotLineDiscolorationSections(page, quiz);
  } else if (!hasGlass && !hasSpot) {
    await clickContinue(page);
    return;
  } else if (hasGlass && !hasScratchUi) {
    await pickSingleScreenScratch(page, quiz);
  }

  await page.waitForTimeout(500);
  await clickContinue(page);
}

async function clickFirstVisible(page, labels) {
  for (const label of labels) {
    try {
      const loc = page.getByText(label, { exact: true });
      if (await loc.count()) {
        await loc.first().click({ force: true, timeout: 3000 });
        return true;
      }
    } catch {
      // try next label
    }
  }
  return false;
}

async function answerBodyPhysicalDetail(page, quiz = {}) {
  const physical = quiz.physicalIssues || [];
  const hasPanelMissing = physical.includes('panel_missing');
  const hasBackPanel = physical.includes('back_panel');

  const panelPick =
    MOBILE_PANEL_CONDITION_LABELS[quiz.panelCondition]
    || (hasPanelMissing
      ? MOBILE_PANEL_CONDITION_LABELS.missing
      : hasBackPanel
        ? MOBILE_PANEL_CONDITION_LABELS.cracked
        : MOBILE_PANEL_CONDITION_LABELS.none);

  const bentPick =
    MOBILE_BENT_CONDITION_LABELS[quiz.bentCondition]
    || MOBILE_BENT_CONDITION_LABELS.none;

  // Current Cashify mobile body detail (panel condition + bent/screen loose)
  const clickedPanel = await clickFirstVisible(page, [
    panelPick,
    ...Object.values(MOBILE_PANEL_CONDITION_LABELS).filter((l) => l !== panelPick),
  ]);
  const clickedBent = await clickFirstVisible(page, [
    bentPick,
    ...Object.values(MOBILE_BENT_CONDITION_LABELS).filter((l) => l !== bentPick),
  ]);

  // Legacy Cashify layout (scratches + dents)
  if (!clickedPanel) {
    await clickFirstVisible(page, ['1-2 scratches', 'More than 2 scratches', 'No scratches']);
  }
  if (!clickedBent) {
    await clickFirstVisible(page, ['1-2 minor dents', 'No dents', 'Major dent(s) or more than 2']);
  }

  await page.waitForTimeout(400);
  await clickContinue(page);
}

async function answerESIM(page, quiz) {
  const mode = quiz.eSIMSupport || 'physical+esim';
  if (mode === 'esim_only_global' || mode === 'dual') {
    const clicked = await clickFirstVisible(page, [
      'Dual eSIM',
      'eSIM only (No Physical SIM)',
      'eSIM only',
      'Dual eSIM Only (Global/US variant)',
    ]);
    if (!clicked) {
      await clickLabel(page, 'Dual eSIM').catch(() => {});
    }
  } else {
    const clicked = await clickFirstVisible(page, [
      'Single eSIM',
      'Physical SIM + eSIM',
      'Physical + eSIM',
    ]);
    if (!clicked) {
      await clickLabel(page, 'Single eSIM').catch(() => {});
    }
  }
  await page.waitForTimeout(600);
  await clickContinue(page);
}

async function answerUnknownMobileStep(page, quiz, bodyText) {
  const sample = String(bodyText || '').slice(0, 2800);
  if (looksLikeResultSummary(sample)) return 'result';
  if (/what is your mobile age|mobile age\?/i.test(sample) || looksLikeAgeQuestion(sample) || hasAgeOptionLabels(sample)) {
    await answerAge(page, quiz);
    return 'age';
  }
  if (looksLikeEsimQuestion(sample)) {
    await answerESIM(page, quiz);
    return 'esim';
  }
  if (looksLikeGeneralScreenPage(sample) || /make and receive calls|touch screen working|original screen/i.test(sample)) {
    await answerDeviceConditionQuestions(page, quiz);
    return 'generalScreen';
  }
  if (/do you have the following|bill available|original box with same imei|original charger of device/i.test(sample)) {
    await answerAccessories(page, quiz);
    return 'accessories';
  }
  await clickContinue(page);
  return 'unknown';
}

async function answerCurrentMobileQuestion(page, quiz, modelName) {
  const head = await questionHead(page);
  const bodyText = await page.locator('body').innerText().catch(() => '');
  const bodySample = bodyText.slice(0, 2800);
  const kind = classifyMobileQuestion(head) !== 'unknown'
    ? classifyMobileQuestion(head)
    : classifyMobileQuestion(bodySample);

  if (kind === 'generalScreen') {
    await answerGeneralScreen(page, quiz);
    return kind;
  }
  if (kind === 'variant') {
    await pickMobileVariant(page, modelName, quiz.storage);
    await clickContinue(page);
    return kind;
  }
  if (kind === 'age') {
    await answerAge(page, quiz);
    return kind;
  }
  if (kind === 'result') {
    return kind;
  }
  if (kind === 'warranty') {
    await answerDeviceConditionQuestions(page, quiz);
    return kind;
  }
  if (kind === 'calls' || kind === 'touchscreen' || kind === 'screenOriginal') {
    // Cashify often groups calls / touch / original on one page — answer all visible Yes/No pairs.
    await answerDeviceConditionQuestions(page, quiz);
    return kind;
  }
  if (kind === 'physical') {
    await answerIssueList(page, quiz.physicalIssues, MOBILE_PHYSICAL_LABELS);
    return kind;
  }
  if (kind === 'screenPhysicalDetail') {
    await answerScreenPhysicalDetail(page, quiz);
    return kind;
  }
  if (kind === 'bodyPhysicalDetail') {
    await answerBodyPhysicalDetail(page, quiz);
    return kind;
  }
  if (kind === 'technical') {
    // Camera glass can appear on Cashify technical page — merge if selected as physical id
    const technical = [...(quiz.technicalIssues || [])];
    if ((quiz.physicalIssues || []).includes('camera_glass_broken') && !technical.includes('camera_glass_broken')) {
      technical.push('camera_glass_broken');
    }
    await answerIssueList(page, technical, MOBILE_TECHNICAL_LABELS);
    return kind;
  }
  if (kind === 'accessories') {
    await answerAccessories(page, quiz);
    return kind;
  }
  if (kind === 'esim') {
    await answerESIM(page, quiz);
    return kind;
  }
  if (kind === 'power') {
    await clickYesNo(page, true);
    await clickContinue(page);
    return kind;
  }

  if (kind === 'unknown') {
    return answerUnknownMobileStep(page, quiz, bodySample);
  }

  await clickContinue(page);
  return kind;
}

export async function runMobileFlow(quiz, { productUrl, productUrls, modelName = '', device: deviceArg = null } = {}) {
  const urls = productUrls?.length
    ? productUrls
    : productUrl
      ? [productUrl]
      : [];
  if (!urls.length) {
    throw new Error('Cashify product URL is required for mobile valuation.');
  }

  const device = deviceArg || {
    slug: quiz.slug,
    brand: quiz.brand,
    modelName: modelName || quiz.modelName,
    category: 'mobile',
    cashifyProductUrl: quiz.cashifyProductUrl || '',
  };

  acquireQuoteLock();
  const screenshotDir = config.SCREENSHOT_DIR;
  ensureDir(screenshotDir);

  let apiPrice = null;
  const apiBodies = [];
  const debugArtifacts = { steps: [], screenshots: [] };
  let resolvedProductUrl = urls[0];
  let productMaxPrice = null;
  const sessionMeta = readMeta();
  const usingSession = sessionMeta.status === 'connected';

  const { context, page } = await openSessionPage();
  page.setDefaultTimeout(config.NAV_TIMEOUT_MS);

  page.on('response', async (res) => {
    const url = res.url();
    if (!/calculator|quote|next-rule|evaluate|buyback/i.test(url)) return;
    if (/payment\/offers|refurbished|\/api\/cu01\/v1\/payment/i.test(url)) return;
    try {
      const json = await res.json();
      apiBodies.push({ url, json });
      const found = findPriceInObject(json);
      if (found) apiPrice = found;
    } catch {
      // ignore
    }
  });

  try {
    const opened = await openProductPage(page, urls, 'mobile', device);
    resolvedProductUrl = opened.productUrl;
    productMaxPrice = opened.productMaxPrice;
    debugArtifacts.productUrlsTried = opened.productUrlsTried || urls.map((url) => ({ url, valid: url === opened.productUrl }));
    debugArtifacts.resolvedProductUrl = resolvedProductUrl;

    await pickMobileVariant(page, modelName, quiz.storage);

    try {
      await startCalculator(page);
    } catch (startError) {
      await saveDebug(page, 'calculator-start-failed', screenshotDir);
      if (productMaxPrice) {
        return {
          cashifyPrice: productMaxPrice,
          loginRequired: false,
          usedSession: usingSession,
          note: `${startError.message} Showing public Get Upto price as fallback.`,
          productUrl: resolvedProductUrl,
          debugArtifacts: {
            ...debugArtifacts,
            startCalculatorError: startError.message,
          },
        };
      }
      throw startError;
    }

    const loopResult = await runQuoteLoop(page, {
      quiz,
      modelName,
      answerQuestion: answerCurrentMobileQuestion,
      screenshotDir,
      debugArtifacts,
      apiBodies,
      getApiPrice: () => apiPrice,
      setApiPrice: (value) => { apiPrice = value; },
    });

    const { cashifyPrice, loginLocked, finalText } = loopResult;
    const onQuotePage = /sell\/quote|selling price|recommended price/i.test(finalText)
      && /sell\/quote|calculator|pageId=/.test(page.url());

    if (cashifyPrice && !loginLocked) {
      const artifact = await saveDebug(page, 'success', screenshotDir);
      if (artifact) debugArtifacts.screenshots.push(artifact);
      return {
        cashifyPrice,
        loginRequired: false,
        usedSession: usingSession,
        productUrl: resolvedProductUrl,
        note: onQuotePage ? null : 'Price read from Cashify calculator (pre-quote page).',
        debugArtifacts,
      };
    }

    if (cashifyPrice && usingSession && !/xx,xxx/i.test(finalText)) {
      const artifact = await saveDebug(page, 'success', screenshotDir);
      if (artifact) debugArtifacts.screenshots.push(artifact);
      return { cashifyPrice, loginRequired: false, usedSession: true, productUrl: resolvedProductUrl, debugArtifacts };
    }

    if (loginLocked) {
      const artifact = await saveDebug(page, 'login-locked', screenshotDir);
      if (artifact) debugArtifacts.screenshots.push(artifact);
      if (productMaxPrice) {
        return {
          cashifyPrice: productMaxPrice,
          loginRequired: true,
          usedSession: usingSession,
          productUrl: resolvedProductUrl,
          note: usingSession
            ? 'Session may have expired. Reconnect Cashify OTP, then try again. Showing Get Upto for now.'
            : 'Exact Cashify quote is locked behind OTP login. Connect Cashify first, then retry. Showing public Get Upto for now.',
          debugArtifacts,
        };
      }
      throw new Error('Cashify requires login to unlock the exact price. Connect Cashify with OTP first.');
    }

    const artifact = await saveDebug(page, 'no-price', screenshotDir);
    if (artifact) debugArtifacts.screenshots.push(artifact);
    const steps = (debugArtifacts.steps || []).map((s) => s.kind).join(' → ');
    throw new Error(
      `Could not read a valuation from the Cashify page.${steps ? ` Steps: ${steps}.` : ''} URL: ${page.url()}`,
    );
  } catch (error) {
    const artifact = await saveDebug(page, 'error', screenshotDir);
    if (artifact) debugArtifacts.screenshots.push(artifact);
    if (error.productUrlsTried) {
      debugArtifacts.productUrlsTried = error.productUrlsTried;
    }
    error.debugArtifacts = debugArtifacts;
    throw error;
  } finally {
    await context.close().catch(() => {});
    releaseQuoteLock();
  }
}
