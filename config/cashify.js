import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const sessionRoot = process.env.CASHIFY_SESSION_DIR
  || path.join(__dirname, '..', 'data', 'cashify-session');

export default {
  MARKUP_INR: Number(process.env.CASHIFY_MARKUP_INR) || 1000,
  HEADLESS: process.env.CASHIFY_HEADLESS !== 'false',
  SLOW_MO_MS: process.env.CASHIFY_HEADLESS === 'false' ? 80 : 0,
  NAV_TIMEOUT_MS: 45_000,
  STEP_TIMEOUT_MS: 8_000,
  MAX_QUESTION_STEPS: 24,
  SESSION_DIR: sessionRoot,
  USER_DATA_DIR: path.join(sessionRoot, 'browser-profile'),
  META_PATH: path.join(sessionRoot, 'meta.json'),
  SCREENSHOT_DIR: path.join(sessionRoot, 'screenshots'),
};

function brandSlugKey(brand) {
  return String(brand || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/** Ordered URL candidates — Cashify often drops the brand prefix (e.g. used-g7-gaming-series). */
export function buildCashifyProductUrlCandidates(device) {
  if (device.cashifyProductUrl) return [device.cashifyProductUrl];

  const slug = String(device.slug || '').trim();
  if (!slug) return [];

  const basePaths = device.category === 'mobile'
    ? [
      'https://www.cashify.in/sell-old-mobile-phone/used-',
      'https://www.cashify.in/sell-old-mobile-phones/used-',
    ]
    : device.category === 'laptop' || device.category === 'mac'
      ? ['https://www.cashify.in/sell-old-laptop/used-']
      : [];

  if (!basePaths.length) return [];

  const candidates = [];
  for (const base of basePaths) {
    candidates.push(base + slug);
    const brandKey = brandSlugKey(device.brand);
    if (brandKey && slug.startsWith(`${brandKey}-`)) {
      const stripped = slug.slice(brandKey.length + 1);
      if (stripped) candidates.push(base + stripped);
    }
  }

  return [...new Set(candidates)];
}

export function buildCashifyProductUrl(device) {
  const candidates = buildCashifyProductUrlCandidates(device);
  return candidates[0] || '';
}
