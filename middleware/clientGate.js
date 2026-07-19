import { isAllowedOrigin } from '../config/origins.js';

/**
 * Accepts either:
 * - Valid X-DeviceKart-App-Key (mobile / non-browser clients)
 * - Allowed browser Origin (web SPA)
 * - Allowed Referer origin (same-origin GETs sometimes omit Origin)
 *
 * When MOBILE_APP_API_KEY is unset (local dev), requests are allowed through.
 */
const clientGate = (req, res, next) => {
  const configuredKey = process.env.MOBILE_APP_API_KEY;
  if (!configuredKey) {
    return next();
  }

  const appKey = req.headers['x-devicekart-app-key'];
  if (appKey && appKey === configuredKey) {
    return next();
  }

  const origin = req.headers.origin;
  if (origin && isAllowedOrigin(origin)) {
    return next();
  }

  // Same-origin XHR/fetch can omit Origin; fall back to Referer.
  const referer = req.headers.referer || req.headers.referrer;
  if (referer) {
    try {
      const refOrigin = new URL(referer).origin;
      if (isAllowedOrigin(refOrigin)) {
        return next();
      }
    } catch {
      // ignore invalid referer
    }
  }

  return res.status(401).json({
    message: 'Unauthorized client. Provide a valid app key or call from an allowed origin.',
  });
};

export default clientGate;
