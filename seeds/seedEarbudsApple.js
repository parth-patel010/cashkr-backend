/**
 * Seed Apple AirPods / earbuds lineup for sell flow.
 * Missing vs typical catalog: 1st Gen, 2nd Gen, 3rd Gen, Pro 1st, Max
 * (site already had Pro 2nd / Pro 3rd / 4th — this upserts a clean full set).
 *
 * Base prices = estimated India buyback "upto" quotes (DeviceKart).
 * Run: npm run seed:earbuds:apple
 */
import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import Device from '../models/Device.js';
import Brand from '../models/Brand.js';

const conditionMultipliers = {
  likenew: 1.0,
  good: 0.95,
  average: 0.85,
  belowAverage: 0.7,
  fair: 0.72,
  poor: 0.55,
};

function slugify(text) {
  return String(text)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Images: Apple CDN + Wikimedia where stable.
 * Prices: realistic India buyback ceilings (good condition).
 */
const APPLE_EARBUDS = [
  {
    modelName: 'AirPods 1st Generation',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/AirPods.jpg/640px-AirPods.jpg',
    basePrice: 1800,
  },
  {
    modelName: 'AirPods 2nd Generation',
    imageUrl:
      'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MV7N2?wid=800&hei=800&fmt=jpeg&qlt=90&.v=1551489688005',
    basePrice: 2800,
  },
  {
    modelName: 'AirPods 3rd Generation',
    imageUrl:
      'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MME73?wid=800&hei=800&fmt=jpeg&qlt=90&.v=1632861342000',
    basePrice: 4500,
  },
  {
    modelName: 'AirPods 4',
    imageUrl:
      'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/airpods-4-select-202409?wid=800&hei=800&fmt=jpeg&qlt=90',
    basePrice: 7500,
  },
  {
    modelName: 'AirPods 4 with Active Noise Cancellation',
    imageUrl:
      'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/airpods-4-anc-select-202409?wid=800&hei=800&fmt=jpeg&qlt=90',
    basePrice: 9500,
  },
  {
    modelName: 'AirPods Pro 1st Generation',
    imageUrl:
      'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MWP22?wid=800&hei=800&fmt=jpeg&qlt=90&.v=1591632955000',
    basePrice: 5500,
  },
  {
    modelName: 'AirPods Pro 2nd Generation',
    imageUrl:
      'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MQD83?wid=800&hei=800&fmt=jpeg&qlt=90&.v=1660803972361',
    basePrice: 11000,
  },
  {
    modelName: 'AirPods Pro 3rd Generation',
    imageUrl:
      'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/airpods-pro-3-hero-select?wid=800&hei=800&fmt=jpeg&qlt=90',
    basePrice: 16000,
  },
  {
    modelName: 'AirPods Max',
    imageUrl:
      'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/airpods-max-select-silver-202011?wid=800&hei=800&fmt=jpeg&qlt=90&.v=1604709508000',
    basePrice: 22000,
  },
];

async function ensureAppleEarbudsBrand() {
  const existing = await Brand.findOne({ slug: 'apple' });
  if (!existing) {
    await Brand.create({
      name: 'Apple',
      slug: 'apple',
      logoUrl:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/1280px-Apple_logo_black.svg.png',
      color: '#111111',
      categories: ['mobile', 'laptop', 'tablet', 'mac', 'smartwatch', 'earbuds'],
      offers: ['sell', 'buy'],
      isActive: true,
      sortOrder: 1,
    });
    console.log('Created Apple brand with earbuds');
    return;
  }
  const cats = new Set(existing.categories || []);
  const offers = new Set(existing.offers || []);
  let changed = false;
  if (!cats.has('earbuds')) {
    cats.add('earbuds');
    changed = true;
  }
  if (!offers.has('sell')) {
    offers.add('sell');
    changed = true;
  }
  if (changed) {
    existing.categories = [...cats];
    existing.offers = [...offers];
    await existing.save();
    console.log('Updated Apple brand → earbuds / sell');
  }
}

async function run() {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
  if (!uri) {
    console.error('Missing MONGODB_URI in .env');
    process.exit(1);
  }

  await mongoose.connect(uri);
  console.log('Connected to MongoDB');
  await ensureAppleEarbudsBrand();

  let created = 0;
  let updated = 0;

  for (const item of APPLE_EARBUDS) {
    const slug = slugify(`apple-${item.modelName}`);
    const payload = {
      category: 'earbuds',
      brand: 'Apple',
      modelName: item.modelName,
      slug,
      imageUrl: item.imageUrl || '',
      description: `Sell your ${item.modelName} online with DeviceKart. Instant quote, free pickup.`,
      variants: [{ storage: 'Standard', basePrice: item.basePrice }],
      conditionMultipliers,
      isActive: true,
    };

    const existing = await Device.findOne({
      $or: [{ slug }, { category: 'earbuds', brand: 'Apple', modelName: item.modelName }],
    });

    if (existing) {
      existing.modelName = payload.modelName;
      existing.slug = payload.slug;
      existing.brand = 'Apple';
      existing.category = 'earbuds';
      existing.imageUrl = payload.imageUrl || existing.imageUrl;
      existing.variants = payload.variants;
      existing.isActive = true;
      await existing.save();
      updated += 1;
      console.log(`Updated: ${item.modelName} → ₹${item.basePrice}`);
    } else {
      await Device.create(payload);
      created += 1;
      console.log(`Created: ${item.modelName} → ₹${item.basePrice}`);
    }
  }

  console.log(`\nDone. Created: ${created}, Updated: ${updated}`);
  console.log('Pending filled: 1st Gen, 2nd Gen, 3rd Gen, Pro 1st, Max (+ cleaned Pro 2/3/4 names)');
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
