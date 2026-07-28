import User from '../models/User.js';
import Order from '../models/Order.js';
import UserNotification from '../models/UserNotification.js';
import { validationResult } from 'express-validator';
import { maskPaymentMethods } from '../utils/maskPayment.js';
import { ensureAppSettings } from './appSettings.controller.js';

const DEFAULT_REFERRAL_BONUS = 100;

const getReferralBonusAmount = async () => {
  try {
    const settings = await ensureAppSettings();
    const amount = Number(settings?.referralBonusAmount);
    return Number.isFinite(amount) && amount >= 0 ? amount : DEFAULT_REFERRAL_BONUS;
  } catch {
    return DEFAULT_REFERRAL_BONUS;
  }
};

const serializeUser = (user) => {
  const obj = typeof user.toObject === 'function' ? user.toObject() : { ...user };
  delete obj.passwordHash;
  delete obj.refreshToken;
  delete obj.pushTokens;
  obj.paymentMethods = maskPaymentMethods(obj.paymentMethods || []);
  return obj;
};

export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-passwordHash -refreshToken');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const orders = await Order.find({ userId: req.user.id });
    const totalOrders = orders.length;
    const totalEarned = orders
      .filter((o) => o.status === 'completed')
      .reduce((sum, o) => sum + (o.priceBreakdown?.finalPrice || 0), 0);
    const pendingOrders = orders.filter((o) => !['completed', 'cancelled'].includes(o.status)).length;

    res.json({
      user: serializeUser(user),
      stats: { totalOrders, totalEarned, pendingOrders },
    });
  } catch (error) {
    next(error);
  }
};

export const updateMe = async (req, res, next) => {
  try {
    const { name, phone, email } = req.body;
    const updates = {};
    if (name) updates.name = name;
    if (phone) updates.phone = phone;
    if (email !== undefined) updates.email = email;

    const user = await User.findByIdAndUpdate(req.user.id, updates, {
      new: true,
      runValidators: true,
    }).select('-passwordHash -refreshToken');

    res.json(serializeUser(user));
  } catch (error) {
    next(error);
  }
};

/** Save last quiz device (smartwatch / gaming / etc.) for admin user logs. */
export const reportLastQuiz = async (req, res, next) => {
  try {
    const { category, brand, modelName, slug, storage, quizPath } = req.body || {};
    if (!slug && !modelName) {
      return res.status(400).json({ message: 'slug or modelName is required' });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        lastQuizDevice: {
          category: category || '',
          brand: brand || '',
          modelName: modelName || '',
          slug: slug || '',
          storage: storage || '',
          quizPath: quizPath || '',
          loggedInAt: new Date(),
        },
      },
      { new: true },
    ).select('-passwordHash -refreshToken');

    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ lastQuizDevice: user.lastQuizDevice });
  } catch (error) {
    next(error);
  }
};

export const deleteMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const tombstonePhone = `deleted_${user._id}`;

    await User.findByIdAndUpdate(req.user.id, {
      $set: {
        name: 'Deleted User',
        phone: tombstonePhone,
        refreshToken: null,
        addresses: [],
        paymentMethods: [],
      },
      $unset: {
        email: 1,
        lastQuizDevice: 1,
        passwordHash: 1,
      },
    });

    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const getReferrals = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const referralBonus = await getReferralBonusAmount();
    const referredUsers = await User.find({ referredBy: user.referralCode })
      .select('name createdAt referralBonusCreditedAt')
      .sort({ createdAt: -1 });

    const creditedCount = referredUsers.filter((u) => u.referralBonusCreditedAt).length;

    res.json({
      referralCode: user.referralCode,
      referralBonusAmount: referralBonus,
      totalReferrals: referredUsers.length,
      totalEarnings: creditedCount * referralBonus,
      referrals: referredUsers,
    });
  } catch (error) {
    next(error);
  }
};

