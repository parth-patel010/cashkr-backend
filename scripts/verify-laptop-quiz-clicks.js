/**
 * Verify Cashify laptop quiz clicks with Chromium + random issue combinations.
 *
 * Usage:
 *   node scripts/verify-laptop-quiz-clicks.js [count]
 *
 * Env:
 *   CASHIFY_SESSION_DIR — path to Cashify browser session (default: DeviceKart-AI/session)
 *   CASHIFY_HEADLESS=false — show browser window
 */
import path from 'path';
import { fileURLToPath } from 'url';
import { openSessionPage, readMeta } from '../services/cashify/sessionManager.js';
import { startCalculator, clickContinue } from '../services/cashify/flowHelpers.js';
import { cashifyProcessor, cashifyRam, cashifyStorage } from '../services/cashify/selectors.js';
import { runLaptopFlow } from '../services/cashify/laptopFlow.js';
import { buildRandomCashifyQuiz, quizSummaryLine } from '../utils/buildRandomCashifyQuiz.js';
import { normalizeLaptopQuiz } from '../utils/quizNormalize.js';
import {
  bodyLabel,
  screenLabel,
  mergeCashifyBody,
  mergeCashifyScreen,
} from '../utils/laptopCashifyQuiz.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const count = Math.max(1, Number(process.argv[2]) || 3);

const TEST_LAPTOP = {
  slug: 'hp-hp-15-series',
  brand: 'HP',
  modelName: 'HP 15 Series',
  productUrl: 'https://www.cashify.in/sell-old-laptop/used-hp-15-series',
};

const EXPECTED_KINDS = new Set([
  'power', 'config', 'features', 'screenSize', 'touchScreen', 'gpu',
  'accessories', 'functional', 'physicalDetail', 'physical',
  'age', 'screenDetail', 'screen', 'overall',
]);

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function openDropdown(page, index) {
  await page.evaluate((i) => {
    const inputs = [...document.querySelectorAll('input[placeholder="Search"]')];
    const el = inputs[i];
    if (!el) return;
    const row = el.closest('.flex.flex-row') || el.parentElement;
    const svg = row?.querySelector('svg');
    (svg || el).dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
    el.focus();
  }, index);
  await page.waitForTimeout(400);
}

async function readDropdownOptions(page, index) {
  await openDropdown(page, index);
  const options = await page.evaluate(() => {
    const normalize = (s) => String(s || '').replace(/\s+/g, ' ').trim();
    const nodes = [...document.querySelectorAll('div, span, li, button, p')];
    const seen = new Set();
    const out = [];
    for (const n of nodes) {
      const t = normalize(n.innerText || '');
      if (!t || t.length > 60 || t.length < 3) continue;
      if (/search|continue|processor|ram|storage|hard disk/i.test(t)) continue;
      if (seen.has(t)) continue;
      if (!(n.offsetParent || n.getClientRects().length)) continue;
      seen.add(t);
      out.push(t);
    }
    return out.slice(0, 80);
  });
  await page.keyboard.press('Escape').catch(() => {});
  return options;
}

async function pickDropdown(page, index, value) {
  await openDropdown(page, index);
  await page.keyboard.press('Control+A').catch(() => {});
  await page.keyboard.press('Backspace').catch(() => {});
  await page.keyboard.type(value, { delay: 15 });
  await page.waitForTimeout(400);
  await page.evaluate((want) => {
    const normalize = (s) => String(s || '').replace(/\s+/g, ' ').trim().toLowerCase();
    const target = normalize(want);
    const nodes = [...document.querySelectorAll('div, span, li, button, p')];
    const exact = nodes.find((n) => normalize(n.innerText) === target && (n.offsetParent || n.getClientRects().length));
    if (exact) exact.click();
  }, value);
  await page.keyboard.press('Escape').catch(() => {});
  await page.waitForTimeout(300);
}

async function discoverRandomConfig(productUrl) {
  const { context, page } = await openSessionPage();
  try {
    await page.goto(productUrl, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1500);
    await startCalculator(page);

    const body = await page.locator('body').innerText().catch(() => '');
    if (/switch on/i.test(body)) {
      await page.getByText('Yes', { exact: true }).first().click({ force: true, timeout: 5000 }).catch(() => {});
      await page.waitForTimeout(800);
    }

    await page.waitForSelector('input[placeholder="Search"]', { timeout: 15000 });
    const processors = (await readDropdownOptions(page, 0)).filter((p) => /intel|amd|apple|ryzen|core|pentium|celeron/i.test(p));
    if (!processors.length) throw new Error('No processors in dropdown');
    const processor = pickRandom(processors);
    await pickDropdown(page, 0, cashifyProcessor(processor));

    const rams = (await readDropdownOptions(page, 1)).filter((r) => /^\d+\s*(GB|MB)$/i.test(r.trim()));
    if (!rams.length) throw new Error('No RAM options');
    const ram = pickRandom(rams);
    await pickDropdown(page, 1, cashifyRam(ram));

    const storages = (await readDropdownOptions(page, 2)).filter((s) => /\d+\s*(GB|TB)/i.test(s) && /(SSD|HDD)/i.test(s));
    if (!storages.length) throw new Error('No storage options');
    const storage = pickRandom(storages);
    await pickDropdown(page, 2, cashifyStorage(storage));
    await clickContinue(page);

    return {
      processors,
      rams,
      storages,
      picked: { processor, ram, storage },
    };
  } finally {
    await context.close().catch(() => {});
  }
}

