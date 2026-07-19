import jwt from 'jsonwebtoken';
import { msUntilNextIstMidnight } from '../utils/istSession.js';

export const signAccessToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

export const signRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
  });
};

/** Vendor JWT expires at next 12:00 AM IST */
export const signVendorAccessToken = (vendorId) => {
  const expiresInMs = msUntilNextIstMidnight();
  const expiresInSec = Math.ceil(expiresInMs / 1000);
  return jwt.sign({ id: vendorId, role: 'vendor' }, process.env.JWT_SECRET, {
    expiresIn: expiresInSec,
  });
};

export const verifyAccessToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

export const verifyRefreshToken = (token) => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
};