export const applyReferral = async (req, res, next) => {
  try {
    const code = typeof req.body.code === 'string' ? req.body.code.trim().toUpperCase() : '';
    if (!code) {
      return res.status(400).json({ message: 'Referral code is required' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.referredBy) {
      return res.status(400).json({ message: 'Referral code already applied' });
    }

    if (user.referralCode && user.referralCode.toUpperCase() === code) {
      return res.status(400).json({ message: 'You cannot use your own referral code' });
    }

    const referrer = await User.findOne({ referralCode: code }).select('_id referralCode');
    if (!referrer) {
      return res.status(404).json({ message: 'Invalid referral code' });
    }

    user.referredBy = referrer.referralCode;
    await user.save();

    res.json({
      message: 'Referral code applied',
      referredBy: user.referredBy,
    });
  } catch (error) {
    next(error);
  }
};

export const savePushToken = async (req, res, next) => {
  try {
    const token = typeof req.body.token === 'string' ? req.body.token.trim() : '';
    if (!token) {
      return res.status(400).json({ message: 'Push token is required' });
    }
    if (!token.startsWith('ExponentPushToken[')) {
      return res.status(400).json({ message: 'Invalid Expo push token' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.pushTokens) user.pushTokens = [];
    // Keep latest token first; drop duplicates
    user.pushTokens = [token, ...user.pushTokens.filter((t) => t !== token)].slice(0, 5);
    await user.save();

    res.json({ message: 'Push token saved', tokenTail: token.slice(-12) });
  } catch (error) {
    next(error);
  }
};

export const listMyNotifications = async (req, res, next) => {
  try {
    const limit = Math.min(parseInt(req.query.limit, 10) || 50, 100);
    const items = await UserNotification.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
    res.json({ notifications: items });
  } catch (error) {
    next(error);
  }
};

export const getMyUnreadNotificationCount = async (req, res, next) => {
  try {
    const count = await UserNotification.countDocuments({
      userId: req.user.id,
      readAt: null,
    });
    res.json({ count });
  } catch (error) {
    next(error);
  }
};

export const markNotificationRead = async (req, res, next) => {
  try {
    const item = await UserNotification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { $set: { readAt: new Date() } },
      { new: true },
    ).lean();
    if (!item) return res.status(404).json({ message: 'Notification not found' });
    res.json(item);
  } catch (error) {
    next(error);
  }
};

export const markAllNotificationsRead = async (req, res, next) => {
  try {
    const result = await UserNotification.updateMany(
      { userId: req.user.id, readAt: null },
      { $set: { readAt: new Date() } },
    );
    res.json({ updated: result.modifiedCount || 0 });
  } catch (error) {
    next(error);
  }
};

export const getEarnings = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const completedOrders = await Order.find({
      userId: req.user.id,
      status: 'completed',
    })
      .sort({ createdAt: -1 })
      .lean();

    const referralBonus = await getReferralBonusAmount();
    const referredUsers = await User.find({ referredBy: user.referralCode })
      .select('name createdAt referralBonusCreditedAt')
      .lean();

    const sellLedger = completedOrders.map((order) => ({
      id: order.orderId,
      type: 'sell_payout',
      title: `${order.device?.brand || ''} ${order.device?.modelName || 'Device'}`.trim(),
      amount: order.priceBreakdown?.finalPrice || 0,
      status: 'completed',
      createdAt: order.createdAt,
    }));

    const referralLedger = referredUsers.map((ref) => {
      const credited = Boolean(ref.referralBonusCreditedAt);
      return {
        id: `REF-${ref._id}`,
        type: 'referral_bonus',
        title: `Referral: ${ref.name || 'User'}`,
        amount: referralBonus,
        status: credited ? 'completed' : 'pending',
        createdAt: credited ? ref.referralBonusCreditedAt : ref.createdAt,
      };
    });

    const ledger = [...sellLedger, ...referralLedger].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    );

    const sellTotal = sellLedger.reduce((sum, row) => sum + row.amount, 0);
    const referralCompleted = referralLedger.filter((r) => r.status === 'completed');
    const referralPending = referralLedger.filter((r) => r.status === 'pending');
    const referralEarned = referralCompleted.reduce((sum, row) => sum + row.amount, 0);
    const referralPendingTotal = referralPending.reduce((sum, row) => sum + row.amount, 0);

    res.json({
      summary: {
        sellPayouts: sellTotal,
        referralEarnings: referralEarned,
        total: sellTotal + referralEarned,
        pendingReferrals: referralPendingTotal,
      },
      ledger,
    });
  } catch (error) {
    next(error);
  }
};

