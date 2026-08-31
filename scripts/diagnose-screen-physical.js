/**
 * Headless: reproduce screenPhysicalDetail loop (Z Fold6 / Narzo).
 */
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { runMobileFlow } from '../services/cashify/mobileFlow.js';
import { buildCashifyProductUrlCandidates } from '../config/cashify.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
process.env.CASHIFY_SESSION_DIR = process.env.CASHIFY_SESSION_DIR
  || path.resolve(__dirname, '../../../DeviceKart-AI/session');
process.env.CASHIFY_HEADLESS = 'true';

const cases = [
  {
    name: 'Z Fold6',
    device: { category: 'mobile', brand: 'Samsung', modelName: 'Galaxy Z Fold6 5G', slug: 'samsung-galaxy-z-fold6-5g' },
    storage: '12 GB/256 GB',
    quiz: {
      storage: '12 GB/256 GB',
      deviceAge: 'Above 11 Months',
      underWarranty: false,
      eSIMSupport: 'physical+esim',
      ableToMakeCalls: true,
      isTouchScreenWorking: false,
      isScreenOriginal: true,
      physicalIssues: ['screen_spot', 'back_panel'],
      panelCondition: 'none',
      bentCondition: 'none',
      technicalIssues: [],
      accessories: [],
    },
  },
  {
    name: 'Narzo 20 Pro',
    device: { category: 'mobile', brand: 'Realme', modelName: 'Realme Narzo 20 Pro', slug: 'realme-realme-narzo-20-pro' },
    storage: '6 GB/64 GB',
    quiz: {
      storage: '6 GB/64 GB',
      deviceAge: '0 - 3 Months',
      underWarranty: true,
      eSIMSupport: 'physical+esim',
      ableToMakeCalls: true,
      isTouchScreenWorking: true,
      isScreenOriginal: true,
      physicalIssues: ['camera_glass_broken', 'glass_crack', 'screen_spot', 'back_panel', 'panel_missing'],
      screenPhysicalDetail: 'minor12',
      panelCondition: 'none',
      bentCondition: 'none',
      technicalIssues: [],
      accessories: ['bill', 'box', 'charger'],
      hasBox: true,
      hasCharger: true,
    },
  },
];

async function runCase(c) {
  const urls = buildCashifyProductUrlCandidates(c.device, { storage: c.storage });
  console.log(`\n======== ${c.name} ========`);
  console.log('first url:', urls[0]);
  try {
    const result = await runMobileFlow(c.quiz, {
      productUrls: urls,
      modelName: c.device.modelName,
      device: c.device,
    });
    console.log('SUCCESS', result.cashifyPrice, (result.debugArtifacts?.steps || []).map((s) => s.kind).join(' → '));
  } catch (error) {
    console.log('FAILED:', error.message);
    const steps = (error.debugArtifacts?.steps || []).map((s) => s.kind).join(' → ');
    console.log('steps:', steps);
    const shots = error.debugArtifacts?.screenshots || [];
    const last = shots[shots.length - 1];
    if (last?.textDump && fs.existsSync(last.textDump)) {
      const text = fs.readFileSync(last.textDump, 'utf8');
      const body = text.slice(text.indexOf('\n\n') + 2, text.indexOf('\n\n') + 2500);
      console.log('--- page body ---\n', body);
    }
  }
}

for (const c of cases) {
  // eslint-disable-next-line no-await-in-loop
  await runCase(c);
}
