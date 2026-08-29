import AppSettings from '../models/AppSettings.js';
import config from '../config/cashify.js';

/** Default % increments by DeviceKart catalog base price; applied to Cashify quote. */
export const DEFAULT_PRICING_BRACKETS = {
  mobile: [
    { min: 0, max: 3000, percent: 20 },
    { min: 3001, max: 10000, percent: 12 },
    { min: 10001, max: 25000, percent: 8 },
    { min: 25001, max: 50000, percent: 6 },
    { min: 50001, max: null, percent: 4 },
  ],
  laptop: [
    { min: 0, max: 5000, percent: 18 },
    { min: 5001, max: 15000, percent: 12 },
    { min: 15001, max: 40000, percent: 8 },
    { min: 40001, max: 80000, percent: 5 },
    { min: 80001, max: null, percent: 3 },
  ],
};

export function normalizeBracketList(list, fallback = []) {
  if (!Array.isArray(list) || !list.length) return fallback.map((b) => ({ ...b }));
  return list
    .map((row) => ({
      min: Math.max(0, Number(row.min) || 0),
      max: row.max == null || row.max === '' ? null : Math.max(0, Number(row.max)),
      percent: Math.max(0, Number(row.percent) || 0),
    }))
    .filter((row) => Number.isFinite(row.min) && Number.isFinite(row.percent))
    .sort((a, b) => a.min - b.min);
}

export function findBracket(basePrice, brackets) {
  const price = Number(basePrice);
  if (!Number.isFinite(price) || price <= 0) return null;
  const list = Array.isArray(brackets) ? brackets : [];
  for (const b of list) {
    const min = Number(b.min) || 0;
    const max = b.max == null || b.max === '' ? Infinity : Number(b.max);
    if (price >= min && price <= max) return b;
  }
  return list[list.length - 1] || null;
}

export function computeOurOffer(cashifyPrice, {
  category = 'mobile',
  basePrice = null,
  bracketsByCategory = null,
  fallbackFixedInr = null,
} = {}) {
  const price = Number(cashifyPrice);
  if (!Number.isFinite(price) || price <= 0) return null;

  const cat = category === 'mac' ? 'laptop' : category;
  const brackets = bracketsByCategory?.[cat]
    || DEFAULT_PRICING_BRACKETS[cat]
    || DEFAULT_PRICING_BRACKETS.mobile;
  const bracket = findBracket(basePrice, brackets);

  if (bracket && Number.isFinite(Number(bracket.percent))) {
    const raw = price * (1 + Number(bracket.percent) / 100);
    return Math.max(Math.round(raw / 10) * 10, Math.round(price));
  }

  const fixed = fallbackFixedInr != null
    ? Number(fallbackFixedInr)
    : (config.MARKUP_INR || 1000);
  return Math.max(Math.round(price + (Number.isFinite(fixed) ? fixed : 1000)), Math.round(price));
}

let cachedSettings = null;
let cachedAt = 0;
const CACHE_MS = 15_000;

export async function loadPricingBracketSettings({ force = false } = {}) {
  const now = Date.now();
  if (!force && cachedSettings && (now - cachedAt) < CACHE_MS) {
    return cachedSettings;
  }

  const doc = await AppSettings.findOne({ key: 'default' }).lean();
  const pricing = doc?.pricingAgent || {};
  const settings = {
    mobile: normalizeBracketList(pricing.mobileBrackets, DEFAULT_PRICING_BRACKETS.mobile),
    laptop: normalizeBracketList(pricing.laptopBrackets, DEFAULT_PRICING_BRACKETS.laptop),
    fallbackFixedInr: Number.isFinite(Number(pricing.fallbackFixedInr))
      ? Number(pricing.fallbackFixedInr)
      : (config.MARKUP_INR || 1000),
  };
  cachedSettings = settings;
  cachedAt = now;
  return settings;
}

export function invalidatePricingBracketCache() {
  cachedSettings = null;
  cachedAt = 0;
}

export async function computeOurOfferFromSettings(cashifyPrice, category = 'mobile', basePrice = null) {
  const settings = await loadPricingBracketSettings();
  return computeOurOffer(cashifyPrice, {
    category,
    basePrice,
    bracketsByCategory: settings,
    fallbackFixedInr: settings.fallbackFixedInr,
  });
}
