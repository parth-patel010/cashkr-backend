/**
 * Cashify-aligned laptop pricing algorithm (v5).
 * estimate = bbmp × tier curve blended with series min→max interpolation
 */
import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { computeSpecTier, ramTier, processorTier } from './specTier.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CONSTANTS_PATH = join(__dirname, 'trainedConstants.json');

let cachedConstants = null;

export function loadConstants() {
  if (cachedConstants) return cachedConstants;
  try {
    cachedConstants = JSON.parse(readFileSync(CONSTANTS_PATH, 'utf8'));
    return cachedConstants;
  } catch {
    cachedConstants = {
      global: { windowsScale: 0.11, appleScale: 0.39, bbmpFactor: 1.0, linearSlope: 0.15, linearIntercept: 0 },
      brandFactors: {},
      ageFactors: { oneToTwo: 1, twoToThree: 1, lessThan1: 1 },
      seriesBaselines: {},
      issueDeductionPct: { perIssue: 0.08, powerOff: 0.95 },
      markupInr: 1000,
      vendorSafetyPct: 0.1,
    };
    return cachedConstants;
  }
}

function isApple(device) {
  const brand = (device.brand || '').toLowerCase();
  const model = (device.modelName || device.model || '').toLowerCase();
  return brand === 'apple' || model.includes('macbook') || model.includes('imac');
}

function computeIssueMultiplier(selections, constants) {
  const pct = constants.issueDeductionPct || {};
  let mult = 1;
  const func = selections.functionalIssues || selections.issuesList || [];
  const screen = selections.screenIssues || selections.screenIssuesList || [];
  const body = selections.bodyIssues || selections.bodyIssuesList || [];

  for (const id of func) mult -= pct[id] || pct.perIssue || 0.08;
  if (screen.includes('screenCracked')) mult -= pct.screenCracked || 0.25;
  if (screen.includes('lineDiscolour')) mult -= pct.lineDiscolour || 0.12;
  for (const id of body) {
    if (/major/i.test(id)) mult -= 0.1;
    else if (/minor/i.test(id)) mult -= 0.04;
  }
  if (selections.powerStatus === 'off') mult *= (1 - (pct.powerOff || 0.95));
  return Math.max(mult, 0.12);
}

function hasFullSpecs(selections) {
  return Boolean(selections.processor && selections.ram && selections.storage && selections.storage !== 'Standard');
}

function accessoryBonus(selections) {
  const acc = Array.isArray(selections.accessories) ? selections.accessories : [];
  const lower = acc.map((a) => String(a).toLowerCase());
  let b = 0;
  if (lower.includes('bill')) b += 150;
  if (lower.includes('box')) b += 100;
  if (lower.includes('charger')) b += 50;
  return b;
}

