/**
 * Quick repro: open iPhone 17 Pro, pick 256 GB variant, start calculator.
 *
 * Usage:
 *   node scripts/diagnose-iphone-variant.js
 */
import path from 'path';
import { fileURLToPath } from 'url';
import { openSessionPage, readMeta } from '../services/cashify/sessionManager.js';
import { startCalculator } from '../services/cashify/flowHelpers.js';
import { pickMobileVariant, runMobileFlow } from '../services/cashify/mobileFlow.js';
import { buildRandomCashifyMobileQuiz } from '../utils/buildRandomCashifyMobileQuiz.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PRODUCT_URL = 'https://www.cashify.in/sell-old-mobile-phone/used-apple-iphone-17-pro';

async function main() {
  process.env.CASHIFY_SESSION_DIR = process.env.CASHIFY_SESSION_DIR
    || path.resolve(__dirname, '../../../DeviceKart-AI/session');
  if (!process.env.CASHIFY_HEADLESS) process.env.CASHIFY_HEADLESS = 'true';

  console.log('Session:', process.env.CASHIFY_SESSION_DIR, '|', readMeta().status);
  console.log('URL:', PRODUCT_URL);

  const quiz = {
    ...buildRandomCashifyMobileQuiz({
      slug: 'apple-iphone-17-pro',
      brand: 'Apple',
      modelName: 'Apple iPhone 17 Pro',
      storage: '256GB',
    }),
    storage: '256GB',
  };

  console.log('\n--- Full mobile flow (random conditions, 256GB) ---');
  const result = await runMobileFlow(quiz, {
    productUrls: [PRODUCT_URL],
    modelName: 'Apple iPhone 17 Pro',
  });

  console.log('Price:', result.cashifyPrice);
  console.log('Login required:', result.loginRequired);
  console.log('Note:', result.note || '—');
  console.log('Steps:', (result.debugArtifacts?.steps || []).map((s) => s.kind).join(' → '));
  console.log('OK:', Boolean(result.cashifyPrice) && !result.loginRequired);
}

main().catch((err) => {
  console.error('FAILED:', err.message);
  process.exit(1);
});
