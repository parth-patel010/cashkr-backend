import fs from 'fs';
import path from 'path';
import { openSessionPage, readMeta } from './sessionManager.js';
import {
  acquireQuoteLock,
  releaseQuoteLock,
  saveDebug,
  findPriceInObject,
  pageIdFromUrl,
  clickLabel,
  clickContinue,
  startCalculator,
  openProductPage,
  isLoginModal,
  isResultPage,
  extractVisibleOffer,
  config,
} from './flowHelpers.js';
import {
  cashifyProcessor,
  cashifyRam,
  cashifyStorage,
  SCREEN_SIZE,
  AGE,
  FUNCTIONAL_LABELS,
  classifyQuestion,
} from './selectors.js';
import {
  mergeCashifyBody,
  mergeCashifyScreen,
  bodyLabel,
  screenLabel,
  deriveScreenOverall,
} from '../../utils/laptopCashifyQuiz.js';

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

async function cardText(page, modelName) {
  const text = await page.locator('body').innerText().catch(() => '');
  const marker = modelName ? `\n${modelName}` : '';
  const start = text.indexOf('\nMore\n');
  const end = marker ? text.indexOf(marker) : -1;
  if (start >= 0 && end > start) return text.slice(start + 6, end).trim();
  return text.slice(0, 800);
}

async function openAndPickDropdown(page, index, desiredValue) {
  const input = page.locator('input[placeholder="Search"]').nth(index);
  await input.waitFor({ state: 'attached', timeout: 10000 });

  await page.evaluate((i) => {
    const inputs = [...document.querySelectorAll('input[placeholder="Search"]')];
    const el = inputs[i];
    if (!el) return;
    let wrap = el.parentElement;
    while (wrap && wrap.style && wrap.style.pointerEvents === 'none') {
      wrap.style.pointerEvents = 'auto';
      wrap = wrap.parentElement;
    }
    el.style.pointerEvents = 'auto';
    const row = el.closest('.flex.flex-row') || el.parentElement;
    const svg = row?.querySelector('svg');
    (svg || el).dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
    el.focus();
  }, index);
  await page.waitForTimeout(400);

  await page.keyboard.press('Control+A').catch(() => {});
  await page.keyboard.press('Backspace').catch(() => {});
  await page.keyboard.type(desiredValue, { delay: 20 });
  await page.waitForTimeout(500);

  await page.evaluate((want) => {
    const normalize = (s) => String(s || '').replace(/\s+/g, ' ').trim().toLowerCase();
    const target = normalize(want);
    const nodes = [...document.querySelectorAll('div, span, li, button, p')];
    const exact = nodes.find((n) => normalize(n.innerText) === target && (n.offsetParent || n.getClientRects().length));
    if (exact) {
      exact.click();
      return;
    }
    const partial = nodes.find((n) => {
      const t = normalize(n.innerText);
      return t.includes(target) && t.length < target.length + 20 && (n.offsetParent || n.getClientRects().length);
    });
    if (partial) partial.click();
  }, desiredValue);

  await page.keyboard.press('Escape').catch(() => {});
  await page.waitForTimeout(300);
}

async function fillSystemConfiguration(page, quiz) {
  const processor = cashifyProcessor(quiz.processor);
  const ram = cashifyRam(quiz.ram);
  const storage = cashifyStorage(quiz.storage);
  await page.waitForSelector('input[placeholder="Search"]', { timeout: 15000 });
  await page.waitForTimeout(500);
  await openAndPickDropdown(page, 0, processor);
  await openAndPickDropdown(page, 1, ram);
  await openAndPickDropdown(page, 2, storage);
  await page.waitForTimeout(400);
  await clickContinue(page);
}

function gpuLabel(quiz, modelName = '') {
  const model = String(modelName || quiz.modelName || quiz.slug || '').toLowerCase();
  const brand = String(quiz.brand || '').toLowerCase();
  const isMac = quiz.category === 'mac'
    || brand === 'apple'
    || /macbook|imac|mac mini/.test(model);
  // Cashify Mac flow does not ask dedicated GPU
  if (isMac) return 'Graphics Card not available';
  // Explicit user answer wins over gaming heuristic
  if (quiz.hasGpu === 'no' || quiz.hasGpu === false) return 'Graphics Card not available';
  const gaming = /nitro|tuf|legion|omen|alienware|rog|gaming|g15|g16|predator|victus|katana|crosshair/.test(model);
  const hasGpu = quiz.hasGpu === 'yes' || quiz.hasGpu === true || gaming;
  const gpuWorking = quiz.isGpuWorking === 'yes' || quiz.isGpuWorking === true;
  if (hasGpu && !gpuWorking) return 'Graphics Card not working';
  if (hasGpu) return 'Graphics Card available';
  return 'Graphics Card not available';
}

