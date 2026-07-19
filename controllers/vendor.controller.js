import Vendor from '../models/Vendor.js';
import VendorAgent from '../models/VendorAgent.js';
import VendorGrievance from '../models/VendorGrievance.js';
import VendorTrainingItem from '../models/VendorTrainingItem.js';
import VendorLedgerEntry from '../models/VendorLedgerEntry.js';
import Order from '../models/Order.js';
import mongoose from 'mongoose';

const orderMatch = (orderId) => {
  if (mongoose.Types.ObjectId.isValid(orderId)) {
    return { $or: [{ orderId }, { _id: orderId }] };
  }
  return { orderId };
};

const TERMINAL = ['completed', 'cancelled', 'failed'];
const PROGRESS = ['assigned', 'picked', 'verified', 'payment_initiated'];
const AVAILABLE = ['placed', 'scheduled'];

const publicVendor = (v) => ({
  id: v._id,
  name: v.name,
  phone: v.phone,
  photoUrl: v.photoUrl,
  city: v.city,
  vendorCode: v.vendorCode,
  walletBalance: v.walletBalance,
  credits: v.credits,
  upi: v.upi,
  managerPhone: v.managerPhone,
  virtualAccount: v.virtualAccount,
  servicePincodes: v.servicePincodes,
});

const mapOrderCard = (o) => ({
  id: o._id,
  orderId: o.orderId,
  status: o.status,
  deviceTitle: [o.device?.brand, o.device?.modelName, o.device?.storage ? `(${o.device.storage})` : '']
    .filter(Boolean)
    .join(' '),
  brand: o.device?.brand,
  modelName: o.device?.modelName,
  storage: o.device?.storage,
  price: o.priceBreakdown?.finalPrice || 0,
  incentive: o.vendorIncentive || 0,
  customerName: o.pickup?.name || '',
  customerPhone: o.pickup?.phone || '',
  alternatePhone: o.pickup?.alternatePhone || '',
  address: o.pickup?.address || '',
  city: o.pickup?.city || '',
  pincode: o.pickup?.pincode || '',
  date: o.pickup?.date || '',
  timeSlot: o.pickup?.timeSlot || '',
  assignedAt: o.assignedAt,
  failedReason: o.failedReason,
  toBeFailed: o.toBeFailed,
  createdAt: o.createdAt,
  updatedAt: o.updatedAt,
});

export const getMe = async (req, res, next) => {
  try {
    res.json({ vendor: publicVendor(req.vendor) });
  } catch (error) {
    next(error);
  }
};

export const updateMe = async (req, res, next) => {
  try {
    const allowed = ['photoUrl', 'upi'];
    const updates = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }
    const vendor = await Vendor.findByIdAndUpdate(req.vendor.id, updates, { new: true });
    res.json({ vendor: publicVendor(vendor) });
  } catch (error) {
    next(error);
  }
};

export const getHome = async (req, res, next) => {
  try {
    const vendorId = req.vendor.id;
    const pincodes = (req.vendor.servicePincodes || []).map(String);

    const availableQuery = {
      vendorId: null,
      status: { $in: AVAILABLE },
    };
    if (pincodes.length) {
      availableQuery['pickup.pincode'] = { $in: pincodes };
    } else if (req.vendor.city) {
      availableQuery['pickup.city'] = new RegExp(`^${req.vendor.city}$`, 'i');
    }

    const [available, inProgress, completed, failed] = await Promise.all([
      Order.countDocuments(availableQuery),
      Order.countDocuments({ vendorId, status: { $in: PROGRESS } }),
      Order.countDocuments({ vendorId, status: 'completed' }),
      Order.countDocuments({ vendorId, status: 'failed' }),
    ]);

    res.json({
      vendor: publicVendor(req.vendor),
      metrics: { available, inProgress, completed, failed },
      announcements: [
        {
          id: '1',
          title: 'Welcome to DeviceKart Partners',
          body: 'Accept nearby pickups, complete verification, and earn incentives.',
        },
      ],
      banners: [],
    });
  } catch (error) {
    next(error);
  }
};

export const listAvailableOrders = async (req, res, next) => {
  try {
    const pincodes = (req.vendor.servicePincodes || []).map(String);
    const query = {
      vendorId: null,
      status: { $in: AVAILABLE },
    };
    if (pincodes.length) {
      query['pickup.pincode'] = { $in: pincodes };
    } else if (req.vendor.city) {
      query['pickup.city'] = new RegExp(`^${req.vendor.city}$`, 'i');
    }

    const orders = await Order.find(query).sort({ createdAt: -1 }).limit(100).lean();
    res.json({ orders: orders.map(mapOrderCard) });
  } catch (error) {
    next(error);
  }
};

