import Vendor from '../models/Vendor.js';
import VendorAgent from '../models/VendorAgent.js';
import VendorGrievance from '../models/VendorGrievance.js';
import VendorTrainingItem from '../models/VendorTrainingItem.js';
import VendorLedgerEntry from '../models/VendorLedgerEntry.js';
import Order from '../models/Order.js';
import Device from '../models/Device.js';
import Pincode from '../models/Pincode.js';
import CustomPricingItem from '../models/CustomPricingItem.js';
import { ensureCustomPricingSeed } from './customPricing.controller.js';
import mongoose from 'mongoose';
import crypto from 'crypto';

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
  orderCreditCost: v.orderCreditCost || 0,
});

const mapOrderCard = (o, imageUrl = '') => {
  const callLogs = Array.isArray(o.deviceReport?.callLogs) ? o.deviceReport.callLogs : [];
  const lastCallAt = o.deviceReport?.lastCallAt || (callLogs.length ? callLogs[callLogs.length - 1].at : null);
  const ram = o.device?.ram || '';
  const storage = o.device?.storage || '';
  const capacity =
    ram && storage ? `(${ram}/${storage})` : storage ? `(${storage})` : ram ? `(${ram})` : '';
  return {
    id: o._id,
    orderId: o.orderId,
    status: o.status,
    deviceTitle: [o.device?.brand, o.device?.modelName, capacity].filter(Boolean).join(' '),
    brand: o.device?.brand,
    modelName: o.device?.modelName,
    storage,
    ram,
    slug: o.device?.slug || '',
    imageUrl: imageUrl || o.device?.imageUrl || '',
    price: o.priceBreakdown?.finalPrice || 0,
    incentive: o.vendorIncentive || 0,
    customerName: o.pickup?.name || '',
    customerPhone: o.pickup?.phone || '',
    alternatePhone: o.pickup?.alternatePhone || '',
    address: o.pickup?.address || '',
    city: o.pickup?.city || '',
    state: o.pickup?.state || '',
    pincode: o.pickup?.pincode || '',
    date: o.pickup?.date || '',
    timeSlot: o.pickup?.timeSlot || '',
    assignedAt: o.assignedAt,
    failedReason: o.failedReason,
    toBeFailed: o.toBeFailed,
    createdAt: o.createdAt,
    updatedAt: o.updatedAt,
    lastCallAt,
    callCount: callLogs.length,
    callLogs: callLogs.slice(-10),
  };
};

const attachImagesToOrders = async (orders) => {
  const slugs = [...new Set(orders.map((o) => o.device?.slug).filter(Boolean))];
  if (!slugs.length) return orders.map((o) => mapOrderCard(o));
  const devices = await Device.find({ slug: { $in: slugs } }).select('slug imageUrl').lean();
  const bySlug = Object.fromEntries(devices.map((d) => [d.slug, d.imageUrl || '']));
  return orders.map((o) => mapOrderCard(o, bySlug[o.device?.slug] || ''));
};

const normalizePins = (value) => {
  if (Array.isArray(value)) {
    return value.map((p) => String(p).replace(/\D/g, '')).filter(Boolean);
  }
  return String(value || '')
    .split(',')
    .map((p) => p.replace(/\D/g, ''))
    .filter(Boolean);
};

const buildAvailableQuery = (vendor, appliedPincodes) => {
  const assigned = (vendor.servicePincodes || []).map(String);
  const query = {
    vendorId: null,
    status: { $in: AVAILABLE },
  };

  const pins = Array.isArray(appliedPincodes) ? appliedPincodes.filter(Boolean) : [];
  if (pins.length === 1) {
    query['pickup.pincode'] = pins[0];
    return query;
  }
  if (pins.length > 1) {
    query['pickup.pincode'] = { $in: pins };
    return query;
  }

  if (assigned.length) {
    query['pickup.pincode'] = { $in: assigned };
  } else if (vendor.city) {
    query['pickup.city'] = new RegExp(`^${vendor.city}$`, 'i');
  }
  return query;
};

