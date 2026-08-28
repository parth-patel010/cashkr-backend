import fs from 'fs';
import path from 'path';
import config from '../../config/cashify.js';
import { openSessionPage, readMeta } from './sessionManager.js';
import {
  cashifyProcessor,
  cashifyRam,
  cashifyStorage,
  SCREEN_SIZE,
  AGE,
  FUNCTIONAL_LABELS,
  classifyQuestion,
} from './selectors.js';

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

async function saveDebug(page, name, screenshotDir) {
  try {
    ensureDir(screenshotDir);
    const stamp = Date.now();
    await page.screenshot({
      path: path.join(screenshotDir, `${stamp}-${name}.png`),
      fullPage: false,
    });
    fs.writeFileSync(
      path.join(screenshotDir, `${stamp}-${name}.txt`),
      `${page.url()}\n\n${await page.locator('body').innerText().catch(() => '')}`,
      'utf8',
    );
    return {
      screenshot: path.join(screenshotDir, `${stamp}-${name}.png`),
      textDump: path.join(screenshotDir, `${stamp}-${name}.txt`),
      url: page.url(),
    };
  } catch {
    return null;
  }
}

const PRICE_KEYS = /^(exactPrice|quotedPrice|sellingPrice|offerPrice|quotePrice|finalPrice|cashifyPrice|qp|sp|amount|price|value|maxPrice|minPrice|quote)$/i;

function findPriceInObject(value, depth = 0, keyHint = '') {
  if (depth > 10 || value == null) return null;
  if (typeof value === 'number' && value >= 500 && value <= 500000 && /price|quote|amount|qp|sp|value/i.test(keyHint)) {
    return value;
  }
  if (typeof value === 'string') {
    const n = Number(String(value).replace(/[₹,\s]/g, ''));
    if (Number.isFinite(n) && n >= 500 && n <= 500000 && /price|quote|amount|qp|sp|value/i.test(keyHint)) {
      return n;
    }
  }
  if (Array.isArray(value)) {
    for (const item of value) {
      const found = findPriceInObject(item, depth + 1, keyHint);
      if (found) return found;
    }
    return null;
  }
  if (typeof value !== 'object') return null;
  for (const [key, nested] of Object.entries(value)) {
    if (PRICE_KEYS.test(key)) {
      const n = Number(String(nested).replace(/[₹,\s]/g, ''));
      if (Number.isFinite(n) && n >= 500 && n <= 500000) return n;
    }
    if (nested && typeof nested === 'object') {
      const found = findPriceInObject(nested, depth + 1, key);
      if (found) return found;
    } else if (typeof nested === 'number' || typeof nested === 'string') {
      const found = findPriceInObject(nested, depth + 1, key);
      if (found) return found;
    }
  }
  return null;
}

function parseRupees(text) {
  const matches = [...String(text).matchAll(/₹\s*([0-9]{1,3}(?:,[0-9]{2,3})+|[0-9]{3,7})/g)];
  const values = matches
    .map((m) => Number(String(m[1]).replace(/,/g, '')))
    .filter((n) => Number.isFinite(n) && n >= 500 && n <= 500000);
  if (!values.length) return null;
  return values.sort((a, b) => b - a)[0];
}

function pageIdFromUrl(url) {
  try {
    return new URL(url).searchParams.get('pageId');
  } catch {
    return null;
  }
}

async function cardText(page, modelName) {
  const text = await page.locator('body').innerText().catch(() => '');
  const marker = modelName ? `\n${modelName}` : '';
  const start = text.indexOf('\nMore\n');
  const end = marker ? text.indexOf(marker) : -1;
  if (start >= 0 && end > start) return text.slice(start + 6, end).trim();
  return text.slice(0, 800);
}

async function clickLabel(page, label) {
  const exact = page.getByText(label, { exact: true });
  if (await exact.count()) {
    try {
      await exact.first().click({ timeout: 2500, force: true });
      return true;
    } catch {
      // fall through
    }
  }
  const fuzzy = page.getByText(label, { exact: false });
  if (await fuzzy.count()) {
    try {
      await fuzzy.first().click({ timeout: 2500, force: true });
      return true;
    } catch {
      // fall through
    }
  }
  return page.evaluate((text) => {
    const normalize = (s) => String(s || '').replace(/\s+/g, ' ').trim().toLowerCase();
    const want = normalize(text);
    const nodes = [...document.querySelectorAll('button, a, div, span, p, label, li')];
    const scored = nodes
      .map((n) => {
        const t = normalize(n.innerText || n.textContent || '');
        let score = 0;
        if (t === want) score = 1000 - t.length;
        else if (t.startsWith(want)) score = 500 - t.length;
        else if (t.includes(want) && t.length < want.length + 24) score = 200 - t.length;
        return { n, score };
      })
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score);
    const target = scored[0]?.n;
    if (!target) return false;
    target.scrollIntoView({ block: 'center', inline: 'center' });
    target.click();
    return true;
  }, label);
}

