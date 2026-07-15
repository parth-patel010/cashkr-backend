import Order from '../models/Order.js';
import { validationResult } from 'express-validator';

const DUPLICATE_WINDOW_MS = 30 * 60 * 1000; // 30 minutes

const normalizeList = (value) => {
  if (!Array.isArray(value)) return [];
  return [...value].map(String).sort();
};

/** Build a comparable fingerprint of device specs + offered price for this user. */
const buildOrderSpecKey = (device = {}, priceBreakdown = {}) => {
  const d = device || {};
  return JSON.stringify({
    category: d.category || '',
    brand: d.brand || '',
    modelName: d.modelName || '',
    slug: d.slug || '',
    storage: d.storage || '',
    ram: d.ram || '',
    processor: d.processor || '',
    generation: d.generation || '',
    deviceAge: d.deviceAge || '',
    yearOfPurchase: d.yearOfPurchase || '',
    ableToMakeCalls: d.ableToMakeCalls ?? null,
    isTouchScreenWorking: d.isTouchScreenWorking ?? null,
    isScreenOriginal: d.isScreenOriginal ?? null,
    underWarranty: d.underWarranty ?? null,
    hasGSTBill: d.hasGSTBill ?? null,
    eSIMSupport: d.eSIMSupport || '',
    physicalIssues: normalizeList(d.physicalIssues),
    technicalIssues: normalizeList(d.technicalIssues),
    functionalIssues: normalizeList(d.functionalIssues),
    screenIssues: normalizeList(d.screenIssues),
    accessories: Array.isArray(d.accessories) ? normalizeList(d.accessories) : (d.accessories || ''),
    finalPrice: priceBreakdown?.finalPrice ?? null,
  });
};

export const createOrder = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    }

    const { device, priceBreakdown, pickup } = req.body;
    const userId = req.user.id;
    const since = new Date(Date.now() - DUPLICATE_WINDOW_MS);
    const incomingKey = buildOrderSpecKey(device, priceBreakdown);

    const recentOrders = await Order.find({
      userId,
      createdAt: { $gte: since },
      status: { $ne: 'cancelled' },
    })
      .sort({ createdAt: -1 })
      .select('orderId device priceBreakdown createdAt')
      .lean();

    const duplicate = recentOrders.find(
      (existing) => buildOrderSpecKey(existing.device, existing.priceBreakdown) === incomingKey
    );

    if (duplicate) {
      return res.status(409).json({
        message: 'An order with the same device details is already placed for you. Please try again after 30 minutes if you still need a new one.',
        orderId: duplicate.orderId,
        alreadyPlaced: true,
      });
    }

    const order = await Order.create({
      userId,
      device,
      priceBreakdown,
      pickup,
      status: 'placed',
      partnerName: 'Rajesh Kumar',
      partnerPhone: '+91 98765 43210',
    });

    res.status(201).json({
      orderId: order.orderId,
      message: 'Order created successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const getUserOrders = async (req, res, next) => {
  try {
    const { type } = req.query;
    const query = { userId: req.user.id };

    // Current catalog is sell-only; type=sell returns all. buy/repair reserved for later.
    if (type === 'buy' || type === 'repair') {
      return res.json([]);
    }

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .lean();

    res.json(orders);
  } catch (error) {
    next(error);
  }
};

export const getOrderById = async (req, res, next) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findOne({ orderId }).lean();

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(order);
  } catch (error) {
    next(error);
  }
};

export const cancelOrder = async (req, res, next) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findOne({ orderId });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (!['placed', 'scheduled'].includes(order.status)) {
      return res.status(400).json({ message: 'Order can only be cancelled when status is "placed" or "scheduled"' });
    }

    order.status = 'cancelled';
    await order.save();

    res.json({ message: 'Order cancelled successfully', orderId: order.orderId });
  } catch (error) {
    next(error);
  }
};

export const rescheduleOrder = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { date, timeSlot } = req.body;

    const order = await Order.findOne({ orderId });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    order.pickup.date = date;
    order.pickup.timeSlot = timeSlot;
    order.status = 'scheduled'; // Reset status to scheduled if it was something else (optional)
    await order.save();

    res.json({ message: 'Order rescheduled successfully', orderId: order.orderId });
  } catch (error) {
    next(error);
  }
};

export const updateOrderPaymentMethod = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { paymentMethod } = req.body;

    const order = await Order.findOne({ orderId });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    order.pickup.paymentMethod = paymentMethod;
    await order.save();

    res.json({ message: 'Payment method updated successfully', orderId: order.orderId });
  } catch (error) {
    next(error);
  }
};
