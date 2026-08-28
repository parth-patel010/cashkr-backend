/** Spec tier scoring for Cashify laptop config → price scaling. */

export function processorTier(processor) {
  const p = String(processor || '').toLowerCase();
  if (/m4 max|m3 max|m2 ultra|snapdragon x2|snapdragon x elite|ryzen ai 9|i9|ryzen 9|threadripper|xeon/.test(p)) return 0.97;
  if (/m4|m3|m2|m1|ryzen ai 7|i7|ryzen 7|ultra 7|snapdragon x plus|snapdragon x[^2]/.test(p)) return 0.82;
  if (/ryzen ai 5|i5|ryzen 5|ultra 5|snapdragon 8/.test(p)) return 0.62;
  if (/i3|ryzen 3|ultra 3|snapdragon 7/.test(p)) return 0.44;
  if (/celeron|pentium|atom|core 2|dual core|brazos|quad core/.test(p)) return 0.28;
  return 0.5;
}

export function ramTier(ram) {
  const raw = String(ram || '');
  const m = raw.match(/(\d+)/);
  if (!m) return 0.5;
  let gb = Number(m[1]);
  if (/mb/i.test(raw)) gb /= 1024;
  return Number(Math.min(Math.max(gb / 32, 0.1), 1).toFixed(3));
}

export function storageTier(storage) {
  const s = String(storage || '').toLowerCase();
  let gb = 256;
  const tb = s.match(/(\d+(?:\.\d+)?)\s*tb/i);
  const matches = [...s.matchAll(/(\d+)\s*gb/gi)];
  if (tb) gb = Number(tb[1]) * 1000;
  else if (matches.length) gb = Math.max(...matches.map((m) => Number(m[1])));

  let typeMult = 0.72;
  if (/ssd/.test(s) && !/hdd/.test(s)) typeMult = 1;
  else if (/hdd/.test(s) && !/ssd/.test(s)) typeMult = 0.58;
  else if (/\+/.test(s)) typeMult = 0.85;

  return Number(Math.min(Math.max((gb / 1536) * typeMult, 0.15), 1).toFixed(3));
}

export function isGamingSlug(slug = '', model = '') {
  const s = `${slug} ${model}`.toLowerCase();
  return /nitro|tuf|legion|omen|alienware|rog|gaming|victus|predator|katana|crosshair/.test(s);
}

export function computeSpecTier(quiz, meta = {}) {
  const pt = processorTier(quiz.processor);
  const rt = ramTier(quiz.ram);
  const st = storageTier(quiz.storage);
  let tier = 0.72 * pt + 0.18 * rt + 0.10 * st;
  if (isGamingSlug(quiz.slug, quiz.modelName)) tier = Math.min(tier * 1.08, 1);
  return Number(Math.min(Math.max(tier, 0.12), 1).toFixed(3));
}

export function bbmpFromUrl(url) {
  try {
    const v = Number(new URL(url).searchParams.get('bbmp'));
    return Number.isFinite(v) && v >= 500 ? v : null;
  } catch {
    return null;
  }
}