// --- Address Operations ---

export const getAddresses = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('addresses');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user.addresses || []);
  } catch (error) {
    next(error);
  }
};

export const addAddress = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const newAddress = { ...req.body };

    // Drop empty optional strings so they don't overwrite/store blanks
    ['name', 'phone', 'alternatePhone', 'landmark', 'state', 'label'].forEach((key) => {
      if (typeof newAddress[key] === 'string') {
        newAddress[key] = newAddress[key].trim();
        if (!newAddress[key]) delete newAddress[key];
      }
    });

    if (!newAddress.name) {
      newAddress.name = user.name && user.name !== 'User' ? user.name : 'Customer';
    }
    if (!newAddress.phone) {
      newAddress.phone = user.phone || '';
    }

    if (newAddress.isDefault) {
      user.addresses.forEach((addr) => {
        addr.isDefault = false;
      });
    } else if (user.addresses.length === 0) {
      newAddress.isDefault = true;
    }

    user.addresses.push(newAddress);
    await user.save();
    res.status(201).json(user.addresses);
  } catch (error) {
    next(error);
  }
};

export const updateAddress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const address = user.addresses.id(req.params.id);
    if (!address) return res.status(404).json({ message: 'Address not found' });

    const fields = [
      'label',
      'name',
      'phone',
      'alternatePhone',
      'pincode',
      'address',
      'landmark',
      'city',
      'state',
      'isDefault',
    ];
    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        address[field] = req.body[field];
      }
    });

    if (address.isDefault) {
      user.addresses.forEach((addr) => {
        if (addr._id.toString() !== address._id.toString()) {
          addr.isDefault = false;
        }
      });
    }

    await user.save();
    res.json(user.addresses);
  } catch (error) {
    next(error);
  }
};

export const deleteAddress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.addresses = user.addresses.filter((addr) => addr._id.toString() !== req.params.id);

    if (user.addresses.length > 0 && !user.addresses.some((a) => a.isDefault)) {
      user.addresses[0].isDefault = true;
    }

    await user.save();
    res.json(user.addresses);
  } catch (error) {
    next(error);
  }
};

// --- Payment Method Operations ---

export const getPaymentMethods = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('paymentMethods');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(maskPaymentMethods(user.paymentMethods || []));
  } catch (error) {
    next(error);
  }
};

export const addPaymentMethod = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const newPayment = { ...req.body };
    if (newPayment.isDefault) {
      user.paymentMethods.forEach((pm) => {
        pm.isDefault = false;
      });
    } else if (user.paymentMethods.length === 0) {
      newPayment.isDefault = true;
    }

    user.paymentMethods.push(newPayment);
    await user.save();
    res.status(201).json(maskPaymentMethods(user.paymentMethods));
  } catch (error) {
    next(error);
  }
};

export const updatePaymentMethod = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const payment = user.paymentMethods.id(req.params.id);
    if (!payment) return res.status(404).json({ message: 'Payment method not found' });

    const fields = [
      'type',
      'accountName',
      'accountNumber',
      'ifscCode',
      'bankName',
      'upiId',
      'isDefault',
    ];
    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        payment[field] = req.body[field];
      }
    });

    if (payment.isDefault) {
      user.paymentMethods.forEach((pm) => {
        if (pm._id.toString() !== payment._id.toString()) {
          pm.isDefault = false;
        }
      });
    }

    await user.save();
    res.json(maskPaymentMethods(user.paymentMethods));
  } catch (error) {
    next(error);
  }
};

export const deletePaymentMethod = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.paymentMethods = user.paymentMethods.filter(
      (pm) => pm._id.toString() !== req.params.id,
    );

    if (user.paymentMethods.length > 0 && !user.paymentMethods.some((pm) => pm.isDefault)) {
      user.paymentMethods[0].isDefault = true;
    }

    await user.save();
    res.json(maskPaymentMethods(user.paymentMethods));
  } catch (error) {
    next(error);
  }
};
