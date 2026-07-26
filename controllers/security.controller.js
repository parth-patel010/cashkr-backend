import SecurityEvent from '../models/SecurityEvent.js';
import { getAllowedOrigins } from '../config/origins.js';

export const adminSecurityAudit = async (req, res, next) => {
  try {
    const recentEvents = await SecurityEvent.find()
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    res.json({
      helmetEnabled: true,
      corsOrigins: getAllowedOrigins(),
      rateLimits: {
        global: { windowMs: 15 * 60 * 1000, max: 300 },
        auth: { windowMs: 15 * 60 * 1000, max: 30 },
        orderCreate: { windowMs: 15 * 60 * 1000, max: 20 },
        chatSend: { windowMs: 15 * 60 * 1000, max: 60 },
        adminLogin: { windowMs: 15 * 60 * 1000, max: 15 },
      },
      otpLimiters: {
        send: { windowMs: 15 * 60 * 1000, max: 5 },
        verify: { windowMs: 15 * 60 * 1000, max: 10 },
      },
      mobileAppKeyConfigured: Boolean(process.env.MOBILE_APP_API_KEY),
      jwtConfigured: Boolean(process.env.JWT_SECRET && process.env.JWT_REFRESH_SECRET),
      socketAuthRequired: true,
      recentEvents,
    });
  } catch (error) {
    next(error);
  }
};
