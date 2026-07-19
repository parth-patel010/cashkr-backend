import Vendor from '../models/Vendor.js';
import { signVendorAccessToken } from '../config/jwt.js';
import { msUntilNextIstMidnight, istDateKey } from '../utils/istSession.js';

const normalizePhone = (phone = '') => {
  const digits = String(phone).replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('91')) return digits.slice(2);
  return digits.slice(-10);
};

export const sendVendorOtp = async (req, res, next) => {
  try {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ message: 'Phone number is required' });

    const clean = normalizePhone(phone);
    if (clean.length !== 10) {
      return res.status(400).json({ message: 'Enter a valid 10-digit phone number' });
    }

    const vendor = await Vendor.findOne({ phone: clean, isActive: true });
    if (!vendor) {
      return res.status(403).json({ message: 'No active vendor account for this number' });
    }

    const apiKey = process.env.TWO_FACTOR_API_KEY;
    const template = process.env.TWO_FACTOR_TEMPLATE || 'OTPTEMPLATE';
    if (!apiKey) {
      return res.status(500).json({ message: 'OTP service is not configured' });
    }

    const formattedPhone = `91${clean}`;
    const url = `https://2factor.in/API/V1/${apiKey}/SMS/${formattedPhone}/AUTOGEN/${template}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.Status !== 'Success') {
      return res.status(400).json({ message: 'Failed to send OTP', error: data.Details });
    }

    res.json({
      message: 'OTP sent successfully',
      sessionId: data.Details,
      phone: clean,
    });
  } catch (error) {
    next(error);
  }
};

export const verifyVendorOtp = async (req, res, next) => {
  try {
    const { phone, otp, sessionId } = req.body;
    if (!phone || !otp || !sessionId) {
      return res.status(400).json({ message: 'Phone, OTP, and Session ID are required' });
    }

    const clean = normalizePhone(phone);
    const vendor = await Vendor.findOne({ phone: clean, isActive: true });
    if (!vendor) {
      return res.status(403).json({ message: 'No active vendor account for this number' });
    }

    const apiKey = process.env.TWO_FACTOR_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ message: 'OTP service is not configured' });
    }

    const url = `https://2factor.in/API/V1/${apiKey}/SMS/VERIFY/${sessionId}/${otp}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.Status !== 'Success') {
      return res.status(401).json({ message: 'Invalid or expired OTP' });
    }

    const accessToken = signVendorAccessToken(vendor._id);
    const expiresInMs = msUntilNextIstMidnight();

    res.json({
      message: 'Login successful',
      accessToken,
      expiresAt: new Date(Date.now() + expiresInMs).toISOString(),
      expiresInMs,
      sessionDateIst: istDateKey(),
      vendor: {
        id: vendor._id,
        name: vendor.name,
        phone: vendor.phone,
        city: vendor.city,
        photoUrl: vendor.photoUrl,
        vendorCode: vendor.vendorCode,
        walletBalance: vendor.walletBalance,
        credits: vendor.credits,
        upi: vendor.upi,
      },
    });
  } catch (error) {
    next(error);
  }
};
