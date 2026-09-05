import Vendor from '../models/Vendor.js';
import VendorLedgerEntry from '../models/VendorLedgerEntry.js';
import AppSettings from '../models/AppSettings.js';
import { ensureAppSettings } from './appSettings.controller.js';
import {
  DEFAULT_VENDOR_COMMISSION_BRACKETS,
  averageBracketPercent,
  invalidateVendorCommissionCache,
  loadVendorCommissionDefaults,
} from '../utils/vendorCommission.js';
import { normalizeBracketList } from '../utils/offerMarkup.js';

async function enrichVendorCommissionRow(vendor, defaults) {
  const own = Array.isArray(vendor.commissionBrackets) && vendor.commissionBrackets.length
    ? normalizeBracketList(vendor.commissionBrackets, defaults.defaultBrackets)
    : null;
  const effective = own || defaults.defaultBrackets;
  return {
    id: String(vendor._id),
    name: vendor.name,
    phone: vendor.phone,
    city: vendor.city || '',
    vendorCode: vendor.vendorCode || '',
    isActive: vendor.isActive !== false,
    walletBalance: Number(vendor.walletBalance) || 0,
    credits: Number(vendor.credits) || 0,
    hasOverride: Boolean(own),
    commissionBrackets: own || [],
    effectiveBrackets: effective,
    averageCommissionPercent: averageBracketPercent(effective),
  };
}

export const adminGetVendorCommissionSettings = async (req, res, next) => {
  try {
    await ensureAppSettings();
    const settings = await loadVendorCommissionDefaults({ force: true });
    res.json({
      defaultBrackets: settings.defaultBrackets,
    });
  } catch (error) {
    next(error);
  }
};

export const adminSaveVendorCommissionSettings = async (req, res, next) => {
  try {
    await ensureAppSettings();
    const defaultBrackets = normalizeBracketList(
      req.body?.defaultBrackets,
      DEFAULT_VENDOR_COMMISSION_BRACKETS,
    );
    const doc = await AppSettings.findOneAndUpdate(
      { key: 'default' },
      { $set: { 'vendorCommission.defaultBrackets': defaultBrackets } },
      { new: true },
    );
    invalidateVendorCommissionCache();
    res.json({
      message: 'Vendor commission brackets saved',
      defaultBrackets: normalizeBracketList(
        doc?.vendorCommission?.defaultBrackets,
        DEFAULT_VENDOR_COMMISSION_BRACKETS,
      ),
    });
  } catch (error) {
    next(error);
  }
};

export const adminListVendorCommissions = async (req, res, next) => {
  try {
    const { search, sort = 'highest', active } = req.query;
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

    const defaults = await loadVendorCommissionDefaults({ force: true });
    const vendors = await Vendor.find(query)
      .select('name phone city vendorCode isActive walletBalance credits commissionBrackets')
      .lean();

    let rows = await Promise.all(vendors.map((v) => enrichVendorCommissionRow(v, defaults)));

    if (sort === 'lowest') {
      rows.sort((a, b) => a.averageCommissionPercent - b.averageCommissionPercent
        || a.name.localeCompare(b.name));
    } else if (sort === 'wallet') {
      rows.sort((a, b) => b.walletBalance - a.walletBalance || a.name.localeCompare(b.name));
    } else {
      rows.sort((a, b) => b.averageCommissionPercent - a.averageCommissionPercent
        || a.name.localeCompare(b.name));
    }

    res.json({
      vendors: rows,
      defaultBrackets: defaults.defaultBrackets,
    });
  } catch (error) {
    next(error);
  }
};

export const adminGetVendorCommissionDetail = async (req, res, next) => {
  try {
    const vendor = await Vendor.findById(req.params.id).lean();
    if (!vendor) return res.status(404).json({ message: 'Vendor not found' });

    const defaults = await loadVendorCommissionDefaults({ force: true });
    const row = await enrichVendorCommissionRow(vendor, defaults);
    const ledger = await VendorLedgerEntry.find({ vendorId: vendor._id })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    res.json({
      vendor: {
        ...row,
        email: vendor.email || '',
        address: vendor.address || '',
        servicePincodes: vendor.servicePincodes || [],
        orderCreditCost: vendor.orderCreditCost || 0,
        createdAt: vendor.createdAt,
      },
      defaultBrackets: defaults.defaultBrackets,
      ledger,
    });
  } catch (error) {
    next(error);
  }
};

export const adminUpdateVendorCommissionBrackets = async (req, res, next) => {
  try {
    const vendor = await Vendor.findById(req.params.id);
    if (!vendor) return res.status(404).json({ message: 'Vendor not found' });

    const defaults = await loadVendorCommissionDefaults({ force: true });
    if (req.body?.useDefault === true || req.body?.clearOverride === true) {
      vendor.commissionBrackets = [];
    } else if (Array.isArray(req.body?.commissionBrackets)) {
      if (!req.body.commissionBrackets.length) {
        vendor.commissionBrackets = [];
      } else {
        vendor.commissionBrackets = normalizeBracketList(
          req.body.commissionBrackets,
          defaults.defaultBrackets,
        );
      }
    } else {
      return res.status(400).json({ message: 'commissionBrackets array or useDefault required' });
    }

    await vendor.save();
    const row = await enrichVendorCommissionRow(vendor.toObject(), defaults);
    res.json({ message: 'Vendor commission updated', vendor: row });
  } catch (error) {
    next(error);
  }
};
