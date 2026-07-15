import RepairService, { DEFAULT_REPAIR_ISSUES } from '../models/RepairService.js';
import RepairOrder from '../models/RepairOrder.js';

const slugify = (value = '') =>
  String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const normalizeIssues = (issues = []) => {
  if (!Array.isArray(issues)) return [];
  return issues
    .filter((issue) => issue && issue.label && Number(issue.price) >= 0)
    .map((issue) => ({
      key: issue.key || slugify(issue.label),
      label: issue.label,
      price: Number(issue.price) || 0,
      description: issue.description || '',
      isActive: issue.isActive !== false,
    }));
};

export const listRepairServicesPublic = async (req, res, next) => {
  try {
    const { brand, category = 'mobile' } = req.query;
    const query = { isActive: true, category };
    if (brand) query.brand = new RegExp(`^${brand}$`, 'i');

    const services = await RepairService.find(query).sort({ sortOrder: 1, createdAt: -1 }).lean();
    const mapped = services.map((service) => {
      const activeIssues = (service.issues || []).filter((i) => i.isActive !== false);
      const prices = activeIssues.map((i) => i.price);
      return {
        ...service,
        issues: activeIssues,
        minPrice: prices.length ? Math.min(...prices) : 0,
        maxPrice: prices.length ? Math.max(...prices) : 0,
      };
    });
    res.json(mapped);
  } catch (error) {
    next(error);
  }
};

export const getRepairServiceBySlug = async (req, res, next) => {
  try {
    const service = await RepairService.findOne({
      slug: req.params.slug,
      isActive: true,
    }).lean();
    if (!service) return res.status(404).json({ message: 'Repair service not found' });

    service.issues = (service.issues || []).filter((i) => i.isActive !== false);
    res.json(service);
  } catch (error) {
    next(error);
  }
};

export const listRepairIssueCatalog = async (_req, res, next) => {
  try {
    res.json({ issues: DEFAULT_REPAIR_ISSUES });
  } catch (error) {
    next(error);
  }
};

export const adminListRepairServices = async (req, res, next) => {
  try {
    const { category, brand, search } = req.query;
    const query = {};
    if (category) query.category = category;
    if (brand) query.brand = brand;
    if (search) {
      query.$or = [
        { brand: { $regex: search, $options: 'i' } },
        { title: { $regex: search, $options: 'i' } },
      ];
    }

    const services = await RepairService.find(query).sort({ createdAt: -1 }).lean();
    res.json({ services, defaultIssues: DEFAULT_REPAIR_ISSUES });
  } catch (error) {
    next(error);
  }
};

export const adminCreateRepairService = async (req, res, next) => {
  try {
    const issues = normalizeIssues(req.body.issues);
    if (!issues.length) {
      return res.status(400).json({ message: 'Add at least one repair issue with price' });
    }

    const brand = String(req.body.brand || '').trim();
    const category = req.body.category || 'mobile';
    const payload = {
      ...req.body,
      brand,
      category,
      issues,
      title: req.body.title || `${brand} Repair`,
      slug: req.body.slug?.trim() || slugify(`${brand}-${category}-repair`),
    };

    const service = await RepairService.create(payload);
    res.status(201).json(service);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Repair service slug already exists' });
    }
    next(error);
  }
};

export const adminUpdateRepairService = async (req, res, next) => {
  try {
    const updates = { ...req.body };
    if (updates.issues) {
      updates.issues = normalizeIssues(updates.issues);
      if (!updates.issues.length) {
        return res.status(400).json({ message: 'Add at least one repair issue with price' });
      }
    }

    const service = await RepairService.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });
    if (!service) return res.status(404).json({ message: 'Repair service not found' });
    res.json(service);
  } catch (error) {
    next(error);
  }
};

export const adminDeleteRepairService = async (req, res, next) => {
  try {
    const service = await RepairService.findByIdAndDelete(req.params.id);
    if (!service) return res.status(404).json({ message: 'Repair service not found' });
    res.json({ message: 'Repair service deleted' });
  } catch (error) {
    next(error);
  }
};

export const createRepairOrder = async (req, res, next) => {
  try {
    const { serviceId, issueKey, pickup, customerNote } = req.body;
    if (!serviceId || !issueKey) {
      return res.status(400).json({ message: 'serviceId and issueKey are required' });
    }

    const service = await RepairService.findById(serviceId);
    if (!service || !service.isActive) {
      return res.status(404).json({ message: 'Repair service not found' });
    }

    const issue = service.issues.find((i) => i.key === issueKey && i.isActive !== false);
    if (!issue) {
      return res.status(400).json({ message: 'Invalid repair issue selected' });
    }

    const order = await RepairOrder.create({
      userId: req.user.id,
      serviceId: service._id,
      snapshot: {
        brand: service.brand,
        title: service.title,
        category: service.category,
        imageUrl: service.imageUrl,
        issueKey: issue.key,
        issueLabel: issue.label,
        price: issue.price,
      },
      pickup: pickup || {},
      customerNote: customerNote || '',
      status: 'booked',
    });

    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
};

export const listMyRepairOrders = async (req, res, next) => {
  try {
    const orders = await RepairOrder.find({ userId: req.user.id }).sort({ createdAt: -1 }).lean();
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

export const getRepairOrderById = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const order = await RepairOrder.findOne({ orderId }).lean();
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }
    res.json(order);
  } catch (error) {
    next(error);
  }
};
