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
  MOBILE_PHYSICAL_LABELS,
  MOBILE_TECHNICAL_LABELS,
  MOBILE_SCREEN_PHYSICAL_DEFAULT,
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

async function answerGeneralScreen(page, quiz) {
  const text = await page.locator('body').innerText().catch(() => '');
  const hasCalls = /make and receive calls/i.test(text);
  const hasTouch = /touch screen/i.test(text);
  const hasOriginal = /screen original|original screen/i.test(text);
  const hasWarranty = /under manufacturer warranty|under warranty/i.test(text);
  const hasGstBill = /gst valid bill|bill with the same imei/i.test(text);
  const hasEsimCount = /how many esims|dual esim|single esim/i.test(text);

  // Prefer question-scoped clicks — multiple Yes/No pairs share the same page.
  if (hasCalls) {
    const ok = await clickYesNoNearText(page, 'make and receive calls', quiz.ableToMakeCalls !== false);
    if (!ok) await clickYesNoByIndex(page, 0, quiz.ableToMakeCalls !== false);
  }
  if (hasTouch) {
    const ok = await clickYesNoNearText(page, 'touch screen', quiz.isTouchScreenWorking !== false);
    if (!ok) await clickYesNoByIndex(page, 1, quiz.isTouchScreenWorking !== false);
  }
  if (hasOriginal) {
    const ok = await clickYesNoNearText(page, 'screen original', quiz.isScreenOriginal !== false);
    if (!ok) await clickYesNoByIndex(page, 2, quiz.isScreenOriginal !== false);
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
    // Always answer bill — Cashify requires it even when out of warranty.
    const wantBill = !!quiz.underWarranty && hasBill;
    // Avoid matching warranty help text that also mentions "GST valid bill".
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

async function answerAge(page, quiz) {
  const label = MOBILE_AGE[quiz.deviceAge] || quiz.deviceAge || MOBILE_AGE['Above 11 Months'];
  await clickLabel(page, label);
  await page.waitForTimeout(600);
  await clickContinue(page);
}

async function questionHead(page) {
  const text = await page.locator('body').innerText().catch(() => '');
  const moreIdx = text.indexOf('\nMore\n');
  if (moreIdx < 0) return text.slice(0, 500);
  let afterMore = text.slice(moreIdx + 6);
  // Strip validation toasts that appear above the quiz card
  afterMore = afterMore.replace(/Please answer the .*?\n+/gi, '');
  const stops = ['\nContinue\n', '\nDevice Evaluation\n', '\nFollow us on\n'];
  let end = afterMore.length;
  for (const stop of stops) {
    const idx = afterMore.indexOf(stop);
    if (idx >= 0 && idx < end) end = idx;
  }
  return afterMore.slice(0, end).trim();
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
        'Device panel missing/broken': ['Camera Glass Broken', 'Device panel missing/broken'],
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

async function answerScreenPhysicalDetail(page) {
  const defaults = [
    '1-2 scratches on screen',
    'Screen cracked/ glass broken',
    'More than 2 scratches on screen',
    'Chipped/cracked outside display area',
  ];
  for (const label of defaults) {
    try {
      const loc = page.getByText(label, { exact: true });
      if (await loc.count()) {
        await loc.first().click({ force: true, timeout: 3000 });
        await page.waitForTimeout(400);
        await clickContinue(page);
        return;
      }
    } catch {
      // try next
    }
  }
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
  const hasPanelMissing = physical.includes('panel_missing') || physical.includes('camera_glass_broken');
  const hasBackPanel = physical.includes('back_panel');

  const panelPick = hasPanelMissing
    ? 'Missing side or back panel'
    : hasBackPanel
      ? 'Cracked/ broken side or back panel'
      : 'No defect on side or back panel';

  const bentPick = 'Phone not bent';

  // Current Cashify mobile body detail (panel condition + bent/screen loose)
  const clickedPanel = await clickFirstVisible(page, [
    panelPick,
    'No defect on side or back panel',
    'Cracked/ broken side or back panel',
    'Missing side or back panel',
  ]);
  const clickedBent = await clickFirstVisible(page, [
    bentPick,
    'Phone not bent',
    'Loose screen (Gap in screen and body)',
    'Bent/ curved panel',
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
  if (mode === 'esim_only_global') {
    await clickLabel(page, 'eSIM only (No Physical SIM)').catch(() => clickLabel(page, 'eSIM only'));
  } else {
    await clickLabel(page, 'Physical SIM + eSIM').catch(() => clickLabel(page, 'Physical + eSIM'));
  }
  await page.waitForTimeout(600);
  await clickContinue(page);
}

async function answerCurrentMobileQuestion(page, quiz, modelName) {
  const head = await questionHead(page);
  const bodyText = await page.locator('body').innerText().catch(() => '');
  const kind = classifyMobileQuestion(head) !== 'unknown'
    ? classifyMobileQuestion(head)
    : classifyMobileQuestion(bodyText.slice(0, 900));

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
  if (kind === 'warranty') {
    await clickYesNo(page, !!quiz.underWarranty);
    await clickContinue(page);
    return kind;
  }
  if (kind === 'calls') {
    await clickYesNo(page, quiz.ableToMakeCalls !== false);
    await clickContinue(page);
    return kind;
  }
  if (kind === 'touchscreen') {
    await clickYesNo(page, quiz.isTouchScreenWorking !== false);
    await clickContinue(page);
    return kind;
  }
  if (kind === 'screenOriginal') {
    await clickYesNo(page, quiz.isScreenOriginal !== false);
    await clickContinue(page);
    return kind;
  }
  if (kind === 'physical') {
    await answerIssueList(page, quiz.physicalIssues, MOBILE_PHYSICAL_LABELS);
    return kind;
  }
  if (kind === 'screenPhysicalDetail') {
    await answerScreenPhysicalDetail(page);
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

  await clickContinue(page);
  return kind;
}

export async function runMobileFlow(quiz, { productUrl, productUrls, modelName = '' } = {}) {
  const urls = productUrls?.length
    ? productUrls
    : productUrl
      ? [productUrl]
      : [];
  if (!urls.length) {
    throw new Error('Cashify product URL is required for mobile valuation.');
  }

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
    const opened = await openProductPage(page, urls, 'mobile');
    resolvedProductUrl = opened.productUrl;
    productMaxPrice = opened.productMaxPrice;
    debugArtifacts.productUrlsTried = urls;
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
    const onQuotePage = /sell\/quote|selling price/i.test(finalText) && /sell\/quote|calculator|pageId=/.test(page.url());

    if (cashifyPrice && !loginLocked && onQuotePage) {
      const artifact = await saveDebug(page, 'success', screenshotDir);
      if (artifact) debugArtifacts.screenshots.push(artifact);
      return { cashifyPrice, loginRequired: false, usedSession: usingSession, productUrl: resolvedProductUrl, debugArtifacts };
    }

    if (cashifyPrice && usingSession && !/xx,xxx/i.test(finalText) && onQuotePage) {
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
    throw new Error('Could not read a valuation from the Cashify page.');
  } catch (error) {
    const artifact = await saveDebug(page, 'error', screenshotDir);
    if (artifact) debugArtifacts.screenshots.push(artifact);
    error.debugArtifacts = debugArtifacts;
    throw error;
  } finally {
    await context.close().catch(() => {});
    releaseQuoteLock();
  }
}
