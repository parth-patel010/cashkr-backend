import RepairService, { DEFAULT_REPAIR_ISSUES } from '../models/RepairService.js';
import RepairPriceTemplate from '../models/RepairPriceTemplate.js';
import RepairOrder from '../models/RepairOrder.js';
import Device from '../models/Device.js';

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

const enrichService = (service) => {
  const activeIssues = (service.issues || []).filter((i) => i.isActive !== false);
  const prices = activeIssues.map((i) => i.price);
  return {
    ...service,
    issues: activeIssues,
    minPrice: prices.length ? Math.min(...prices) : 0,
    maxPrice: prices.length ? Math.max(...prices) : 0,
  };
};

const resolveDeviceFields = async (body = {}) => {
  let deviceId = body.deviceId || null;
  let modelName = String(body.modelName || '').trim();
  let deviceSlug = String(body.deviceSlug || '').trim();
  let brand = String(body.brand || '').trim();
  let category = body.category || 'mobile';
  let imageUrl = body.imageUrl || '';

  if (deviceId) {
    const device = await Device.findById(deviceId).lean();
    if (!device) {
      const err = new Error('Device not found');
      err.status = 404;
      throw err;
    }
    brand = device.brand;
    category = device.category || category;
    modelName = device.modelName;
    deviceSlug = device.slug;
    if (!imageUrl) imageUrl = device.imageUrl || '';
  }

  return { deviceId, modelName, deviceSlug, brand, category, imageUrl };
};

export const listRepairServicesPublic = async (req, res, next) => {
  try {
    const { brand, category = 'mobile', modelOnly = 'true' } = req.query;
    const query = { isActive: true, category };
    if (brand) query.brand = new RegExp(`^${brand}$`, 'i');
    if (modelOnly !== 'false') {
      query.deviceSlug = { $exists: true, $ne: '' };
    }

    const services = await RepairService.find(query).sort({ brand: 1, modelName: 1, sortOrder: 1 }).lean();
    res.json(services.map(enrichService));
  } catch (error) {
    next(error);
  }
};

export const listRepairBrandsPublic = async (req, res, next) => {
  try {
    const category = req.query.category || 'mobile';
    const rows = await RepairService.aggregate([
      {
        $match: {
          isActive: true,
          category,
          deviceSlug: { $exists: true, $ne: '' },
        },
      },
      {
        $group: {
          _id: { $toLower: '$brand' },
          brand: { $first: '$brand' },
          modelCount: { $sum: 1 },
          minPrice: { $min: { $min: '$issues.price' } },
          imageUrl: { $first: '$imageUrl' },
        },
      },
      { $sort: { brand: 1 } },
    ]);
    res.json(rows.map((r) => ({
      brand: r.brand,
      modelCount: r.modelCount,
      minPrice: r.minPrice || 0,
      imageUrl: r.imageUrl || '',
    })));
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
    res.json(enrichService(service));
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
    const { category, brand, search, modelOnly } = req.query;
    const query = {};
    if (category) query.category = category;
    if (brand) query.brand = new RegExp(`^${brand}$`, 'i');
    if (modelOnly === 'true') query.deviceSlug = { $exists: true, $ne: '' };
    if (search) {
      query.$or = [
        { brand: { $regex: search, $options: 'i' } },
        { title: { $regex: search, $options: 'i' } },
        { modelName: { $regex: search, $options: 'i' } },
        { deviceSlug: { $regex: search, $options: 'i' } },
      ];
    }

    const services = await RepairService.find(query).sort({ updatedAt: -1 }).lean();
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

    const resolved = await resolveDeviceFields(req.body);
    if (!resolved.brand) {
      return res.status(400).json({ message: 'Brand is required' });
    }
    if (!resolved.deviceId && !resolved.modelName) {
      return res.status(400).json({ message: 'Select a phone model for repair pricing' });
    }

    const slug =
      req.body.slug?.trim() ||
      slugify(`repair-${resolved.deviceSlug || `${resolved.brand}-${resolved.modelName}`}`);

    const payload = {
      ...req.body,
      brand: resolved.brand,
      category: resolved.category,
      deviceId: resolved.deviceId,
      modelName: resolved.modelName,
      deviceSlug: resolved.deviceSlug,
      imageUrl: resolved.imageUrl || req.body.imageUrl || '',
      issues,
      title: req.body.title || `${resolved.brand} ${resolved.modelName} Repair`,
      slug,
    };

    const service = await RepairService.create(payload);
    res.status(201).json(service);
  } catch (error) {
    if (error.status === 404) return res.status(404).json({ message: error.message });
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Repair pricing already exists for this model (or slug)' });
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

    if (updates.deviceId || updates.modelName || updates.brand) {
      const resolved = await resolveDeviceFields(updates);
      updates.brand = resolved.brand || updates.brand;
      updates.category = resolved.category || updates.category;
      updates.deviceId = resolved.deviceId;
      updates.modelName = resolved.modelName;
      updates.deviceSlug = resolved.deviceSlug;
      if (resolved.imageUrl) updates.imageUrl = resolved.imageUrl;
      if (!updates.title && resolved.modelName) {
        updates.title = `${resolved.brand} ${resolved.modelName} Repair`;
      }
    }

    const service = await RepairService.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });
    if (!service) return res.status(404).json({ message: 'Repair service not found' });
    res.json(service);
  } catch (error) {
    if (error.status === 404) return res.status(404).json({ message: error.message });
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Repair pricing already exists for this model' });
    }
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

