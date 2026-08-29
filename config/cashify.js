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

/** Fix seed slugs like samsung-samsung-galaxy-* → samsung-galaxy-* */
function dedupeRepeatedBrandPrefix(slug, brandKeys) {
  let result = String(slug || '');
  for (const brandKey of brandKeys) {
    const double = `${brandKey}-${brandKey}-`;
    while (brandKey && result.startsWith(double)) {
      result = `${brandKey}-${result.slice(double.length)}`;
    }
  }
  return result;
}

/** Cashify often drops trailing -5g / -4g on product slugs (e.g. s21-fe not s21-fe-5g). */
function addConnectivitySuffixVariants(slug, out) {
  if (!slug) return;
  const suffixes = ['-5g', '-4g', '-lte', '-3g'];
  for (const suffix of suffixes) {
    if (slug.endsWith(suffix)) {
      out.add(slug.slice(0, -suffix.length));
    }
  }
}

/** "8GB / 128GB" → "8-gb-128-gb" for Cashify variant URLs */
export function storageToCashifySlug(storage) {
  const raw = String(storage || '').trim().toLowerCase();
  if (!raw) return '';
  const ramStorage = raw.match(/(\d+)\s*gb\s*\/\s*(\d+)\s*(gb|tb)/i);
  if (ramStorage) {
    return `${ramStorage[1]}-gb-${ramStorage[2]}-${ramStorage[3].toLowerCase()}`;
  }
  const storageOnly = raw.match(/^(\d+(?:\.\d+)?)\s*(gb|tb)$/i);
  if (storageOnly) {
    return `${storageOnly[1]}-${storageOnly[2].toLowerCase()}`;
  }
  return toSlugKey(raw).replace(/\//g, '-');
}

function registerSlugVariant(slug, brandKeys, out) {
  if (!slug) return;
  out.add(slug);
  const deduped = dedupeRepeatedBrandPrefix(slug, brandKeys);
  if (deduped) out.add(deduped);
  addConnectivitySuffixVariants(slug, out);
  if (deduped) addConnectivitySuffixVariants(deduped, out);
}

/** Ordered slug candidates — Cashify usually drops the brand prefix (e.g. used-g7-gaming-series). */
export function slugVariants(slug, brand, modelName = '', options = {}) {
  const { storage = '', deviceVariants = null } = options;
  const variants = new Set();
  const brandKeys = brandStripKeys(brand);
  const brandKey = brandKeys[0] || '';

  if (slug) {
    registerSlugVariant(slug, brandKeys, variants);
    for (const stripped of stripBrandOnce(slug, brandKeys)) {
      registerSlugVariant(stripped, brandKeys, variants);
    }
    for (const stripped of stripBrandPrefixes(slug, brandKeys)) {
      registerSlugVariant(stripped, brandKeys, variants);
    }
    addSpellingVariants(slug, variants);
    for (const stripped of stripBrandOnce(slug, brandKeys)) {
      addSpellingVariants(stripped, variants);
    }
  }

  const fromModel = modelNameSlug(modelName, brand);
  if (fromModel) {
    registerSlugVariant(fromModel, brandKeys, variants);
    if (brandKey) registerSlugVariant(`${brandKey}-${fromModel}`, brandKeys, variants);
    addSpellingVariants(fromModel, variants);
  }

  // OnePlus seeds use oneplus-one-plus-* but Cashify uses oneplus-*
  if (slug && /^oneplus-one-plus-/i.test(slug)) {
    variants.add(slug.replace(/^oneplus-one-plus-/i, 'oneplus-'));
  }

  const storageSlugs = new Set();
  const storageSlug = storageToCashifySlug(storage);
  if (storageSlug) storageSlugs.add(storageSlug);
  if (Array.isArray(deviceVariants)) {
    for (const variant of deviceVariants) {
      const ss = storageToCashifySlug(variant?.storage);
      if (ss) storageSlugs.add(ss);
    }
  }

  const bases = [...variants];
  for (const base of bases) {
    for (const ss of storageSlugs) {
      variants.add(`${base}-${ss}`);
    }
  }

  return [...variants].filter(Boolean);
}

function slugCandidateScore(slug, brand, originalSlug, modelName = '', preferredStorage = '') {
  const brandKeys = brandStripKeys(brand);
  const modelSlug = modelNameSlug(modelName, brand);
  const isOriginal = slug === originalSlug;
  const hasBrandPrefix = brandKeys.some((key) => slug.startsWith(`${key}-`));
  const storageSlug = storageToCashifySlug(preferredStorage);
  const dedupedOriginal = dedupeRepeatedBrandPrefix(originalSlug, brandKeys);
  const endsWithConnectivity = /-5g$|-4g$|-lte$|-3g$/.test(slug);
  const modelHasConnectivity = /-5g$|-4g$|-lte$|-3g$/.test(originalSlug)
    || /-5g$|-4g$|-lte$|-3g$/.test(modelSlug || '');

  if (storageSlug && slug.endsWith(`-${storageSlug}`)) {
    if (/^samsung-samsung-/.test(slug)) return 15;
    return -20;
  }
  if (storageSlug && slug.includes(`-${storageSlug}`)) return -5;
  // Cashify parent pages usually drop -5g (verified: s21-fe not s21-fe-5g).
  if (hasBrandPrefix && !endsWithConnectivity && modelHasConnectivity) return -12;
  if (dedupedOriginal && slug === dedupedOriginal && dedupedOriginal !== originalSlug) return 1;
  if (modelSlug && slug === modelSlug && hasBrandPrefix && !endsWithConnectivity) return 2;
  if (!hasBrandPrefix && slug.length >= 8) return 35;
  if (isOriginal) return 40;
  if (endsWithConnectivity && !storageSlug) return 55;
  if (/^samsung-samsung-/.test(slug)) return 70;
  if (!hasBrandPrefix) return 45;
  return 50;
}

export function orderSlugCandidates(slugs, brand, originalSlug = '', modelName = '', preferredStorage = '') {
  const seedSlug = originalSlug || slugs[0] || '';
  const unique = [...new Set(slugs.filter(Boolean))];
  return unique.sort(
    (a, b) => slugCandidateScore(a, brand, seedSlug, modelName, preferredStorage)
      - slugCandidateScore(b, brand, seedSlug, modelName, preferredStorage),
  );
}

export function getBrandListingSlug(brand) {
  const brandKey = brandSlugKey(brand);
  if (!brandKey) return '';
  return BRAND_LISTING_SLUGS[brandKey] || `sell-${brandKey}`;
}

export function buildCashifyProductUrlCandidates(device, options = {}) {
  if (device.cashifyProductUrl) return [device.cashifyProductUrl];

  const slug = String(device.slug || '').trim();
  if (!slug) return [];

  const basePaths = device.category === 'mobile'
    ? MOBILE_URL_BASES
    : device.category === 'laptop' || device.category === 'mac'
      ? [LAPTOP_URL_BASE]
      : [];

  if (!basePaths.length) return [];

  const storage = options.storage || device.preferredStorage || '';
  const slugs = orderSlugCandidates(
    slugVariants(slug, device.brand, device.modelName, {
      storage,
      deviceVariants: device.variants,
    }),
    device.brand,
    slug,
    device.modelName,
    storage,
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
