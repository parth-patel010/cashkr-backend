import Device from '../models/Device.js';
import Brand from '../models/Brand.js';
import { calculateLaptopPrice } from '../utils/laptopPriceCalculator.js';

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

    // Device counts for sell offers only — every category stored on Device
    const deviceCategories = [
      'mobile',
      'laptop',
      'tablet',
      'mac',
      'tv',
      'earbuds',
      'refrigerator',
      'smartwatch',
      'gaming',
    ];
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
          String(row._id).trim().toLowerCase(),
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
        const stats = modelCounts[String(b.name).trim().toLowerCase()] || {
          modelCount: 0,
          maxPrice: 0,
        };
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

    // ─── LAPTOP / MAC — same calculator as website (overrides + component math) ───
    if (device.category === 'laptop' || device.category === 'mac') {
      const {
        ram,
        storage,
        processor,
        yearBracket,
        powerStatus,
        screenSize,
        hasGpu,
        isGpuWorking,
        functionalIssues = [],
        screenIssues = [],
        bodyIssues = [],
        accessories,
      } = req.body;

      if (!yearBracket) {
        return res.status(400).json({ message: 'yearBracket is required' });
      }

      const deviceObj = device.toObject ? device.toObject() : device;
      // Some catalog rows use empty ram + "Standard" storage — still quote them.
      const resolvedRam = ram || deviceObj.variants?.[0]?.ram || '';
      const resolvedStorage = storage || deviceObj.variants?.[0]?.storage || '';
      const result = calculateLaptopPrice(deviceObj, {
        ram: resolvedRam,
        storage: resolvedStorage,
        processor: processor || deviceObj.variants?.[0]?.processor || deviceObj.processorFamily || '',
        yearBracket,
        powerStatus: powerStatus || 'on',
        screenSize: screenSize || '14-15',
        hasGpu: !!hasGpu,
        isGpuWorking: !!isGpuWorking,
        functionalIssues,
        screenIssues,
        bodyIssues,
        accessories: Array.isArray(accessories)
          ? accessories
          : accessories
            ? [accessories]
            : ['none'],
      });

      if (!result) {
        return res.status(400).json({ message: 'Unable to calculate laptop price' });
      }

      return res.json({
        ...result,
        totalDeductionPct:
          result.basePrice > 0
            ? Math.round(((result.basePrice - result.finalPrice) / result.basePrice) * 100)
            : 0,
        breakdown: {
          ageAdjustment: result.ageAdjustment || 0,
          powerDeduction: result.powerDeduction || 0,
          functionalDeduction: result.functionalDeduction || 0,
          screenDeduction: result.screenDeduction || 0,
          bodyDeduction: result.bodyDeduction || 0,
          accessoriesBonus: result.accessoriesBonus || 0,
          priceSource: result.priceSource || 'calculator',
          internalPrice: result.internalPrice ?? null,
          cashifyEstimate: result.cashifyEstimate ?? null,
          pricingMethod: result.pricingMethod ?? null,
          specTier: result.specTier ?? null,
          bbmp: result.bbmp ?? null,
        },
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

    if (!q || String(q).trim().length < 2) {
      return res.json([]);
    }

    const raw = String(q).trim();
    const normalized = raw
      .toLowerCase()
      .replace(/[_/-]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    const brandAliases = {
      motorola: ['motorola', 'moto'],
      moto: ['motorola', 'moto'],
      apple: ['apple', 'iphone'],
      iphone: ['apple', 'iphone'],
      samsung: ['samsung', 'galaxy'],
      galaxy: ['samsung', 'galaxy'],
      xiaomi: ['xiaomi', 'redmi', 'poco', 'mi'],
      redmi: ['xiaomi', 'redmi', 'poco', 'mi'],
      poco: ['xiaomi', 'redmi', 'poco', 'mi'],
      mi: ['xiaomi', 'redmi', 'poco', 'mi'],
      google: ['google', 'pixel'],
      pixel: ['google', 'pixel'],
      oneplus: ['oneplus', 'one plus'],
      realme: ['realme'],
      vivo: ['vivo', 'iqoo'],
      iqoo: ['vivo', 'iqoo'],
      oppo: ['oppo'],
      nothing: ['nothing'],
      dell: ['dell'],
      hp: ['hp'],
      lenovo: ['lenovo'],
      asus: ['asus'],
      acer: ['acer'],
      microsoft: ['microsoft', 'surface'],
      surface: ['microsoft', 'surface'],
      msi: ['msi'],
      razer: ['razer'],
    };

    const brandTokenSet = new Set([
      ...Object.keys(brandAliases),
      ...Object.values(brandAliases).flat(),
    ]);

    const tokens = normalized
      .split(' ')
      .filter((t) => (t.length >= 2 || /^\d+$/.test(t)) && !['the', 'and', 'for', 'with', 'gb', 'ram', 'phone', 'mobile'].includes(t));

    const expanded = new Set();
    for (const t of tokens) {
      expanded.add(t);
      const aliases = brandAliases[t];
      if (aliases) aliases.forEach((a) => expanded.add(a));
    }

    // Keep model family tokens (edge/nord/note/galaxy/pixel/iphone series) when present
    for (const family of ['edge', 'nord', 'note', 'galaxy', 'pixel', 'iphone', 'reno', 'phone']) {
      if (normalized.includes(family)) expanded.add(family);
    }

    const orClauses = [
      { modelName: { $regex: raw, $options: 'i' } },
      { brand: { $regex: raw, $options: 'i' } },
      { slug: { $regex: raw.replace(/\s+/g, '-'), $options: 'i' } },
    ];

    for (const t of expanded) {
      const escaped = String(t).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      orClauses.push({ modelName: { $regex: escaped, $options: 'i' } });
      orClauses.push({ brand: { $regex: escaped, $options: 'i' } });
      orClauses.push({ slug: { $regex: escaped, $options: 'i' } });
    }

    const category = req.query.category;
    const findFilter = {
      isActive: true,
      $or: orClauses,
    };
    if (category && category !== 'all') findFilter.category = category;

    const devices = await Device.find(
      findFilter,
      { category: 1, brand: 1, modelName: 1, slug: 1, imageUrl: 1, variants: 1, searchCount: 1 },
    )
      .limit(60)
      .sort({ modelName: 1 })
      .lean();

    const scoreDevice = (d) => {
      const hay = `${d.brand || ''} ${d.modelName || ''} ${d.slug || ''}`.toLowerCase();
      let score = 0;
      let keywordHits = 0;
      for (const t of expanded) {
        if (!hay.includes(t)) continue;
        if (/^\d+$/.test(t)) score += 4;
        else if (t.length >= 3) score += 3;
        else score += 1;
        if (!brandTokenSet.has(t)) keywordHits += 1;
      }
      if (hay.includes(normalized)) score += 10;
      // Prefer models that hit more non-brand keywords (edge + 50 + pro)
      score += keywordHits * 2;
      return score;
    };

    const ranked = devices
      .map((d) => ({ d, score: scoreDevice(d) }))
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score || (b.d.searchCount || 0) - (a.d.searchCount || 0) || a.d.modelName.localeCompare(b.d.modelName))
      .slice(0, 15)
      .map(({ d }) => ({
        category: d.category,
        brand: d.brand,
        modelName: d.modelName,
        slug: d.slug,
        imageUrl: d.imageUrl,
        variants: Array.isArray(d.variants)
          ? d.variants.map((v) => ({
              storage: v.storage || '',
              ram: v.ram || '',
              basePrice: v.basePrice || 0,
            }))
          : [],
        maxPrice: d.variants?.length
          ? Math.max(...d.variants.map((v) => v.basePrice || 0))
          : 0,
      }));

    res.json(ranked);
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
  gaming: '/sell/gaming',
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

/** Increment searchCount when a user picks a device from search results. */
export const recordSearch = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const device = await Device.findOneAndUpdate(
      { slug, isActive: true },
      { $inc: { searchCount: 1 } },
      { new: true, projection: { slug: 1, searchCount: 1 } },
    );

    if (!device) {
      return res.status(404).json({ message: 'Device not found' });
    }

    res.json({ slug: device.slug, searchCount: device.searchCount });
  } catch (error) {
    next(error);
  }
};

/** Top models by searchCount (popular search chips). Falls back to quizCount / price. */
export const getPopularSearches = async (req, res, next) => {
  try {
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 5, 1), 12);
    const category = req.query.category;

    const filter = { isActive: true };
    if (category && category !== 'all') filter.category = category;

    const bySearch = await Device.find(filter)
      .sort({ searchCount: -1, quizCount: -1, 'variants.0.basePrice': -1 })
      .limit(limit)
      .lean();

    const hasSearchData = bySearch.some((d) => (d.searchCount || 0) > 0);
    const source = hasSearchData
      ? bySearch
      : await Device.find(filter)
          .sort({ quizCount: -1, 'variants.0.basePrice': -1 })
          .limit(limit)
          .lean();

    res.json(
      source.map((d) => ({
        label: d.modelName,
        brand: d.brand,
        slug: d.slug,
        category: d.category,
        imageUrl: d.imageUrl || '',
        searchCount: d.searchCount || 0,
        sellPath: `${CATEGORY_PATHS[d.category] || '/sell-old-mobile-phones'}/${String(d.brand || '').toLowerCase()}/${d.slug}`,
      })),
    );
  } catch (error) {
    next(error);
  }
};



