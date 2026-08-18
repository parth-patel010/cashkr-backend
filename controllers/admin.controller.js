import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Device from '../models/Device.js';
import Order from '../models/Order.js';
import BuyOrder from '../models/BuyOrder.js';
import RepairOrder from '../models/RepairOrder.js';
import PartnerApplication from '../models/PartnerApplication.js';
import Pincode from '../models/Pincode.js';
import MetaSpend from '../models/MetaSpend.js';
import {
  notifyUserPushTokens,
  buildOrderStatusPushBody,
} from '../utils/pushNotifications.js';
import { createInboxNotifications } from '../utils/userInbox.js';
import { creditReferralOnEligibleCompletion } from '../utils/referralCredit.js';

const pushOrderStatusUpdate = async (userId, orderType, status, order) => {
  if (!userId) return;
  try {
    const user = await User.findById(userId).select('pushTokens').lean();
    if (!user) return;
    const otp = order?.pickupOtpPlain || null;
    const body = buildOrderStatusPushBody(orderType, status, order, otp);
    const data = {
      type: 'order_status',
      orderType,
      orderId: order?.orderId || '',
      status,
      ...(otp ? { otp } : {}),
    };
    const inbox = await createInboxNotifications([userId], {
      title: 'Order update',
      body,
      data,
    });
    const notificationId = inbox.items?.[0]?._id;
    if (user.pushTokens?.length) {
      await notifyUserPushTokens(user, {
        title: 'Order update',
        body,
        data: {
          ...data,
          ...(notificationId ? { notificationId } : {}),
        },
      });
    }
  } catch (err) {
    console.error('Push notification failed:', err.message);
  }
};

const buildCreatedAtFilter = (fromDate, toDate) => {
  if (!fromDate && !toDate) return {};
  const createdAt = {};
  if (fromDate) createdAt.$gte = new Date(fromDate);
  if (toDate) {
    const end = new Date(toDate);
    end.setHours(23, 59, 59, 999);
    createdAt.$lte = end;
  }
  return { createdAt };
};

const safeCost = (spend, count) => {
  if (!count || count <= 0) return null;
  return Math.round((spend / count) * 100) / 100;
};

// ─── Admin Login ──────────────────────────────────────────────────────────────

export const adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (
      !adminEmail ||
      !adminPassword ||
      email.trim().toLowerCase() !== adminEmail.trim().toLowerCase() ||
      password.trim() !== adminPassword.trim()
    ) {
      return res.status(401).json({ message: 'Invalid admin credentials' });
    }

    const token = jwt.sign(
      { email, isAdmin: true },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ token, admin: { email } });
  } catch (error) {
    next(error);
  }
};

// ─── Dashboard Stats ──────────────────────────────────────────────────────────

export const getDashboardStats = async (req, res, next) => {
  try {
    const [totalUsers, totalDevices, totalOrders, totalPartners, orders] = await Promise.all([
      User.countDocuments(),
      Device.countDocuments(),
      Order.countDocuments(),
      PartnerApplication.countDocuments(),
      Order.find({ status: 'completed' }).select('priceBreakdown.finalPrice').lean(),
    ]);

    const totalRevenue = orders.reduce((sum, o) => sum + (o.priceBreakdown?.finalPrice || 0), 0);

    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('userId', 'name email')
      .lean();

    const recentPartners = await PartnerApplication.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    res.json({
      stats: { totalUsers, totalDevices, totalOrders, totalPartners, totalRevenue },
      recentOrders,
      recentPartners,
    });
  } catch (error) {
    next(error);
  }
};

// ─── Users ────────────────────────────────────────────────────────────────────