/** ── Price templates (common prices → apply to many models) ── */

export const adminListRepairTemplates = async (req, res, next) => {
  try {
    const query = {};
    if (req.query.category) query.category = req.query.category;
    const templates = await RepairPriceTemplate.find(query).sort({ updatedAt: -1 }).lean();
    res.json({ templates, defaultIssues: DEFAULT_REPAIR_ISSUES });
  } catch (error) {
    next(error);
  }
};

export const adminCreateRepairTemplate = async (req, res, next) => {
  try {
    const issues = normalizeIssues(req.body.issues);
    if (!issues.length) {
      return res.status(400).json({ message: 'Add at least one issue price' });
    }
    const name = String(req.body.name || '').trim();
    if (!name) return res.status(400).json({ message: 'Template name is required' });

    const template = await RepairPriceTemplate.create({
      name,
      category: req.body.category || 'mobile',
      description: req.body.description || '',
      issues,
      isActive: req.body.isActive !== false,
    });
    res.status(201).json(template);
  } catch (error) {
    next(error);
  }
};

export const adminUpdateRepairTemplate = async (req, res, next) => {
  try {
    const updates = { ...req.body };
    if (updates.issues) {
      updates.issues = normalizeIssues(updates.issues);
      if (!updates.issues.length) {
        return res.status(400).json({ message: 'Add at least one issue price' });
      }
    }
    const template = await RepairPriceTemplate.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });
    if (!template) return res.status(404).json({ message: 'Template not found' });
    res.json(template);
  } catch (error) {
    next(error);
  }
};

export const adminDeleteRepairTemplate = async (req, res, next) => {
  try {
    const template = await RepairPriceTemplate.findByIdAndDelete(req.params.id);
    if (!template) return res.status(404).json({ message: 'Template not found' });
    res.json({ message: 'Template deleted' });
  } catch (error) {
    next(error);
  }
};

/**
 * Apply a common price template to many device models quickly.
 * Body: { deviceIds: string[] } OR { brand, category } to apply to all models of a brand.
 */
export const adminApplyRepairTemplate = async (req, res, next) => {
  try {
    const template = await RepairPriceTemplate.findById(req.params.id).lean();
    if (!template) return res.status(404).json({ message: 'Template not found' });

    const issues = normalizeIssues(template.issues);
    if (!issues.length) {
      return res.status(400).json({ message: 'Template has no issue prices' });
    }

    let devices = [];
    const deviceIds = Array.isArray(req.body.deviceIds) ? req.body.deviceIds.filter(Boolean) : [];

    if (deviceIds.length) {
      devices = await Device.find({ _id: { $in: deviceIds } }).lean();
    } else if (req.body.brand) {
      const category = req.body.category || template.category || 'mobile';
      devices = await Device.find({
        brand: new RegExp(`^${String(req.body.brand).trim()}$`, 'i'),
        category,
      }).lean();
    } else {
      return res.status(400).json({ message: 'Provide deviceIds[] or brand to apply prices' });
    }

    if (!devices.length) {
      return res.status(404).json({ message: 'No matching devices found' });
    }

    let created = 0;
    let updated = 0;
    const results = [];

    for (const device of devices) {
      const slug = slugify(`repair-${device.slug}`);
      const payload = {
        category: device.category || template.category || 'mobile',
        brand: device.brand,
        deviceId: device._id,
        modelName: device.modelName,
        deviceSlug: device.slug,
        title: `${device.brand} ${device.modelName} Repair`,
        slug,
        imageUrl: device.imageUrl || '',
        issues,
        isActive: true,
        templateId: template._id,
        turnaroundHours: req.body.turnaroundHours ?? 24,
        warrantyDays: req.body.warrantyDays ?? 90,
      };

      const existing = await RepairService.findOne({ deviceId: device._id });
      if (existing) {
        existing.issues = issues;
        existing.templateId = template._id;
        existing.isActive = true;
        existing.title = payload.title;
        existing.imageUrl = payload.imageUrl || existing.imageUrl;
        await existing.save();
        updated += 1;
        results.push({ deviceId: device._id, modelName: device.modelName, action: 'updated' });
      } else {
        // Avoid slug clash with old brand-level docs
        let uniqueSlug = slug;
        const clash = await RepairService.findOne({ slug: uniqueSlug, deviceId: { $ne: device._id } });
        if (clash) uniqueSlug = `${slug}-${String(device._id).slice(-6)}`;
        payload.slug = uniqueSlug;
        await RepairService.create(payload);
        created += 1;
        results.push({ deviceId: device._id, modelName: device.modelName, action: 'created' });
      }
    }

    res.json({
      message: `Applied “${template.name}” to ${devices.length} model(s)`,
      created,
      updated,
      total: devices.length,
      results,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Slug conflict while applying template' });
    }
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
        modelName: service.modelName || '',
        deviceSlug: service.deviceSlug || '',
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