/** Resolve search/filter into applied pins + status for the Available screen. */
const resolveAvailablePins = async (vendor, { pincode, pincodes }) => {
  const assigned = (vendor.servicePincodes || []).map(String);
  const searched = String(pincode || '').replace(/\D/g, '');
  const multi = normalizePins(pincodes);

  if (searched) {
    const exists = await Pincode.findOne({
      code: searched,
      isActive: { $ne: false },
    })
      .select('code')
      .lean();

    if (!exists) {
      return {
        appliedPincodes: [],
        pinStatus: 'not_found',
        searchedPincode: searched,
        servicePincodes: assigned,
      };
    }

    if (assigned.length && !assigned.includes(searched)) {
      return {
        appliedPincodes: [],
        pinStatus: 'not_assigned',
        searchedPincode: searched,
        servicePincodes: assigned,
      };
    }

    return {
      appliedPincodes: [searched],
      pinStatus: 'ok',
      searchedPincode: searched,
      servicePincodes: assigned,
    };
  }

  if (multi.length) {
    const applied = assigned.length ? multi.filter((p) => assigned.includes(p)) : multi;
    return {
      appliedPincodes: applied,
      pinStatus: applied.length ? 'ok' : 'not_assigned',
      searchedPincode: null,
      servicePincodes: assigned,
    };
  }

  return {
    appliedPincodes: assigned,
    pinStatus: null,
    searchedPincode: null,
    servicePincodes: assigned,
  };
};

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
    const availableQuery = buildAvailableQuery(req.vendor);

    const [available, inProgress, completed, failed, upcomingRaw] = await Promise.all([
      Order.countDocuments(availableQuery),
      Order.countDocuments({ vendorId, status: { $in: PROGRESS } }),
      Order.countDocuments({ vendorId, status: 'completed' }),
      Order.countDocuments({ vendorId, status: 'failed' }),
      Order.find({ vendorId, status: { $in: PROGRESS } })
        .sort({ 'pickup.date': 1, assignedAt: 1 })
        .limit(10)
        .lean(),
    ]);

    const upcomingOrders = await attachImagesToOrders(upcomingRaw);

    res.json({
      vendor: publicVendor(req.vendor),
      metrics: { available, inProgress, completed, failed },
      upcomingOrders,
      announcements: [
        {
          id: '1',
          title: 'Welcome to DeviceKart Partners',
          body: 'Accept nearby pickups, complete verification, and earn incentives.',
        },
      ],
      banners: [],
      creditRate: { rupeesPerCredit: 100 },
    });
  } catch (error) {
    next(error);
  }
};

export const listAvailableOrders = async (req, res, next) => {
  try {
    const resolved = await resolveAvailablePins(req.vendor, {
      pincode: req.query.pincode,
      pincodes: req.query.pincodes,
    });

    let orders = [];
    if (resolved.pinStatus !== 'not_found' && resolved.pinStatus !== 'not_assigned') {
      const query = buildAvailableQuery(req.vendor, resolved.appliedPincodes);
      orders = await Order.find(query).sort({ createdAt: -1 }).limit(100).lean();
    }

    const vendorDoc = await Vendor.findById(req.vendor.id).select('credits orderCreditCost').lean();
    const creditsRequired = Number(vendorDoc?.orderCreditCost) || 0;
    const vendorCredits = Number(vendorDoc?.credits) || 0;
    const cards = await attachImagesToOrders(orders);
    res.json({
      orders: cards.map((o) => ({
        ...o,
        creditsRequired,
      })),
      creditsRequired,
      vendorCredits,
      creditRate: { rupeesPerCredit: 100 },
      servicePincodes: resolved.servicePincodes,
      appliedPincodes: resolved.appliedPincodes,
      pinStatus: resolved.pinStatus,
      searchedPincode: resolved.searchedPincode,
    });
  } catch (error) {
    next(error);
  }
};

