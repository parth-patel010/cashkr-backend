/** Resolve App vs Website for Pricing Agent / quiz capture. */
export function resolveClientPlatform(req) {
  const fromBody = req?.body?.clientPlatform;
  if (fromBody === 'App' || fromBody === 'Website') return fromBody;

  const header = String(req?.headers?.['x-devicekart-client'] || '').trim().toLowerCase();
  if (header === 'app' || header === 'mobile') return 'App';
  if (header === 'website' || header === 'web') return 'Website';

  const configuredKey = process.env.MOBILE_APP_API_KEY;
  const appKey = req?.headers?.['x-devicekart-app-key'];
  if (configuredKey && appKey && appKey === configuredKey) return 'App';

  return 'Website';
}

/** Strip partner brand names from user-facing valuation errors. */
export function sanitizeValuationPublicError(message) {
  let text = String(message || '').trim();
  if (!text) return 'Could not fetch live valuation. Please try again.';
  text = text
    .replace(/\bcashify\b/gi, 'live market')
    .replace(/\bCashify\b/g, 'live market');
  return text;
}
