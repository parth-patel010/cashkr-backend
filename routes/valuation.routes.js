import { Router } from 'express';
import { verifyAccessToken } from '../config/jwt.js';
import { isAllowedOrigin } from '../config/origins.js';
import { valuationLog } from '../utils/valuationLog.js';
import {
  submitLaptopValuation,
  submitMobileValuation,
  getLaptopValuationStatus,
  getMobileValuationStatus,
  getLaptopValuationAgentStatus,
  getMobileValuationAgentStatus,
} from '../controllers/laptopValuation.controller.js';

const router = Router();

/** Log clientGate rejects for valuation (normally silent 401s). */
function valuationClientGate(req, res, next) {
  const configuredKey = process.env.MOBILE_APP_API_KEY;
  if (!configuredKey) return next();

  const appKey = req.headers['x-devicekart-app-key'];
  if (appKey && appKey === configuredKey) return next();

  const origin = req.headers.origin;
  if (origin && isAllowedOrigin(origin)) return next();

  const referer = req.headers.referer || req.headers.referrer;
  if (referer) {
    try {
      const refOrigin = new URL(referer).origin;
      if (isAllowedOrigin(refOrigin)) return next();
    } catch {
      // ignore
    }
  }

  valuationLog('warn', '401 clientGate blocked', {
    method: req.method,
    path: req.originalUrl,
    origin: origin || '(none)',
    referer: referer || '(none)',
    hasAppKey: Boolean(appKey),
  });
  return res.status(401).json({
    message: 'Unauthorized client. Provide a valid app key or call from an allowed origin.',
  });
}

/** Auth with PM2 logs — 401s never hit errorHandler otherwise. */
function valuationAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      valuationLog('warn', '401 no token', {
        method: req.method,
        path: req.originalUrl,
        ip: req.ip,
      });
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyAccessToken(token);
    req.user = { id: decoded.id };
    next();
  } catch (error) {
    const reason = error.name === 'TokenExpiredError' ? 'token_expired' : 'invalid_token';
    valuationLog('warn', `401 ${reason}`, {
      method: req.method,
      path: req.originalUrl,
      err: error.message,
    });
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired', code: 'TOKEN_EXPIRED' });
    }
    return res.status(401).json({ message: 'Invalid token' });
  }
}

router.use(valuationClientGate);
router.use(valuationAuth);

router.get('/laptop/agent-status', getLaptopValuationAgentStatus);
router.post('/laptop/quote', submitLaptopValuation);
router.get('/laptop/status/:recordId', getLaptopValuationStatus);

router.get('/mobile/agent-status', getMobileValuationAgentStatus);
router.post('/mobile/quote', submitMobileValuation);
router.get('/mobile/status/:recordId', getMobileValuationStatus);

export default router;
