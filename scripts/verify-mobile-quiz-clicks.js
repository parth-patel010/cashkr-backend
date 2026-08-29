/**
 * Verify Cashify mobile quiz clicks with Chromium + random issue combinations.
 *
 * Usage:
 *   node scripts/verify-mobile-quiz-clicks.js [count]
 *
 * Env:
 *   CASHIFY_SESSION_DIR — path to Cashify browser session (default: DeviceKart-AI/session)
 *   CASHIFY_HEADLESS=false — show browser window
 */
import path from 'path';
import { fileURLToPath } from 'url';
import { openSessionPage, readMeta } from '../services/cashify/sessionManager.js';
import { runMobileFlow } from '../services/cashify/mobileFlow.js';
import { buildRandomCashifyMobileQuiz, mobileQuizSummaryLine } from '../utils/buildRandomCashifyMobileQuiz.js';
import { normalizeMobileQuiz } from '../utils/quizNormalize.js';
import {
  MOBILE_PHYSICAL_LABELS,
  MOBILE_TECHNICAL_LABELS,
} from '../services/cashify/selectors.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const count = Math.max(1, Number(process.argv[2]) || 3);

const TEST_MOBILE = {
  slug: 'samsung-galaxy-m31',
  brand: 'Samsung',
  modelName: 'Galaxy M31',
  productUrls: [
    'https://www.cashify.in/sell-old-mobile-phone/used-samsung-galaxy-m31',
    'https://www.cashify.in/sell-old-mobile-phones/used-samsung-galaxy-m31',
  ],
  fallbackStorages: ['6 GB/64 GB', '6 GB/128 GB', '8 GB/128 GB'],
};

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function discoverMobileVariants(productUrls) {
  const { context, page } = await openSessionPage();
  try {
    let lastError = null;
    for (const url of productUrls) {
      try {
        await page.goto(url, { waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(1500);

        const variants = await page.evaluate(() => {
          const normalize = (s) => String(s || '').replace(/\s+/g, ' ').trim();
          const nodes = [...document.querySelectorAll('div, span, button, a, p, li')];
          const seen = new Set();
          const out = [];
          for (const n of nodes) {
            const t = normalize(n.innerText || n.textContent || '');
            if (!/^\d+\s*GB\s*\/\s*\d+\s*GB$/i.test(t)) continue;
            if (seen.has(t)) continue;
            if (!(n.offsetParent || n.getClientRects().length)) continue;
            seen.add(t);
            out.push(t);
          }
          return out;
        });

        if (variants.length) {
          const storage = pickRandom(variants);
          return { storages: variants, picked: { storage }, productUrl: url };
        }
      } catch (err) {
        lastError = err;
      }
    }

    if (lastError) throw lastError;
    const storage = pickRandom(TEST_MOBILE.fallbackStorages);
    return {
      storages: TEST_MOBILE.fallbackStorages,
      picked: { storage },
      productUrl: productUrls[0],
    };
  } finally {
    await context.close().catch(() => {});
  }
}

function expectedClickLabels(quiz) {
  return {
    physical: (quiz.physicalIssues || []).map((id) => MOBILE_PHYSICAL_LABELS[id]).filter(Boolean),
    technical: (quiz.technicalIssues || []).map((id) => MOBILE_TECHNICAL_LABELS[id]).filter(Boolean),
  };
}

function analyzeRun(result) {
  const steps = result.debugArtifacts?.steps || [];
  const kinds = steps.map((s) => s.kind);
  const hasPrice = Boolean(result.cashifyPrice);
  const loginLocked = Boolean(result.loginRequired);
  const finalUrl = result.debugArtifacts?.finalUrl || '';
  const onQuotePage = /sell\/quote/.test(finalUrl);
  const plausiblePrice = hasPrice && result.cashifyPrice <= 50_000;
  const sawCoreSteps = ['generalScreen', 'physical', 'technical', 'accessories']
    .filter((k) => kinds.includes(k)).length >= 2;

  return {
    ok: plausiblePrice && !loginLocked && onQuotePage && sawCoreSteps,
    hasPrice,
    loginLocked,
    kinds,
    stepCount: steps.length,
    finalUrl,
    note: result.note || null,
  };
}

async function runOne(i, config, productUrls) {
  const raw = buildRandomCashifyMobileQuiz(TEST_MOBILE, config);
  const quiz = normalizeMobileQuiz({ ...raw, slug: TEST_MOBILE.slug });
  const expected = expectedClickLabels(quiz);

  console.log(`\n--- Run ${i + 1}/${count} ---`);
  console.log('Quiz:', mobileQuizSummaryLine(quiz));
  console.log('Expected physical:', expected.physical.length ? expected.physical.join(' · ') : '(none — No Issues)');
  console.log('Expected technical:', expected.technical.length ? expected.technical.join(' · ') : '(none — No Issues)');

  const result = await runMobileFlow(quiz, {
    productUrls,
    modelName: TEST_MOBILE.modelName,
  });

  const analysis = analyzeRun(result);
  console.log('Steps:', analysis.kinds.join(' → '));
  console.log('Price:', result.cashifyPrice ?? '—', analysis.loginLocked ? '(login locked)' : '');
  console.log('Result:', analysis.ok ? 'PASS' : 'FAIL', analysis.note ? `(${analysis.note})` : '');

  if (!analysis.ok) {
    const lastShot = result.debugArtifacts?.screenshots?.slice(-1)[0];
    if (lastShot?.screenshot) console.log('Screenshot:', lastShot.screenshot);
    if (lastShot?.textDump) console.log('Debug dump:', lastShot.textDump);
  }

  return { ...analysis, price: result.cashifyPrice, quiz };
}

async function main() {
  const sessionDir = process.env.CASHIFY_SESSION_DIR
    || path.resolve(__dirname, '../../../DeviceKart-AI/session');
  process.env.CASHIFY_SESSION_DIR = sessionDir;
  if (!process.env.CASHIFY_HEADLESS) process.env.CASHIFY_HEADLESS = 'true';

  const meta = readMeta();
  console.log('=== Mobile Quiz Click Verification (Chromium) ===');
  console.log('Session:', sessionDir, '| status:', meta.status);
  console.log('Mobile:', TEST_MOBILE.modelName, TEST_MOBILE.productUrls[0]);
  console.log('Runs:', count);

  if (meta.status !== 'connected') {
    console.warn('WARNING: Cashify session not connected — runs may hit login wall.');
  }

  console.log('\nDiscovering storage variants…');
  const config = await discoverMobileVariants(TEST_MOBILE.productUrls);
  console.log('Variants:', config.storages.join(', '));
  console.log('Picked:', config.picked.storage);

  const productUrls = config.productUrl
    ? [config.productUrl, ...TEST_MOBILE.productUrls.filter((u) => u !== config.productUrl)]
    : TEST_MOBILE.productUrls;

  const results = [];
  for (let i = 0; i < count; i += 1) {
    try {
      results.push(await runOne(i, config, productUrls));
    } catch (err) {
      console.log('ERROR:', err.message);
      const dump = err.debugArtifacts?.screenshots?.slice(-1)[0];
      if (dump?.textDump) console.log('Debug dump:', dump.textDump);
      results.push({ ok: false, error: err.message, kinds: err.debugArtifacts?.steps?.map((s) => s.kind) });
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
  console.log('All random mobile quiz click paths completed successfully.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
