/**
 * MacBook price overrides.
 * Prices = Cashify (from sheet) + ₹1,000.
 * Applied FIRST in the Apple branch of calculateLaptopPrice (before catalog math).
 *
 * Match: seriesKey + variantKey + chipKey + ramGb + storageGb + age
 * Sheet has no age split → same price for 1to3 and 3plus.
 */

const OFFSET = 1000;

function bothAges(seriesKey, variantKey, chipKey, ramGb, storageGb, cashify) {
  const price = cashify + OFFSET;
  return [
    { seriesKey, variantKey, chipKey, ramGb, storageGb, age: '1to3', price },
    { seriesKey, variantKey, chipKey, ramGb, storageGb, age: '3plus', price },
  ];
}

function expandProYear(year, chips) {
  return chips.flatMap(([chipKey, cashify]) =>
    bothAges('pro', String(year), chipKey, 8, 256, cashify),
  );
}

export const MACBOOK_PRICE_OVERRIDES = [
  // ── MacBook Pro 2025 (8GB / 256) ──
  ...expandProYear(2025, [
    ['m1', 33360],
    ['m1-pro', 68700],
    ['m1-max', 73810],
    ['m2', 41020],
    ['m2-pro', 72630],
    ['m2-max', 82450],
    ['m3', 49070],
    ['m3-pro', 86370],
    ['m3-max', 94230],
    ['m4', 68700],
    ['m4-pro', 92260],
    ['m4-max', 107970],
    ['m5', 83340],
  ]),

  // ── MacBook Pro 2024 ──
  ...expandProYear(2024, [
    ['m1', 34150],
    ['m1-pro', 67150],
    ['m1-max', 72560],
    ['m2', 40090],
    ['m2-pro', 70990],
    ['m2-max', 80580],
    ['m3', 47960],
    ['m3-pro', 84420],
    ['m3-max', 92090],
    ['m4', 67150],
    ['m4-pro', 32610],
    ['m4-max', 105530],
    ['m5', 86340],
  ]),

  // ── MacBook Pro 2023 ──
  ...expandProYear(2023, [
    ['m1', 32610],
    ['m1-pro', 67150],
    ['m1-max', 72910],
    ['m2', 40090],
    ['m2-pro', 80580],
    ['m2-max', 80580],
    ['m3', 47960],
    ['m3-pro', 84420],
    ['m3-max', 92090],
    ['m4', 67150],
    ['m4-pro', 90180],
    ['m4-max', 105530],
    ['m5', 86340],
  ]),

  // ── MacBook Pro 2022 ──
  ...expandProYear(2022, [
    ['m1', 37260],
    ['m1-pro', 76780],
    ['m1-max', 83370],
    ['m2', 78070],
    ['m2-pro', 81170],
    ['m2-max', 92150],
    ['m3', 54830],
    ['m3-pro', 96540],
    ['m3-max', 105320],
    ['m4', 76780],
    ['m4-pro', 103130],
    ['m4-max', 120690],
    ['m5', 98740],
  ]),

  // ── MacBook Pro 2021 ──
  ...expandProYear(2021, [
    ['m1', 28110],
    ['m1-pro', 57830],
    ['m1-max', 62780],
    ['m2', 34550],
    ['m2-pro', 61130],
    ['m2-max', 69390],
    ['m3', 41320],
    ['m3-pro', 72690],
    ['m3-max', 79290],
    ['m4', 57830],
    ['m4-pro', 77640],
    ['m4-max', 90850],
    ['m5', 74340],
  ]),

  // ── MacBook Pro 2020 (Apple Silicon catalog year model) ──
  ...expandProYear(2020, [
    ['m1', 35610],
    ['m1-pro', 73360],
    ['m1-max', 79660],
    ['m2', 43790],
    ['m2-pro', 77560],
    ['m2-max', 88040],
    ['m3', 52390],
    ['m3-pro', 92240],
    ['m3-max', 100630],
    ['m4', 76840],
    ['m4-pro', 98530],
    ['m4-max', 115310],
    ['m5', 94340],
  ]),

  // ── MacBook Pro 2019 (Intel) ──
  ...expandProYear(2019, [
    ['i3', 10800],
    ['i5', 15930],
    ['i7', 18480],
    ['i9', 27400],
  ]),

  // ── MacBook Air ──
  ...bothAges('air', '2026', 'm5', 16, 512, 76880),
  ...bothAges('air', '2025', 'm4', 16, 256, 68560),
  ...bothAges('air', '2024', 'm3', 8, 256, 58590),
  ...bothAges('air', '2023', 'm2', 8, 256, 45640),
  ...bothAges('air', '2022', 'm2', 8, 256, 43420),
  ...bothAges('air', '2020', 'i3', 8, 256, 14640),
  ...bothAges('air', '2020', 'i5', 8, 256, 21230),
  ...bothAges('air', '2020', 'i7', 8, 256, 25990),
  ...bothAges('air', '2020', 'm1', 8, 256, 31110),
  ...bothAges('air', '2019', 'i3', 8, 256, 13290),
  ...bothAges('air', '2019', 'i5', 8, 256, 19500),
  ...bothAges('air', '2019', 'i7', 8, 256, 23860),
  ...bothAges('air', '2018', 'i3', 8, 256, 12600),
  ...bothAges('air', '2018', 'i5', 8, 256, 18480),
  ...bothAges('air', '2018', 'i7', 8, 256, 22610),
  ...bothAges('air', '2017-mid', 'i3', 8, 256, 7920),
  ...bothAges('air', '2017-mid', 'i5', 8, 256, 11550),
  ...bothAges('air', '2017-mid', 'i7', 8, 256, 14110),
  ...bothAges('air', '2015-early', 'i3', 8, 256, 6330),
  ...bothAges('air', '2015-early', 'i5', 8, 256, 9720),
  ...bothAges('air', '2015-early', 'i7', 8, 256, 11860),
  ...bothAges('air', '2014-early', 'i3', 8, 256, 6200),
  ...bothAges('air', '2014-early', 'i5', 8, 256, 9010),
  ...bothAges('air', '2014-early', 'i7', 8, 256, 10980),
  ...bothAges('air', '2013-early', 'i3', 8, 256, 5650),
  ...bothAges('air', '2013-early', 'i5', 8, 256, 8190),
  ...bothAges('air', '2013-early', 'i7', 8, 256, 9980),

  // ── MacBook Neo ──
  ...bothAges('neo', 'neo', 'm18-pro', 8, 256, 36890),

  // ── MacBook Retina (12") ──
  ...bothAges('retina', '2017-mid', 'i3', 8, 256, 7230),
  ...bothAges('retina', '2017-mid', 'i5', 8, 256, 10540),
  ...bothAges('retina', '2017-mid', 'i7', 8, 256, 12860),
  ...bothAges('retina', '2016-early', 'i3', 8, 256, 6820),
  ...bothAges('retina', '2016-early', 'i5', 8, 256, 9920),
  ...bothAges('retina', '2016-early', 'i7', 8, 256, 12110),
  ...bothAges('retina', '2015-early', 'i3', 8, 256, 7580),
  ...bothAges('retina', '2015-early', 'i5', 8, 256, 11040),
  ...bothAges('retina', '2015-early', 'i7', 8, 256, 13480),

  // ── MacBook Pro Touch Bar / Retina variants ──
  ...bothAges('pro', '2020-tb4', 'i5', 8, 256, 23980),
  ...bothAges('pro', '2020-tb4', 'i7', 8, 256, 29360),
  ...bothAges('pro', '2020-tb2', 'i5', 8, 256, 23780),
  ...bothAges('pro', '2020-tb2', 'i7', 8, 256, 29110),
  ...bothAges('pro', '2019-tb4', 'i5', 8, 256, 18170),
  ...bothAges('pro', '2019-tb4', 'i7', 8, 256, 22230),
  ...bothAges('pro', '2019-tb2', 'i5', 8, 256, 17260),
  ...bothAges('pro', '2019-tb2', 'i7', 8, 256, 21110),
  ...bothAges('pro', '2019-tb', 'i3', 8, 256, 11220),
  ...bothAges('pro', '2019-tb', 'i5', 8, 256, 16440),
  ...bothAges('pro', '2019-tb', 'i7', 8, 256, 20110),
  ...bothAges('pro', '2019-tb', 'i9', 8, 256, 28290),
  ...bothAges('pro', '2018-mid-tb4', 'i3', 8, 256, 11500),
  ...bothAges('pro', '2018-mid-tb4', 'i5', 8, 256, 16850),
  ...bothAges('pro', '2018-mid-tb4', 'i7', 8, 256, 20610),
  ...bothAges('pro', '2018-mid-tb4', 'i9', 8, 256, 28990),
  ...bothAges('pro', '2017-mid-tb4', 'i3', 8, 256, 11220),
  ...bothAges('pro', '2017-mid-tb4', 'i5', 8, 256, 16440),
  ...bothAges('pro', '2017-mid-tb4', 'i7', 8, 256, 20110),
  ...bothAges('pro', '2017-mid-tb4', 'i9', 8, 256, 27720),
  ...bothAges('pro', '2017-tb2', 'i3', 8, 256, 10670),
  ...bothAges('pro', '2017-tb2', 'i5', 8, 256, 15630),
  ...bothAges('pro', '2017-tb2', 'i7', 8, 256, 19110),
  ...bothAges('pro', '2017-tb2', 'i9', 8, 256, 26870),
  ...bothAges('pro', '2016-late-tb4', 'i3', 8, 256, 10330),
  ...bothAges('pro', '2016-late-tb4', 'i5', 8, 256, 15120),
  ...bothAges('pro', '2016-late-tb4', 'i7', 8, 256, 18480),
  ...bothAges('pro', '2016-late-tb4', 'i9', 8, 256, 25990),
  ...bothAges('pro', '2016-late-tb2', 'i3', 8, 256, 10120),
  ...bothAges('pro', '2016-late-tb2', 'i5', 8, 256, 14810),
  ...bothAges('pro', '2016-late-tb2', 'i7', 8, 256, 18110),
  ...bothAges('pro', '2016-late-tb2', 'i9', 8, 256, 25460),
  ...bothAges('pro', '2015-mid-retina', 'i3', 8, 256, 6610),
  ...bothAges('pro', '2015-mid-retina', 'i5', 8, 256, 9620),
  ...bothAges('pro', '2015-mid-retina', 'i7', 8, 256, 11730),
  ...bothAges('pro', '2015-early-retina', 'i3', 8, 256, 6540),
  ...bothAges('pro', '2015-early-retina', 'i5', 8, 256, 9520),
  ...bothAges('pro', '2015-early-retina', 'i7', 8, 256, 11600),
  ...bothAges('pro', '2014-mid-retina', 'i3', 8, 256, 6270),
  ...bothAges('pro', '2014-mid-retina', 'i5', 8, 256, 9110),
  ...bothAges('pro', '2014-mid-retina', 'i7', 8, 256, 11100),
  ...bothAges('pro', '2013-late-retina', 'i5', 8, 256, 5990),
  ...bothAges('pro', '2013-late-retina', 'i3', 8, 256, 8700),
  ...bothAges('pro', '2013-late-retina', 'i7', 8, 256, 10600),
  ...bothAges('pro', '2013-early-retina', 'i3', 8, 256, 5860),
  ...bothAges('pro', '2013-early-retina', 'i5', 8, 256, 8500),
  ...bothAges('pro', '2013-early-retina', 'i7', 8, 256, 10350),
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

function tbPorts(text) {
  if (
    text.includes('four thunderbolt') ||
    text.includes('4 thunderbolt') ||
    text.includes('four thunderboult') ||
    text.includes('4 thunderboult') ||
    text.includes('tb4') ||
    text.includes('four-thunderbolt')
  ) {
    return 4;
  }
  if (
    text.includes('two thunderbolt') ||
    text.includes('2 thunderbolt') ||
    text.includes('two thunderboult') ||
    text.includes('2 thunderboult') ||
    text.includes('tb2') ||
    text.includes('2thunderbolt')
  ) {
    return 2;
  }
  return null;
}

/**
 * seriesKey: pro | air | retina | neo
 */
export function detectMacSeriesKey(device) {
  const text = norm(`${device?.brand || ''} ${device?.modelName || ''} ${device?.slug || ''}`);
  if (!text.includes('macbook') && !text.includes('neo')) return null;

  if (text.includes('neo')) return 'neo';
  // "MacBook Retina" (12") — not Pro Retina
  if (text.includes('retina') && !text.includes('pro')) return 'retina';
  if (text.includes('air')) return 'air';
  if (text.includes('pro')) return 'pro';
  if (text.includes('retina')) return 'retina';
  return null;
}

/**
 * variantKey from catalog model/slug (year + Touch Bar / season).
 */
export function detectMacVariantKey(device) {
  const text = norm(`${device?.modelName || ''} ${device?.slug || ''}`);
  if (!text) return null;

  if (text.includes('neo')) return 'neo';

  const ports = tbPorts(text);
  const hasTouchBar = text.includes('touch bar') || text.includes('touchbar');
  const isProRetina = text.includes('pro') && text.includes('retina');

  // Season / mid / early / late
  const mid = text.includes('mid');
  const early = text.includes('early');
  const late = text.includes('late');

  const yearMatch = text.match(/\b(20\d{2})\b/);
  const year = yearMatch ? yearMatch[1] : null;

  // Touch Bar Pro variants (prefer over plain year)
  if (hasTouchBar && year === '2020') {
    if (ports === 4) return '2020-tb4';
    if (ports === 2) return '2020-tb2';
  }
  if (hasTouchBar && year === '2019') {
    if (ports === 4) return '2019-tb4';
    if (ports === 2) return '2019-tb2';
    return '2019-tb';
  }
  if (hasTouchBar && year === '2018' && (mid || text.includes('mid 2018'))) {
    return ports === 4 || ports == null ? '2018-mid-tb4' : '2018-mid-tb4';
  }
  if (hasTouchBar && year === '2017') {
    if (mid || text.includes('mid 2017')) return '2017-mid-tb4';
    if (ports === 2) return '2017-tb2';
    if (ports === 4) return '2017-mid-tb4';
  }
  if (hasTouchBar && year === '2016') {
    if (ports === 2) return '2016-late-tb2';
    return '2016-late-tb4';
  }

  // Pro Retina
  if (isProRetina) {
    if (year === '2015' && mid) return '2015-mid-retina';
    if (year === '2015' && early) return '2015-early-retina';
    if (year === '2015') return '2015-mid-retina';
    if (year === '2014') return '2014-mid-retina';
    if (year === '2013' && late) return '2013-late-retina';
    if (year === '2013' && early) return '2013-early-retina';
    if (year === '2013') return '2013-late-retina';
  }

  // Air seasons
  if (text.includes('air')) {
    if (year === '2017') return '2017-mid';
    if (year === '2015') return '2015-early';
    if (year === '2014') return '2014-early';
    if (year === '2013') return '2013-early';
    if (year) return year;
  }

  // Plain Retina 12"
  if (text.includes('retina') && !text.includes('pro')) {
    if (year === '2017') return '2017-mid';
    if (year === '2016') return '2016-early';
    if (year === '2015') return '2015-early';
  }

  return year;
}

/**
 * Map selected CPU string → chipKey.
 */
export function detectMacChipKey(cpu) {
  const c = norm(cpu);
  if (!c) return null;

  // Apple Silicon — check Pro/Max before base
  if (/\bm4\s*max\b/.test(c) || c.includes('m4 max')) return 'm4-max';
  if (/\bm4\s*pro\b/.test(c) || c.includes('m4 pro')) return 'm4-pro';
  if (/\bm4\b/.test(c)) return 'm4';

  if (/\bm3\s*max\b/.test(c) || c.includes('m3 max')) return 'm3-max';
  if (/\bm3\s*pro\b/.test(c) || c.includes('m3 pro')) return 'm3-pro';
  if (/\bm3\b/.test(c)) return 'm3';

  if (/\bm2\s*max\b/.test(c) || c.includes('m2 max')) return 'm2-max';
  if (/\bm2\s*pro\b/.test(c) || c.includes('m2 pro')) return 'm2-pro';
  if (/\bm2\b/.test(c)) return 'm2';

  if (/\bm1\s*max\b/.test(c) || c.includes('m1 max')) return 'm1-max';
  if (/\bm1\s*pro\b/.test(c) || c.includes('m1 pro') || c.includes('m1pro')) return 'm1-pro';
  if (/\bm1\b/.test(c)) return 'm1';

  if (/\bm5\b/.test(c)) return 'm5';

  // Neo sheet: "Apple 18 Pro"
  if (c.includes('18 pro') || c.includes('m18')) return 'm18-pro';

  if (/\bi9\b/.test(c)) return 'i9';
  if (/\bi7\b/.test(c)) return 'i7';
  if (/\bi5\b/.test(c)) return 'i5';
  if (/\bi3\b/.test(c)) return 'i3';

  return null;
}

/**
 * Returns override price (Cashify + 1000) or null.
 */
export function findMacbookOverridePrice(device, selections = {}) {
  const seriesKey = detectMacSeriesKey(device);
  if (!seriesKey) return null;

  const variantKey = detectMacVariantKey(device);
  if (!variantKey) return null;

  const ageKey = mapOverrideAge(selections.yearBracket);
  if (!ageKey) return null;

  const ramGb = parseRamGb(selections.ram);
  const storageGb = parseStorageGb(selections.storage);
  if (ramGb == null || storageGb == null) return null;

  const cpu =
    selections.processor ||
    (device?.generation
      ? `${device.processorFamily || ''} - ${device.generation}`
      : device?.processorFamily || '');
  const chipKey = detectMacChipKey(cpu);
  if (!chipKey) return null;

  const row = MACBOOK_PRICE_OVERRIDES.find(
    (r) =>
      r.seriesKey === seriesKey &&
      r.variantKey === variantKey &&
      r.chipKey === chipKey &&
      r.ramGb === ramGb &&
      r.storageGb === storageGb &&
      r.age === ageKey,
  );

  return row ? row.price : null;
}

/** chipKey → label shown in LaptopSpecModal (must map back via detectMacChipKey) */
export const MAC_CHIP_LABELS = {
  m1: 'Apple M1',
  'm1-pro': 'Apple M1 Pro',
  'm1-max': 'Apple M1 Max',
  m2: 'Apple M2',
  'm2-pro': 'Apple M2 Pro',
  'm2-max': 'Apple M2 Max',
  m3: 'Apple M3',
  'm3-pro': 'Apple M3 Pro',
  'm3-max': 'Apple M3 Max',
  m4: 'Apple M4',
  'm4-pro': 'Apple M4 Pro',
  'm4-max': 'Apple M4 Max',
  m5: 'Apple M5',
  'm18-pro': 'Apple 18 Pro',
  i3: 'Intel Core i3',
  i5: 'Intel Core i5',
  i7: 'Intel Core i7',
  i9: 'Intel Core i9',
};

const CHIP_DISPLAY_ORDER = [
  'm1', 'm1-pro', 'm1-max',
  'm2', 'm2-pro', 'm2-max',
  'm3', 'm3-pro', 'm3-max',
  'm4', 'm4-pro', 'm4-max',
  'm5', 'm18-pro',
  'i3', 'i5', 'i7', 'i9',
];

function rowsForDevice(device) {
  const seriesKey = detectMacSeriesKey(device);
  const variantKey = detectMacVariantKey(device);
  if (!seriesKey || !variantKey) return [];
  return MACBOOK_PRICE_OVERRIDES.filter(
    (r) => r.seriesKey === seriesKey && r.variantKey === variantKey && r.age === '1to3',
  );
}

/**
 * Processors available for this catalog MacBook (from Cashify override sheet only).
 * Returns null if device is not a sheet-covered MacBook (caller should use full MAC_PROCESSORS).
 */
export function getMacbookProcessorsForDevice(device) {
  const rows = rowsForDevice(device);
  if (!rows.length) return null;

  const chips = [...new Set(rows.map((r) => r.chipKey))];
  chips.sort(
    (a, b) =>
      (CHIP_DISPLAY_ORDER.indexOf(a) === -1 ? 999 : CHIP_DISPLAY_ORDER.indexOf(a)) -
      (CHIP_DISPLAY_ORDER.indexOf(b) === -1 ? 999 : CHIP_DISPLAY_ORDER.indexOf(b)),
  );
  return chips.map((key) => MAC_CHIP_LABELS[key] || key).filter(Boolean);
}

/**
 * RAM options for selected processor on this MacBook (sheet configs only).
 */
export function getMacbookRamOptionsForDevice(device, processor) {
  const rows = rowsForDevice(device);
  if (!rows.length) return null;
  const chipKey = detectMacChipKey(processor);
  if (!chipKey) return null;
  const rams = [...new Set(rows.filter((r) => r.chipKey === chipKey).map((r) => r.ramGb))];
  rams.sort((a, b) => a - b);
  return rams.map((gb) => `${gb}GB`);
}

/**
 * Storage options for processor + RAM on this MacBook (sheet configs only).
 */
export function getMacbookStorageOptionsForDevice(device, processor, ram) {
  const rows = rowsForDevice(device);
  if (!rows.length) return null;
  const chipKey = detectMacChipKey(processor);
  const ramGb = parseRamGb(ram);
  if (!chipKey || ramGb == null) return null;
  const storages = [
    ...new Set(
      rows
        .filter((r) => r.chipKey === chipKey && r.ramGb === ramGb)
        .map((r) => r.storageGb),
    ),
  ];
  storages.sort((a, b) => a - b);
  return storages.map((gb) => {
    if (gb >= 1024 && gb % 1024 === 0) return `${gb / 1024} TB SSD`;
    return `${gb} GB SSD`;
  });
}

