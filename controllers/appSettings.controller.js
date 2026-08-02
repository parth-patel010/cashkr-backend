import AppSettings, {
  APP_PAGE_DEFS,
  defaultAppSettingsPages,
  defaultWebsiteCategories,
  defaultHomeBanners,
} from '../models/AppSettings.js';
import { WEBSITE_CATEGORY_DEFS } from '../config/websiteCategories.js';

const MAX_SLOT_BANNERS = 6;
const DEFAULT_ANDROID_DOWNLOAD =
  'https://play.google.com/store/apps/details?id=com.devicekart.app';
const DEFAULT_MAINTENANCE_MESSAGE =
  "We're working to improve your experience. Please try again later.";

/** Compare dotted versions (1.2.3). Returns -1 / 0 / 1. Fail-open → 0. */
function compareVersions(a, b) {
  try {
    const pa = String(a || '0')
      .split(/[^\d]+/)
      .filter(Boolean)
      .map((n) => parseInt(n, 10) || 0);
    const pb = String(b || '0')
      .split(/[^\d]+/)
      .filter(Boolean)
      .map((n) => parseInt(n, 10) || 0);
    const len = Math.max(pa.length, pb.length, 1);
    for (let i = 0; i < len; i += 1) {
      const x = pa[i] || 0;
      const y = pb[i] || 0;
      if (x < y) return -1;
      if (x > y) return 1;
    }
    return 0;
  } catch {
    return 0;
  }
}

export const ensureAppSettings = async () => {
  let doc = await AppSettings.findOne({ key: 'default' });
  if (!doc) {
    doc = await AppSettings.create({
      key: 'default',
      pages: defaultAppSettingsPages(),
      categories: defaultWebsiteCategories(),
      banners: defaultHomeBanners(),
      sellBanners: [],
      repairBanners: [],
      referralBonusAmount: 100,
      requireAddressFor: ['sell', 'buy', 'repair'],
      maintenanceMode: false,
      maintenanceMessage: DEFAULT_MAINTENANCE_MESSAGE,
      maintenanceContact: '',
      androidMinVersion: '',
      androidDownloadUrl: DEFAULT_ANDROID_DOWNLOAD,
      iosMinVersion: '',
      iosDownloadUrl: '',
    });
    return doc;
  }

  const existing = new Map((doc.pages || []).map((p) => [p.key, p]));
  let changed = false;

  for (const def of APP_PAGE_DEFS) {
    if (!existing.has(def.key)) {
      doc.pages.push({
        key: def.key,
        label: def.label,
        enabled: true,
        restrictByPincode: ['sell', 'buy', 'repair'].includes(def.key),
      });
      changed = true;
    } else if (existing.get(def.key).label !== def.label) {
      existing.get(def.key).label = def.label;
      changed = true;
    }
  }

  if (!Array.isArray(doc.categories) || doc.categories.length === 0) {
    doc.categories = defaultWebsiteCategories();
    changed = true;
  } else {
    const byKey = new Map(doc.categories.map((c) => [c.key, c]));
    for (const def of WEBSITE_CATEGORY_DEFS) {
      if (!byKey.has(def.key)) {
        doc.categories.push({ ...def });
        changed = true;
      } else {
        const cur = byKey.get(def.key);
        if (!cur.sellPath && def.sellPath) {
          cur.sellPath = def.sellPath;
          changed = true;
        }
        if (!cur.buyPath && def.buyPath) {
          cur.buyPath = def.buyPath;
          changed = true;
        }
        if (!cur.label && def.label) {
          cur.label = def.label;
          changed = true;
        }
        // TV / Fridge sell now use request forms (not brand→model catalog)
        if (
          (def.key === 'tv' || def.key === 'refrigerator') &&
          def.sellPath &&
          cur.sellPath !== def.sellPath
        ) {
          cur.sellPath = def.sellPath;
          changed = true;
        }
        // Gaming / Smartwatch were default-off; enable sell so they appear on Sell hub
        if ((def.key === 'gaming' || def.key === 'smartwatch') && def.enabledSell === true) {
          if (cur.enabledSell === false) {
            cur.enabledSell = true;
            changed = true;
          }
          if (def.label && cur.label !== def.label) {
            cur.label = def.label;
            changed = true;
          }
        }
      }
    }
  }

  if (!Array.isArray(doc.banners) || doc.banners.length === 0) {
    doc.banners = defaultHomeBanners();
    changed = true;
  }

  if (!Array.isArray(doc.sellBanners)) {
    doc.sellBanners = [];
    changed = true;
  }

  if (!Array.isArray(doc.repairBanners)) {
    doc.repairBanners = [];
    changed = true;
  }

  if (doc.referralBonusAmount == null || !Number.isFinite(Number(doc.referralBonusAmount))) {
    doc.referralBonusAmount = 100;
    changed = true;
  }

  if (doc.maintenanceMode == null) {
    doc.maintenanceMode = false;
    changed = true;
  }
  if (doc.maintenanceMessage == null) {
    doc.maintenanceMessage = DEFAULT_MAINTENANCE_MESSAGE;
    changed = true;
  }
  if (doc.maintenanceContact == null) {
    doc.maintenanceContact = '';
    changed = true;
  }
  if (doc.androidMinVersion == null) {
    doc.androidMinVersion = '';
    changed = true;
  }
  if (doc.androidDownloadUrl == null || doc.androidDownloadUrl === '') {
    doc.androidDownloadUrl = DEFAULT_ANDROID_DOWNLOAD;
    changed = true;
  }
  if (doc.iosMinVersion == null) {
    doc.iosMinVersion = '';
    changed = true;
  }
  if (doc.iosDownloadUrl == null) {
    doc.iosDownloadUrl = '';
    changed = true;
  }

  if (changed) await doc.save();
  return doc;
};