export const acceptOrder = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const vendorDoc = await Vendor.findById(req.vendor.id);
    if (!vendorDoc) return res.status(404).json({ message: 'Vendor not found' });

    const cost = Number(vendorDoc.orderCreditCost) || 0;
    if (cost > 0 && Number(vendorDoc.credits || 0) < cost) {
      return res.status(402).json({
        message: `Insufficient credits. Need ${cost} credit(s). Add money (₹100 = 1 credit).`,
      });
    }

    const order = await Order.findOneAndUpdate(
      {
        ...orderMatch(orderId),
        vendorId: null,
        status: { $in: AVAILABLE },
      },
      {
        $set: {
          vendorId: vendorDoc._id,
          assignedAt: new Date(),
          status: 'assigned',
          partnerName: vendorDoc.name,
          partnerPhone: vendorDoc.phone,
          vendorIncentive: Number(req.body?.incentive) || 0,
        },
      },
      { new: true },
    );

    if (!order) {
      return res.status(409).json({ message: 'Order not available or already assigned' });
    }

    if (cost > 0) {
      vendorDoc.credits = Number(vendorDoc.credits || 0) - cost;
      await vendorDoc.save();
      await VendorLedgerEntry.create({
        vendorId: vendorDoc._id,
        entryType: 'order',
        accountType: 'credit',
        title: `Accept ${order.orderId}`,
        amount: 0,
        credits: -cost,
        status: 'Completed',
        serviceNumber: order.orderId,
      });
    }

    res.json({ order: mapOrderCard(order), message: 'Order accepted', creditsCharged: cost });
  } catch (error) {
    next(error);
  }
};

