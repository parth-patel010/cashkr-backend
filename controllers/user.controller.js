import User from '../models/User.js';
import Order from '../models/Order.js';

export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-passwordHash -refreshToken');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const orders = await Order.find({ userId: req.user.id });
    const totalOrders = orders.length;
    const totalEarned = orders
      .filter(o => o.status === 'completed')
      .reduce((sum, o) => sum + (o.priceBreakdown?.finalPrice || 0), 0);
    const pendingOrders = orders.filter(o => !['completed', 'cancelled'].includes(o.status)).length;

    res.json({
      user,
      stats: { totalOrders, totalEarned, pendingOrders },
    });
  } catch (error) {
    next(error);
  }
};

export const updateMe = async (req, res, next) => {
  try {
    const { name, phone } = req.body;
    const updates = {};
    if (name) updates.name = name;
    if (phone) updates.phone = phone;

    const user = await User.findByIdAndUpdate(req.user.id, updates, {
      new: true,
      runValidators: true,
    }).select('-passwordHash -refreshToken');

    res.json(user);
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
      totalEarnings: referredUsers.length * 500,
      referrals: referredUsers,
    });
  } catch (error) {
    next(error);
  }
};

// --- Address Operations ---

export const addAddress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const newAddress = req.body;
    if (newAddress.isDefault) {
      user.addresses.forEach(addr => addr.isDefault = false);
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

export const deleteAddress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.addresses = user.addresses.filter(addr => addr._id.toString() !== req.params.id);
    
    // Ensure one address is default if any exist
    if (user.addresses.length > 0 && !user.addresses.some(a => a.isDefault)) {
      user.addresses[0].isDefault = true;
    }

    await user.save();
    res.json(user.addresses);
  } catch (error) {
    next(error);
  }
};

// --- Payment Method Operations ---

export const addPaymentMethod = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const newPayment = req.body;
    if (newPayment.isDefault) {
      user.paymentMethods.forEach(pm => pm.isDefault = false);
    } else if (user.paymentMethods.length === 0) {
      newPayment.isDefault = true;
    }

    user.paymentMethods.push(newPayment);
    await user.save();
    res.status(201).json(user.paymentMethods);
  } catch (error) {
    next(error);
  }
};

export const deletePaymentMethod = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.paymentMethods = user.paymentMethods.filter(pm => pm._id.toString() !== req.params.id);
    
    if (user.paymentMethods.length > 0 && !user.paymentMethods.some(pm => pm.isDefault)) {
      user.paymentMethods[0].isDefault = true;
    }

    await user.save();
    res.json(user.paymentMethods);
  } catch (error) {
    next(error);
  }
};
