/**
 * Absolute public URLs for uploads / push images.
 * Expo and React Native need https://host/... not /api/uploads/...
 */

export function getPublicOrigin() {
  const fromEnv =
    process.env.PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    process.env.FRONTEND_URL ||
    process.env.APP_PUBLIC_URL ||
    '';
  if (fromEnv) {
    return String(fromEnv).trim().replace(/\/+$/, '').replace(/\/api$/i, '');
  }
  return 'https://devicekart.in';
}

/** Make `/api/uploads/...` (or any absolute path) a full HTTPS URL. */
export function absolutizeMediaUrl(url) {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();
  if (!trimmed) return '';
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (trimmed.startsWith('//')) return `https:${trimmed}`;
  if (trimmed.startsWith('/')) return `${getPublicOrigin()}${trimmed}`;
  return trimmed;
}
