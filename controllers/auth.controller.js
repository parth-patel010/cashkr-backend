import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../config/jwt.js';
import { validationResult } from 'express-validator';

export const register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    }

    const { name, email, phone, password, referralCode } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await User.create({
      name,
      email,
      phone,
      passwordHash,
      referredBy: referralCode || null,
    });

    const accessToken = signAccessToken(user._id);
    const refreshToken = signRefreshToken(user._id);

    user.refreshToken = refreshToken;
    await user.save();

    res.status(201).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        referralCode: user.referralCode,
      },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const accessToken = signAccessToken(user._id);
    const refreshToken = signRefreshToken(user._id);

    user.refreshToken = refreshToken;
    await user.save();

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        referralCode: user.referralCode,
      },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    next(error);
  }
};

export const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ message: 'Refresh token required' });
    }

    const decoded = verifyRefreshToken(refreshToken);
    const user = await User.findById(decoded.id);

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    const newAccessToken = signAccessToken(user._id);
    const newRefreshToken = signRefreshToken(user._id);

    user.refreshToken = newRefreshToken;
    await user.save();

    res.json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Invalid or expired refresh token' });
    }
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (user) {
      user.refreshToken = null;
      await user.save();
    }
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
};

export const sendOtp = async (req, res, next) => {
  try {
    const { phone } = req.body;
    if (!phone) {
      return res.status(400).json({ message: 'Phone number is required' });
    }

    const apiKey = process.env.TWO_FACTOR_API_KEY;
    const template = process.env.TWO_FACTOR_TEMPLATE || 'OTPTEMPLATE';
    if (!apiKey) {
      return res.status(500).json({ message: 'OTP service is not configured' });
    }

    // Format phone to digits only and add 91 if it's a 10-digit number
    const cleanPhone = phone.replace(/\D/g, '');
    const formattedPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;

    const url = `https://2factor.in/API/V1/${apiKey}/SMS/${formattedPhone}/AUTOGEN/${template}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.Status !== 'Success') {
      return res.status(400).json({ message: 'Failed to send OTP', error: data.Details });
    }

    res.json({
      message: 'OTP sent successfully',
      sessionId: data.Details,
    });
  } catch (error) {
    next(error);
  }
};

const applyQuizContext = (user, quizContext) => {
  if (!quizContext || typeof quizContext !== 'object') return;
  const { category, brand, modelName, slug, storage, quizPath } = quizContext;
  if (!slug && !modelName) return;

  user.lastQuizDevice = {
    category: category || 'mobile',
    brand: brand || '',
    modelName: modelName || '',
    slug: slug || '',
    storage: storage || '',
    quizPath: quizPath || '',
    loggedInAt: new Date(),
  };
};

export const verifyOtp = async (req, res, next) => {
  try {
    const { phone, otp, sessionId, name, quizContext } = req.body;
    if (!phone || !otp || !sessionId) {
      return res.status(400).json({ message: 'Phone, OTP, and Session ID are required' });
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

    const trimmedName = typeof name === 'string' ? name.trim() : '';

    let user = await User.findOne({ phone });
    let isNewUser = false;

    if (!user) {
      user = await User.create({
        phone,
        name: trimmedName || 'User',
      });
      isNewUser = true;
    } else if (trimmedName) {
      const hasPlaceholderName = !user.name || user.name.trim() === 'User';
      if (hasPlaceholderName || isNewUser) {
        user.name = trimmedName;
      }
    }

    applyQuizContext(user, quizContext);

    const needsName = !user.name || user.name.trim() === 'User' || user.name.trim().length < 2;

    const accessToken = signAccessToken(user._id);
    const refreshToken = signRefreshToken(user._id);

    user.refreshToken = refreshToken;
    await user.save();

    res.json({
      message: isNewUser ? 'Registration successful' : 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email || '',
        phone: user.phone,
        referralCode: user.referralCode,
        addresses: user.addresses || [],
      },
      accessToken,
      refreshToken,
      isNewUser,
      needsName,
    });
  } catch (error) {
    next(error);
  }
};
