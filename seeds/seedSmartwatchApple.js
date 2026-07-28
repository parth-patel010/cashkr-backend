/**
 * Seed Apple smartwatches grouped by model + variants (size / connectivity).
 *
 * Run: npm run seed:smartwatch:apple
 *
 * Model example:  Apple Watch Series 8 Aluminium
 * Variant example: 45mm GPS+Cellular  → stored in variants[].storage
 * Base price:      17700
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

const screenMultipliers = {
  noScratch: 1.0,
  minorScratch: 0.95,
  crackedWorks: 0.75,
  crackedBroken: 0.5,
  noIssue: 1.0,
  deadPixels: 0.82,
};

function slugify(text) {
  return String(text)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * One device document per model name; variants = size + connectivity.
 */
const APPLE_WATCH_MODELS = [
  {
    modelName: 'Apple Watch Series 6 Aluminium',
    imageUrl:
      'https://s3ng.cashify.in/cashify/product/img/xhdpi/8ad368df-60c1.jpg?dpr=1.0&q=70&w=320',
    variants: [
      { storage: '40mm GPS Only', basePrice: 7450 },
      { storage: '40mm GPS+Cellular', basePrice: 8910 },
      { storage: '44mm GPS Only', basePrice: 7610 },
      { storage: '44mm GPS+Cellular', basePrice: 9320 },
    ],
  },
  {
    modelName: 'Apple Watch Series 6 Stainless Steel',
    imageUrl:
      'https://s3ng.cashify.in/cashify/product/img/xhdpi/859814f0-d764.jpg?dpr=2&w=320',
    variants: [
      { storage: '40mm GPS+Cellular', basePrice: 8910 },
      { storage: '44mm GPS+Cellular', basePrice: 9230 },
    ],
  },
  {
    modelName: 'Apple Watch Series 7 Aluminium',
    imageUrl:
      'https://s3ng.cashify.in/cashify/product/img/xhdpi/4f138c61-e632.jpg?dpr=2&w=320',
    variants: [
      { storage: '41mm GPS Only', basePrice: 9480 },
      { storage: '41mm GPS+Cellular', basePrice: 11260 },
      { storage: '45mm GPS Only', basePrice: 10370 },
      { storage: '45mm GPS+Cellular', basePrice: 11990 },
    ],
  },
  {
    modelName: 'Apple Watch Series 7 Stainless Steel',
    imageUrl:
      'https://s3ng.cashify.in/cashify/product/img/xhdpi/651c3290-318a.jpg?w=200',
    variants: [
      { storage: '41mm GPS+Cellular', basePrice: 11990 },
      { storage: '45mm GPS+Cellular', basePrice: 12800 },
    ],
  },
  {
    modelName: 'Apple Watch Series 7 Titanium',
    imageUrl:
      'https://s3ng.cashify.in/cashify/product/img/xhdpi/ac6ccd72-b1c0.jpg?dpr=2&w=320',
    variants: [
      { storage: '41mm GPS+Cellular', basePrice: 12150 },
      { storage: '45mm GPS+Cellular', basePrice: 12960 },
    ],
  },
  {
    modelName: 'Apple Watch SE 2nd Gen',
    imageUrl:
      'https://s3ng.cashify.in/cashify/product/img/xhdpi/42c992a3-0112.jpg?dpr=2&w=320',
    variants: [
      { storage: '40mm GPS Only', basePrice: 8600 },
      { storage: '44mm GPS Only', basePrice: 9900 },
      { storage: '40mm GPS+Cellular', basePrice: 10700 },
      { storage: '44mm GPS+Cellular', basePrice: 11600 },
    ],
  },
  {
    modelName: 'Apple Watch Series 8 Aluminium',
    imageUrl:
      'https://s3ng.cashify.in/cashify/product/img/xhdpi/add7e112-6cfc.jpg?dpr=2&w=320',
    variants: [
      { storage: '41mm GPS Only', basePrice: 14200 },
      { storage: '45mm GPS Only', basePrice: 15800 },
      { storage: '41mm GPS+Cellular', basePrice: 16500 },
      { storage: '45mm GPS+Cellular', basePrice: 17700 },
    ],
  },
  {
    modelName: 'Apple Watch Series 5 Stainless Steel',
    imageUrl:
      'https://s3ng.cashify.in/cashify/product/img/xhdpi/c8308775-71c6.jpg?dpr=2&w=320',
    variants: [
      { storage: '40mm GPS+Cellular', basePrice: 7130 },
      { storage: '44mm GPS+Cellular', basePrice: 7450 },
    ],
  },
  {
    modelName: 'Apple Watch Series 9 Aluminium',
    imageUrl:
      'https://s3ng.cashify.in/cashify/product/img/xhdpi/dd0148d4-b8ed.jpg?dpr=2&w=320',
    variants: [
      { storage: '41mm GPS Only', basePrice: 17200 },
      { storage: '45mm GPS Only', basePrice: 17600 },
      { storage: '41mm GPS+Cellular', basePrice: 18900 },
      { storage: '45mm GPS+Cellular', basePrice: 19400 },
    ],
  },
  {
    modelName: 'Apple Watch Series 9 Stainless Steel',
    imageUrl:
      'https://s3ng.cashify.in/cashify/product/img/xhdpi/0e8f8bd4-55ca.jpg?dpr=2&w=320',
    variants: [
      { storage: '41mm GPS+Cellular', basePrice: 19000 },
    ],
  },
  {
    modelName: 'Apple Watch Series 10 Aluminium',
    imageUrl:
      'https://s3ng.cashify.in/cashify/product/img/xhdpi/90ad5a80-7974.jpg?dpr=2&w=320',
    variants: [
      { storage: '42mm GPS Only', basePrice: 21000 },
      { storage: '46mm GPS Only', basePrice: 21500 },
      { storage: '42mm GPS+Cellular', basePrice: 22400 },
      { storage: '46mm GPS+Cellular', basePrice: 21500 },
    ],
  },
  {
    modelName: 'Apple Watch Series 10 Titanium',
    imageUrl:
      'https://s3ng.cashify.in/cashify/product/img/xhdpi/f92c2dd9-2477.jpg?dpr=2&w=320',
    variants: [
      { storage: '42mm GPS+Cellular', basePrice: 25500 },
      { storage: '46mm GPS+Cellular', basePrice: 27000 },
    ],
  },
  {
    modelName: 'Apple Watch Series 11 Aluminium',
    imageUrl:
      'https://s3ng.cashify.in/cashify/product/img/xhdpi/0c2ea8da-5125.jpg?dpr=2&w=320',
    variants: [
      { storage: '42mm GPS Only', basePrice: 28000 },
      { storage: '46mm GPS Only', basePrice: 29800 },
      { storage: '42mm GPS+Cellular', basePrice: 33200 },
      { storage: '46mm GPS+Cellular', basePrice: 35200 },
    ],
  },
  {
    modelName: 'Apple Watch Series 11 Titanium',
    imageUrl:
      'https://s3ng.cashify.in/cashify/product/img/xhdpi/26efba0e-043f.jpg?dpr=2&w=320',
    variants: [
      { storage: '42mm GPS+Cellular', basePrice: 35700 },
      { storage: '46mm GPS+Cellular', basePrice: 37700 },
    ],
  },
  {
    modelName: 'Apple Watch SE 3',
    imageUrl:
      'https://s3ng.cashify.in/cashify/product/img/xhdpi/42c992a3-0112.jpg?dpr=2&w=320',
    variants: [
      { storage: '40mm GPS Only', basePrice: 13600 },
      { storage: '44mm GPS Only', basePrice: 14800 },
      { storage: '40mm GPS+Cellular', basePrice: 17700 },
      { storage: '44mm GPS+Cellular', basePrice: 19300 },
    ],
  },
];

