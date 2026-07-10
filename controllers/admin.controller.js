import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Device from '../models/Device.js';
import Order from '../models/Order.js';
import PartnerApplication from '../models/PartnerApplication.js';
import Pincode from '../models/Pincode.js';

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
    const { search, page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const filter = {};
    if (search) {
      filter.$or = [
        { name: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') },
        { phone: new RegExp(search, 'i') },
      ];
    }

    const [users, total] = await Promise.all([
      User.find(filter)
        .select('-passwordHash -refreshToken')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      User.countDocuments(filter),
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
      orderCount: countMap[u._id.toString()] || 0,
    }));

    res.json({ users: enrichedUsers, total, page: parseInt(page), totalPages: Math.ceil(total / parseInt(limit)) });
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
    const validStatuses = ['placed', 'scheduled', 'assigned', 'picked', 'verified', 'payment_initiated', 'completed', 'cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    next(error);
  }
};

// ─── Pincodes ─────────────────────────────────────────────────────────────────

export const getAllPincodes = async (req, res, next) => {
  try {
    const { search, page = 1, limit = 50 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const filter = {};
    if (search) {
      filter.$or = [
        { code: new RegExp(search, 'i') },
        { city: new RegExp(search, 'i') },
      ];
    }

    const [pincodes, total] = await Promise.all([
      Pincode.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Pincode.countDocuments(filter),
    ]);

    res.json({ pincodes, total, page: parseInt(page), totalPages: Math.ceil(total / parseInt(limit)) });
  } catch (error) {
    next(error);
  }
};

export const createPincode = async (req, res, next) => {
  try {
    const pincode = await Pincode.create(req.body);
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
    const pincode = await Pincode.findByIdAndUpdate(
      req.params.id,
      req.body,
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

