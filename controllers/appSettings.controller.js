import AppSettings, {
  APP_PAGE_DEFS,
  defaultAppSettingsPages,
} from '../models/AppSettings.js';

export const ensureAppSettings = async () => {
  let doc = await AppSettings.findOne({ key: 'default' });
  if (!doc) {
    doc = await AppSettings.create({
      key: 'default',
      pages: defaultAppSettingsPages(),
      requireAddressFor: ['sell', 'buy', 'repair'],
    });
    return doc;
  }

  // Merge any newly added page keys without wiping admin choices
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
  if (changed) await doc.save();
  return doc;
};

const publicShape = (doc) => ({
  pages: (doc.pages || []).map((p) => ({
    key: p.key,
    label: p.label,
    enabled: p.enabled !== false,
    restrictByPincode: Boolean(p.restrictByPincode),
  })),
  requireAddressFor: doc.requireAddressFor?.length
    ? doc.requireAddressFor
    : ['sell', 'buy', 'repair'],
  updatedAt: doc.updatedAt,
});

/** Public — mobile / website */
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

    if (Array.isArray(req.body.requireAddressFor)) {
      doc.requireAddressFor = req.body.requireAddressFor.map(String);
    }

    await doc.save();
    res.json(publicShape(doc));
  } catch (error) {
    next(error);
  }
};
