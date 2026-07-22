import AppSettings, {
  APP_PAGE_DEFS,
  defaultAppSettingsPages,
  defaultWebsiteCategories,
  defaultHomeBanners,
} from '../models/AppSettings.js';
import { WEBSITE_CATEGORY_DEFS } from '../config/websiteCategories.js';

export const ensureAppSettings = async () => {
  let doc = await AppSettings.findOne({ key: 'default' });
  if (!doc) {
    doc = await AppSettings.create({
      key: 'default',
      pages: defaultAppSettingsPages(),
      categories: defaultWebsiteCategories(),
      banners: defaultHomeBanners(),
      requireAddressFor: ['sell', 'buy', 'repair'],
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
      }
    }
  }

  if (!Array.isArray(doc.banners) || doc.banners.length === 0) {
    doc.banners = defaultHomeBanners();
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

const shapeBanners = (doc) =>
  [...(doc.banners || [])]
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

const publicShape = (doc) => ({
  pages: (doc.pages || []).map((p) => ({
    key: p.key,
    label: p.label,
    enabled: p.enabled !== false,
    restrictByPincode: Boolean(p.restrictByPincode),
  })),
  categories: shapeCategories(doc),
  banners: shapeBanners(doc),
  requireAddressFor: doc.requireAddressFor?.length
    ? doc.requireAddressFor
    : ['sell', 'buy', 'repair'],
  updatedAt: doc.updatedAt,
});

export const getPublicAppSettings = async (req, res, next) => {
  try {
    const doc = await ensureAppSettings();
    res.json(publicShape(doc));
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

    // Only rewrite pages when the client sends a pages array (App Settings page)
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

    if (Array.isArray(req.body.categories)) {
      const incomingCats = new Map(req.body.categories.map((c) => [c.key, c]));
      doc.categories = WEBSITE_CATEGORY_DEFS.map((def) => {
        const cur = (doc.categories || []).find((c) => c.key === def.key) || {};
        const next = incomingCats.get(def.key) || {};
        return {
          key: def.key,
          label: next.label || cur.label || def.label,
          sellPath: next.sellPath || cur.sellPath || def.sellPath,
          buyPath: next.buyPath || cur.buyPath || def.buyPath,
          enabledSell:
            next.enabledSell != null ? Boolean(next.enabledSell) : cur.enabledSell !== false,
          enabledBuy:
            next.enabledBuy != null ? Boolean(next.enabledBuy) : cur.enabledBuy !== false,
          imageUrl: next.imageUrl != null ? String(next.imageUrl) : cur.imageUrl || '',
          sortOrder:
            next.sortOrder != null
              ? Number(next.sortOrder) || 0
              : cur.sortOrder != null
                ? cur.sortOrder
                : def.sortOrder,
        };
      });
    }

    if (Array.isArray(req.body.banners)) {
      doc.banners = req.body.banners
        .filter((b) => b && b.id)
        .map((b, index) => ({
          id: String(b.id),
          title: String(b.title || ''),
          subtitle: String(b.subtitle || ''),
          ctaText: String(b.ctaText || 'Sell Now'),
          ctaLink: String(b.ctaLink || '/'),
          imageUrl: String(b.imageUrl || ''),
          enabled: b.enabled !== false,
          sortOrder: b.sortOrder != null ? Number(b.sortOrder) || 0 : index + 1,
        }));
    }

    await doc.save();
    res.json(publicShape(doc));
  } catch (error) {
    next(error);
  }
};
