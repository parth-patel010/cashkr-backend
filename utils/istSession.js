/** Milliseconds until next 12:00 AM Asia/Kolkata (IST). Min 60s so just-after-midnight still works. */
export function msUntilNextIstMidnight(from = new Date()) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).formatToParts(from);

  const get = (type) => Number(parts.find((p) => p.type === type)?.value || 0);
  const y = get('year');
  const m = get('month');
  const d = get('day');
  const h = get('hour');
  const min = get('minute');
  const s = get('second');

  // Current IST as a UTC-shifted Date for arithmetic
  const nowIstAsUtc = Date.UTC(y, m - 1, d, h === 24 ? 0 : h, min, s);
  let nextMidnightIstAsUtc = Date.UTC(y, m - 1, d + 1, 0, 0, 0);
  // If somehow at exactly midnight, next day is already correct via d+1
  const ms = nextMidnightIstAsUtc - nowIstAsUtc;
  return Math.max(ms, 60 * 1000);
}

export function istDateKey(from = new Date()) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(from);
}
