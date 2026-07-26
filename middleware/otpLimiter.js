import rateLimit from 'express-rate-limit';
import { logSecurityEvent, clientIp } from '../utils/logSecurityEvent.js';

export const otpSendLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many OTP requests. Please try again later.' },
  handler: async (req, res, next, options) => {
    await logSecurityEvent({
      type: 'rate_limit_otp_send',
      ip: clientIp(req),
      path: req.originalUrl || req.path,
    });
    res.status(options.statusCode).json(options.message);
  },
});

export const otpVerifyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many OTP verification attempts. Please try again later.' },
  handler: async (req, res, next, options) => {
    await logSecurityEvent({
      type: 'rate_limit_otp_verify',
      ip: clientIp(req),
      path: req.originalUrl || req.path,
    });
    res.status(options.statusCode).json(options.message);
  },
});