const shapeCategories = (doc) =>
  [...(doc.categories || [])]
    .map((c) => ({
      key: c.key,
      label: c.label,
      sellPath: c.sellPath || '',
      buyPath: c.buyPath || '',
      enabledSell: c.enabledSell !== false,
      enabledBuy: c.enabledBuy !== false,
      imageUrl: c.imageUrl || '',
      sortOrder: c.sortOrder ?? 0,
    }))
    .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

const normalizeBanners = (list) =>
  [...(list || [])]
    .map((b) => ({
      id: b.id,
      title: b.title || '',
      subtitle: b.subtitle || '',
      ctaText: b.ctaText || 'Sell Now',
      ctaLink: b.ctaLink || '/',
      imageUrl: b.imageUrl || '',
      enabled: b.enabled !== false,
      sortOrder: b.sortOrder ?? 0,
    }))
    .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

const mapIncomingBanners = (incoming, max = null) => {
  let list = (incoming || [])
    .filter((b) => b && b.id)
    .map((b, index) => ({
      id: String(b.id),
      title: String(b.title || ''),
      subtitle: String(b.subtitle || ''),
      ctaText: String(b.ctaText || 'Sell Now'),
      ctaLink: String(b.ctaLink || '/'),
      imageUrl: String(b.imageUrl || ''),
      enabled: Object.prototype.hasOwnProperty.call(b, 'enabled') ? Boolean(b.enabled) : true,
      sortOrder: b.sortOrder != null ? Number(b.sortOrder) || 0 : index + 1,
    }));
  if (max != null) list = list.slice(0, max);
  return list;
};

