/**
 * HP ZBook Power series price overrides.
 * Prices = Cashify (from sheet) + ₹1,000.
 * Applied BEFORE the Windows Component_Base algorithm for ALL Intel Core i5 gens.
 */

export const ZBOOK_POWER_OVERRIDES = [
  // i5 · 8GB  (sheet + 1000)
  { ramGb: 8, storageGb: 256, age: '1to3', price: 24830 },
  { ramGb: 8, storageGb: 256, age: '3plus', price: 23070 },
  { ramGb: 8, storageGb: 512, age: '1to3', price: 25870 },
  { ramGb: 8, storageGb: 512, age: '3plus', price: 24030 },
  { ramGb: 8, storageGb: 1024, age: '1to3', price: 25130 },
  { ramGb: 8, storageGb: 1024, age: '3plus', price: 23340 },
  { ramGb: 8, storageGb: 2048, age: '1to3', price: 25870 },
  { ramGb: 8, storageGb: 2048, age: '3plus', price: 24030 },
  // i5 · 16GB
  { ramGb: 16, storageGb: 256, age: '1to3', price: 25500 },
  { ramGb: 16, storageGb: 256, age: '3plus', price: 23690 },
  { ramGb: 16, storageGb: 512, age: '1to3', price: 26530 },
  { ramGb: 16, storageGb: 512, age: '3plus', price: 24640 },
  { ramGb: 16, storageGb: 1024, age: '1to3', price: 28610 },
  { ramGb: 16, storageGb: 1024, age: '3plus', price: 26560 },
  { ramGb: 16, storageGb: 2048, age: '1to3', price: 30090 },
  { ramGb: 16, storageGb: 2048, age: '3plus', price: 27930 },
  // i5 · 32GB
  { ramGb: 32, storageGb: 256, age: '1to3', price: 27350 },
  { ramGb: 32, storageGb: 256, age: '3plus', price: 25400 },
  { ramGb: 32, storageGb: 512, age: '1to3', price: 28380 },
  { ramGb: 32, storageGb: 512, age: '3plus', price: 26350 },
  { ramGb: 32, storageGb: 1024, age: '1to3', price: 30460 },
  { ramGb: 32, storageGb: 1024, age: '3plus', price: 28270 },
  { ramGb: 32, storageGb: 2048, age: '1to3', price: 31940 },
  { ramGb: 32, storageGb: 2048, age: '3plus', price: 29640 },
  // i5 · 64GB
  { ramGb: 64, storageGb: 256, age: '1to3', price: 29570 },
  { ramGb: 64, storageGb: 256, age: '3plus', price: 27450 },
  { ramGb: 64, storageGb: 512, age: '1to3', price: 30600 },
  { ramGb: 64, storageGb: 512, age: '3plus', price: 28410 },
  { ramGb: 64, storageGb: 1024, age: '1to3', price: 32680 },
  { ramGb: 64, storageGb: 1024, age: '3plus', price: 30320 },
  { ramGb: 64, storageGb: 2048, age: '1to3', price: 34160 },
  { ramGb: 64, storageGb: 2048, age: '3plus', price: 31690 },
];

function norm(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function mapOverrideAge(yearBracket) {
  // Quiz: lessThan1 | oneToTwo (1–3 yrs) | twoToThree (above 3 yrs)
  if (yearBracket === 'lessThan1' || yearBracket === 'oneToTwo') return '1to3';
  if (yearBracket === 'twoToThree') return '3plus';
  return null;
}

function parseRamGb(ram) {
  const n = parseInt(String(ram || '').replace(/[^\d]/g, ''), 10);
  return Number.isFinite(n) && n > 0 ? n : null;
}

function parseStorageGb(storage) {
  if (!storage) return null;
  const s = String(storage).toLowerCase();
  // Prefer the SSD/primary capacity when combo strings appear
  const ssd = s.match(/(\d+(?:\.\d+)?)\s*(tb|gb)\s*ssd/);
  if (ssd) {
    const val = parseFloat(ssd[1]);
    return ssd[2] === 'tb' ? Math.round(val * 1024) : Math.round(val);
  }
  const tb = s.match(/(\d+(?:\.\d+)?)\s*tb/);
  if (tb) return Math.round(parseFloat(tb[1]) * 1024);
  const gb = s.match(/(\d+)\s*gb/);
  if (gb) return parseInt(gb[1], 10);
  // "256GB" / "1TB" without space
  const compactTb = s.match(/(\d+(?:\.\d+)?)tb/);
  if (compactTb) return Math.round(parseFloat(compactTb[1]) * 1024);
  const compactGb = s.match(/(\d+)gb/);
  if (compactGb) return parseInt(compactGb[1], 10);
  return null;
}

export function isZbookPowerSeries(device) {
  const text = norm(`${device?.brand || ''} ${device?.modelName || ''} ${device?.slug || ''}`);
  if (!text) return false;
  // slug: hp-zbook-power-series → "hp zbook power series"
  if (text.includes('zbook power') || text.includes('zbookpower')) return true;
  return text.includes('zbook') && text.includes('power');
}

/**
 * "Intel Core i5" in the table = ALL i5 generations (2nd–14th, bare i5, etc.).
 * Does NOT match i3 / i7 / i9 / Ultra / Xeon / Ryzen.
 */
export function isIntelCoreI5(cpu) {
  const c = norm(cpu);
  if (!c) return false;
  if (
    c.includes('ultra') ||
    c.includes('xeon') ||
    c.includes('ryzen') ||
    c.includes('celeron') ||
    c.includes('pentium')
  ) {
    return false;
  }
  // Reject other Core tiers (word-boundary so "i5" is not inside something else)
  if (/\bi[379]\b/.test(c)) return false;
  return /\bi5\b/.test(c);
}

function resolveCpuString(device, selections) {
  if (selections?.processor) return selections.processor;
  const family = device?.processorFamily || '';
  const gen = device?.generation || selections?.generation || '';
  if (family && gen) return `${family} - ${gen}`;
  return family || '';
}

/**
 * Returns override price (number) or null if no match.
 */
export function findZbookPowerOverridePrice(device, selections = {}) {
  if (!isZbookPowerSeries(device)) return null;

  const ageKey = mapOverrideAge(selections.yearBracket);
  if (!ageKey) return null;

  const ramGb = parseRamGb(selections.ram);
  const storageGb = parseStorageGb(selections.storage);
  if (ramGb == null || storageGb == null) return null;

  const cpu = resolveCpuString(device, selections);
  // Also accept device.processorFamily alone when selector string is incomplete
  if (!isIntelCoreI5(cpu) && !isIntelCoreI5(device?.processorFamily)) return null;
  if (isIntelCoreI5(cpu) === false && isIntelCoreI5(device?.processorFamily)) {
    // family says i5 but selected CPU is something else — trust selection
    if (selections?.processor && !isIntelCoreI5(selections.processor)) return null;
  }
  if (selections?.processor && !isIntelCoreI5(selections.processor)) return null;
  if (!selections?.processor && !isIntelCoreI5(cpu) && !isIntelCoreI5(device?.processorFamily)) {
    return null;
  }

  const row = ZBOOK_POWER_OVERRIDES.find(
    (r) => r.age === ageKey && r.ramGb === ramGb && r.storageGb === storageGb,
  );

  return row ? row.price : null;
}