export const getAllUsers = async (req, res, next) => {
  try {
    const { search, page = 1, limit = 20, loginFrom } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const filter = {};
    if (search) {
      filter.$or = [
        { name: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') },
        { phone: new RegExp(search, 'i') },
      ];
    }

    const source = String(loginFrom || '').trim();
    if (source === 'App') {
      filter.loginFrom = 'App';
    } else if (source === 'Website') {
      // Treat missing/legacy values as Website
      filter.$and = [
        ...(filter.$and || []),
        {
          $or: [
            { loginFrom: 'Website' },
            { loginFrom: { $exists: false } },
            { loginFrom: null },
            { loginFrom: '' },
          ],
        },
      ];
    }

    const [users, total, appCount, websiteCount, allCount] = await Promise.all([
      User.find(filter)
        .select('-passwordHash -refreshToken')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      User.countDocuments(filter),
      User.countDocuments({ loginFrom: 'App' }),
      User.countDocuments({
        $or: [
          { loginFrom: 'Website' },
          { loginFrom: { $exists: false } },
          { loginFrom: null },
          { loginFrom: '' },
        ],
      }),
      User.countDocuments({}),
    ]);

    // Attach order count per user
    const userIds = users.map(u => u._id);
    const orderCounts = await Order.aggregate([
      { $match: { userId: { $in: userIds } } },
      { $group: { _id: '$userId', count: { $sum: 1 } } },
    ]);
    const countMap = {};
    orderCounts.forEach(oc => { countMap[oc._id.toString()] = oc.count; });

    const enrichedUsers = users.map(u => ({
      ...u,
      loginFrom: u.loginFrom === 'App' ? 'App' : 'Website',
      orderCount: countMap[u._id.toString()] || 0,
    }));

    res.json({
      users: enrichedUsers,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)) || 1,
      counts: {
        all: allCount,
        app: appCount,
        website: websiteCount,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const exportUsers = async (req, res, next) => {
  try {
    const { search, loginFrom } = req.query;
    const filter = {};
    if (search) {
      filter.$or = [
        { name: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') },
        { phone: new RegExp(search, 'i') },
      ];
    }

    const source = String(loginFrom || '').trim();
    if (source === 'App') {
      filter.loginFrom = 'App';
    } else if (source === 'Website') {
      filter.$and = [
        ...(filter.$and || []),
        {
          $or: [
            { loginFrom: 'Website' },
            { loginFrom: { $exists: false } },
            { loginFrom: null },
            { loginFrom: '' },
          ],
        },
      ];
    }

    const users = await User.find(filter)
      .select('-passwordHash -refreshToken')
      .sort({ createdAt: -1 })
      .limit(10000)
      .lean();

    const userIds = users.map((u) => u._id);
    const orderCounts = await Order.aggregate([
      { $match: { userId: { $in: userIds } } },
      { $group: { _id: '$userId', count: { $sum: 1 } } },
    ]);
    const countMap = {};
    orderCounts.forEach((oc) => {
      countMap[oc._id.toString()] = oc.count;
    });

    const headers = [
      'User ID',
      'Name',
      'Email',
      'Phone',
      'Referral Code',
      'Login From',
      'Last Quiz Brand',
      'Last Quiz Model',
      'Last Quiz Storage',
      'Last Quiz At',
      'Joined At',
      'Orders Count',
    ];

    const rows = users.map((user) => {
      const lqd = user.lastQuizDevice || {};
      return [
        user._id,
        user.name || '',
        user.email || '',
        user.phone || '',
        user.referralCode || '',
        user.loginFrom === 'App' ? 'App' : 'Website',
        lqd.brand || '',
        lqd.modelName || '',
        lqd.storage || '',
        lqd.loggedInAt ? new Date(lqd.loggedInAt).toISOString() : '',
        user.createdAt ? new Date(user.createdAt).toISOString() : '',
        countMap[user._id.toString()] || 0,
      ].map(csvEscape).join(',');
    });

    const csv = [headers.join(','), ...rows].join('\n');
    const filename = `users-${new Date().toISOString().slice(0, 10)}.csv`;

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(`\uFEFF${csv}`);
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-passwordHash -refreshToken')
      .lean();

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const orders = await Order.find({ userId: user._id }).sort({ createdAt: -1 }).lean();

    res.json({ user, orders });
  } catch (error) {
    next(error);
  }
};

// ─── Devices (CRUD) ───────────────────────────────────────────────────────────

export const getAllDevices = async (req, res, next) => {
  try {
    const { category, brand, search, page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const filter = {};
    if (category) filter.category = category;
    if (brand) filter.brand = new RegExp(brand, 'i');
    if (search) {
      filter.$or = [
        { modelName: new RegExp(search, 'i') },
        { brand: new RegExp(search, 'i') },
        { slug: new RegExp(search, 'i') },
      ];
    }

    const [devices, total] = await Promise.all([
      Device.find(filter)
        .sort({ category: 1, brand: 1, modelName: 1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Device.countDocuments(filter),
    ]);

    res.json({ devices, total, page: parseInt(page), totalPages: Math.ceil(total / parseInt(limit)) });
  } catch (error) {
    next(error);
  }
};

export const getDeviceById = async (req, res, next) => {
  try {
    const device = await Device.findById(req.params.id).lean();
    if (!device) {
      return res.status(404).json({ message: 'Device not found' });
    }
    res.json(device);
  } catch (error) {
    next(error);
  }
};

export const createDevice = async (req, res, next) => {
  try {
    const device = await Device.create(req.body);
    res.status(201).json(device);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Device with this slug already exists' });
    }
    next(error);
  }
};

export const updateDevice = async (req, res, next) => {
  try {
    const device = await Device.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!device) {
      return res.status(404).json({ message: 'Device not found' });
    }

    res.json(device);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Device with this slug already exists' });
    }
    next(error);
  }
};

export const deleteDevice = async (req, res, next) => {
  try {
    const device = await Device.findByIdAndDelete(req.params.id);
    if (!device) {
      return res.status(404).json({ message: 'Device not found' });
    }
    res.json({ message: 'Device deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// ─── Partners ─────────────────────────────────────────────────────────────────

export const getAllPartners = async (req, res, next) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const filter = {};
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { businessName: new RegExp(search, 'i') },
        { contactPerson: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') },
        { city: new RegExp(search, 'i') },
      ];
    }

    const [partners, total] = await Promise.all([
      PartnerApplication.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      PartnerApplication.countDocuments(filter),
    ]);

    res.json({ partners, total, page: parseInt(page), totalPages: Math.ceil(total / parseInt(limit)) });
  } catch (error) {
    next(error);
  }
};

// ─── Orders ───────────────────────────────────────────────────────────────────

const buildOrderFilter = (query) => {
  const { status, search, fromDate, toDate } = query;
  const filter = {};

  if (status) filter.status = status;
  if (search) {
    filter.$or = [
      { orderId: new RegExp(search, 'i') },
      { 'device.brand': new RegExp(search, 'i') },
      { 'device.modelName': new RegExp(search, 'i') },
    ];
  }
  if (fromDate || toDate) {
    filter.createdAt = {};
    if (fromDate) {
      filter.createdAt.$gte = new Date(fromDate);
    }
    if (toDate) {
      const end = new Date(toDate);
      end.setHours(23, 59, 59, 999);
      filter.createdAt.$lte = end;
    }
  }

  return filter;
};

const csvEscape = (value) => {
  const str = value == null ? '' : String(value);
  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
};

export const getAllOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const filter = buildOrderFilter(req.query);

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .populate('userId', 'name email phone')
        .lean(),
      Order.countDocuments(filter),
    ]);

    res.json({ orders, total, page: parseInt(page), totalPages: Math.ceil(total / parseInt(limit)) });
  } catch (error) {
    next(error);
  }
};

export const exportOrders = async (req, res, next) => {
  try {
    const filter = buildOrderFilter(req.query);

    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .limit(10000)
      .populate('userId', 'name email phone')
      .lean();

    const headers = [
      'Order ID',
      'Status',
      'Ordered At',
      'Customer Name',
      'Customer Phone',
      'Alternative Number',
      'Customer Email',
      'Category',
      'Brand',
      'Model',
      'Storage',
      'Final Price',
      'Base Price',
      'Pickup Date',
      'Time Slot',
      'City',
      'State',
      'Pincode',
      'Address',
      'Payment Method',
    ];

    const rows = orders.map((order) => {
      const d = order.device || {};
      const p = order.pickup || {};
      const pb = order.priceBreakdown || {};
      const u = order.userId || {};

      return [
        order.orderId,
        order.status,
        order.createdAt ? new Date(order.createdAt).toISOString() : '',
        u.name || p.name || '',
        u.phone || p.phone || '',
        p.alternatePhone || '',
        u.email || p.email || '',
        d.category || '',
        d.brand || '',
        d.modelName || '',
        d.storage || '',
        pb.finalPrice ?? 0,
        pb.basePrice ?? 0,
        p.date || '',
        p.timeSlot || '',
        p.city || '',
        p.state || '',
        p.pincode || '',
        p.address || '',
        p.paymentMethod || '',
      ].map(csvEscape).join(',');
    });

    const csv = [headers.join(','), ...rows].join('\n');
    const filename = `orders-${new Date().toISOString().slice(0, 10)}.csv`;

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(`\uFEFF${csv}`);
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ['placed', 'scheduled', 'assigned', 'picked', 'verified', 'payment_initiated', 'completed', 'cancelled', 'failed'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status;
    if (status === 'completed' && !order.completedAt) {
      order.completedAt = new Date();
    }
    if (status === 'cancelled' && !order.cancelledAt) {
      order.cancelledAt = new Date();
      if (!order.cancelledBy) order.cancelledBy = 'admin';
    }
    await order.save();

    await pushOrderStatusUpdate(order.userId, 'sell', status, order);
    if (status === 'completed') {
      await creditReferralOnEligibleCompletion(order.userId);
    }

    res.json(order);
  } catch (error) {
    next(error);
  }
};

const findSellOrder = (idParam) => {
  const id = String(idParam || '').trim();
  if (!id) return null;
  const filter = mongoose.Types.ObjectId.isValid(id)
    ? { $or: [{ orderId: id }, { _id: id }] }
    : { orderId: id };
  return Order.findOne(filter);
};

export const adminLaterAdjustOrder = async (req, res, next) => {
  try {
    const amount = Number(req.body.amount);
    if (!Number.isFinite(amount)) {
      return res.status(400).json({ message: 'Enter a valid later adjustment amount' });
    }

    const query = findSellOrder(req.params.id);
    if (!query) return res.status(400).json({ message: 'Order id is required' });
    const order = await query;
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.status !== 'completed') {
      return res.status(400).json({ message: 'Later adjustment is only allowed on completed orders' });
    }

    const pb = order.priceBreakdown || {};
    const vendorAdj = Number(order.vendorPriceAdjustment ?? pb.vendorAdjustment) || 0;
    const prevLater = Number(pb.laterAdjustment) || 0;
    let quoted =
      pb.quotedFinalPrice != null && pb.quotedFinalPrice !== ''
        ? Number(pb.quotedFinalPrice)
        : NaN;
    if (!Number.isFinite(quoted)) {
      quoted = (Number(pb.finalPrice) || 0) - vendorAdj - prevLater;
    }

    const finalPrice = Math.max(0, Math.round(quoted + vendorAdj + amount));
    const note = String(req.body.note || '').trim();

    order.priceBreakdown = {
      ...(typeof pb.toObject === 'function' ? pb.toObject() : pb),
      quotedFinalPrice: quoted,
      vendorAdjustment: vendorAdj,
      laterAdjustment: amount,
      laterAdjustmentNote: note,
      laterAdjustedAt: new Date(),
      laterAdjustedBy: req.admin?.email || 'admin',
      finalPrice,
    };
    order.markModified('priceBreakdown');
    await order.save();

    await pushOrderStatusUpdate(order.userId, 'sell', order.status, order);

    const populated = await Order.findById(order._id).populate('userId', 'name email phone').lean();
    res.json({ order: populated || order });
  } catch (error) {
    next(error);
  }
};

export const getAllBuyOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status, search } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const filter = {};
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { orderId: new RegExp(search, 'i') },
        { 'productSnapshot.brand': new RegExp(search, 'i') },
        { 'productSnapshot.modelName': new RegExp(search, 'i') },
        { 'productSnapshot.title': new RegExp(search, 'i') },
      ];
    }

    const [orders, total] = await Promise.all([
      BuyOrder.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .populate('userId', 'name email phone')
        .lean(),
      BuyOrder.countDocuments(filter),
    ]);

    res.json({
      orders,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)) || 1,
      statuses: ['placed', 'confirmed', 'shipped', 'delivered', 'cancelled'],
    });
  } catch (error) {
    next(error);
  }
};

