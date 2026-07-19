import CustomPricingItem, { CUSTOM_PRICING_SEED } from '../models/CustomPricingItem.js';

export const ensureCustomPricingSeed = async () => {
  const count = await CustomPricingItem.countDocuments();
  if (count > 0) return;
  await CustomPricingItem.insertMany(
    CUSTOM_PRICING_SEED.map((item) => ({
      ...item,
      defaultLabel: item.label,
      priceAdjustment: 0,
      isActive: true,
    })),
  );
};

export const adminListCustomPricing = async (req, res, next) => {
  try {
    await ensureCustomPricingSeed();
    const items = await CustomPricingItem.find().sort({ sortOrder: 1, category: 1 }).lean();
    res.json({ items });
  } catch (error) {
    next(error);
  }
};

export const adminBulkSaveCustomPricing = async (req, res, next) => {
  try {
    const items = Array.isArray(req.body.items) ? req.body.items : [];
    if (!items.length) return res.status(400).json({ message: 'No items to save' });

    await Promise.all(
      items.map((item) =>
        CustomPricingItem.findOneAndUpdate(
          { key: item.key },
          {
            $set: {
              priceAdjustment: Number(item.priceAdjustment) || 0,
              isActive: item.isActive !== false,
              label: item.label || undefined,
            },
          },
          { new: true },
        ),
      ),
    );

    const updated = await CustomPricingItem.find().sort({ sortOrder: 1 }).lean();
    res.json({ items: updated, message: 'Custom pricing saved' });
  } catch (error) {
    next(error);
  }
};

export const listCustomPricingPublic = async (req, res, next) => {
  try {
    await ensureCustomPricingSeed();
    const items = await CustomPricingItem.find({ isActive: true })
      .sort({ sortOrder: 1 })
      .select('key category label priceAdjustment sortOrder')
      .lean();
    res.json({ items });
  } catch (error) {
    next(error);
  }
};