export const logCall = async (req, res, next) => {
  try {
    const vendor = req.vendor;
    const order = await Order.findOne(orderMatch(req.params.orderId));
    if (!order) return res.status(404).json({ message: 'Order not found' });

    const assignedToMe = order.vendorId && String(order.vendorId) === String(vendor.id);
    const isAvailable =
      !order.vendorId && AVAILABLE.includes(order.status);

    if (!assignedToMe && !isAvailable) {
      return res.status(403).json({ message: 'Not allowed to call this order' });
    }

    if (isAvailable) {
      const pincodes = (vendor.servicePincodes || []).map(String);
      const pin = String(order.pickup?.pincode || '');
      if (pincodes.length && !pincodes.includes(pin)) {
        return res.status(403).json({ message: 'Order outside your service pincodes' });
      }
      if (!pincodes.length && vendor.city) {
        const cityOk = new RegExp(`^${vendor.city}$`, 'i').test(order.pickup?.city || '');
        if (!cityOk) return res.status(403).json({ message: 'Order outside your city' });
      }
    }

    const at = new Date().toISOString();
    const report = order.deviceReport && typeof order.deviceReport === 'object' ? { ...order.deviceReport } : {};
    const callLogs = Array.isArray(report.callLogs) ? [...report.callLogs] : [];
    callLogs.push({ at, vendorId: String(vendor.id) });
    report.callLogs = callLogs.slice(-50);
    report.lastCallAt = at;
    order.deviceReport = report;
    order.markModified('deviceReport');
    await order.save();

    res.json({
      message: 'Call logged',
      lastCallAt: at,
      callCount: report.callLogs.length,
      callLogs: report.callLogs.slice(-10),
      order: mapOrderCard(order.toObject ? order.toObject() : order),
    });
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
    res.json({ orders: await attachImagesToOrders(orders) });
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
      orders: await attachImagesToOrders(orders),
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
    const vendorId = req.vendor.id;
    let order = await Order.findOne({
      ...orderMatch(req.params.orderId),
      vendorId,
    }).lean();

    let hidePii = false;
    if (!order) {
      // Preview available order in service area (no PII)
      order = await Order.findOne({
        ...orderMatch(req.params.orderId),
        vendorId: null,
        status: { $in: AVAILABLE },
      }).lean();
      if (!order) return res.status(404).json({ message: 'Order not found' });
      const q = buildAvailableQuery(req.vendor);
      const pinOk =
        !q['pickup.pincode'] ||
        (typeof q['pickup.pincode'] === 'string'
          ? order.pickup?.pincode === q['pickup.pincode']
          : (q['pickup.pincode'].$in || []).includes(String(order.pickup?.pincode || '')));
      if (!pinOk && q['pickup.pincode'] !== undefined) {
        return res.status(403).json({ message: 'Order outside your service area' });
      }
      hidePii = true;
    }

    const pickupPublic = hidePii
      ? {
          date: order.pickup?.date,
          timeSlot: order.pickup?.timeSlot,
          city: order.pickup?.city,
          state: order.pickup?.state,
          pincode: order.pickup?.pincode,
          address: order.pickup?.address
            ? String(order.pickup.address).split(',')[0]
            : undefined,
        }
      : order.pickup;

    let imageUrl = '';
    if (order.device?.slug) {
      const device = await Device.findOne({ slug: order.device.slug }).select('imageUrl').lean();
      imageUrl = device?.imageUrl || '';
    }

    res.json({
      order: {
        ...mapOrderCard(order, imageUrl),
        device: order.device,
        priceBreakdown: order.priceBreakdown,
        pickup: pickupPublic,
        imei1: hidePii ? '' : order.imei1,
        imei2: hidePii ? '' : order.imei2,
        deviceReport: order.deviceReport,
        partnerName: order.partnerName,
        partnerPhone: order.partnerPhone,
        reachedAt: order.reachedAt,
        pickupOtpVerifiedAt: order.pickupOtpVerifiedAt,
        pickupPhotos: order.pickupPhotos || [],
        vendorPriceAdjustment: order.vendorPriceAdjustment || 0,
        hidePii,
        otpPending: Boolean(order.reachedAt && !order.pickupOtpVerifiedAt),
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
      creditRate: { rupeesPerCredit: 100 },
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
    const credits = Math.floor(amount / 100);
    if (credits < 1) {
      return res.status(400).json({ message: 'Minimum ₹100 required (1 credit = ₹100)' });
    }

    const vendor = await Vendor.findById(req.vendor.id);
    vendor.credits = Number(vendor.credits || 0) + credits;
    vendor.walletBalance = Number(vendor.walletBalance || 0) + amount;
    await vendor.save();

    const entry = await VendorLedgerEntry.create({
      vendorId: req.vendor.id,
      entryType: 'payment',
      accountType,
      title: `Add money → ${credits} credit(s)`,
      amount,
      credits,
      status: 'Completed',
      paymentMode: 'ONLINE',
      paymentId: `ADD-${Date.now()}`,
    });
    res.status(201).json({
      message: `Added ${credits} credit(s) (₹100 = 1 credit).`,
      entry,
      credits: vendor.credits,
      walletBalance: vendor.walletBalance,
      creditRate: { rupeesPerCredit: 100 },
    });
  } catch (error) {
    next(error);
  }
};

export const listCallLogs = async (req, res, next) => {
  try {
    const orders = await Order.find({
      vendorId: req.vendor.id,
      'deviceReport.callLogs.0': { $exists: true },
    })
      .sort({ updatedAt: -1 })
      .limit(100)
      .lean();

    const logs = [];
    for (const o of orders) {
      const callLogs = o.deviceReport?.callLogs || [];
      for (const log of callLogs) {
        logs.push({
          at: log.at,
          orderId: o.orderId,
          deviceTitle: mapOrderCard(o).deviceTitle,
          customerName: o.pickup?.name || '',
          customerPhone: o.pickup?.phone || '',
          pincode: o.pickup?.pincode || '',
        });
      }
    }
    logs.sort((a, b) => new Date(b.at) - new Date(a.at));
    res.json({ logs });
  } catch (error) {
    next(error);
  }
};

export const markReached = async (req, res, next) => {
  try {
    const order = await Order.findOne({
      ...orderMatch(req.params.orderId),
      vendorId: req.vendor.id,
      status: { $in: ['assigned', 'picked'] },
    });
    if (!order) return res.status(404).json({ message: 'Order not found' });

    const otp = String(Math.floor(1000 + Math.random() * 9000));
    order.reachedAt = new Date();
    order.pickupOtpPlain = otp;
    order.pickupOtpHash = crypto.createHash('sha256').update(otp).digest('hex');
    order.pickupOtpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
    order.pickupOtpVerifiedAt = null;
    await order.save();

    res.json({ message: 'Reached. Ask customer for the OTP shown on their app.' });
  } catch (error) {
    next(error);
  }
};

export const verifyPickupOtp = async (req, res, next) => {
  try {
    const otp = String(req.body.otp || '').trim();
    const order = await Order.findOne({
      ...orderMatch(req.params.orderId),
      vendorId: req.vendor.id,
    });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (!order.reachedAt) return res.status(400).json({ message: 'Mark reached first' });
    if (order.pickupOtpVerifiedAt) {
      return res.json({ message: 'Already verified', order: mapOrderCard(order) });
    }
    if (!order.pickupOtpExpiresAt || order.pickupOtpExpiresAt < new Date()) {
      return res.status(400).json({ message: 'OTP expired. Tap I Have Reached again.' });
    }
    const hash = crypto.createHash('sha256').update(otp).digest('hex');
    if (hash !== order.pickupOtpHash && otp !== order.pickupOtpPlain) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }
    order.pickupOtpVerifiedAt = new Date();
    order.pickupOtpPlain = '';
    order.status = 'picked';
    await order.save();
    res.json({ message: 'OTP verified', order: mapOrderCard(order) });
  } catch (error) {
    next(error);
  }
};

export const uploadPickupPhotos = async (req, res, next) => {
  try {
    const photos = Array.isArray(req.body.photos) ? req.body.photos : [];
    const angles = ['front', 'back', 'left', 'right', 'top', 'bottom'];
    if (photos.length < 6) {
      return res.status(400).json({ message: 'Upload all 6 angles' });
    }
    const order = await Order.findOne({
      ...orderMatch(req.params.orderId),
      vendorId: req.vendor.id,
    });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (!order.pickupOtpVerifiedAt) {
      return res.status(400).json({ message: 'Verify pickup OTP first' });
    }

    order.pickupPhotos = photos.slice(0, 6).map((p, i) => ({
      angle: p.angle || angles[i],
      url: p.url || '',
      uploadedAt: new Date(),
    }));
    if (order.pickupPhotos.every((p) => p.url)) {
      order.status = 'verified';
    }
    await order.save();
    res.json({ order: mapOrderCard(order), pickupPhotos: order.pickupPhotos });
  } catch (error) {
    next(error);
  }
};

export const setPriceAdjustment = async (req, res, next) => {
  try {
    const amount = Number(req.body.amount) || 0;
    const order = await Order.findOne({
      ...orderMatch(req.params.orderId),
      vendorId: req.vendor.id,
    });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    order.vendorPriceAdjustment = amount;
    await order.save();
    res.json({
      vendorPriceAdjustment: order.vendorPriceAdjustment,
      total:
        Number(order.priceBreakdown?.finalPrice || 0) + Number(order.vendorPriceAdjustment || 0),
    });
  } catch (error) {
    next(error);
  }
};

export const markDelivered = async (req, res, next) => {
  try {
    const order = await Order.findOne({
      ...orderMatch(req.params.orderId),
      vendorId: req.vendor.id,
    });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (!order.pickupOtpVerifiedAt) {
      return res.status(400).json({ message: 'OTP not verified' });
    }
    if (!order.pickupPhotos || order.pickupPhotos.length < 6) {
      return res.status(400).json({ message: 'Upload 6 angle photos first' });
    }

    const adj = Number(order.vendorPriceAdjustment) || 0;
    if (adj) {
      order.priceBreakdown = {
        ...(order.priceBreakdown || {}),
        vendorAdjustment: adj,
        finalPrice: Number(order.priceBreakdown?.finalPrice || 0) + adj,
      };
    }
    order.status = 'completed';
    await order.save();

    if (order.vendorIncentive > 0) {
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

    res.json({ order: mapOrderCard(order), message: 'Pickup completed successfully' });
  } catch (error) {
    next(error);
  }
};

export const listVendorCustomPricing = async (req, res, next) => {
  try {
    await ensureCustomPricingSeed();
    const items = await CustomPricingItem.find({ isActive: true })
      .sort({ sortOrder: 1 })
      .select('key category label priceAdjustment')
      .lean();
    res.json({ items });
  } catch (error) {
    next(error);
  }
};