function touchScreenLabel(quiz) {
  const hasTouch = quiz.hasTouchScreen === 'yes' || quiz.hasTouchScreen === true;
  const working = quiz.isTouchScreenWorking === 'yes' || quiz.isTouchScreenWorking === true;
  if (hasTouch && !working) return 'Touch Screen not working';
  if (hasTouch) return 'Touch Screen available';
  return 'Touch Screen not available';
}

async function answerScreen(page, quiz) {
  const screen = mergeCashifyScreen(quiz);
  await clickLabel(page, screenLabel('screenScratch', screen.screenScratch));
  await clickLabel(page, screenLabel('screenDiscolouration', screen.screenDiscolouration));
  await clickLabel(page, screenLabel('screenSpots', screen.screenSpots));
  await clickLabel(page, screenLabel('screenLines', screen.screenLines));
  await clickLabel(page, deriveScreenOverall(screen));
  if (screen.isScreenOriginal === 'no') {
    await clickLabel(page, 'No Screen is original');
  } else {
    await clickLabel(page, 'Display Working Fine').catch(() => {});
  }
  await clickContinue(page);
}

const PHYSICAL_SECTIONS = [
  'Scratch on Body',
  'Dent on Top Panel',
  'Dent on Base Panel',
  'Loose Hinges',
  'Cracked or Loose Panel',
];

async function clickOptionInSection(page, sectionHeader, optionLabel) {
  await page.evaluate(({ sectionHeader, optionLabel, sectionHeaders }) => {
    const normalize = (s) => String(s || '').replace(/\s+/g, ' ').trim();
    const visible = (n) => n && (n.offsetParent || n.getClientRects().length);
    const nodes = [...document.querySelectorAll('div, span, p, button, label')];
    const headerIdx = nodes.findIndex((n) => {
      const t = normalize(n.innerText);
      return t === sectionHeader || t.startsWith(`${sectionHeader}\n`) || t.startsWith(sectionHeader);
    });
    if (headerIdx < 0) return;

    const sectionOrder = sectionHeaders;
    const myIdx = sectionOrder.indexOf(sectionHeader);
    const nextHeader = sectionOrder[myIdx + 1];
    let endIdx = nodes.length;
    if (nextHeader) {
      const nextIdx = nodes.findIndex((n, i) => i > headerIdx && normalize(n.innerText).startsWith(nextHeader));
      if (nextIdx >= 0) endIdx = nextIdx;
    }

    const target = normalize(optionLabel);
    const sectionNodes = nodes.slice(headerIdx, endIdx);
    const el = sectionNodes.find((n) => normalize(n.innerText) === target && visible(n));
    if (el) {
      el.scrollIntoView({ block: 'center' });
      el.click();
    }
  }, { sectionHeader, optionLabel, sectionHeaders: PHYSICAL_SECTIONS });
}

async function answerPhysical(page, quiz) {
  const body = mergeCashifyBody(quiz);
  const selections = [
    ['Scratch on Body', bodyLabel('bodyScratch', body.bodyScratch)],
    ['Dent on Top Panel', bodyLabel('dentTop', body.dentTop)],
    ['Dent on Base Panel', bodyLabel('dentBase', body.dentBase)],
    ['Loose Hinges', bodyLabel('looseHinges', body.looseHinges)],
    ['Cracked or Loose Panel', bodyLabel('panelCondition', body.panelCondition)],
  ];

  for (const [section, label] of selections) {
    await clickOptionInSection(page, section, label);
    await page.waitForTimeout(150);
  }

  await page.waitForTimeout(600);
  await clickContinue(page);
  await page.waitForTimeout(1500);
}

