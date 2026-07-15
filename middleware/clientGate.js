import { isAllowedOrigin } from '../config/origins.js';

/**
 * Accepts either:
 * - Valid X-DeviceKart-App-Key (mobile / non-browser clients)
 * - Allowed browser Origin (web SPA)
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

  return res.status(401).json({
    message: 'Unauthorized client. Provide a valid app key or call from an allowed origin.',
  });
};

export default clientGate;
