import Device from '../models/Device.js';
import Brand from '../models/Brand.js';

/** Map API category aliases used by the app/admin */
const CATEGORY_ALIASES = {
  phone: 'mobile',
  phones: 'mobile',
  mobile: 'mobile',
};

export const getBrands = async (req, res, next) => {
  try {
    const raw = req.query.category || 'mobile';
    const category = CATEGORY_ALIASES[raw] || raw;
    const offer = req.query.offer || 'sell';

    // Prefer Brand catalog for this category + offer
    const brandQuery = {
      isActive: true,
      categories: category,
    };
    if (offer && offer !== 'all') {
      brandQuery.offers = offer;
    }

    const catalog = await Brand.find(brandQuery)
      .sort({ sortOrder: 1, name: 1 })
      .lean();

    // Device counts for sell offers only
    const deviceCategories = ['mobile', 'laptop', 'tablet', 'mac'];
    let modelCounts = {};

    if (deviceCategories.includes(category) && offer === 'sell') {
      const grouped = await Device.aggregate([
        { $match: { category, isActive: true } },
        {
          $group: {
            _id: '$brand',
            modelCount: { $sum: 1 },
            maxPrice: { $max: { $max: '$variants.basePrice' } },
          },
        },
      ]);
      modelCounts = Object.fromEntries(
        grouped.map((row) => [
          String(row._id).toLowerCase(),
          { modelCount: row.modelCount, maxPrice: row.maxPrice },
        ]),
      );
    }

    if (offer === 'buy') {
      const BuyProduct = (await import('../models/BuyProduct.js')).default;
      const grouped = await BuyProduct.aggregate([
        { $match: { category, isActive: true } },
        {
          $group: {
            _id: '$brand',
            modelCount: { $sum: 1 },
            maxPrice: { $max: { $max: '$conditions.price' } },
          },
        },
      ]);
      modelCounts = Object.fromEntries(
        grouped.map((row) => [
          String(row._id).toLowerCase(),
          { modelCount: row.modelCount, maxPrice: row.maxPrice },
        ]),
      );
    }

    if (offer === 'repair') {
      const RepairService = (await import('../models/RepairService.js')).default;
      const grouped = await RepairService.aggregate([
        { $match: { category, isActive: true } },
        {
          $group: {
            _id: '$brand',
            modelCount: { $sum: 1 },
            maxPrice: { $max: { $max: '$issues.price' } },
          },
        },
      ]);
      modelCounts = Object.fromEntries(
        grouped.map((row) => [
          String(row._id).toLowerCase(),
          { modelCount: row.modelCount, maxPrice: row.maxPrice },
        ]),
      );
    }

    if (catalog.length > 0) {
      const brands = catalog.map((b) => {
        const stats = modelCounts[b.name.toLowerCase()] || { modelCount: 0, maxPrice: 0 };
        return {
          brand: b.name,
          slug: b.slug,
          logoUrl: b.logoUrl || '',
          color: b.color || '#2F6BFF',
          modelCount: stats.modelCount,
          maxPrice: stats.maxPrice || 0,
        };
      });
      return res.json(brands);
    }

    // Fallback: aggregate sell devices if Brand catalog empty
    if (offer !== 'sell' || !deviceCategories.includes(category)) {
      return res.json([]);
    }

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
      {
        modelName: 1,
        slug: 1,
        imageUrl: 1,
        videoUrl: 1,
        description: 1,
        variants: 1,
        processorFamily: 1,
        gpuType: 1,
        isGamingLaptop: 1,
        tier: 1,
      },
    ).sort({ 'variants.0.basePrice': -1 });

    const result = models.map((m) => ({
      modelName: m.modelName,
      slug: m.slug,
      imageUrl: m.imageUrl,
      videoUrl: m.videoUrl || '',
      description: m.description || '',
      maxPrice: Math.max(...m.variants.map((v) => v.basePrice)),
      minPrice: Math.min(...m.variants.map((v) => v.basePrice)),
      variantCount: m.variants.length,
      processorFamily: m.processorFamily || '',
      gpuType: m.gpuType || '',
      isGamingLaptop: m.isGamingLaptop || false,
      tier: m.tier || '',
      ramOptions: [...new Set(m.variants.map((v) => v.ram).filter(Boolean))],
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
  tv: '/sell/tv',
  earbuds: '/sell/earbuds',
  refrigerator: '/sell/refrigerator',
  smartwatch: '/sell/smartwatch',
};

const mapQuotedDevice = (d, quoteCount) => {
  const variants = d.variants || [];
  const prices = variants.map((v) => v.basePrice).filter((n) => typeof n === 'number');
  return {
    category: d.category,
    brand: d.brand,
    modelName: d.modelName,
    slug: d.slug,
    imageUrl: d.imageUrl || '',
    maxPrice: prices.length ? Math.max(...prices) : 0,
    quoteCount: quoteCount ?? d.quizCount ?? 0,
    sellPath: `${CATEGORY_PATHS[d.category] || '/sell-old-mobile-phones'}/${String(d.brand || '').toLowerCase()}/${d.slug}`,
  };
};

/** Rank devices by quiz starts; fall back to completed sell orders, then top price. */
export const getMostQuoted = async (req, res, next) => {
  try {
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 8, 1), 24);
    const category = req.query.category;

    const filter = { isActive: true };
    if (category && category !== 'all') filter.category = category;

    const byQuiz = await Device.find(filter)
      .sort({ quizCount: -1, 'variants.0.basePrice': -1 })
      .limit(limit)
      .lean();

    const hasQuizData = byQuiz.some((d) => (d.quizCount || 0) > 0);
    if (hasQuizData) {
      return res.json(byQuiz.map((d) => mapQuotedDevice(d)));
    }

    // Cold start: use sell-order frequency as "quoted" proxy until quizzes accumulate
    const Order = (await import('../models/Order.js')).default;
    const orderMatch = {
      status: { $nin: ['cancelled', 'failed'] },
      'device.slug': { $exists: true, $ne: '' },
    };
    if (category && category !== 'all') orderMatch['device.category'] = category;

    const popular = await Order.aggregate([
      { $match: orderMatch },
      { $group: { _id: '$device.slug', quoteCount: { $sum: 1 } } },
      { $sort: { quoteCount: -1 } },
      { $limit: limit },
    ]);

    if (popular.length) {
      const slugs = popular.map((p) => p._id);
      const countBySlug = Object.fromEntries(popular.map((p) => [p._id, p.quoteCount]));
      const devices = await Device.find({ ...filter, slug: { $in: slugs } }).lean();
      const bySlug = Object.fromEntries(devices.map((d) => [d.slug, d]));
      const ordered = slugs.map((slug) => bySlug[slug]).filter(Boolean);
      if (ordered.length) {
        return res.json(ordered.map((d) => mapQuotedDevice(d, countBySlug[d.slug])));
      }
    }

    // Final fallback: highest listed max price
    const priced = await Device.find(filter).limit(limit * 3).lean();
    const ranked = priced
      .map((d) => mapQuotedDevice(d, 0))
      .sort((a, b) => b.maxPrice - a.maxPrice)
      .slice(0, limit);

    res.json(ranked);
  } catch (error) {
    next(error);
  }
};

/** Increment quizCount when a user opens the condition quiz for a device. */
export const recordQuiz = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const device = await Device.findOneAndUpdate(
      { slug, isActive: true },
      { $inc: { quizCount: 1 } },
      { new: true, projection: { slug: 1, quizCount: 1 } },
    );

    if (!device) {
      return res.status(404).json({ message: 'Device not found' });
    }

    res.json({ slug: device.slug, quizCount: device.quizCount });
  } catch (error) {
    next(error);
  }
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
