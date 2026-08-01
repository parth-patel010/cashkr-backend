import BuyProduct, { BUY_CONDITIONS, BUY_CONDITION_LABELS } from '../models/BuyProduct.js';
import BuyOrder from '../models/BuyOrder.js';
import { uploadedFileUrl } from '../middleware/upload.js';
import mongoose from 'mongoose';
import { getRazorpay, getRazorpayKeyId, verifyPaymentSignature } from '../utils/razorpay.js';
import { markBuyOrderPaid } from '../utils/buyPayment.js';

const toObjectId = (id) => {
  if (id instanceof mongoose.Types.ObjectId) return id;
  if (mongoose.Types.ObjectId.isValid(id)) return new mongoose.Types.ObjectId(id);
  return id;
};

const validateShipping = (shipping = {}) => {
  const required = ['name', 'phone', 'address', 'pincode', 'city', 'state'];
  for (const key of required) {
    if (!String(shipping[key] || '').trim()) return false;
  }
  return true;
};

const normalizeShipping = (shipping = {}) => ({
  name: String(shipping.name || '').trim(),
  phone: String(shipping.phone || '').trim(),
  address: String(shipping.address || '').trim(),
  pincode: String(shipping.pincode || '').trim(),
  city: String(shipping.city || '').trim(),
  state: String(shipping.state || '').trim(),
});

const resolveBuyProductCondition = async (productId, conditionKey) => {
  const product = await BuyProduct.findById(productId);
  if (!product || !product.isActive) {
    return { error: { status: 404, message: 'Product not found' } };
  }
  const condition = product.conditions.find((c) => c.key === conditionKey);
  if (!condition || Number(condition.price) <= 0) {
    return { error: { status: 400, message: 'Invalid condition selected' } };
  }
  if (condition.stock < 1) {
    return { error: { status: 400, message: 'Out of stock for this condition' } };
  }
  return { product, condition };
};

const slugify = (value = '') =>
  String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const normalizeConditions = (conditions = []) => {
  if (!Array.isArray(conditions)) return [];
  return conditions
    .filter((c) => c && BUY_CONDITIONS.includes(c.key) && Number(c.price) > 0)
    .map((c) => ({
      key: c.key,
      label: c.label || BUY_CONDITION_LABELS[c.key],
      price: Number(c.price) || 0,
      mrp: Number(c.mrp) || 0,
      description: c.description || '',
      stock: Number(c.stock) || 0,
    }));
};

/** Public responses only expose conditions that have a price set in admin. */
const withPricedConditions = (product) => {
  const conditions = (product.conditions || []).filter((c) => Number(c?.price) > 0);
  const prices = conditions.map((c) => c.price);
  return {
    ...product,
    conditions,
    minPrice: prices.length ? Math.min(...prices) : 0,
    maxPrice: prices.length ? Math.max(...prices) : 0,
  };
};

export const listBuyProductsPublic = async (req, res, next) => {
  try {
    const { brand, category = 'mobile' } = req.query;
    const query = { isActive: true, category };
    if (brand) query.brand = new RegExp(`^${brand}$`, 'i');

    const products = await BuyProduct.find(query).sort({ sortOrder: 1, createdAt: -1 }).lean();
    res.json(products.map(withPricedConditions).filter((p) => p.conditions.length > 0));
  } catch (error) {
    next(error);
  }
};

export const getBuyProductBySlug = async (req, res, next) => {
  try {
    const product = await BuyProduct.findOne({ slug: req.params.slug, isActive: true }).lean();
    if (!product) return res.status(404).json({ message: 'Product not found' });
    const mapped = withPricedConditions(product);
    if (!mapped.conditions.length) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(mapped);
  } catch (error) {
    next(error);
  }
};