async function clickContinue(page) {
  const before = page.url();
  const beforeId = pageIdFromUrl(before);
  const ok = await page.evaluate(() => {
    const btn = [...document.querySelectorAll('button')].find((b) =>
      /^continue/i.test((b.innerText || '').trim()),
    );
    if (!btn) return false;
    btn.scrollIntoView({ block: 'center' });
    btn.click();
    return true;
  });
  if (!ok) return false;
  await page.waitForTimeout(900);
  return pageIdFromUrl(page.url()) !== beforeId || page.url() !== before;
}

async function dismissBlockingOverlays(page) {
  const accept = page.getByRole('button', { name: /accept all|accept|agree|got it|allow all|i agree/i });
  if (await accept.count()) {
    await accept.first().click({ force: true, timeout: 2000 }).catch(() => {});
    await page.waitForTimeout(400);
  }
}

async function startCalculator(page) {
  if (/sell\/calculator|pageId=/.test(page.url())) {
    return;
  }

  await page.waitForLoadState('domcontentloaded');
  await page.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {});
  await page.waitForTimeout(2000);
  await dismissBlockingOverlays(page);

  const bodyText = await page.locator('body').innerText().catch(() => '');

  if (/page not found|404|something went wrong|no longer available/i.test(bodyText)) {
    throw new Error(`Cashify product page not found (${page.url()}). Set the correct cashifyProductUrl on this device.`);
  }

  const clickStrategies = [
    async () => page.getByRole('button', { name: /get exact value/i }).first().click({ timeout: 6000, force: true }),
    async () => page.getByRole('link', { name: /get exact value/i }).first().click({ timeout: 6000, force: true }),
    async () => page.locator('text=/get exact value/i').first().click({ timeout: 6000, force: true }),
    async () => page.locator('a[href*="calculator"], a[href*="pageId="]').first().click({ timeout: 6000, force: true }),
    async () => {
      const clicked = await page.evaluate(() => {
        const nodes = [...document.querySelectorAll('a, button, div, span, p')];
        const target = nodes.find((n) => /get exact value/i.test(String(n.innerText || n.textContent || '').trim()));
        if (!target) return false;
        target.scrollIntoView({ block: 'center', inline: 'center' });
        target.click();
        return true;
      });
      if (!clicked) throw new Error('evaluate click missed');
    },
  ];

  let opened = false;
  for (const strategy of clickStrategies) {
    const before = page.url();
    try {
      await strategy();
      await page.waitForTimeout(1500);
      if (/sell\/calculator|pageId=/.test(page.url())) {
        opened = true;
        break;
      }
      if (page.url() !== before) {
        opened = true;
        break;
      }
    } catch {
      // try next strategy
    }
  }

  if (!opened) {
    const calcHref = await page.evaluate(() => {
      const link = [...document.querySelectorAll('a')].find((el) => {
        const href = el.getAttribute('href') || '';
        return /calculator|pageId=/.test(href);
      });
      return link?.href || null;
    });
    if (calcHref) {
      await page.goto(calcHref, { waitUntil: 'domcontentloaded' });
      opened = true;
    }
  }

  try {
    await page.waitForURL(/sell\/calculator|pageId=/, { timeout: 20000 });
  } catch {
    // fall through to validation below
  }

  await page.waitForTimeout(1200);

  if (!/calculator|pageId=/.test(page.url())) {
    const hasExact = /get exact value/i.test(bodyText);
    if (hasExact) {
      throw new Error('Cashify showed "Get Exact Value" but the calculator did not open. Try reconnecting Cashify or run with CASHIFY_HEADLESS=false on the server.');
    }
    throw new Error(
      `No "Get Exact Value" on this Cashify page (${page.url()}). The auto URL may be wrong — add cashifyProductUrl for this model in Device Catalog.`,
    );
  }
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

function gpuLabel(quiz) {
  const hasGpu = quiz.hasGpu === 'yes' || quiz.hasGpu === true;
  const gpuWorking = quiz.isGpuWorking === 'yes' || quiz.isGpuWorking === true;
  if (hasGpu && !gpuWorking) return 'Graphics Card not working';
  if (hasGpu) return 'Graphics Card available';
  return 'Graphics Card not available';
}

function scratchLabel(quiz) {
  const body = quiz.bodyIssuesList || quiz.bodyIssues || [];
  if (body.includes('majorScratch')) return 'Major Scratch on Body';
  if (body.includes('minorScratch')) return 'Minor Scratch on Body';
  return 'No Scratches';
}

function dentLabel(quiz, panel) {
  const body = quiz.bodyIssuesList || quiz.bodyIssues || [];
  const major = panel === 'top' ? 'majorDentTop' : 'majorDentBase';
  const minor = panel === 'top' ? 'minorDentTop' : 'minorDentBase';
  if (body.includes(major)) return '1 or more Major Dents';
  if (body.includes(minor)) return 'Upto 2 Minor Dents';
  return panel === 'top' ? 'No Dents on top panel' : 'No Dents on base panel';
}

