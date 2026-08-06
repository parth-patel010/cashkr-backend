/**
 * ASUS ROG / Asus Chromebook price overrides.
 * Prices = Cashify (from sheet) + ₹1,000.
 * Applied BEFORE the Windows Component_Base algorithm.
 */

export const ROG_CHROMEBOOK_OVERRIDES = [
  // Intel i3 12th
  { cpuKey: 'i3-12', ramGb: 8, storageGb: 256, age: '1to3', price: 10930 },
  { cpuKey: 'i3-12', ramGb: 16, storageGb: 512, age: '1to3', price: 4180 },
  { cpuKey: 'i3-12', ramGb: 16, storageGb: 512, age: '3plus', price: 3960 },
  { cpuKey: 'i3-12', ramGb: 8, storageGb: 256, age: '3plus', price: 3220 },
  // Intel i5 12th
  { cpuKey: 'i5-12', ramGb: 8, storageGb: 256, age: '1to3', price: 14350 },
  { cpuKey: 'i5-12', ramGb: 8, storageGb: 256, age: '3plus', price: 13350 },
  { cpuKey: 'i5-12', ramGb: 16, storageGb: 512, age: '1to3', price: 15150 },
  { cpuKey: 'i5-12', ramGb: 16, storageGb: 512, age: '3plus', price: 14090 },
  // Intel i7 10th (all i7 / i9 gens map here)
  { cpuKey: 'i7-10', ramGb: 8, storageGb: 256, age: '1to3', price: 15670 },
  { cpuKey: 'i7-10', ramGb: 16, storageGb: 512, age: '1to3', price: 16470 },
  { cpuKey: 'i7-10', ramGb: 16, storageGb: 512, age: '3plus', price: 15310 },
  { cpuKey: 'i7-10', ramGb: 8, storageGb: 256, age: '3plus', price: 14570 },
  // Intel i3 10th
  { cpuKey: 'i3-10', ramGb: 8, storageGb: 256, age: '1to3', price: 9470 },
];

function norm(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function mapOverrideAge(yearBracket) {
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
  const ssd = s.match(/(\d+(?:\.\d+)?)\s*(tb|gb)\s*ssd/);
  if (ssd) {
    const val = parseFloat(ssd[1]);
    return ssd[2] === 'tb' ? Math.round(val * 1024) : Math.round(val);
  }
  const tb = s.match(/(\d+(?:\.\d+)?)\s*tb/);
  if (tb) return Math.round(parseFloat(tb[1]) * 1024);
  const gb = s.match(/(\d+)\s*gb/);
  if (gb) return parseInt(gb[1], 10);
  const compactTb = s.match(/(\d+(?:\.\d+)?)tb/);
  if (compactTb) return Math.round(parseFloat(compactTb[1]) * 1024);
  const compactGb = s.match(/(\d+)gb/);
  if (compactGb) return parseInt(compactGb[1], 10);
  return null;
}

/**
 * Sheet model "Rog chromebook". Catalog often uses "Asus Chromebook Series" / Flip.
 */
export function isRogChromebookSeries(device) {
  const text = norm(`${device?.brand || ''} ${device?.modelName || ''} ${device?.slug || ''}`);
  if (!text || !text.includes('chromebook')) return false;

  if (text.includes('rog') && text.includes('chromebook')) return true;

  const isAsus = text.includes('asus') || norm(device?.brand) === 'asus';
  return isAsus && text.includes('chromebook');
}

/**
 * Map selected CPU → override cpuKey.
 * i3 10th / 12th exact; other i3 → i3-12 (or i3-10 if gen ≤ 10).
 * All i5 → i5-12. All i7 / i9 → i7-10.
 */
export function detectRogChromebookCpuKey(cpu) {
  const c = norm(cpu);
  if (!c) return null;
  if (
    c.includes('ultra') ||
    c.includes('xeon') ||
    c.includes('ryzen') ||
    c.includes('celeron') ||
    c.includes('pentium')
  ) {
    return null;
  }

  const genMatch =
    c.match(/\b(\d{1,2})(?:st|nd|rd|th)?\s*gen\b/) ||
    c.match(/\bi[3579]\s*[- ]?\s*(\d{1,2})\b/);
  const gen = genMatch ? parseInt(genMatch[1], 10) : null;

  if (/\bi3\b/.test(c)) {
    if (gen === 10) return 'i3-10';
    if (gen === 12) return 'i3-12';
    // Bare / other gen i3
    if (gen != null && gen <= 10) return 'i3-10';
    return 'i3-12';
  }

  if (/\bi5\b/.test(c)) return 'i5-12';

  // All i7 / i9 gens use i7-10 sheet prices
  if (/\bi[79]\b/.test(c)) return 'i7-10';

  return null;
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
export function findRogChromebookOverridePrice(device, selections = {}) {
  if (!isRogChromebookSeries(device)) return null;

  const ageKey = mapOverrideAge(selections.yearBracket);
  if (!ageKey) return null;

  const ramGb = parseRamGb(selections.ram);
  const storageGb = parseStorageGb(selections.storage);
  if (ramGb == null || storageGb == null) return null;

  const cpu = resolveCpuString(device, selections);
  const cpuKey = detectRogChromebookCpuKey(selections?.processor || cpu);
  if (!cpuKey) return null;

  const exact = ROG_CHROMEBOOK_OVERRIDES.find(
    (r) =>
      r.cpuKey === cpuKey &&
      r.age === ageKey &&
      r.ramGb === ramGb &&
      r.storageGb === storageGb,
  );
  if (exact) return exact.price;

  // i3-10 only has 1to3 · 8/256 — if other age/config, try i3-12 same RAM/storage/age
  if (cpuKey === 'i3-10') {
    const fallback = ROG_CHROMEBOOK_OVERRIDES.find(
      (r) =>
        r.cpuKey === 'i3-12' &&
        r.age === ageKey &&
        r.ramGb === ramGb &&
        r.storageGb === storageGb,
    );
    if (fallback) return fallback.price;
  }

  return null;
}
