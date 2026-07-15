const BASE_ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:5174',
  'https://cash-kr.vercel.app',
  'https://cashkr-frontends.vercel.app',
  'https://www.devicekart.in',
  'https://devicekart.in',
  'http://www.devicekart.in',
  'http://devicekart.in',
];

export function getAllowedOrigins() {
  const origins = [...BASE_ALLOWED_ORIGINS];
  if (process.env.CLIENT_URL) {
    origins.push(process.env.CLIENT_URL);
  }
  return origins;
}

export function isAllowedOrigin(origin) {
  if (!origin) return false;
  if (getAllowedOrigins().includes(origin)) return true;

  if (process.env.NODE_ENV !== 'production') {
    // Local Expo / Vite ports during development
    if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) return true;
    return /^https?:\/\/\d{1,3}(\.\d{1,3}){3}(:\d+)?$/.test(origin);
  }

  return false;
}
