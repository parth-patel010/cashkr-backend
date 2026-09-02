/** Short PM2-friendly logs for the user valuation flow. */

export function valuationLog(level, message, meta = {}) {
  const parts = Object.entries(meta)
    .filter(([, v]) => v !== undefined && v !== null && v !== '')
    .map(([k, v]) => `${k}=${typeof v === 'object' ? JSON.stringify(v) : v}`)
    .join(' ');
  const line = parts ? `[valuation] ${message} | ${parts}` : `[valuation] ${message}`;
  if (level === 'error') console.error(line);
  else if (level === 'warn') console.warn(line);
  else console.log(line);
}
