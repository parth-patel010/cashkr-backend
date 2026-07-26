import SecurityEvent from '../models/SecurityEvent.js';

export async function logSecurityEvent({ type, ip, path, meta } = {}) {
  try {
    await SecurityEvent.create({
      type: type || 'unknown',
      ip: ip || '',
      path: path || '',
      meta: meta || null,
    });
  } catch (err) {
    console.error('Failed to log security event:', err.message);
  }
}

export function clientIp(req) {
  return (
    req.ip ||
    req.headers['x-forwarded-for']?.toString().split(',')[0]?.trim() ||
    req.socket?.remoteAddress ||
    ''
  );
}