async function answerFeatureStep(page, quiz, modelName = '') {
  const text = (await page.locator('body').innerText().catch(() => '')).toLowerCase();
  const hasScreenSize = /10-11 inch|12-13 inch|14-15 inch|above 15 inch/.test(text);
  const hasGpu = /graphics card|external graphics/.test(text);
  const hasTouch = /touch screen/.test(text);
  const hasBoxBill = /original box|bill available|do you have the following/.test(text);

  if (hasScreenSize) {
    await clickLabel(page, SCREEN_SIZE[quiz.screenSize] || '14-15 inch');
    await page.waitForTimeout(400);
  }
  if (hasTouch) {
    await clickLabel(page, touchScreenLabel(quiz));
    await page.waitForTimeout(400);
  }
  if (hasGpu) {
    const label = gpuLabel(quiz, modelName);
    await page.getByText(label, { exact: true }).first().click({ force: true, timeout: 5000 }).catch(() => clickLabel(page, label));
    await page.waitForTimeout(400);
  }
  if (hasBoxBill) {
    const accessories = quiz.accessories || [];
    const accList = Array.isArray(accessories) ? accessories : [accessories].filter(Boolean);
    await clickLabel(page, accList.includes('box') ? 'Original Box with same serial number' : 'Box Not Available or Damaged');
    await clickLabel(page, accList.includes('bill') ? 'Bill Available' : 'Bill Not Available');
  }
  if (hasScreenSize || hasGpu || hasTouch || hasBoxBill) {
    await clickContinue(page);
    return;
  }
  await answerFeatures(page, quiz, modelName);
}

async function answerFeatures(page, quiz, modelName = '') {
  await clickLabel(page, SCREEN_SIZE[quiz.screenSize] || '14-15 inch');
  await clickLabel(page, touchScreenLabel(quiz));
  const bodyText = (await page.locator('body').innerText().catch(() => '')).toLowerCase();
  // Mac Cashify pages often omit dedicated GPU options
  if (/graphics card|external graphics/.test(bodyText)) {
    await clickLabel(page, gpuLabel(quiz, modelName)).catch(() => {});
  }
  const accessories = quiz.accessories || [];
  const accList = Array.isArray(accessories) ? accessories : [accessories].filter(Boolean);
  await clickLabel(page, accList.includes('box') ? 'Original Box with same serial number' : 'Box Not Available or Damaged');
  await clickLabel(page, accList.includes('bill') ? 'Bill Available' : 'Bill Not Available');
  await clickContinue(page);
}

async function answerFunctional(page, quiz) {
  const issues = quiz.issuesList || quiz.functionalIssues || [];
  for (const id of issues) {
    const label = FUNCTIONAL_LABELS[id];
    if (label) await clickLabel(page, label);
  }
  const accessories = quiz.accessories || [];
  const accList = Array.isArray(accessories) ? accessories : [accessories].filter(Boolean);
  await clickLabel(
    page,
    accList.includes('charger')
      ? 'Original charger available'
      : 'Faulty Charger; wire cut, Not available',
  );
  await clickContinue(page);
}

async function answerCurrentQuestion(page, quiz, modelName) {
  const bodyText = await page.locator('body').innerText().catch(() => '');
  const card = await cardText(page, modelName);
  const kind = classifyQuestion(card) !== 'unknown' ? classifyQuestion(card) : classifyQuestion(bodyText);

  if (kind === 'power') {
    const label = quiz.powerStatus === 'off' ? 'No' : 'Yes';
    await page.getByText(label, { exact: true }).first().click({ force: true, timeout: 5000 });
    await page.waitForTimeout(800);
    return kind;
  }
  if (kind === 'config') {
    await fillSystemConfiguration(page, quiz);
    return kind;
  }
  if (kind === 'features' || kind === 'screenSize' || kind === 'touchScreen' || kind === 'gpu') {
    if (/select the screen condition|scratch or broken on screen/.test(card.toLowerCase())) {
      await answerScreen(page, quiz);
      return 'screenDetail';
    }
    await answerFeatureStep(page, quiz, modelName);
    return kind;
  }
  if (kind === 'accessories') {
    const accessories = quiz.accessories || [];
    const accList = Array.isArray(accessories) ? accessories : [accessories].filter(Boolean);
    await clickLabel(page, accList.includes('box') ? 'Original Box with same serial number' : 'Box Not Available or Damaged');
    await clickLabel(page, accList.includes('bill') ? 'Bill Available' : 'Bill Not Available');
    if (accList.includes('charger')) {
      await clickLabel(page, 'Original charger available');
    }
    await clickContinue(page);
    return kind;
  }
  if (kind === 'functional') {
    await answerFunctional(page, quiz);
    return kind;
  }
  if (kind === 'physical' || kind === 'physicalDetail') {
    await answerPhysical(page, quiz);
    return kind;
  }
  if (kind === 'age') {
    const ageKey = quiz.age || quiz.yearBracket;
    const ageLabel = AGE[ageKey] || AGE.oneToTwo;
    await page.getByText(ageLabel, { exact: true }).first().click({ force: true, timeout: 5000 });
    await page.waitForTimeout(1000);
    await clickContinue(page);
    return kind;
  }
  if (kind === 'screen' || kind === 'screenDetail') {
    await answerScreen(page, quiz);
    return kind;
  }
  if (kind === 'overall') {
    // Cashify rarely shows this now — always pick "No software issue" if it appears
    await clickLabel(page, 'No software issue').catch(() =>
      clickLabel(page, 'No Software issue'),
    );
    await clickContinue(page);
    return kind;
  }

  await clickContinue(page);
  return kind;
}

