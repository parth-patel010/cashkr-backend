import Brand, { BRAND_CATEGORIES, BRAND_OFFERS } from '../models/Brand.js';
import { uploadBufferToCloudinary } from '../middleware/upload.js';

const slugify = (name = '') =>
  String(name)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const normalizeList = (value) =>
  Array.isArray(value)
    ? value
    : String(value || '')
        .split(',')
        .map((c) => c.trim())
        .filter(Boolean);

export const listBrands = async (req, res, next) => {
  try {
    const { category, search, active, offer } = req.query;
    const query = {};

    if (category) query.categories = category;
    if (offer) query.offers = offer;
    if (active === 'true') query.isActive = true;
    if (active === 'false') query.isActive = false;
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const brands = await Brand.find(query).sort({ sortOrder: 1, name: 1 }).lean();
    res.json({ brands, categories: BRAND_CATEGORIES, offers: BRAND_OFFERS });
  } catch (error) {
    next(error);
  }
};

export const listBrandLogos = async (req, res, next) => {
  try {
    const brands = await Brand.find({ logoUrl: { $ne: '' } })
      .select('name logoUrl')
      .sort({ name: 1 })
      .lean();

    const unique = [];
    const seen = new Set();
    for (const brand of brands) {
      if (!brand.logoUrl || seen.has(brand.logoUrl)) continue;
      seen.add(brand.logoUrl);
      unique.push({ name: brand.name, logoUrl: brand.logoUrl });
    }

    res.json({ logos: unique });
  } catch (error) {
    next(error);
  }
};

export const getBrandById = async (req, res, next) => {
  try {
    const brand = await Brand.findById(req.params.id);
    if (!brand) return res.status(404).json({ message: 'Brand not found' });
    res.json(brand);
  } catch (error) {
    next(error);
  }
};

export const createBrand = async (req, res, next) => {
  try {
    const {
      name,
      logoUrl = '',
      color = '#2F6BFF',
      categories = [],
      offers = ['sell'],
      sortOrder = 0,
      isActive = true,
      slug,
    } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({ message: 'Brand name is required' });
    }

    const cats = normalizeList(categories);
    const offerList = normalizeList(offers);

    if (!cats.length) {
      return res.status(400).json({ message: 'Select at least one category' });
    }
    if (!offerList.length) {
      return res.status(400).json({ message: 'Select at least one offer (sell, buy, repair)' });
    }

    const invalid = cats.filter((c) => !BRAND_CATEGORIES.includes(c));
    if (invalid.length) {
      return res.status(400).json({ message: `Invalid categories: ${invalid.join(', ')}` });
    }
    const invalidOffers = offerList.filter((o) => !BRAND_OFFERS.includes(o));
    if (invalidOffers.length) {
      return res.status(400).json({ message: `Invalid offers: ${invalidOffers.join(', ')}` });
    }

    const brand = await Brand.create({
      name: name.trim(),
      slug: slug?.trim() || slugify(name),
      logoUrl: logoUrl || '',
      color,
      categories: cats,
      offers: offerList,
      sortOrder: Number(sortOrder) || 0,
      isActive: Boolean(isActive),
    });

    res.status(201).json(brand);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Brand slug already exists' });
    }
    next(error);
  }
};

export const updateBrand = async (req, res, next) => {
  try {
    const updates = { ...req.body };

    if (updates.name && !updates.slug) {
      updates.slug = slugify(updates.name);
    }

    if (updates.categories) {
      const cats = normalizeList(updates.categories);
      const invalid = cats.filter((c) => !BRAND_CATEGORIES.includes(c));
      if (invalid.length) {
        return res.status(400).json({ message: `Invalid categories: ${invalid.join(', ')}` });
      }
      if (!cats.length) {
        return res.status(400).json({ message: 'Select at least one category' });
      }
      updates.categories = cats;
    }

    if (updates.offers) {
      const offerList = normalizeList(updates.offers);
      const invalidOffers = offerList.filter((o) => !BRAND_OFFERS.includes(o));
      if (invalidOffers.length) {
        return res.status(400).json({ message: `Invalid offers: ${invalidOffers.join(', ')}` });
      }
      if (!offerList.length) {
        return res.status(400).json({ message: 'Select at least one offer' });
      }
      updates.offers = offerList;
    }

    const brand = await Brand.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!brand) return res.status(404).json({ message: 'Brand not found' });
    res.json(brand);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Brand slug already exists' });
    }
    next(error);
  }
};

export const deleteBrand = async (req, res, next) => {
  try {
    const brand = await Brand.findByIdAndDelete(req.params.id);
    if (!brand) return res.status(404).json({ message: 'Brand not found' });
    res.json({ message: 'Brand deleted' });
  } catch (error) {
    next(error);
  }
};

export const uploadBrandLogo = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Image file is required' });
    }

    const result = await uploadBufferToCloudinary(req.file.buffer);
    res.status(201).json({
      logoUrl: result.secure_url,
      publicId: result.public_id,
    });
  } catch (error) {
    next(error);
  }
};

export const uploadMediaVideo = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Video file is required (max 500KB)' });
    }
    if (req.file.size > 500 * 1024) {
      return res.status(400).json({ message: 'Video must be 500KB or less' });
    }

    const result = await uploadBufferToCloudinary(
      req.file.buffer,
      'devicekart/videos',
      'video',
    );
    res.status(201).json({
      videoUrl: result.secure_url,
      publicId: result.public_id,
    });
  } catch (error) {
    next(error);
  }
};