/** Top mobiles by completed sell orders (leads). Fallback: most quoted / price. */
export const getTopSellingMobiles = async (req, res, next) => {
  try {
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 5, 1), 10);
    const Order = (await import("../models/Order.js")).default;

    const popular = await Order.aggregate([
      {
        $match: {
          status: "completed",
          "device.category": "mobile",
          "device.slug": { $exists: true, $ne: "" },
        },
      },
      {
        $group: {
          _id: "$device.slug",
          sellCount: { $sum: 1 },
          brand: { $first: "$device.brand" },
          modelName: { $first: "$device.modelName" },
          storage: { $first: "$device.storage" },
          ram: { $first: "$device.ram" },
          maxFinal: { $max: "$priceBreakdown.finalPrice" },
        },
      },
      { $sort: { sellCount: -1 } },
      { $limit: limit },
    ]);

    const mapRow = (d, extras = {}) => {
      const variants = d.variants || [];
      const prices = variants.map((v) => v.basePrice).filter((n) => typeof n === "number");
      const maxPrice = prices.length ? Math.max(...prices) : extras.maxFinal || 0;
      const topVariant = variants
        .slice()
        .sort((a, b) => (b.basePrice || 0) - (a.basePrice || 0))[0];
      const ram = extras.ram || topVariant?.ram || "";
      const storage = extras.storage || topVariant?.storage || "";
      return {
        brand: d.brand || extras.brand || "",
        modelName: d.modelName || extras.modelName || "",
        slug: d.slug,
        imageUrl: d.imageUrl || "",
        ram,
        storage,
        maxPrice,
        sellCount: extras.sellCount || 0,
        sellPath: `${CATEGORY_PATHS.mobile}/${String(d.brand || extras.brand || "").toLowerCase()}/${d.slug}`,
      };
    };

    if (popular.length) {
      const slugs = popular.map((p) => p._id);
      const devices = await Device.find({
        isActive: true,
        category: "mobile",
        slug: { $in: slugs },
      }).lean();
      const bySlug = Object.fromEntries(devices.map((d) => [d.slug, d]));
      const rows = popular
        .map((p) => {
          const d = bySlug[p._id];
          if (!d) return null;
          return mapRow(d, {
            sellCount: p.sellCount,
            brand: p.brand,
            modelName: p.modelName,
            storage: p.storage,
            ram: p.ram,
            maxFinal: p.maxFinal,
          });
        })
        .filter(Boolean);
      if (rows.length) return res.json(rows);
    }

    // Fallback: quiz / price ranked mobiles
    const fallback = await Device.find({ isActive: true, category: "mobile" })
      .sort({ quizCount: -1, "variants.0.basePrice": -1 })
      .limit(limit)
      .lean();
    res.json(fallback.map((d) => mapRow(d, { sellCount: d.quizCount || 0 })));
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
