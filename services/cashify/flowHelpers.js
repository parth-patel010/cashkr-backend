import fs from 'fs';
import path from 'path';
import config, {
  buildCashifyProductUrlCandidates,
  getBrandListingSlug,
  slugVariants,
} from '../../config/cashify.js';

let quoteBusy = false;

export function acquireQuoteLock() {
  if (quoteBusy) {
    throw new Error('Valuation agent is busy — Another Cashify quote is already running. Try again in a moment.');
  }
  quoteBusy = true;
}

export function releaseQuoteLock() {
  quoteBusy = false;
}

export function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

export async function saveDebug(page, name, screenshotDir) {
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
const MIN_PRICE = config.MIN_CASHIFY_PRICE ?? 100;
const MAX_PRICE = 500_000;

function inPriceRange(n) {
  return Number.isFinite(n) && n >= MIN_PRICE && n <= MAX_PRICE;
}

export function findPriceInObject(value, depth = 0, keyHint = '') {
  if (depth > 10 || value == null) return null;
  if (typeof value === 'number' && inPriceRange(value) && /price|quote|amount|qp|sp|value/i.test(keyHint)) {
    return value;
  }
  if (typeof value === 'string') {
    const n = Number(String(value).replace(/[₹,\s]/g, ''));
    if (inPriceRange(n) && /price|quote|amount|qp|sp|value/i.test(keyHint)) {
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
      if (inPriceRange(n)) return n;
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

export function parseRupees(text) {
  const matches = [...String(text).matchAll(/₹\s*([0-9]{1,3}(?:,[0-9]{2,3})+|[0-9]{3,7})/g)];
  const values = matches
    .map((m) => Number(String(m[1]).replace(/,/g, '')))
    .filter((n) => inPriceRange(n));
  if (!values.length) return null;
  return values.sort((a, b) => b - a)[0];
}

export function pageIdFromUrl(url) {
  try {
    return new URL(url).searchParams.get('pageId');
  } catch {
    return null;
  }
}

export async function clickLabel(page, label) {
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

export async function clickYesNo(page, yes) {
  const label = yes ? 'Yes' : 'No';
  const clicked = await page.evaluate((want) => {
    const normalize = (s) => String(s || '').replace(/\s+/g, ' ').trim();
    const buttons = [...document.querySelectorAll('button')];
    const continueBtn = buttons.find((b) => /^continue$/i.test(normalize(b.innerText)));
    if (!continueBtn) return false;

    let container = continueBtn.parentElement;
    for (let depth = 0; depth < 10 && container; depth += 1) {
      const candidates = [...container.querySelectorAll('button, div, span, label, p')].filter(
        (n) => normalize(n.innerText) === want && (n.offsetParent || n.getClientRects().length),
      );
      if (candidates.length) {
        const target = candidates[candidates.length - 1];
        target.scrollIntoView({ block: 'center' });
        target.click();
        return true;
      }
      container = container.parentElement;
    }
    return false;
  }, label);

  if (!clicked) {
    await page.getByText(label, { exact: true }).first().click({ force: true, timeout: 5000 }).catch(() => clickLabel(page, label));
  }
  await page.waitForTimeout(600);
}

export async function clickContinue(page) {
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

export async function startCalculator(page) {
  if (/sell\/calculator|pageId=/.test(page.url())) {
    return;
  }

  await page.waitForLoadState('domcontentloaded');
  await page.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {});
  await page.waitForTimeout(2000);
  await dismissBlockingOverlays(page);

  // If Get Exact Value is disabled, a variant must be selected first (iPhone storage-only, etc.)
  const exactDisabled = await page.evaluate(() => {
    const nodes = [...document.querySelectorAll('button, a, div, span')];
    const btn = nodes.find((n) => /^get exact value/i.test(String(n.innerText || '').trim()));
    if (!btn) return false;
    if (btn.disabled || btn.getAttribute('aria-disabled') === 'true') return true;
    const cls = `${btn.className || ''} ${btn.parentElement?.className || ''}`.toLowerCase();
    return /disabled|opacity-50|cursor-not-allowed|pointer-events-none/.test(cls);
  }).catch(() => false);

  if (exactDisabled) {
    const href = await page.evaluate(() => {
      const normalize = (s) => String(s || '').replace(/\s+/g, ' ').trim();
      const visible = (n) => n && (n.offsetParent || n.getClientRects().length);
      const nodes = [...document.querySelectorAll('a, div, span, button, p, li, label')];
      const headerIdx = nodes.findIndex((n) => /choose a variant/i.test(normalize(n.innerText)));
      let endIdx = nodes.length;
      if (headerIdx >= 0) {
        const nextIdx = nodes.findIndex((n, i) => i > headerIdx && /get exact value|top selling|top models/i.test(normalize(n.innerText)));
        if (nextIdx >= 0) endIdx = nextIdx;
      }
      const section = headerIdx >= 0 ? nodes.slice(headerIdx, endIdx) : nodes;
      const option = section.find((n) => {
        const t = normalize(n.innerText || '');
        return t.length <= 40
          && (/^\d+\s*GB\s*\/\s*\d+(?:\.\d+)?\s*(GB|TB)$/i.test(t) || /^\d+(?:\.\d+)?\s*(GB|TB)$/i.test(t))
          && visible(n);
      });
      if (!option) return null;
      const link = option.closest?.('a[href]') || (option.tagName === 'A' ? option : null);
      const target = link || option;
      target.scrollIntoView({ block: 'center' });
      target.click();
      return link?.href || null;
    });
    if (href) {
      try {
        await page.waitForURL((url) => String(url).includes(new URL(href).pathname.split('/').pop()), { timeout: 8000 });
      } catch {
        if (!/calculator|pageId=/.test(page.url())) {
          await page.goto(href, { waitUntil: 'domcontentloaded' }).catch(() => {});
        }
      }
    }
    await page.waitForTimeout(800);
  }

  const bodyText = await page.locator('body').innerText().catch(() => '');

  if (/page not found|404|something went wrong|no longer available/i.test(bodyText)) {
    throw new Error(`Cashify product page not found (${page.url()}). Set the correct cashifyProductUrl on this device.`);
  }

  const clickStrategies = [
    async () => {
      const btn = page.getByRole('button', { name: /get exact value/i }).first();
      await btn.waitFor({ state: 'visible', timeout: 6000 }).catch(() => {});
      await page.waitForFunction(() => {
        const nodes = [...document.querySelectorAll('button, a')];
        const el = nodes.find((n) => /get exact value/i.test(String(n.innerText || '').trim()));
        if (!el) return false;
        if (el.disabled || el.getAttribute('aria-disabled') === 'true') return false;
        return true;
      }, { timeout: 8000 }).catch(() => {});
      await btn.click({ timeout: 6000, force: true });
    },
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

export async function pageLooksLikeProductListing(page) {
  const text = await page.locator('body').innerText().catch(() => '');
  if (/page not found|404|something went wrong|no longer available/i.test(text)) return false;
  return /get exact value|get upto|choose a variant/i.test(text);
}

function scoreListingLink(href, slugHints = []) {
  let pathSlug = '';
  try {
    const { pathname } = new URL(href);
    const match = pathname.match(/\/sell-old-laptop\/used-([^/?#]+)/i);
    pathSlug = match?.[1] || '';
  } catch {
    return -1;
  }
  if (!pathSlug) return -1;

  let score = 0;
  for (const hint of slugHints) {
    if (!hint) continue;
    if (pathSlug === hint) score = Math.max(score, 1000);
    else if (pathSlug.includes(hint) || hint.includes(pathSlug)) score = Math.max(score, 500 - Math.abs(pathSlug.length - hint.length));
  }
  return score;
}

async function discoverFromBrandListing(page, device) {
  const listingSlug = getBrandListingSlug(device?.brand);
  if (!listingSlug || !device) return null;

  const slugHints = slugVariants(device.slug, device.brand, device.modelName);
  const listingUrl = `https://www.cashify.in/sell-old-laptop/${listingSlug}`;

  try {
    await page.goto(listingUrl, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1500);

    const links = await page.evaluate(() => [...document.querySelectorAll('a[href*="/sell-old-laptop/used-"]')]
      .map((el) => el.href)
      .filter(Boolean));

    const ranked = [...new Set(links)]
      .map((href) => ({ href, score: scoreListingLink(href, slugHints) }))
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score);

    for (const { href } of ranked.slice(0, 8)) {
      await page.goto(href, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(1500);
      if (await pageLooksLikeProductListing(page)) {
        return href;
      }
    }
  } catch {
    // fall through
  }

  return null;
}

export async function openProductPage(page, productUrls, categoryLabel = 'device', device = null) {
  const urls = [...new Set((productUrls || []).filter(Boolean))];
  if (!urls.length && device) {
    urls.push(...buildCashifyProductUrlCandidates(device));
  }
  if (!urls.length) {
    throw new Error(`Cashify product URL is required for ${categoryLabel} valuation.`);
  }

  const productUrlsTried = [];
  let lastReason = 'unknown error';

  for (const url of urls) {
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(2000);
      const valid = await pageLooksLikeProductListing(page);
      productUrlsTried.push({ url, valid, reason: valid ? 'matched product page' : 'no product quote UI' });
      if (valid) {
        return {
          productUrl: url,
          productMaxPrice: parseRupees(await page.locator('body').innerText()),
          productUrlsTried,
        };
      }
      lastReason = `Cashify page loaded but has no product quote UI (${url}).`;
    } catch (error) {
      lastReason = error.message;
      productUrlsTried.push({ url, valid: false, reason: error.message });
    }
  }

  if (device && (categoryLabel === 'laptop' || categoryLabel === 'mac' || device.category === 'laptop' || device.category === 'mac')) {
    const discovered = await discoverFromBrandListing(page, device);
    if (discovered) {
      productUrlsTried.push({ url: discovered, valid: true, reason: 'matched via brand listing page' });
      return {
        productUrl: discovered,
        productMaxPrice: parseRupees(await page.locator('body').innerText()),
        productUrlsTried,
      };
    }
    productUrlsTried.push({
      url: `https://www.cashify.in/sell-old-laptop/${getBrandListingSlug(device.brand)}`,
      valid: false,
      reason: 'brand listing page had no matching product link',
    });
  }

  const triedList = productUrlsTried.map((entry) => entry.url).join(', ');
  const error = new Error(
    `Could not open a valid Cashify product page for ${categoryLabel}. Tried ${productUrlsTried.length} URL(s): ${triedList}. ${lastReason} Set cashifyProductUrl on this device in Device Catalog if auto-discovery keeps failing.`,
  );
  error.productUrlsTried = productUrlsTried;
  throw error;
}

export function isLoginModal(text) {
  const t = String(text || '').toLowerCase();
  return /login to unlock|enter your mobile|login\/signup/.test(t) && /\+91|continue/.test(t);
}

export function isResultPage(text, url) {
  if (isLoginModal(text)) return true;
  const onCalc = /calculator|pageId=/.test(String(url || ''));
  if (!onCalc && !/sell\/quote|final|offer/.test(String(url || '').toLowerCase())) return false;
  return /your selling price|exact selling price|final quote|device worth|congratulations|offer for your|schedule a pickup|pick a time|get paid|recommended price|selling price/.test(text)
    && /₹\s*[0-9]/.test(text);
}

export async function extractVisibleOffer(page) {
  const text = await page.locator('body').innerText();
  const selling = text.match(/selling price[\s\S]{0,40}₹\s*([0-9,]{3,9})/i);
  if (selling) {
    const n = Number(selling[1].replace(/,/g, ''));
    if (inPriceRange(n)) return n;
  }
  return parseRupees(text);
}

export async function runQuoteLoop(page, {
  quiz,
  modelName,
  answerQuestion,
  screenshotDir,
  debugArtifacts,
  apiBodies,
  getApiPrice,
  setApiPrice,
}) {
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

    const kind = await answerQuestion(page, quiz, modelName);
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

  let cashifyPrice = getApiPrice() || (await extractVisibleOffer(page));
  if (!cashifyPrice) {
    for (const entry of apiBodies.slice().reverse()) {
      const found = findPriceInObject(entry.json);
      if (found) {
        cashifyPrice = found;
        setApiPrice(found);
        break;
      }
    }
  }

  const apiDumpPath = path.join(screenshotDir, `api-${Date.now()}.json`);
  fs.writeFileSync(apiDumpPath, JSON.stringify(apiBodies.slice(-20), null, 2));
  debugArtifacts.apiDump = apiDumpPath;
  debugArtifacts.finalUrl = page.url();

  return { cashifyPrice, loginLocked, finalText };
}

export { config };