export const acceptOrder = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const vendor = req.vendor;

    const order = await Order.findOneAndUpdate(
      {
        ...orderMatch(orderId),
        vendorId: null,
        status: { $in: AVAILABLE },
      },
      {
        $set: {
          vendorId: vendor.id,
          assignedAt: new Date(),
          status: 'assigned',
          partnerName: vendor.name,
          partnerPhone: vendor.phone,
          vendorIncentive: Number(req.body?.incentive) || 0,
        },
      },
      { new: true },
    );

    if (!order) {
      return res.status(409).json({ message: 'Order not available or already assigned' });
    }

    res.json({ order: mapOrderCard(order), message: 'Order accepted' });
  } catch (error) {
    next(error);
  }
};

export const logCall = async (req, res, next) => {
  try {
    const order = await Order.findOne({
      ...orderMatch(req.params.orderId),
      vendorId: req.vendor.id,
    });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    order.deviceReport = {
      ...(order.deviceReport || {}),
      lastCallAt: new Date().toISOString(),
    };
    await order.save();
    res.json({ message: 'Call logged', lastCallAt: order.deviceReport.lastCallAt });
  } catch (error) {
    next(error);
  }
};

export const listProgressOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({
      vendorId: req.vendor.id,
      status: { $in: PROGRESS },
    })
      .sort({ assignedAt: -1 })
      .lean();
    res.json({ orders: orders.map(mapOrderCard) });
  } catch (error) {
    next(error);
  }
};

