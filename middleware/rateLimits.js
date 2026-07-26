import rateLimit from 'express-rate-limit';
import { logSecurityEvent, clientIp } from '../utils/logSecurityEvent.js';

const makeLimiter = ({ windowMs, max, type, message }) =>
  rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message },
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

export const globalLimiter = makeLimiter({
  windowMs: 15 * 60 * 1000,
  max: 300,
  type: 'rate_limit_global',
  message: 'Too many requests. Please try again later.',
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