const publicShape = (doc, opts = {}) => {
  const androidMin = String(doc.androidMinVersion || '').trim();
  const iosMin = String(doc.iosMinVersion || '').trim();
  const androidUrl = String(doc.androidDownloadUrl || '').trim() || DEFAULT_ANDROID_DOWNLOAD;
  const iosUrl = String(doc.iosDownloadUrl || '').trim();

  let forceUpdate = false;
  const platform = String(opts.platform || '').toLowerCase() === 'ios' ? 'ios' : 'android';
  const currentVersion = String(opts.currentVersion || '').trim();
  const minVersion = platform === 'ios' ? iosMin : androidMin;
  if (minVersion && currentVersion) {
    forceUpdate = compareVersions(currentVersion, minVersion) < 0;
  }

  return {
    pages: (doc.pages || []).map((p) => ({
      key: p.key,
      label: p.label,
      enabled: p.enabled !== false,
      restrictByPincode: Boolean(p.restrictByPincode),
    })),
    categories: shapeCategories(doc),
    banners: normalizeBanners(doc.banners).slice(0, MAX_SLOT_BANNERS),
    sellBanners: normalizeBanners(doc.sellBanners).slice(0, MAX_SLOT_BANNERS),
    repairBanners: normalizeBanners(doc.repairBanners).slice(0, MAX_SLOT_BANNERS),
    referralBonusAmount:
      doc.referralBonusAmount != null && Number.isFinite(Number(doc.referralBonusAmount))
        ? Number(doc.referralBonusAmount)
        : 100,
    requireAddressFor: doc.requireAddressFor?.length
      ? doc.requireAddressFor
      : ['sell', 'buy', 'repair'],
    maintenanceMode: doc.maintenanceMode === true,
    maintenanceMessage: String(doc.maintenanceMessage || DEFAULT_MAINTENANCE_MESSAGE),
    maintenanceContact: String(doc.maintenanceContact || ''),
    forceUpdate,
    versionControl: {
      android: { minVersion: androidMin, downloadUrl: androidUrl },
      ios: { minVersion: iosMin, downloadUrl: iosUrl },
    },
    updatedAt: doc.updatedAt,
  };
};

export const getPublicAppSettings = async (req, res, next) => {
  try {
    const doc = await ensureAppSettings();
    const platform = req.query.platform;
    const currentVersion = req.query.currentVersion || req.query.current_version;
    res.json(publicShape(doc, { platform, currentVersion }));
  } catch (error) {
    next(error);
  }
};

export const adminGetAppSettings = async (req, res, next) => {
  try {
    const doc = await ensureAppSettings();
    res.json(publicShape(doc));
  } catch (error) {
    next(error);
  }
};