export const updateBuyOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ['placed', 'confirmed', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid buy order status' });
    }

    const order = await BuyOrder.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!order) return res.status(404).json({ message: 'Buy order not found' });

    await pushOrderStatusUpdate(order.userId, 'buy', status, order);
    if (status === 'delivered') {
      await creditReferralOnEligibleCompletion(order.userId);
    }

    res.json(order);
  } catch (error) {
    next(error);
  }
};

export const getAllRepairOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status, search } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const filter = {};
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { orderId: new RegExp(search, 'i') },
        { 'snapshot.brand': new RegExp(search, 'i') },
        { 'snapshot.title': new RegExp(search, 'i') },
        { 'snapshot.issueLabel': new RegExp(search, 'i') },
      ];
    }

    const [orders, total] = await Promise.all([
      RepairOrder.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .populate('userId', 'name email phone')
        .lean(),
      RepairOrder.countDocuments(filter),
    ]);

    res.json({
      orders,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)) || 1,
      statuses: ['booked', 'assigned', 'picked', 'repairing', 'quality_check', 'delivered', 'cancelled'],
    });
  } catch (error) {
    next(error);
  }
};

export const updateRepairOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ['booked', 'assigned', 'picked', 'repairing', 'quality_check', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid repair order status' });
    }

    const order = await RepairOrder.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!order) return res.status(404).json({ message: 'Repair order not found' });

    await pushOrderStatusUpdate(order.userId, 'repair', status, order);

    res.json(order);
  } catch (error) {
    next(error);
  }
};

