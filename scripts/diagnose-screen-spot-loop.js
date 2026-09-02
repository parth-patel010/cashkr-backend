/**
 * Reproduce screenPhysicalDetail loop for spot-only and mixed defect quizzes.
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
    name: 'Samsung Galaxy F62 (spot only)',
    device: { category: 'mobile', brand: 'Samsung', modelName: 'Galaxy F62', slug: 'samsung-galaxy-f62' },
    storage: '6GB / 128GB',
    quiz: {
      storage: '6GB / 128GB', deviceAge: 'Above 11 Months', underWarranty: false,
      eSIMSupport: 'physical+esim', ableToMakeCalls: true, isTouchScreenWorking: true, isScreenOriginal: true,
      physicalIssues: ['screen_spot'], panelCondition: 'none', bentCondition: 'none',
      technicalIssues: [], accessories: ['Charger'], hasCharger: true,
    },
  },
  {
    name: 'Nothing Phone 3 (mixed)',
    device: { category: 'mobile', brand: 'Nothing', modelName: 'Phone 3', slug: 'nothing-phone-3' },
    storage: '12 GB/256 GB',
    quiz: {
      storage: '12 GB/256 GB', deviceAge: '3 - 6 Months', underWarranty: true,
      eSIMSupport: 'physical+esim', ableToMakeCalls: true, isTouchScreenWorking: true, isScreenOriginal: true,
      physicalIssues: ['back_panel', 'camera_glass_broken', 'glass_crack', 'screen_spot'],
      screenPhysicalDetail: 'more2', panelCondition: 'cracked', bentCondition: 'none',
      technicalIssues: ['front_camera', 'back_camera'],
      accessories: ['Bill', 'Box', 'Charger'], hasBox: true, hasCharger: true,
    },
  },
  {
    name: 'Apple iPhone 11 (spot only)',
    device: { category: 'mobile', brand: 'Apple', modelName: 'iPhone 11', slug: 'apple-iphone-11' },
    storage: '128GB',
    quiz: {
      storage: '128GB', deviceAge: 'Above 11 Months', underWarranty: false,
      eSIMSupport: 'physical+esim', ableToMakeCalls: true, isTouchScreenWorking: true, isScreenOriginal: true,
      physicalIssues: ['screen_spot'], panelCondition: 'none', bentCondition: 'none',
      technicalIssues: [], accessories: ['Box', 'Charger'], hasBox: true, hasCharger: true,
    },
  },
  {
    name: 'Oppo A5s (mixed)',
    device: { category: 'mobile', brand: 'Oppo', modelName: 'A5s', slug: 'oppo-a5s' },
    storage: '3GB / 32GB',
    quiz: {
      storage: '3GB / 32GB', deviceAge: 'Above 11 Months', underWarranty: false,
      eSIMSupport: 'physical+esim', ableToMakeCalls: true, isTouchScreenWorking: true, isScreenOriginal: false,
      physicalIssues: ['glass_crack', 'screen_spot', 'back_panel'],
      screenPhysicalDetail: 'minor12', panelCondition: 'none', bentCondition: 'none',
      technicalIssues: ['volume_button'], accessories: ['Charger'], hasCharger: true,
    },
  },
  {
    name: 'Samsung Z Fold 7 (spot)',
    device: { category: 'mobile', brand: 'Samsung', modelName: 'Galaxy Z Fold 7', slug: 'samsung-galaxy-z-fold-7' },
    storage: '12 GB/256 GB',
    quiz: {
      storage: '12 GB/256 GB', deviceAge: 'Above 11 Months', underWarranty: false,
      eSIMSupport: 'physical+esim', ableToMakeCalls: true, isTouchScreenWorking: true, isScreenOriginal: true,
      physicalIssues: ['screen_spot'], panelCondition: 'none', bentCondition: 'none',
      technicalIssues: [], accessories: [],
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
    console.log('steps:', (error.debugArtifacts?.steps || []).map((s) => s.kind).join(' → '));
  }
}

for (const c of cases) {
  // eslint-disable-next-line no-await-in-loop
  await runCase(c);
}
