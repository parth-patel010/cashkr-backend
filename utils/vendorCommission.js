import AppSettings from '../models/AppSettings.js';
import { findBracket, normalizeBracketList } from './offerMarkup.js';

/** Default vendor commission % of DeviceKart offer, by catalog basePrice. */
export const DEFAULT_VENDOR_COMMISSION_BRACKETS = [
  { min: 0, max: 3000, percent: 8 },
  { min: 3001, max: 10000, percent: 6 },
  { min: 10001, max: 25000, percent: 5 },
  { min: 25001, max: 50000, percent: 4 },
  { min: 50001, max: null, percent: 3 },
];

let cachedCommission = null;
let cachedAt = 0;
const CACHE_MS = 15_000;

export function invalidateVendorCommissionCache() {
  cachedCommission = null;
  cachedAt = 0;
}

export async function loadVendorCommissionDefaults({ force = false } = {}) {
  const now = Date.now();
  if (!force && cachedCommission && (now - cachedAt) < CACHE_MS) {
    return cachedCommission;
  }
  const doc = await AppSettings.findOne({ key: 'default' }).lean();
  const cfg = doc?.vendorCommission || {};
  const settings = {
    defaultBrackets: normalizeBracketList(
      cfg.defaultBrackets,
      DEFAULT_VENDOR_COMMISSION_BRACKETS,
    ),
  };
  cachedCommission = settings;
  cachedAt = now;
  return settings;
}

export function averageBracketPercent(brackets = []) {
  const list = Array.isArray(brackets) ? brackets : [];
  if (!list.length) return 0;
  const sum = list.reduce((acc, b) => acc + (Number(b.percent) || 0), 0);
  return Math.round((sum / list.length) * 100) / 100;
}

/**
 * Resolve commission INR for accepting a lead.
 * Bracket chosen by catalog basePrice (fallback: offer price).
 * Amount = offerPrice * percent / 100 (rounded to nearest rupee).
 */
export function computeVendorCommissionInr({
  offerPrice,
  basePrice,
  brackets,
}) {
  const offer = Number(offerPrice);
  if (!Number.isFinite(offer) || offer <= 0) {
    return { commissionInr: 0, percent: 0, bracket: null };
  }
  const bandPrice = Number(basePrice) > 0 ? Number(basePrice) : offer;
  const list = normalizeBracketList(brackets, DEFAULT_VENDOR_COMMISSION_BRACKETS);
  const bracket = findBracket(bandPrice, list);
  const percent = Number(bracket?.percent) || 0;
  const commissionInr = Math.max(0, Math.round((offer * percent) / 100));
  return { commissionInr, percent, bracket, bandPrice };
}

export async function resolveVendorCommissionBrackets(vendorDoc) {
  const defaults = await loadVendorCommissionDefaults();
  const own = vendorDoc?.commissionBrackets;
  if (Array.isArray(own) && own.length) {
    return normalizeBracketList(own, defaults.defaultBrackets);
  }
  return defaults.defaultBrackets;
}
