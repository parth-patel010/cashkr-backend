import User from '../models/User.js';
import Order from '../models/Order.js';
import { validationResult } from 'express-validator';
import { maskPaymentMethods } from '../utils/maskPayment.js';

const REFERRAL_BONUS = 500;

const serializeUser = (user) => {
  const obj = typeof user.toObject === 'function' ? user.toObject() : { ...user };
  delete obj.passwordHash;
  delete obj.refreshToken;
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

    const referredUsers = await User.find({ referredBy: user.referralCode })
      .select('name createdAt')
      .sort({ createdAt: -1 });

    res.json({
      referralCode: user.referralCode,
      totalReferrals: referredUsers.length,
      totalEarnings: referredUsers.length * REFERRAL_BONUS,
      referrals: referredUsers,
    });
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

    const referredUsers = await User.find({ referredBy: user.referralCode })
      .select('name createdAt')
      .lean();

    const sellLedger = completedOrders.map((order) => ({
      id: order.orderId,
      type: 'sell_payout',
      title: `${order.device?.brand || ''} ${order.device?.modelName || 'Device'}`.trim(),
      amount: order.priceBreakdown?.finalPrice || 0,
      status: 'completed',
      createdAt: order.createdAt,
    }));

    const referralLedger = referredUsers.map((ref) => ({
      id: `REF-${ref._id}`,
      type: 'referral_bonus',
      title: `Referral: ${ref.name || 'User'}`,
      amount: REFERRAL_BONUS,
      status: 'pending',
      createdAt: ref.createdAt,
    }));

    const ledger = [...sellLedger, ...referralLedger].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    );

    const sellTotal = sellLedger.reduce((sum, row) => sum + row.amount, 0);
    const referralTotal = referralLedger.reduce((sum, row) => sum + row.amount, 0);

    res.json({
      summary: {
        sellPayouts: sellTotal,
        referralEarnings: referralTotal,
        total: sellTotal + referralTotal,
        pendingReferrals: referralTotal,
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
    if (typeof newAddress.alternatePhone === 'string') {
      newAddress.alternatePhone = newAddress.alternatePhone.trim();
      if (!newAddress.alternatePhone) delete newAddress.alternatePhone;
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