export async function runLaptopFlow(quiz, { productUrl, productUrls, modelName = '', device: deviceArg = null } = {}) {
  const urls = productUrls?.length
    ? productUrls
    : productUrl
      ? [productUrl]
      : [];
  if (!urls.length) {
    throw new Error('Cashify product URL is required for laptop valuation.');
  }

  const device = deviceArg || {
    slug: quiz.slug,
    brand: quiz.brand,
    modelName: modelName || quiz.modelName,
    category: quiz.category || 'laptop',
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
    const opened = await openProductPage(page, urls, 'laptop', device);
    resolvedProductUrl = opened.productUrl;
    productMaxPrice = opened.productMaxPrice;
    debugArtifacts.productUrlsTried = opened.productUrlsTried || urls.map((url) => ({ url, valid: url === opened.productUrl }));
    debugArtifacts.resolvedProductUrl = resolvedProductUrl;

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

    let lastPageId = pageIdFromUrl(page.url());
    let stuck = 0;
    let loginLocked = false;

    for (let step = 0; step < config.MAX_QUESTION_STEPS; step += 1) {
      await page.waitForTimeout(600);
      const text = await page.locator('body').innerText().catch(() => '');
      if (isLoginModal(text)) {
        loginLocked = true;
        break;
      }
      if (isResultPage(text, page.url())) break;

      const kind = await answerCurrentQuestion(page, quiz, modelName);
      debugArtifacts.steps.push({ step, kind, pageId: pageIdFromUrl(page.url()), url: page.url() });
      await page.waitForTimeout(700);

      const afterText = await page.locator('body').innerText().catch(() => '');
      if (isLoginModal(afterText)) {
        loginLocked = true;
        break;
      }
      if (isResultPage(afterText, page.url())) break;

      const nowId = pageIdFromUrl(page.url());
      if (nowId === lastPageId) {
        stuck += 1;
        await clickContinue(page);
        await page.waitForTimeout(800);
        const again = await page.locator('body').innerText().catch(() => '');
        if (isLoginModal(again)) {
          loginLocked = true;
          break;
        }
        if (pageIdFromUrl(page.url()) === lastPageId) {
          if (stuck >= 3) {
            const artifact = await saveDebug(page, `stuck-${nowId || 'x'}`, screenshotDir);
            if (artifact) debugArtifacts.screenshots.push(artifact);
            break;
          }
        } else {
          stuck = 0;
          lastPageId = pageIdFromUrl(page.url());
        }
      } else {
        stuck = 0;
        lastPageId = nowId;
      }
    }

    await page.waitForTimeout(1500);
    const finalText = await page.locator('body').innerText();
    if (isLoginModal(finalText)) loginLocked = true;

    let cashifyPrice = apiPrice || (await extractVisibleOffer(page));
    if (!cashifyPrice) {
      for (const entry of apiBodies.slice().reverse()) {
        const found = findPriceInObject(entry.json);
        if (found) {
          cashifyPrice = found;
          break;
        }
      }
    }

    const apiDumpPath = path.join(screenshotDir, `api-${Date.now()}.json`);
    fs.writeFileSync(apiDumpPath, JSON.stringify(apiBodies.slice(-20), null, 2));
    debugArtifacts.apiDump = apiDumpPath;
    debugArtifacts.finalUrl = page.url();

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