function expectedClickLabels(quiz) {
  const body = mergeCashifyBody(quiz);
  const screen = mergeCashifyScreen(quiz);
  return {
    body: [
      bodyLabel('bodyScratch', body.bodyScratch),
      bodyLabel('dentTop', body.dentTop),
      bodyLabel('dentBase', body.dentBase),
      bodyLabel('looseHinges', body.looseHinges),
      bodyLabel('panelCondition', body.panelCondition),
    ],
    screen: [
      screenLabel('screenScratch', screen.screenScratch),
      screenLabel('screenDiscolouration', screen.screenDiscolouration),
      screenLabel('screenSpots', screen.screenSpots),
      screenLabel('screenLines', screen.screenLines),
    ],
  };
}

function analyzeRun(result, quiz) {
  const steps = result.debugArtifacts?.steps || [];
  const kinds = steps.map((s) => s.kind);
  const hasPrice = Boolean(result.cashifyPrice);
  const loginLocked = Boolean(result.loginRequired);
  const sawFunctional = kinds.some((k) => k === 'functional');
  const sawPhysical = kinds.some((k) => /physical/.test(k));
  const sawScreen = kinds.some((k) => /screen/.test(k));
  const sawAge = kinds.includes('age');

  return {
    ok: hasPrice && !loginLocked && sawFunctional && sawPhysical && sawScreen && sawAge,
    hasPrice,
    loginLocked,
    kinds,
    stepCount: steps.length,
    expected: expectedClickLabels(quiz),
    note: result.note || null,
  };
}

async function runOne(i, config) {
  const raw = buildRandomCashifyQuiz(TEST_LAPTOP, config);
  const quiz = normalizeLaptopQuiz({ ...raw, slug: TEST_LAPTOP.slug });

  console.log(`\n--- Run ${i + 1}/${count} ---`);
  console.log('Quiz:', quizSummaryLine(quiz));
  console.log('Expected body clicks:', expectedClickLabels(quiz).body.join(' · '));
  console.log('Expected screen clicks:', expectedClickLabels(quiz).screen.join(' · '));

  const result = await runLaptopFlow(quiz, {
    productUrls: [TEST_LAPTOP.productUrl],
    modelName: TEST_LAPTOP.modelName,
  });

  const analysis = analyzeRun(result, quiz);
  console.log('Steps:', analysis.kinds.join(' → '));
  console.log('Price:', result.cashifyPrice ?? '—', analysis.loginLocked ? '(login locked)' : '');
  console.log('Result:', analysis.ok ? 'PASS' : 'FAIL', analysis.note ? `(${analysis.note})` : '');

  if (!analysis.ok) {
    const lastShot = result.debugArtifacts?.screenshots?.slice(-1)[0];
    if (lastShot?.screenshot) console.log('Screenshot:', lastShot.screenshot);
  }

  return { ...analysis, price: result.cashifyPrice, quiz };
}

async function main() {
  const sessionDir = process.env.CASHIFY_SESSION_DIR
    || path.resolve(__dirname, '../../../DeviceKart-AI/session');
  process.env.CASHIFY_SESSION_DIR = sessionDir;
  if (!process.env.CASHIFY_HEADLESS) process.env.CASHIFY_HEADLESS = 'true';

  const meta = readMeta();
  console.log('=== Laptop Quiz Click Verification (Chromium) ===');
  console.log('Session:', sessionDir, '| status:', meta.status);
  console.log('Laptop:', TEST_LAPTOP.modelName, TEST_LAPTOP.productUrl);
  console.log('Runs:', count);

  if (meta.status !== 'connected') {
    console.warn('WARNING: Cashify session not connected — runs may hit login wall.');
  }

  console.log('\nDiscovering random valid config…');
  const config = await discoverRandomConfig(TEST_LAPTOP.productUrl);
  console.log('Config:', config.picked.processor, '|', config.picked.ram, '|', config.picked.storage);

  const results = [];
  for (let i = 0; i < count; i += 1) {
    try {
      results.push(await runOne(i, config));
    } catch (err) {
      console.log('ERROR:', err.message);
      results.push({ ok: false, error: err.message });
    }
  }

  const passed = results.filter((r) => r.ok).length;
  console.log('\n=== SUMMARY ===');
  console.log(`Passed: ${passed}/${results.length}`);
  if (passed < results.length) {
    results.forEach((r, idx) => {
      if (!r.ok) console.log(`  Run ${idx + 1}: FAIL`, r.error || r.kinds?.join(' → ') || '');
    });
    process.exit(1);
  }
  console.log('All random quiz click paths completed successfully.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