export const adminUpdateAppSettings = async (req, res, next) => {
  try {
    const doc = await ensureAppSettings();
    const incoming = Array.isArray(req.body.pages) ? req.body.pages : [];
    const byKey = new Map(incoming.map((p) => [p.key, p]));

    if (Array.isArray(req.body.pages)) {
      doc.pages = APP_PAGE_DEFS.map((def) => {
        const cur = doc.pages.find((p) => p.key === def.key) || {};
        const next = byKey.get(def.key) || {};
        return {
          key: def.key,
          label: def.label,
          enabled: next.enabled != null ? Boolean(next.enabled) : cur.enabled !== false,
          restrictByPincode:
            next.restrictByPincode != null
              ? Boolean(next.restrictByPincode)
              : Boolean(cur.restrictByPincode),
        };
      });
    }

    if (Array.isArray(req.body.requireAddressFor)) {
      doc.requireAddressFor = req.body.requireAddressFor.map(String);
    }

    if (req.body.referralBonusAmount != null) {
      const amount = Number(req.body.referralBonusAmount);
      if (Number.isFinite(amount) && amount >= 0) {
        doc.referralBonusAmount = amount;
      }
    }

    if (Object.prototype.hasOwnProperty.call(req.body, 'maintenanceMode')) {
      doc.maintenanceMode = Boolean(req.body.maintenanceMode);
    }
    if (Object.prototype.hasOwnProperty.call(req.body, 'maintenanceMessage')) {
      doc.maintenanceMessage = String(req.body.maintenanceMessage || DEFAULT_MAINTENANCE_MESSAGE);
    }
    if (Object.prototype.hasOwnProperty.call(req.body, 'maintenanceContact')) {
      doc.maintenanceContact = String(req.body.maintenanceContact || '');
    }
    if (Object.prototype.hasOwnProperty.call(req.body, 'androidMinVersion')) {
      doc.androidMinVersion = String(req.body.androidMinVersion || '').trim();
    }
    if (Object.prototype.hasOwnProperty.call(req.body, 'androidDownloadUrl')) {
      doc.androidDownloadUrl =
        String(req.body.androidDownloadUrl || '').trim() || DEFAULT_ANDROID_DOWNLOAD;
    }
    if (Object.prototype.hasOwnProperty.call(req.body, 'iosMinVersion')) {
      doc.iosMinVersion = String(req.body.iosMinVersion || '').trim();
    }
    if (Object.prototype.hasOwnProperty.call(req.body, 'iosDownloadUrl')) {
      doc.iosDownloadUrl = String(req.body.iosDownloadUrl || '').trim();
    }

    // Also accept nested versionControl from admin
    const vc = req.body.versionControl;
    if (vc && typeof vc === 'object') {
      if (vc.android) {
        if (vc.android.minVersion != null) doc.androidMinVersion = String(vc.android.minVersion).trim();
        if (vc.android.downloadUrl != null) {
          doc.androidDownloadUrl =
            String(vc.android.downloadUrl).trim() || DEFAULT_ANDROID_DOWNLOAD;
        }
      }
      if (vc.ios) {
        if (vc.ios.minVersion != null) doc.iosMinVersion = String(vc.ios.minVersion).trim();
        if (vc.ios.downloadUrl != null) doc.iosDownloadUrl = String(vc.ios.downloadUrl).trim();
      }
    }

    if (Array.isArray(req.body.categories)) {
      const incomingCats = new Map(req.body.categories.map((c) => [c.key, c]));
      doc.categories = WEBSITE_CATEGORY_DEFS.map((def) => {
        const cur = (doc.categories || []).find((c) => c.key === def.key) || {};
        const next = incomingCats.get(def.key) || {};
        const enabledSell = Object.prototype.hasOwnProperty.call(next, 'enabledSell')
          ? Boolean(next.enabledSell)
          : cur.enabledSell !== false;
        const enabledBuy = Object.prototype.hasOwnProperty.call(next, 'enabledBuy')
          ? Boolean(next.enabledBuy)
          : cur.enabledBuy !== false;
        return {
          key: def.key,
          label: next.label || cur.label || def.label,
          sellPath: next.sellPath || cur.sellPath || def.sellPath,
          buyPath: next.buyPath || cur.buyPath || def.buyPath,
          enabledSell,
          enabledBuy,
          imageUrl: Object.prototype.hasOwnProperty.call(next, 'imageUrl')
            ? String(next.imageUrl || '')
            : cur.imageUrl || '',
          sortOrder:
            next.sortOrder != null
              ? Number(next.sortOrder) || 0
              : cur.sortOrder != null
                ? cur.sortOrder
                : def.sortOrder,
        };
      });
      doc.markModified('categories');
    }

    if (Array.isArray(req.body.banners)) {
      doc.banners = mapIncomingBanners(req.body.banners, MAX_SLOT_BANNERS);
      doc.markModified('banners');
    }

    if (Array.isArray(req.body.sellBanners)) {
      doc.sellBanners = mapIncomingBanners(req.body.sellBanners, MAX_SLOT_BANNERS);
      doc.markModified('sellBanners');
    }

    if (Array.isArray(req.body.repairBanners)) {
      doc.repairBanners = mapIncomingBanners(req.body.repairBanners, MAX_SLOT_BANNERS);
      doc.markModified('repairBanners');
    }

    await doc.save();
    res.json(publicShape(doc));
  } catch (error) {
    next(error);
  }
};
