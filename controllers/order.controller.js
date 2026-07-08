import Order from '../models/Order.js';
import { validationResult } from 'express-validator';

export const createOrder = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    }

    const { device, priceBreakdown, pickup } = req.body;

    const order = await Order.create({
      userId: req.user.id,
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
    const orders = await Order.find({ userId: req.user.id })
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
