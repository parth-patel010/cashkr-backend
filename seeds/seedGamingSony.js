/**
 * Seed Sony PlayStation gaming consoles.
 * Model = console line (PS4, PS4 Slim, …); variant = storage / edition (in variants[].storage).
 * All base prices = Cashify list − ₹1,000.
 *
 * Run: npm run seed:gaming:sony
 */
import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import Device from '../models/Device.js';
import Brand from '../models/Brand.js';

const PRICE_OFFSET = 1000;

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

function price(n) {
  return Math.max(0, Number(n) - PRICE_OFFSET);
}

/**
 * Model names keep "PS3/PS4/PS5" so the sell-page PlayStation Series filter matches.
 */
const PLAYSTATION_MODELS = [
  {
    modelName: 'PS4',
    imageUrl:
      'https://s3ng.cashify.in/cashify/product/img/xhdpi/15582b59-5a6d.jpg?dpr=2&w=320',
    variants: [
      { storage: '500 GB', basePrice: price(16250) },
      { storage: '1 TB', basePrice: price(16550) },
      { storage: '2 TB', basePrice: price(16950) },
    ],
  },
  {
    modelName: 'PS4 Slim',
    imageUrl:
      'https://s3ng.cashify.in/cashify/product/img/xhdpi/04d9a962-daae.jpg?dpr=2&w=320',
    variants: [
      { storage: '500 GB', basePrice: price(16850) },
      { storage: '1 TB', basePrice: price(18250) },
      { storage: '2 TB', basePrice: price(18550) },
    ],
  },
  {
    modelName: 'PS4 Pro',
    imageUrl:
      'https://s3ng.cashify.in/cashify/product/img/xhdpi/a54a0ea0-f694.jpg?dpr=2&w=320',
    variants: [
      { storage: '1 TB', basePrice: price(21250) },
      { storage: '2 TB', basePrice: price(22050) },
    ],
  },
  {
    modelName: 'PS3 Super Slim',
    imageUrl:
      'https://s3ng.cashify.in/cashify/product/img/xhdpi/a7007fc3-5a07.jpg?dpr=2&w=320',
    variants: [
      { storage: '120 GB', basePrice: price(3750) },
      { storage: '160 GB', basePrice: price(4200) },
      { storage: '250 GB', basePrice: price(4600) },
      { storage: '320 GB', basePrice: price(5100) },
      { storage: '500 GB', basePrice: price(5550) },
      { storage: '1 TB', basePrice: price(6050) },
    ],
  },
  {
    modelName: 'PS3 Slim',
    imageUrl:
      'https://s3ng.cashify.in/cashify/product/img/xhdpi/60c8897f-1e0d.jpg?dpr=2&w=320',
    variants: [
      { storage: '120 GB', basePrice: price(3350) },
      { storage: '160 GB', basePrice: price(3550) },
      { storage: '250 GB', basePrice: price(3900) },
      { storage: '320 GB', basePrice: price(4450) },
      { storage: '500 GB', basePrice: price(4750) },
    ],
  },
  {
    modelName: 'PS5',
    imageUrl:
      'https://s3ng.cashify.in/cashify/product/img/xhdpi/4f3accb9-538a.jpg?dpr=2&w=320',
    variants: [
      { storage: '825 GB', basePrice: price(39250) },
      { storage: 'Digital Edition 825 GB', basePrice: price(37950) },
    ],
  },
  {
    modelName: 'PS5 Slim',
    imageUrl:
      'https://s3ng.cashify.in/cashify/product/img/xhdpi/4f3accb9-538a.jpg?dpr=2&w=320',
    variants: [
      { storage: 'Digital Edition 1 TB', basePrice: price(37650) },
      { storage: 'Disc Edition 1 TB', basePrice: price(42250) },
    ],
  },
];

async function ensureSonyGamingBrand() {
  const existing = await Brand.findOne({ slug: 'sony' });
  if (!existing) {
    await Brand.create({
      name: 'Sony',
      slug: 'sony',
      logoUrl: '',
      color: '#000000',
      categories: ['gaming', 'tv'],
      offers: ['sell', 'buy'],
      isActive: true,
      sortOrder: 10,
    });
    console.log('Created Sony brand with gaming category');
    return;
  }

  const cats = new Set(existing.categories || []);
  const offers = new Set(existing.offers || []);
  let changed = false;
  if (!cats.has('gaming')) {
    cats.add('gaming');
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
    console.log('Updated Sony brand → added gaming / sell');
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
  console.log(`Applying −₹${PRICE_OFFSET} to all listed base prices\n`);

  await ensureSonyGamingBrand();

  let created = 0;
  let updated = 0;

  for (const model of PLAYSTATION_MODELS) {
    const slug = slugify(`sony-${model.modelName}`);
    const payload = {
      category: 'gaming',
      brand: 'Sony',
      modelName: model.modelName,
      slug,
      imageUrl: model.imageUrl || '',
      description: `Sell your ${model.modelName} online with DeviceKart. Instant quote, free pickup.`,
      variants: model.variants.map((v) => ({
        storage: v.storage,
        basePrice: v.basePrice,
      })),
      conditionMultipliers,
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
      console.log(
        `Updated: ${model.modelName} (${model.variants.length} variants) e.g. ₹${model.variants[0].basePrice}`,
      );
    } else {
      await Device.create(payload);
      created += 1;
      console.log(
        `Created: ${model.modelName} (${model.variants.length} variants) e.g. ₹${model.variants[0].basePrice}`,
      );
    }
  }

  console.log(`\nDone. Created: ${created}, Updated: ${updated}`);
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