export const searchBuyProductsPublic = async (req, res, next) => {
  try {
    const q = String(req.query.q || '').trim();
    if (q.length < 2) return res.json([]);

    const tokens = q
      .toLowerCase()
      .split(/\s+/)
      .filter((t) => t.length >= 2)
      .slice(0, 8);

    const or = [
      { modelName: new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i') },
      { brand: new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i') },
      { title: new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i') },
      { slug: new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i') },
    ];
    for (const t of tokens) {
      const re = new RegExp(t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      or.push({ modelName: re }, { brand: re }, { title: re });
    }

    const products = await BuyProduct.find({ isActive: true, $or: or })
      .sort({ sortOrder: 1, createdAt: -1 })
      .limit(40)
      .lean();

    const mapped = products
      .map(withPricedConditions)
      .filter((p) => p.conditions.length > 0)
      .slice(0, 20)
      .map((p) => ({
        category: p.category || 'mobile',
        brand: p.brand,
        modelName: p.modelName || p.title,
        slug: p.slug,
        imageUrl: p.imageUrl || '',
        maxPrice: p.maxPrice || 0,
        minPrice: p.minPrice || 0,
        mode: 'buy',
      }));

    res.json(mapped);
  } catch (error) {
    next(error);
  }
};

export const adminListBuyProducts = async (req, res, next) => {
  try {
    const { category, brand, search } = req.query;
    const query = {};
    if (category) query.category = category;
    if (brand) query.brand = brand;
    if (search) {
      query.$or = [
        { modelName: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
        { title: { $regex: search, $options: 'i' } },
      ];
    }
    const products = await BuyProduct.find(query).sort({ createdAt: -1 }).lean();
    res.json({
      products,
      conditionKeys: BUY_CONDITIONS,
      conditionLabels: BUY_CONDITION_LABELS,
    });
  } catch (error) {
    next(error);
  }
};

export const adminCreateBuyProduct = async (req, res, next) => {
  try {
    const conditions = normalizeConditions(req.body.conditions);
    if (!conditions.length) {
      return res.status(400).json({ message: 'Add at least one condition with price' });
    }

    const payload = {
      ...req.body,
      conditions,
      slug:
        req.body.slug?.trim() ||
        slugify(`${req.body.brand || ''}-${req.body.modelName || ''}`),
      title: req.body.title || `${req.body.brand} ${req.body.modelName}`.trim(),
    };

    const product = await BuyProduct.create(payload);
    res.status(201).json(product);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Product slug already exists' });
    }
    next(error);
  }
};

export const adminUpdateBuyProduct = async (req, res, next) => {
  try {
    const updates = { ...req.body };
    if (updates.conditions) {
      updates.conditions = normalizeConditions(updates.conditions);
      if (!updates.conditions.length) {
        return res.status(400).json({ message: 'Add at least one condition with price' });
      }
    }

    const product = await BuyProduct.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    next(error);
  }
};

export const adminDeleteBuyProduct = async (req, res, next) => {
  try {
    const product = await BuyProduct.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (error) {
    next(error);
  }
};

export const uploadBuyVideo = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Video file is required (max 10MB)' });
    }
    if (req.file.size > 10 * 1024 * 1024) {
      return res.status(400).json({ message: 'Video must be 10MB or less' });
    }
    const videoUrl = uploadedFileUrl(req, 'buy-videos');
    res.status(201).json({ videoUrl, filename: req.file.filename });
  } catch (error) {
    next(error);
  }
};

export const createBuyOrder = async (req, res, next) => {
  try {
    const { productId, conditionKey, shipping, paymentMethod = 'cod' } = req.body;
    if (!productId || !conditionKey) {
      return res.status(400).json({ message: 'productId and conditionKey are required' });
    }

    const method = String(paymentMethod || 'cod').toLowerCase();
    if (method !== 'cod') {
      return res.status(400).json({
        message: 'Use /buy/orders/create-razorpay for online payment',
      });
    }

    if (!validateShipping(shipping)) {
      return res.status(400).json({ message: 'Please fill all shipping details' });
    }

    const resolved = await resolveBuyProductCondition(productId, conditionKey);
    if (resolved.error) {
      return res.status(resolved.error.status).json({ message: resolved.error.message });
    }
    const { product, condition } = resolved;

    condition.stock -= 1;
    await product.save();

    const order = await BuyOrder.create({
      userId: toObjectId(req.user.id),
      productId: product._id,
      productSnapshot: {
        brand: product.brand,
        modelName: product.modelName,
        title: product.title,
        imageUrl: product.imageUrl,
        conditionKey: condition.key,
        conditionLabel: condition.label,
        price: condition.price,
      },
      shipping: normalizeShipping(shipping),
      paymentMethod: 'cod',
      paymentStatus: 'pending',
      amount: Number(condition.price) || 0,
      stockDecremented: true,
      status: 'placed',
    });

    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
};

/** Create pending buy order + Razorpay order (stock decremented after payment). */
export const createRazorpayBuyOrder = async (req, res, next) => {
  try {
    const { productId, conditionKey, shipping } = req.body;
    if (!productId || !conditionKey) {
      return res.status(400).json({ message: 'productId and conditionKey are required' });
    }
    if (!validateShipping(shipping)) {
      return res.status(400).json({ message: 'Please fill all shipping details' });
    }

    const keyId = getRazorpayKeyId();
    if (!keyId || !process.env.RAZORPAY_KEY_SECRET) {
      return res.status(503).json({ message: 'Payment gateway is not configured' });
    }

    const resolved = await resolveBuyProductCondition(productId, conditionKey);
    if (resolved.error) {
      return res.status(resolved.error.status).json({ message: resolved.error.message });
    }
    const { product, condition } = resolved;
    const amount = Number(condition.price) || 0;
    if (amount <= 0) {
      return res.status(400).json({ message: 'Invalid price' });
    }

    const order = await BuyOrder.create({
      userId: toObjectId(req.user.id),
      productId: product._id,
      productSnapshot: {
        brand: product.brand,
        modelName: product.modelName,
        title: product.title,
        imageUrl: product.imageUrl,
        conditionKey: condition.key,
        conditionLabel: condition.label,
        price: condition.price,
      },
      shipping: normalizeShipping(shipping),
      paymentMethod: 'razorpay',
      paymentStatus: 'pending',
      amount,
      stockDecremented: false,
      status: 'placed',
    });

    const razorpay = getRazorpay();
    const rzOrder = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency: 'INR',
      receipt: String(order.orderId).slice(0, 40),
      notes: {
        type: 'buy',
        buyOrderId: order.orderId,
        userId: String(req.user.id),
      },
    });

    order.razorpayOrderId = rzOrder.id;
    await order.save();

    res.status(201).json({
      orderId: order.orderId,
      razorpayOrderId: rzOrder.id,
      amount,
      amountPaise: rzOrder.amount,
      currency: 'INR',
      keyId,
      productSnapshot: order.productSnapshot,
    });
  } catch (error) {
    next(error);
  }
};

export const verifyBuyPayment = async (req, res, next) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId,
    } = req.body || {};

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: 'Missing payment verification fields' });
    }

    const valid = verifyPaymentSignature({
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      signature: razorpay_signature,
    });
    if (!valid) {
      return res.status(400).json({ message: 'Invalid payment signature' });
    }

    const existing = await BuyOrder.findOne({ razorpayOrderId: razorpay_order_id });
    if (!existing) {
      return res.status(404).json({ message: 'Buy order not found' });
    }
    if (String(existing.userId) !== String(req.user.id)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    if (orderId && existing.orderId !== orderId) {
      return res.status(400).json({ message: 'Order mismatch' });
    }

    const result = await markBuyOrderPaid({
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      buyOrderId: existing.orderId,
    });

    if (!result.ok) {
      return res.status(400).json({ message: result.message });
    }

    res.json({
      message: result.alreadyPaid ? 'Payment already confirmed' : 'Payment successful',
      order: result.order,
    });
  } catch (error) {
    next(error);
  }
};

export const listMyBuyOrders = async (req, res, next) => {
  try {
    const orders = await BuyOrder.find({ userId: req.user.id }).sort({ createdAt: -1 }).lean();
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

export const getBuyOrderById = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const order = await BuyOrder.findOne({ orderId }).lean();
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }
    res.json(order);
  } catch (error) {
    next(error);
  }
};
