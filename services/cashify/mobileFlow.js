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

async function pickMobileVariant(page, modelName, storage) {
  const body = await page.locator('body').innerText().catch(() => '');
  if (!/choose a variant|select variant|pick a variant/i.test(body)) return false;

  const storageNorm = normalizeStorageKey(storage);
  const storageCompact = storageNorm.replace(/\s+/g, '').toLowerCase();
  const ramStorageMatch = storageNorm.match(/(\d+\s*GB)\s*\/\s*(\d+\s*GB)/i);
  const storageOnly = ramStorageMatch?.[2] || storageNorm;

  const clicked = await page.evaluate(({ modelName, storageCompact, storageOnly }) => {
    const normalize = (s) => String(s || '').replace(/\s+/g, ' ').trim().toLowerCase();
    const wantStorage = normalize(storageOnly).replace(/\s/g, '');
    const nodes = [...document.querySelectorAll('div, span, button, a, p, li')];
    const scored = nodes
      .map((n) => {
        const t = normalize(n.innerText || n.textContent || '');
        if (!t || t.length > 140 || t.length < 8) return { n, score: 0 };
        const compact = t.replace(/\s/g, '');
        let score = 0;
        if (compact.includes(storageCompact)) score += 100;
        if (wantStorage && compact.includes(wantStorage.replace(/\s/g, ''))) score += 80;
        if (modelName && t.includes(normalize(modelName).split(' ').slice(-2).join(' '))) score += 40;
        if (/\(\d+\s*gb\/\d+\s*gb\)/i.test(t)) score += 20;
        return { n, score };
      })
      .filter((x) => x.score > 60)
      .sort((a, b) => b.score - a.score);

    const target = scored[0]?.n;
    if (!target) return false;
    target.scrollIntoView({ block: 'center', inline: 'center' });
    target.click();
    return true;
  }, { modelName, storageCompact, storageOnly });

  if (clicked) {
    await page.waitForTimeout(800);
    return true;
  }

  if (storageOnly) {
    return clickLabel(page, storageOnly);
  }
  return false;
}

async function answerAge(page, quiz) {
  const label = MOBILE_AGE[quiz.deviceAge] || quiz.deviceAge || MOBILE_AGE['Above 11 Months'];
  await clickLabel(page, label);
  await page.waitForTimeout(600);
  await clickContinue(page);
}

async function answerIssueList(page, issues, labelMap) {
  const list = Array.isArray(issues) ? issues : [];
  if (!list.length) {
    await clickLabel(page, 'No Issues').catch(() => {});
    await clickLabel(page, 'No issues').catch(() => {});
    await clickContinue(page);
    return;
  }
  for (const id of list) {
    const label = labelMap[id];
    if (label) await clickLabel(page, label);
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

  await clickLabel(page, hasBill ? 'Bill Available' : 'Bill Not Available').catch(() =>
    clickLabel(page, hasBill ? 'Valid Bill Available' : 'Valid Bill Not Available'),
  );
  await clickLabel(page, hasBox ? 'Original Box' : 'Box Not Available').catch(() =>
    clickLabel(page, hasBox ? 'Original Box with same serial number' : 'Box Not Available or Damaged'),
  );
  await clickLabel(page, hasCharger ? 'Original Charger' : 'Charger Not Available').catch(() =>
    clickLabel(page, hasCharger ? 'Original charger available' : 'Charger Not Available'),
  );
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
  const card = await cardText(page, modelName);
  const kind = classifyMobileQuestion(card);

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
  if (kind === 'technical') {
    await answerIssueList(page, quiz.technicalIssues, MOBILE_TECHNICAL_LABELS);
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
    if (!/calculator|quote|price|next-rule|evaluate|buyback|offer/i.test(url)) return;
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

    if (cashifyPrice && !loginLocked) {
      const artifact = await saveDebug(page, 'success', screenshotDir);
      if (artifact) debugArtifacts.screenshots.push(artifact);
      return { cashifyPrice, loginRequired: false, usedSession: usingSession, productUrl: resolvedProductUrl, debugArtifacts };
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
