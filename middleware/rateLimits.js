import rateLimit from 'express-rate-limit';
import { logSecurityEvent, clientIp } from '../utils/logSecurityEvent.js';

const makeLimiter = ({ windowMs, max, type, message, skip, keyGenerator }) =>
  rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message },
    skip,
    keyGenerator: keyGenerator || ((req) => clientIp(req) || 'unknown'),
    handler: async (req, res, next, options) => {
      await logSecurityEvent({
        type,
        ip: clientIp(req),
        path: req.originalUrl || req.path,
        meta: { method: req.method },
      });
      res.status(options.statusCode).json(options.message);
    },
  });

function shouldSkipGlobalLimit(req) {
  const path = (req.originalUrl || req.path || '').split('?')[0];
  if (path === '/api/health') return true;
  // Admin routes are JWT-protected and have their own login limiter; polling must not
  // consume the shared public IP bucket (pricing-agent polls every few seconds).
  if (path.startsWith('/api/admin')) return true;
  // Active laptop valuation status checks during a single user quote flow.
  if (/^\/api\/valuation\/laptop\/status\//.test(path)) return true;
  return false;
}

const GLOBAL_WINDOW_MS = 15 * 60 * 1000;
const GLOBAL_MAX = Number(process.env.RATE_LIMIT_GLOBAL_MAX) || 1200;

export const globalLimiter = makeLimiter({
  windowMs: GLOBAL_WINDOW_MS,
  max: GLOBAL_MAX,
  type: 'rate_limit_global',
  message: 'Too many requests. Please try again later.',
  skip: shouldSkipGlobalLimit,
});

export const authLimiter = makeLimiter({
  windowMs: 15 * 60 * 1000,
  max: 30,
  type: 'rate_limit_auth',
  message: 'Too many auth attempts. Please try again later.',
});

export const orderCreateLimiter = makeLimiter({
  windowMs: 15 * 60 * 1000,
  max: 20,
  type: 'rate_limit_order_create',
  message: 'Too many order attempts. Please try again later.',
});

export const chatSendLimiter = makeLimiter({
  windowMs: 15 * 60 * 1000,
  max: 60,
  type: 'rate_limit_chat_send',
  message: 'Too many chat messages. Please try again later.',
});

export const adminLoginLimiter = makeLimiter({
  windowMs: 15 * 60 * 1000,
  max: 15,
  type: 'rate_limit_admin_login',
  message: 'Too many admin login attempts. Please try again later.',
});
