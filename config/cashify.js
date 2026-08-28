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

function slugVariants(slug, brand) {
  const variants = [slug];
  const brandKey = brandSlugKey(brand);

  if (brandKey && slug.startsWith(`${brandKey}-`)) {
    const stripped = slug.slice(brandKey.length + 1);
    if (stripped) variants.push(stripped);
  }

  // OnePlus seeds use oneplus-one-plus-* but Cashify uses oneplus-*
  if (/^oneplus-one-plus-/i.test(slug)) {
    variants.push(slug.replace(/^oneplus-one-plus-/i, 'oneplus-'));
  }

  return [...new Set(variants.filter(Boolean))];
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

  const slugs = slugVariants(slug, device.brand);
  const candidates = [];
  for (const base of basePaths) {
    for (const variant of slugs) {
      candidates.push(base + variant);
    }
  }

  return [...new Set(candidates)];
}

export function buildCashifyProductUrl(device) {
  const candidates = buildCashifyProductUrlCandidates(device);
  return candidates[0] || '';
}
