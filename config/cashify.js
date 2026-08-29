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
  MIN_CASHIFY_PRICE: 100,
  SESSION_DIR: sessionRoot,
  USER_DATA_DIR: path.join(sessionRoot, 'browser-profile'),
  META_PATH: path.join(sessionRoot, 'meta.json'),
  SCREENSHOT_DIR: path.join(sessionRoot, 'screenshots'),
};

const LAPTOP_URL_BASE = 'https://www.cashify.in/sell-old-laptop/used-';
const MOBILE_URL_BASES = [
  'https://www.cashify.in/sell-old-mobile-phone/used-',
  'https://www.cashify.in/sell-old-mobile-phones/used-',
];

/** Cashify brand listing paths differ from DeviceKart brand keys. */
const BRAND_LISTING_SLUGS = {
  hp: 'sell-hp-compaq',
  mi: 'sell-xiaomi',
};

/** Extra slug prefixes to strip when resolving Cashify laptop URLs. */
const BRAND_STRIP_KEYS = {
  hp: ['hp'],
  mi: ['mi', 'xiaomi'],
  microsoft: ['microsoft'],
  samsung: ['samsung'],
  lenovo: ['lenovo'],
  dell: ['dell'],
  acer: ['acer'],
  asus: ['asus'],
  apple: ['apple'],
  msi: ['msi'],
  lg: ['lg'],
  avita: ['avita'],
  razer: ['razer'],
};

function toSlugKey(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function brandSlugKey(brand) {
  return toSlugKey(brand);
}

function brandStripKeys(brand) {
  const key = brandSlugKey(brand);
  const keys = key ? (BRAND_STRIP_KEYS[key] || [key]) : [];
  return [...new Set(keys.filter(Boolean))];
}

function modelNameSlug(modelName, brand) {
  let slug = toSlugKey(modelName);
  if (!slug) return '';

  const brandKeys = brandStripKeys(brand);
  for (const brandKey of brandKeys) {
    while (brandKey && slug.startsWith(`${brandKey}-`)) {
      slug = slug.slice(brandKey.length + 1);
    }
  }

  return slug;
}

function stripBrandOnce(slug, brandKeys) {
  const variants = [];
  for (const brandKey of brandKeys) {
    if (brandKey && slug.startsWith(`${brandKey}-`)) {
      variants.push(slug.slice(brandKey.length + 1));
    }
  }
  return variants;
}

function stripBrandPrefixes(slug, brandKeys) {
  const variants = [];
  let current = slug;

  for (const brandKey of brandKeys) {
    let next = current;
    while (brandKey && next.startsWith(`${brandKey}-`)) {
      next = next.slice(brandKey.length + 1);
      if (next !== current) variants.push(next);
    }
    current = next;
  }

  return variants;
}

function addSpellingVariants(slug, out) {
  if (!slug) return;

  if (slug.includes('probook')) {
    out.add(slug.replace(/probook/g, 'pro-book'));
  }
  if (slug.includes('vivobook')) {
    out.add(slug.replace(/vivobook/g, 'vivo-book'));
  }
  if (slug.includes('ideapad')) {
    out.add(slug.replace(/ideapad/g, 'idea-pad'));
  }
  if (slug.includes('thinkpad')) {
    out.add(slug.replace(/thinkpad/g, 'think-pad'));
  }
  if (slug.includes('redmibook')) {
    out.add(slug.replace(/redmibook/g, 'redmi-book'));
  }
}

/** Ordered slug candidates — Cashify usually drops the brand prefix (e.g. used-g7-gaming-series). */
export function slugVariants(slug, brand, modelName = '') {
  const variants = new Set();
  const brandKeys = brandStripKeys(brand);
  const brandKey = brandKeys[0] || '';

  if (slug) {
    variants.add(slug);
    for (const stripped of stripBrandOnce(slug, brandKeys)) {
      variants.add(stripped);
    }
    for (const stripped of stripBrandPrefixes(slug, brandKeys)) {
      variants.add(stripped);
    }
    addSpellingVariants(slug, variants);
    for (const stripped of stripBrandOnce(slug, brandKeys)) {
      addSpellingVariants(stripped, variants);
    }
  }

  const fromModel = modelNameSlug(modelName, brand);
  if (fromModel) {
    variants.add(fromModel);
    if (brandKey) variants.add(`${brandKey}-${fromModel}`);
    addSpellingVariants(fromModel, variants);
  }

  // OnePlus seeds use oneplus-one-plus-* but Cashify uses oneplus-*
  if (slug && /^oneplus-one-plus-/i.test(slug)) {
    variants.add(slug.replace(/^oneplus-one-plus-/i, 'oneplus-'));
  }

  return [...variants].filter(Boolean);
}

function slugCandidateScore(slug, brand, originalSlug, modelName = '') {
  const brandKeys = brandStripKeys(brand);
  const strippedOnce = brandKeys.some(
    (key) => originalSlug.startsWith(`${key}-`) && slug === originalSlug.slice(key.length + 1),
  );
  const modelSlug = modelNameSlug(modelName, brand);
  const fromModel = modelSlug && slug === modelSlug;
  const isOriginal = slug === originalSlug;
  const hasBrandPrefix = brandKeys.some((key) => slug.startsWith(`${key}-`));

  if (strippedOnce) return 0;
  if (fromModel && !hasBrandPrefix) return 5;
  if (!hasBrandPrefix && slug.length >= 8) return 10;
  if (isOriginal) return 20;
  if (!hasBrandPrefix) return 40;
  return 50;
}

export function orderSlugCandidates(slugs, brand, originalSlug = '', modelName = '') {
  const seedSlug = originalSlug || slugs[0] || '';
  const unique = [...new Set(slugs.filter(Boolean))];
  return unique.sort(
    (a, b) => slugCandidateScore(a, brand, seedSlug, modelName) - slugCandidateScore(b, brand, seedSlug, modelName),
  );
}

export function getBrandListingSlug(brand) {
  const brandKey = brandSlugKey(brand);
  if (!brandKey) return '';
  return BRAND_LISTING_SLUGS[brandKey] || `sell-${brandKey}`;
}

export function buildCashifyProductUrlCandidates(device) {
  if (device.cashifyProductUrl) return [device.cashifyProductUrl];

  const slug = String(device.slug || '').trim();
  if (!slug) return [];

  const basePaths = device.category === 'mobile'
    ? MOBILE_URL_BASES
    : device.category === 'laptop' || device.category === 'mac'
      ? [LAPTOP_URL_BASE]
      : [];

  if (!basePaths.length) return [];

  const slugs = orderSlugCandidates(
    slugVariants(slug, device.brand, device.modelName),
    device.brand,
    slug,
    device.modelName,
  );

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
