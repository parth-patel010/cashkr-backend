/**
 * Headless Chromium: full S24 Ultra flow — dump steps and post-accessories page text.
 */
import path from 'path';
import { fileURLToPath } from 'url';
import { runMobileFlow } from '../services/cashify/mobileFlow.js';
import config from '../config/cashify.js';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
process.env.CASHIFY_SESSION_DIR = process.env.CASHIFY_SESSION_DIR
  || path.resolve(__dirname, '../../../DeviceKart-AI/session');
process.env.CASHIFY_HEADLESS = 'true';

const PRODUCT_URL = 'https://www.cashify.in/sell-old-mobile-phone/used-samsung-galaxy-s24-ultra-5g-12-gb-256-gb';

const quiz = {
  storage: '12 GB/256 GB',
  deviceAge: '6 - 11 Months',
  underWarranty: true,
  eSIMSupport: 'physical+esim',
  ableToMakeCalls: true,
  isTouchScreenWorking: true,
  isScreenOriginal: true,
  physicalIssues: [],
  panelCondition: 'none',
  bentCondition: 'none',
  technicalIssues: [],
  accessories: ['bill', 'box', 'charger'],
  hasBox: true,
  hasCharger: true,
};

async function main() {
  try {
    const result = await runMobileFlow(quiz, {
      productUrls: [PRODUCT_URL],
      modelName: 'Galaxy S24 Ultra 5G',
      device: {
        category: 'mobile',
        brand: 'Samsung',
        modelName: 'Galaxy S24 Ultra 5G',
        slug: 'samsung-galaxy-s24-ultra-5g',
      },
    });
    console.log('SUCCESS cashifyPrice:', result.cashifyPrice);
    console.log('ourOffer would use basePrice from record');
    console.log('steps:', (result.debugArtifacts?.steps || []).map((s) => s.kind).join(' → '));
  } catch (error) {
    console.error('FAILED:', error.message);
    const artifacts = error.debugArtifacts || {};
    console.log('steps:', (artifacts.steps || []).map((s) => s.kind).join(' → '));
    const shots = artifacts.screenshots || [];
    const lastShot = shots[shots.length - 1];
    if (lastShot?.textDump && fs.existsSync(lastShot.textDump)) {
      const text = fs.readFileSync(lastShot.textDump, 'utf8');
      const bodyStart = text.indexOf('\n\n') + 2;
      console.log('\n--- Last debug page body (first 2000 chars) ---\n');
      console.log(text.slice(bodyStart, bodyStart + 2000));
    }
    process.exitCode = 1;
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
