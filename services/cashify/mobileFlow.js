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

export async function pickMobileVariant(page, modelName, storage) {
  const body = await page.locator('body').innerText().catch(() => '');
  if (!/choose a variant|select variant|pick a variant/i.test(body)) return false;

  const storageNorm = normalizeStorageKey(storage);
  const storageCompact = storageNorm.replace(/\s+/g, '').toLowerCase();
  const ramStorageMatch = storageNorm.match(/(\d+)\s*GB\s*\/\s*(\d+)\s*GB/i);
  const ramGb = ramStorageMatch?.[1] || null;
  const storageGb = ramStorageMatch?.[2] || null;

  const clicked = await page.evaluate(({ ramGb, storageGb, storageCompact }) => {
    const normalize = (s) => String(s || '').replace(/\s+/g, ' ').trim();
    const visible = (n) => n && (n.offsetParent || n.getClientRects().length);
    const nodes = [...document.querySelectorAll('div, span, button, a, p, li')];

    const headerIdx = nodes.findIndex((n) => /choose a variant/i.test(normalize(n.innerText)));
    let endIdx = nodes.length;
    if (headerIdx >= 0) {
      const nextIdx = nodes.findIndex((n, i) => i > headerIdx && /get exact value|top selling|top models|follow us on/i.test(normalize(n.innerText)));
      if (nextIdx >= 0) endIdx = nextIdx;
    }
    const sectionNodes = headerIdx >= 0 ? nodes.slice(headerIdx, endIdx) : nodes;

    const matchesStorage = (text) => {
      const t = normalize(text);
      if (!/^\d+\s*GB\s*\/\s*\d+\s*GB$/i.test(t)) return false;
      if (!ramGb || !storageGb) return true;
      const m = t.match(/(\d+)\s*GB\s*\/\s*(\d+)\s*GB/i);
      return m && m[1] === ramGb && m[2] === storageGb;
    };

    const target = sectionNodes.find((n) => matchesStorage(n.innerText || n.textContent || '') && visible(n));
    if (target) {
      target.scrollIntoView({ block: 'center', inline: 'center' });
      target.click();
      return true;
    }

    // Fallback: score within section only (never "Top Models" links)
    const scored = sectionNodes
      .map((n) => {
        const t = normalize(n.innerText || n.textContent || '');
        if (!/^\d+\s*GB\s*\/\s*\d+\s*GB$/i.test(t)) return { n, score: 0 };
        const compact = t.replace(/\s/g, '').toLowerCase();
        let score = 0;
        if (storageCompact && compact === storageCompact.replace(/\s/g, '')) score += 100;
        if (ramGb && storageGb) {
          const m = t.match(/(\d+)\s*GB\s*\/\s*(\d+)\s*GB/i);
          if (m && m[1] === ramGb && m[2] === storageGb) score += 120;
        }
        return { n, score };
      })
      .filter((x) => x.score > 60)
      .sort((a, b) => b.score - a.score);

    const fallback = scored[0]?.n;
    if (!fallback) return false;
    fallback.scrollIntoView({ block: 'center', inline: 'center' });
    fallback.click();
    return true;
  }, { ramGb, storageGb, storageCompact });

  if (clicked) {
    await page.waitForTimeout(800);
    return true;
  }

  if (ramStorageMatch?.[2]) {
    return clickLabel(page, `${ramStorageMatch[2].replace(/\s/g, '')}`);
  }
  return false;
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

async function answerGeneralScreen(page, quiz) {
  await clickYesNoByIndex(page, 0, quiz.ableToMakeCalls !== false);
  await clickYesNoByIndex(page, 1, quiz.isTouchScreenWorking !== false);
  await clickYesNoByIndex(page, 2, quiz.isScreenOriginal !== false);
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
  const afterMore = text.slice(moreIdx + 6);
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
