import Vendor from '../models/Vendor.js';
import VendorTrainingItem from '../models/VendorTrainingItem.js';
import VendorLedgerEntry from '../models/VendorLedgerEntry.js';
import PartnerApplication from '../models/PartnerApplication.js';
import Order from '../models/Order.js';

const normalizePhone = (phone = '') => {
  const digits = String(phone).replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('91')) return digits.slice(2);
  return digits.slice(-10);
};

export const adminListVendors = async (req, res, next) => {
  try {
    const { search, active } = req.query;
    const query = {};
    if (active === 'true') query.isActive = true;
    if (active === 'false') query.isActive = false;
    if (search) {
      query.$or = [
        { name: new RegExp(search, 'i') },
        { phone: new RegExp(search, 'i') },
        { city: new RegExp(search, 'i') },
        { vendorCode: new RegExp(search, 'i') },
      ];
    }
    const vendors = await Vendor.find(query).sort({ createdAt: -1 }).lean();
    res.json({ vendors });
  } catch (error) {
    next(error);
  }
};

export const adminGetVendor = async (req, res, next) => {
  try {
    const vendor = await Vendor.findById(req.params.id).lean();
    if (!vendor) return res.status(404).json({ message: 'Vendor not found' });
    const orders = await Order.find({ vendorId: vendor._id }).sort({ createdAt: -1 }).limit(50).lean();
    res.json({ vendor, orders });
  } catch (error) {
    next(error);
  }
};

export const adminCreateVendor = async (req, res, next) => {
  try {
    const phone = normalizePhone(req.body.phone);
    if (!req.body.name || phone.length !== 10) {
      return res.status(400).json({ message: 'Name and valid 10-digit phone are required' });
    }
    const exists = await Vendor.findOne({ phone });
    if (exists) return res.status(409).json({ message: 'Vendor with this phone already exists' });

    const pincodes = Array.isArray(req.body.servicePincodes)
      ? req.body.servicePincodes.map(String)
      : String(req.body.servicePincodes || '')
          .split(',')
          .map((p) => p.trim())
          .filter(Boolean);

    const vendor = await Vendor.create({
      name: req.body.name.trim(),
      phone,
      city: req.body.city || '',
      photoUrl: req.body.photoUrl || '',
      servicePincodes: pincodes,
      isActive: req.body.isActive !== false,
      managerPhone: req.body.managerPhone || '',
      walletBalance: Number(req.body.walletBalance) || 0,
      credits: Number(req.body.credits) || 0,
      virtualAccount: req.body.virtualAccount || {},
      vendorCode: req.body.vendorCode || undefined,
    });

    res.status(201).json({ vendor });
  } catch (error) {
    next(error);
  }
};

export const adminUpdateVendor = async (req, res, next) => {
  try {
    const updates = { ...req.body };
    if (updates.phone) updates.phone = normalizePhone(updates.phone);
    if (typeof updates.servicePincodes === 'string') {
      updates.servicePincodes = updates.servicePincodes
        .split(',')
        .map((p) => p.trim())
        .filter(Boolean);
    }
    delete updates._id;

    const vendor = await Vendor.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });
    if (!vendor) return res.status(404).json({ message: 'Vendor not found' });
    res.json({ vendor });
  } catch (error) {
    next(error);
  }
};

export const adminAdjustWallet = async (req, res, next) => {
  try {
    const { walletDelta = 0, creditsDelta = 0, note = '' } = req.body;
    const vendor = await Vendor.findById(req.params.id);
    if (!vendor) return res.status(404).json({ message: 'Vendor not found' });

    vendor.walletBalance = Math.max(0, (vendor.walletBalance || 0) + Number(walletDelta || 0));
    vendor.credits = Math.max(0, (vendor.credits || 0) + Number(creditsDelta || 0));
    await vendor.save();

    await VendorLedgerEntry.create({
      vendorId: vendor._id,
      entryType: 'adjustment',
      accountType: Number(walletDelta) ? 'wallet' : 'credit',
      title: note || 'Admin adjustment',
      amount: Number(walletDelta) || Number(creditsDelta) || 0,
      credits: Number(creditsDelta) || 0,
      status: 'Completed',
    });

    res.json({ vendor });
  } catch (error) {
    next(error);
  }
};

export const adminApprovePartnerAsVendor = async (req, res, next) => {
  try {
    const app = await PartnerApplication.findById(req.params.id);
    if (!app) return res.status(404).json({ message: 'Partner application not found' });

    const phone = normalizePhone(app.mobile);
    let vendor = await Vendor.findOne({ phone });
    if (!vendor) {
      vendor = await Vendor.create({
        name: app.contactPerson || app.businessName,
        phone,
        city: app.city || '',
        isActive: true,
      });
    }

    app.status = 'approved';
    await app.save();

    res.json({ vendor, application: app });
  } catch (error) {
    next(error);
  }
};

export const adminListTraining = async (req, res, next) => {
  try {
    const items = await VendorTrainingItem.find().sort({ sortOrder: 1, createdAt: -1 });
    res.json({ items });
  } catch (error) {
    next(error);
  }
};

export const adminUpsertTraining = async (req, res, next) => {
  try {
    if (req.params.id) {
      const item = await VendorTrainingItem.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      if (!item) return res.status(404).json({ message: 'Not found' });
      return res.json({ item });
    }
    const item = await VendorTrainingItem.create(req.body);
    res.status(201).json({ item });
  } catch (error) {
    next(error);
  }
};

export const adminDeleteTraining = async (req, res, next) => {
  try {
    await VendorTrainingItem.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (error) {
    next(error);
  }
};

export const adminAssignOrderVendor = async (req, res, next) => {
  try {
    const { vendorId } = req.body;
    const order = await Order.findOne({
      $or: [{ orderId: req.params.orderId }, { _id: req.params.orderId }],
    });
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (!vendorId) {
      order.vendorId = null;
      order.assignedAt = null;
      order.partnerName = '';
      order.partnerPhone = '';
      if (order.status === 'assigned') order.status = 'scheduled';
      await order.save();
      return res.json({ order });
    }

    const vendor = await Vendor.findById(vendorId);
    if (!vendor || !vendor.isActive) {
      return res.status(400).json({ message: 'Invalid vendor' });
    }

    order.vendorId = vendor._id;
    order.assignedAt = new Date();
    order.partnerName = vendor.name;
    order.partnerPhone = vendor.phone;
    if (['placed', 'scheduled'].includes(order.status)) order.status = 'assigned';
    await order.save();
    res.json({ order });
  } catch (error) {
    next(error);
  }
};
