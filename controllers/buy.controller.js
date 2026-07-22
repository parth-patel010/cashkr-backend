import BuyProduct, { BUY_CONDITIONS, BUY_CONDITION_LABELS } from '../models/BuyProduct.js';
import BuyOrder from '../models/BuyOrder.js';
import { uploadedFileUrl } from '../middleware/upload.js';

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
    const { productId, conditionKey, shipping } = req.body;
    if (!productId || !conditionKey) {
      return res.status(400).json({ message: 'productId and conditionKey are required' });
    }

    const product = await BuyProduct.findById(productId);
    if (!product || !product.isActive) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const condition = product.conditions.find((c) => c.key === conditionKey);
    if (!condition || Number(condition.price) <= 0) {
      return res.status(400).json({ message: 'Invalid condition selected' });
    }
    if (condition.stock < 1) {
      return res.status(400).json({ message: 'Out of stock for this condition' });
    }

    condition.stock -= 1;
    await product.save();

    const order = await BuyOrder.create({
      userId: req.user.id,
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
      shipping: shipping || {},
      status: 'placed',
    });

    res.status(201).json(order);
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