async function answerFeatures(page, quiz) {
  await clickLabel(page, SCREEN_SIZE[quiz.screenSize] || '14-15 inch');
  await clickLabel(page, 'Touch Screen not available');
  await clickLabel(page, gpuLabel(quiz));
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

async function answerScreen(page, quiz) {
  const issues = quiz.screenIssuesList || quiz.screenIssues || [];
  const cracked = issues.includes('screenCracked');
  const colour = issues.includes('lineDiscolour');
  await clickLabel(page, cracked ? 'Screen Cracked or Broken' : 'No scratches on screen');
  await clickLabel(page, colour ? 'Minor Discolouration' : 'No Discolouration');
  await clickLabel(page, 'No spots on screen');
  await clickLabel(page, colour ? 'Visible lines on Screen' : 'No Lines');
  await clickLabel(page, cracked || colour ? 'Damaged' : 'Flawless');
  await clickContinue(page);
}

async function answerPhysical(page, quiz) {
  await clickLabel(page, 'Flawless');
  await page.getByText(scratchLabel(quiz), { exact: true }).first().click({ force: true }).catch(() => {});
  await page.getByText(dentLabel(quiz, 'top'), { exact: true }).first().click({ force: true }).catch(() => {});
  await page.getByText(dentLabel(quiz, 'base'), { exact: true }).first().click({ force: true }).catch(() => {});
  await page.getByText('No Loose Hinges', { exact: true }).first().click({ force: true }).catch(() => {});
  await page.getByText('No Cracked or Loose Panel', { exact: true }).first().click({ force: true }).catch(() => {});
  await page.waitForTimeout(400);
  await page.getByRole('button', { name: /^continue$/i }).last().click({ force: true, timeout: 5000 }).catch(() => clickContinue(page));
  await page.waitForTimeout(1500);
}

async function answerCurrentQuestion(page, quiz, modelName) {
  const card = await cardText(page, modelName);
  const kind = classifyQuestion(card);

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
  if (kind === 'features') {
    await answerFeatures(page, quiz);
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
    await clickLabel(page, 'No software issue');
    await clickContinue(page);
    return kind;
  }

  await clickContinue(page);
  return kind;
}

function isLoginModal(text) {
  const t = String(text || '').toLowerCase();
  return /login to unlock|enter your mobile|login\/signup/.test(t) && /\+91|continue/.test(t);
}

function isResultPage(text, url) {
  if (isLoginModal(text)) return true;
  const onCalc = /calculator|pageId=/.test(String(url || ''));
  if (!onCalc && !/sell\/quote|final|offer/.test(String(url || '').toLowerCase())) return false;
  return /your selling price|exact selling price|final quote|device worth|congratulations|offer for your|schedule a pickup|pick a time|get paid|recommended price|selling price/.test(text)
    && /₹\s*[0-9]/.test(text);
}

async function extractVisibleOffer(page) {
  const text = await page.locator('body').innerText();
  const selling = text.match(/selling price[\s\S]{0,40}₹\s*([0-9,]{3,9})/i);
  if (selling) {
    const n = Number(selling[1].replace(/,/g, ''));
    if (n >= 500 && n <= 500000) return n;
  }
  return parseRupees(text);
}

let quoteBusy = false;

async function pageLooksLikeProductListing(page) {
  const text = await page.locator('body').innerText().catch(() => '');
  if (/page not found|404|something went wrong|no longer available/i.test(text)) return false;
  return /get exact value|get upto/i.test(text);
}

async function openProductPage(page, productUrls) {
  const urls = [...new Set((productUrls || []).filter(Boolean))];
  if (!urls.length) {
    throw new Error('Cashify product URL is required for laptop valuation.');
  }

  let lastError = null;
  for (const url of urls) {
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(2000);
      if (await pageLooksLikeProductListing(page)) {
        return { productUrl: url, productMaxPrice: parseRupees(await page.locator('body').innerText()) };
      }
      lastError = new Error(`Cashify page loaded but has no product quote UI (${url}).`);
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError || new Error(`Could not open a valid Cashify product page. Tried: ${urls.join(', ')}`);
}

export async function runLaptopFlow(quiz, { productUrl, productUrls, modelName = '' } = {}) {
  const urls = productUrls?.length
    ? productUrls
    : productUrl
      ? [productUrl]
      : [];
  if (!urls.length) {
    throw new Error('Cashify product URL is required for laptop valuation.');
  }
  if (quoteBusy) {
    throw new Error('Another Cashify quote is already running. Try again in a moment.');
  }

  quoteBusy = true;
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
    const opened = await openProductPage(page, urls);
    resolvedProductUrl = opened.productUrl;
    productMaxPrice = opened.productMaxPrice;
    debugArtifacts.productUrlsTried = urls;
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
    error.debugArtifacts = debugArtifacts;
    throw error;
  } finally {
    await context.close().catch(() => {});
    quoteBusy = false;
  }
}
