import Device from '../models/Device.js';

export const getBrands = async (req, res, next) => {
  try {
    const { category = 'mobile' } = req.query;

    const brands = await Device.aggregate([
      { $match: { category, isActive: true } },
      {
        $group: {
          _id: '$brand',
          modelCount: { $sum: 1 },
          maxPrice: { $max: { $max: '$variants.basePrice' } },
        },
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          brand: '$_id',
          modelCount: 1,
          maxPrice: 1,
          _id: 0,
        },
      },
    ]);

    res.json(brands);
  } catch (error) {
    next(error);
  }
};

export const getModels = async (req, res, next) => {
  try {
    const { brand, category = 'mobile' } = req.query;

    if (!brand) {
      return res.status(400).json({ message: 'Brand is required' });
    }

    const models = await Device.find(
      { brand: new RegExp(`^${brand}$`, 'i'), category, isActive: true },
      { modelName: 1, slug: 1, imageUrl: 1, variants: 1, processorFamily: 1, gpuType: 1, isGamingLaptop: 1, tier: 1 }
    ).sort({ 'variants.0.basePrice': -1 });

    const result = models.map(m => ({
      modelName: m.modelName,
      slug: m.slug,
      imageUrl: m.imageUrl,
      maxPrice: Math.max(...m.variants.map(v => v.basePrice)),
      minPrice: Math.min(...m.variants.map(v => v.basePrice)),
      variantCount: m.variants.length,
      processorFamily: m.processorFamily || '',
      gpuType: m.gpuType || '',
      isGamingLaptop: m.isGamingLaptop || false,
      tier: m.tier || '',
      ramOptions: [...new Set(m.variants.map(v => v.ram).filter(Boolean))],
    }));

    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const getDeviceBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const device = await Device.findOne({ slug, isActive: true });

    if (!device) {
      return res.status(404).json({ message: 'Device not found' });
    }

    res.json(device);
  } catch (error) {
    next(error);
  }
};

export const calculatePrice = async (req, res, next) => {
  try {
    const { slug } = req.body;

    const device = await Device.findOne({ slug, isActive: true });
    if (!device) {
      return res.status(404).json({ message: 'Device not found' });
    }

    // ─── LAPTOP calculation branch ───
    if (device.category === 'laptop') {
      const { ram, storage, yearBracket, condition, screenCondition, functionalIssues = [], accessories } = req.body;

      if (!ram || !storage || !yearBracket || !condition || !screenCondition || !accessories) {
        return res.status(400).json({ message: 'All laptop fields are required' });
      }

      const variant = device.variants.find(v => v.ram === ram && v.storage === storage);
      if (!variant) {
        return res.status(400).json({ message: 'Invalid RAM + Storage variant' });
      }

      const basePrice = variant.basePrice;
      const ageMult = device.ageMultipliers?.[yearBracket] || 1;
      const condMult = device.conditionMultipliers?.[condition] || 1;
      const screenMult = device.screenMultipliers?.[screenCondition] || 1;

      const ageAdjustment = Math.round(basePrice * ageMult) - basePrice;
      const condBase = Math.round(basePrice * ageMult);
      const conditionAdjustment = Math.round(condBase * condMult) - condBase;
      const screenBase = condBase + conditionAdjustment;
      const screenAdjustment = Math.round(screenBase * screenMult) - screenBase;

      let functionalDeduction = 0;
      for (const issue of functionalIssues) {
        if (device.functionalDeductions?.[issue]) {
          functionalDeduction += device.functionalDeductions[issue];
        }
      }

      const accBonus = device.accessoriesBonus?.[accessories] || 0;

      const rawFinal = screenBase + screenAdjustment - functionalDeduction + accBonus;
      const finalPrice = Math.max(Math.round(rawFinal / 100) * 100, 0);

      return res.json({
        basePrice,
        ageAdjustment,
        conditionAdjustment,
        screenAdjustment,
        functionalDeduction: -functionalDeduction,
        accessoriesBonus: accBonus,
        finalPrice,
      });
    }

    // ─── MOBILE calculation branch (existing) ───
    const { storage, condition, screenCondition, functionalIssues = [], accessories } = req.body;

    if (!storage || !condition || !screenCondition || !accessories) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const variant = device.variants.find(v => v.storage === storage);
    if (!variant) {
      return res.status(400).json({ message: 'Invalid storage variant' });
    }

    const basePrice = variant.basePrice;
    const conditionMult = device.conditionMultipliers[condition] || 1;
    const screenMult = device.screenMultipliers[screenCondition] || 1;

    let functionalDeduction = 0;
    for (const issue of functionalIssues) {
      if (device.functionalDeductions[issue]) {
        functionalDeduction += device.functionalDeductions[issue];
      }
    }

    const accBonus = device.accessoriesBonus[accessories] || 0;

    const rawPrice = (basePrice * conditionMult * screenMult) - functionalDeduction + accBonus;
    const finalPrice = Math.round(rawPrice / 100) * 100;

    const conditionAdjustment = Math.round(basePrice * conditionMult - basePrice);
    const screenAdjustment = Math.round(basePrice * conditionMult * screenMult - basePrice * conditionMult);

    res.json({
      basePrice,
      conditionAdjustment,
      screenAdjustment,
      functionalDeduction: -functionalDeduction,
      accessoriesBonus: accBonus,
      finalPrice: Math.max(finalPrice, 0),
    });
  } catch (error) {
    next(error);
  }
};

export const searchDevices = async (req, res, next) => {
  try {
    const { q } = req.query;

    if (!q || q.trim().length < 2) {
      return res.json([]);
    }

    const devices = await Device.find(
      {
        isActive: true,
        $or: [
          { modelName: { $regex: q, $options: 'i' } },
          { brand: { $regex: q, $options: 'i' } },
        ],
      },
      { category: 1, brand: 1, modelName: 1, slug: 1, imageUrl: 1, variants: 1 }
    )
      .limit(10)
      .sort({ modelName: 1 });

    const results = devices.map((d) => ({
      category: d.category,
      brand: d.brand,
      modelName: d.modelName,
      slug: d.slug,
      imageUrl: d.imageUrl,
      maxPrice: d.variants?.length
        ? Math.max(...d.variants.map((v) => v.basePrice))
        : 0,
    }));

    res.json(results);
  } catch (error) {
    next(error);
  }
};

const CATEGORY_PATHS = {
  mobile: '/sell-old-mobile-phones',
  tablet: '/sell-tablet',
  laptop: '/sell-old-laptops',
  mac: '/sell-imac',
};

export const getSitemapUrls = async (req, res, next) => {
  try {
    const devices = await Device.find({ isActive: true }, { brand: 1, slug: 1, category: 1 }).lean();
    const urls = [];
    const brandsSeen = new Set();

    for (const device of devices) {
      const pathPrefix = CATEGORY_PATHS[device.category];
      if (!pathPrefix) continue;
      const brandSlug = device.brand.toLowerCase();
      brandsSeen.add(`${device.category}:${brandSlug}`);
      urls.push(`${pathPrefix}/${brandSlug}/${device.slug}`);
    }

    for (const key of brandsSeen) {
      const [category, brandSlug] = key.split(':');
      urls.push(`${CATEGORY_PATHS[category]}/${brandSlug}`);
    }

    res.json({ urls: [...new Set(urls)] });
  } catch (error) {
    next(error);
  }
};