export const listHistoryOrders = async (req, res, next) => {
  try {
    const tab = req.query.tab || 'completed';
    const q = { vendorId: req.vendor.id };
    if (tab === 'failed') q.status = 'failed';
    else if (tab === 'to_be_failed') {
      q.toBeFailed = true;
      q.status = { $nin: TERMINAL };
    } else q.status = 'completed';

    if (req.query.search) {
      q.orderId = new RegExp(String(req.query.search).trim(), 'i');
    }

    const orders = await Order.find(q).sort({ updatedAt: -1 }).limit(200).lean();
    res.json({
      orders: orders.map(mapOrderCard),
      counts: {
        completed: await Order.countDocuments({ vendorId: req.vendor.id, status: 'completed' }),
        failed: await Order.countDocuments({ vendorId: req.vendor.id, status: 'failed' }),
        toBeFailed: await Order.countDocuments({
          vendorId: req.vendor.id,
          toBeFailed: true,
          status: { $nin: TERMINAL },
        }),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getOrderDetail = async (req, res, next) => {
  try {
    const order = await Order.findOne({
      ...orderMatch(req.params.orderId),
      vendorId: req.vendor.id,
    }).lean();
    if (!order) return res.status(404).json({ message: 'Order not found' });

    res.json({
      order: {
        ...mapOrderCard(order),
        device: order.device,
        priceBreakdown: order.priceBreakdown,
        pickup: order.pickup,
        imei1: order.imei1,
        imei2: order.imei2,
        deviceReport: order.deviceReport,
        partnerName: order.partnerName,
        partnerPhone: order.partnerPhone,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const { status, failedReason, toBeFailed, imei1, imei2 } = req.body;
    const order = await Order.findOne({
      ...orderMatch(req.params.orderId),
      vendorId: req.vendor.id,
    });
    if (!order) return res.status(404).json({ message: 'Order not found' });

    const allowed = ['assigned', 'picked', 'verified', 'payment_initiated', 'completed', 'failed'];
    if (status && !allowed.includes(status)) {
      return res.status(400).json({ message: 'Invalid status transition' });
    }

    if (status) order.status = status;
    if (failedReason !== undefined) order.failedReason = failedReason;
    if (toBeFailed !== undefined) order.toBeFailed = Boolean(toBeFailed);
    if (imei1 !== undefined) order.imei1 = imei1;
    if (imei2 !== undefined) order.imei2 = imei2;

    if (status === 'completed' && order.vendorIncentive > 0) {
      await Vendor.findByIdAndUpdate(req.vendor.id, {
        $inc: { credits: order.vendorIncentive },
      });
      await VendorLedgerEntry.create({
        vendorId: req.vendor.id,
        entryType: 'order',
        accountType: 'credit',
        title: mapOrderCard(order).deviceTitle,
        amount: order.priceBreakdown?.finalPrice || 0,
        credits: order.vendorIncentive,
        status: 'Completed',
        serviceNumber: order.orderId,
      });
    }

    await order.save();
    res.json({ order: mapOrderCard(order) });
  } catch (error) {
    next(error);
  }
};

export const upsertDeviceReport = async (req, res, next) => {
  try {
    const order = await Order.findOne({
      ...orderMatch(req.params.orderId),
      vendorId: req.vendor.id,
    });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    order.deviceReport = req.body?.report || req.body || {};
    await order.save();
    res.json({ deviceReport: order.deviceReport });
  } catch (error) {
    next(error);
  }
};

/* Agents */
export const listAgents = async (req, res, next) => {
  try {
    const agents = await VendorAgent.find({ vendorId: req.vendor.id, isActive: true }).sort({
      createdAt: -1,
    });
    res.json({ agents });
  } catch (error) {
    next(error);
  }
};

export const createAgent = async (req, res, next) => {
  try {
    const { firstName, lastName, phone, email, aadhaar, photoUrl } = req.body;
    if (!firstName || !phone) {
      return res.status(400).json({ message: 'First name and phone are required' });
    }
    const agent = await VendorAgent.create({
      vendorId: req.vendor.id,
      firstName,
      lastName: lastName || '',
      phone: String(phone).replace(/\D/g, '').slice(-10),
      email: email || '',
      aadhaar: aadhaar || '',
      aadhaarVerified: Boolean(req.body.aadhaarVerified),
      photoUrl: photoUrl || '',
    });
    res.status(201).json({ agent });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Agent with this phone already exists' });
    }
    next(error);
  }
};

export const deleteAgent = async (req, res, next) => {
  try {
    const agent = await VendorAgent.findOneAndUpdate(
      { _id: req.params.id, vendorId: req.vendor.id },
      { isActive: false },
      { new: true },
    );
    if (!agent) return res.status(404).json({ message: 'Agent not found' });
    res.json({ message: 'Agent removed' });
  } catch (error) {
    next(error);
  }
};

/* Grievances */
export const listGrievances = async (req, res, next) => {
  try {
    const items = await VendorGrievance.find({ vendorId: req.vendor.id }).sort({ createdAt: -1 });
    res.json({ grievances: items });
  } catch (error) {
    next(error);
  }
};

export const createGrievance = async (req, res, next) => {
  try {
    const { reason, comment, images } = req.body;
    if (!reason) return res.status(400).json({ message: 'Reason is required' });
    const item = await VendorGrievance.create({
      vendorId: req.vendor.id,
      reason,
      comment: comment || '',
      images: images || [],
    });
    res.status(201).json({ grievance: item });
  } catch (error) {
    next(error);
  }
};

/* Training */
export const listTraining = async (req, res, next) => {
  try {
    const type = req.query.type;
    const query = { isActive: true };
    if (type === 'video' || type === 'document') query.type = type;
    const items = await VendorTrainingItem.find(query).sort({ sortOrder: 1, createdAt: -1 });
    res.json({ items });
  } catch (error) {
    next(error);
  }
};

/* Finance */
export const getWallet = async (req, res, next) => {
  try {
    const vendor = await Vendor.findById(req.vendor.id);
    res.json({
      walletBalance: vendor.walletBalance,
      credits: vendor.credits,
      virtualAccount: vendor.virtualAccount,
      year: new Date().getFullYear(),
    });
  } catch (error) {
    next(error);
  }
};

export const listLedger = async (req, res, next) => {
  try {
    const tab = req.query.tab || 'transaction';
    const query = { vendorId: req.vendor.id };
    if (tab === 'payment') query.entryType = 'payment';
    else if (tab === 'adjustment') query.entryType = 'adjustment';
    else query.entryType = { $in: ['transaction', 'order'] };

    if (req.query.search) {
      query.serviceNumber = new RegExp(String(req.query.search).trim(), 'i');
    }

    const entries = await VendorLedgerEntry.find(query).sort({ createdAt: -1 }).limit(200);
    res.json({ entries });
  } catch (error) {
    next(error);
  }
};

export const addMoneyIntent = async (req, res, next) => {
  try {
    const amount = Number(req.body.amount);
    const accountType = req.body.accountType === 'commission' ? 'commission' : 'wallet';
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Enter a valid amount' });
    }
    // Stub: record intent; admin credits wallet manually / future Razorpay
    const entry = await VendorLedgerEntry.create({
      vendorId: req.vendor.id,
      entryType: 'payment',
      accountType,
      title: 'Online add money request',
      amount,
      status: 'Pending',
      paymentMode: 'ONLINE',
      paymentId: `REQ-${Date.now()}`,
    });
    res.status(201).json({
      message: 'Add money request recorded. Amount will reflect after confirmation.',
      entry,
    });
  } catch (error) {
    next(error);
  }
};