export function calculateCashifyAlignedLaptopPrice(device, selections, internalPrice, constantsOverride, options = {}) {
  const constants = constantsOverride || loadConstants();
  const slug = device.slug || selections.slug || '';
  const brand = device.brand || '';
  const age = selections.yearBracket || selections.age || 'oneToTwo';
  const series = constants.seriesBaselines?.[slug];
  const fullSpecs = hasFullSpecs(selections);
  const issueMult = computeIssueMultiplier(selections, constants);
  const ageF = constants.ageFactors?.[age] || 1;
  const brandF = Math.min(constants.brandFactors?.[brand] || 1, 1.15);
  const tier = options.specTier ?? computeSpecTier({ ...selections, slug, modelName: device.modelName }, options.specMeta || {});
  const bbmp = options.bbmp;
  const bbmpFactor = constants.global.bbmpFactor || 1.0;

  if (options.liveCashifyQuote && options.liveCashifyQuote > 0) {
    const liveEst = options.liveCashifyQuote;
    const liveOffer = liveEst + (constants.markupInr || 1000);
    return {
      internalPrice,
      cashifyEstimate: liveEst,
      ourOffer: liveOffer,
      difference: internalPrice - liveOffer,
      method: 'live_quote',
      specTier: tier,
      bbmp: bbmp || null,
      issueMultiplier: issueMult,
      fullSpecs,
    };
  }

  let cashifyEstimate;
  let method;

  if (fullSpecs && bbmp && bbmp > 500) {
    const tierPow = Math.pow(tier, 0.72);
    const tierCurve = 0.28 + 0.72 * tierPow;
    let fromBbmp = bbmp * tierCurve * bbmpFactor * ageF * brandF;

    const pt = processorTier(selections.processor);
    const rt = ramTier(selections.ram);
    if (rt > 0.6) fromBbmp *= 1 + (rt - 0.6) * 0.85;
    if (tier >= 0.75 && bbmp >= 15000) {
      const specPremium = 1 + tier * pt * 5.5;
      fromBbmp *= Math.min(specPremium, 7.5);
    }

    const seriesN = series?.n || 0;
    const trustSeries = seriesN >= 2 && series.maxCashify > bbmp * 0.15;
    if (trustSeries) {
      const sMin = series.minCashify || series.medianCashify * 0.12;
      const sMax = series.maxCashify * (series.bbmpHeadroom || 1.12);
      const fromSeries = (sMin + (sMax - sMin) * tier) * ageF * brandF;
      cashifyEstimate = (0.72 * fromBbmp + 0.28 * fromSeries) * issueMult;
    } else {
      cashifyEstimate = fromBbmp * issueMult;
    }

    if (rt < 0.05 && pt < 0.7) {
      const junkCap = bbmp * (0.12 + tier * 0.22) * ageF * brandF * issueMult;
      if (cashifyEstimate > junkCap) cashifyEstimate = junkCap;
    } else if (pt < 0.32) {
      const lowCpuCap = bbmp * (0.08 + tier * 0.22) * ageF * brandF * issueMult;
      if (cashifyEstimate > lowCpuCap) cashifyEstimate = lowCpuCap;
    } else if (tier >= 0.75) {
      const bbmpCap = bbmp * (2.2 + tier * 7);
      if (cashifyEstimate > bbmpCap) cashifyEstimate = bbmpCap;
    } else {
      const bbmpCap = bbmp * (1.08 + tier * 0.35);
      if (cashifyEstimate > bbmpCap) cashifyEstimate = bbmpCap;
    }
    method = 'bbmp_series_blend';
  } else if (series?.maxCashify && fullSpecs) {
    const sMin = series.minCashify || series.medianCashify * 0.12;
    const sMax = series.maxCashify * (series.bbmpHeadroom || 1.15);
    cashifyEstimate = (sMin + (sMax - sMin) * tier) * issueMult * ageF * brandF;
    method = 'series_tier';
  } else if (series?.medianCashify) {
    cashifyEstimate = series.medianCashify * issueMult * ageF;
    method = 'series_median';
  } else if (internalPrice > 0) {
    const scale = isApple(device) ? constants.global.appleScale : constants.global.windowsScale;
    cashifyEstimate = internalPrice * scale * brandF * ageF * issueMult;
    method = 'legacy_scale';
  } else {
    cashifyEstimate = 5000 * tier * issueMult;
    method = 'fallback';
  }

  cashifyEstimate += accessoryBonus(selections);
  cashifyEstimate = Math.max(Math.round(cashifyEstimate / 10) * 10, 500);

  const markupInr = constants.markupInr || 1000;
  const safetyPct = constants.vendorSafetyPct ?? 0.1;
  const vendorBase = Math.max(
    cashifyEstimate,
    (bbmp || cashifyEstimate) * Math.max(tier, 0.35) * issueMult * ageF * 0.82,
  );
  const ourOffer = Math.max(
    Math.round(cashifyEstimate * (1 + safetyPct) / 10) * 10 + markupInr,
    Math.round(vendorBase / 10) * 10 + markupInr,
  );

  return {
    internalPrice,
    cashifyEstimate,
    ourOffer,
    difference: internalPrice - ourOffer,
    method,
    specTier: tier,
    bbmp: bbmp || null,
    issueMultiplier: issueMult,
    fullSpecs,
  };
}