// ─── Pincodes ─────────────────────────────────────────────────────────────────

export const getAllPincodes = async (req, res, next) => {
  try {
    const { search, page = 1, limit = 50 } = req.query;
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(500, Math.max(1, parseInt(limit, 10) || 50));
    const skip = (pageNum - 1) * limitNum;

    const filter = {};
    if (search) {
      const q = String(search).trim();
      if (q) {
        filter.$or = [
          { code: new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i') },
          { city: new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i') },
          { state: new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i') },
        ];
      }
    }

    const [pincodes, total] = await Promise.all([
      Pincode.find(filter)
        .sort({ code: 1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Pincode.countDocuments(filter),
    ]);

    res.json({
      pincodes,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum) || 1,
    });
  } catch (error) {
    next(error);
  }
};

export const createPincode = async (req, res, next) => {
  try {
    const code = String(req.body.code || '').replace(/\D/g, '').slice(0, 6);
    if (code.length !== 6) {
      return res.status(400).json({ message: 'Pincode must be a 6-digit number' });
    }
    const city = String(req.body.city || '').trim();
    const state = String(req.body.state || '').trim();
    if (!city || !state) {
      return res.status(400).json({ message: 'City and state are required' });
    }

    const pincode = await Pincode.create({
      code,
      city,
      state,
      isActive: req.body.isActive !== false,
    });
    res.status(201).json(pincode);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Pincode already exists' });
    }
    next(error);
  }
};

export const updatePincode = async (req, res, next) => {
  try {
    const updates = { ...req.body };
    if (updates.code != null) {
      updates.code = String(updates.code).replace(/\D/g, '').slice(0, 6);
      if (updates.code.length !== 6) {
        return res.status(400).json({ message: 'Pincode must be a 6-digit number' });
      }
    }
    if (updates.city != null) updates.city = String(updates.city).trim();
    if (updates.state != null) updates.state = String(updates.state).trim();

    const pincode = await Pincode.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );

    if (!pincode) {
      return res.status(404).json({ message: 'Pincode not found' });
    }

    res.json(pincode);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Pincode already exists' });
    }
    next(error);
  }
};

export const deletePincode = async (req, res, next) => {
  try {
    const pincode = await Pincode.findByIdAndDelete(req.params.id);
    if (!pincode) {
      return res.status(404).json({ message: 'Pincode not found' });
    }
    res.json({ message: 'Pincode deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// ─── Analytics ────────────────────────────────────────────────────────────────

export const getAnalytics = async (req, res, next) => {
  try {
    const { fromDate = '', toDate = '' } = req.query;
    const dateFilter = buildCreatedAtFilter(fromDate, toDate);

    const [users, orders, completedOrders, metaSpendDoc] = await Promise.all([
      User.countDocuments(dateFilter),
      Order.countDocuments(dateFilter),
      Order.find({ ...dateFilter, status: 'completed' })
        .select('priceBreakdown.finalPrice')
        .lean(),
      fromDate && toDate
        ? MetaSpend.findOne({ fromDate, toDate }).lean()
        : Promise.resolve(null),
    ]);

    const revenue = completedOrders.reduce(
      (sum, o) => sum + (o.priceBreakdown?.finalPrice || 0),
      0
    );
    const metaSpend = metaSpendDoc?.amount ?? 0;

    res.json({
      fromDate: fromDate || null,
      toDate: toDate || null,
      users,
      orders,
      revenue,
      metaSpend,
      costPerUser: safeCost(metaSpend, users),
      costPerOrder: safeCost(metaSpend, orders),
    });
  } catch (error) {
    next(error);
  }
};

export const upsertMetaSpend = async (req, res, next) => {
  try {
    const { fromDate, toDate, amount } = req.body;

    if (!fromDate || !toDate) {
      return res.status(400).json({ message: 'fromDate and toDate are required' });
    }

    const numericAmount = Number(amount);
    if (Number.isNaN(numericAmount) || numericAmount < 0) {
      return res.status(400).json({ message: 'amount must be a non-negative number' });
    }

    const doc = await MetaSpend.findOneAndUpdate(
      { fromDate, toDate },
      { fromDate, toDate, amount: numericAmount },
      { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true }
    );

    res.json(doc);
  } catch (error) {
    next(error);
  }
};