async function ensureAppleSmartwatchBrand() {
  const existing = await Brand.findOne({ slug: 'apple' });
  if (!existing) {
    await Brand.create({
      name: 'Apple',
      slug: 'apple',
      logoUrl:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/1280px-Apple_logo_black.svg.png',
      color: '#111111',
      categories: ['mobile', 'laptop', 'tablet', 'mac', 'smartwatch'],
      offers: ['sell', 'buy'],
      isActive: true,
      sortOrder: 1,
    });
    console.log('Created Apple brand with smartwatch category');
    return;
  }

  const cats = new Set(existing.categories || []);
  const offers = new Set(existing.offers || []);
  let changed = false;
  if (!cats.has('smartwatch')) {
    cats.add('smartwatch');
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
    console.log('Updated Apple brand → added smartwatch / sell');
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

  await ensureAppleSmartwatchBrand();

  let created = 0;
  let updated = 0;

  for (const model of APPLE_WATCH_MODELS) {
    const slug = slugify(model.modelName);
    const payload = {
      category: 'smartwatch',
      brand: 'Apple',
      modelName: model.modelName,
      slug,
      imageUrl: model.imageUrl || '',
      description: `Sell your ${model.modelName} online with DeviceKart. Instant quote, free pickup.`,
      variants: model.variants.map((v) => ({
        storage: v.storage,
        basePrice: v.basePrice,
      })),
      conditionMultipliers,
      screenMultipliers,
      isActive: true,
    };

    const existing = await Device.findOne({ slug });
    if (existing) {
      existing.modelName = payload.modelName;
      existing.brand = payload.brand;
      existing.category = payload.category;
      existing.imageUrl = payload.imageUrl || existing.imageUrl;
      existing.variants = payload.variants;
      existing.isActive = true;
      await existing.save();
      updated += 1;
      console.log(`Updated: ${model.modelName} (${model.variants.length} variants)`);
    } else {
      await Device.create(payload);
      created += 1;
      console.log(`Created: ${model.modelName} (${model.variants.length} variants)`);
    }
  }

  console.log(`\nDone. Created: ${created}, Updated: ${updated}`);
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
