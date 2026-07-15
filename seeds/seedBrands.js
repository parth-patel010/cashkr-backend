/**
 * Seed / sync Brand documents for Phone (mobile), Laptop, Tablet.
 * Pulls brand names from Device collection and attaches known logos.
 *
 * Usage: node seeds/seedBrands.js
 */
import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import Brand from '../models/Brand.js';
import Device from '../models/Device.js';

const LOGO_LIBRARY = {
  apple: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/1280px-Apple_logo_black.svg.png',
  samsung: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Samsung_wordmark.svg/1920px-Samsung_wordmark.svg.png',
  oneplus: 'https://cdn.worldvectorlogo.com/logos/oneplus-wordmark-4.svg',
  google: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Google_Favicon_2025.svg/960px-Google_Favicon_2025.svg.png',
  xiaomi: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Xiaomi_logo_%282021-%29.svg/1280px-Xiaomi_logo_%282021-%29.svg.png',
  realme: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Realme_logo.png/960px-Realme_logo.png',
  vivo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Vivo-Cambodia.jpg/960px-Vivo-Cambodia.jpg',
  oppo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/OPPO_LOGO.jpg/960px-OPPO_LOGO.jpg',
  motorola: 'https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/motorola-logo-icon.png',
  nothing: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Nothing.svg/960px-Nothing.svg.png',
  iqoo: 'https://upload.wikimedia.org/wikipedia/commons/a/aa/IQOO_logo.svg',
  poco: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/POCO_logo.svg/250px-POCO_logo.svg.png',
  dell: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Dell_logo_2016.svg/1280px-Dell_logo_2016.svg.png',
  hp: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/HP_logo_2025.svg/960px-HP_logo_2025.svg.png',
  lenovo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Lenovo_logo_2015.svg/1280px-Lenovo_logo_2015.svg.png',
  asus: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/ASUS_Logo.svg/1280px-ASUS_Logo.svg.png',
  acer: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Acer_Logo.svg/1280px-Acer_Logo.svg.png',
  microsoft: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Microsoft_logo_%282012%29.svg/1280px-Microsoft_logo_%282012%29.svg.png',
  msi: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Micro-Star_International_logo.svg/1280px-Micro-Star_International_logo.svg.png',
  razer: 'https://upload.wikimedia.org/wikipedia/en/thumb/4/40/Razer_snake_logo.svg/1280px-Razer_snake_logo.svg.png',
  lg: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/LG_logo_%282014%29.svg/1280px-LG_logo_%282014%29.svg.png',
  huawei: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Huawei_logo_2018.svg/1024px-Huawei_logo_2018.svg.png',
  mi: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Xiaomi_logo_%282021-%29.svg/1280px-Xiaomi_logo_%282021-%29.svg.png',
  avita: 'https://avita-india.com/wp-content/uploads/2024/03/logo.png',
};

const CATEGORY_MAP = {
  mobile: 'mobile',
  laptop: 'laptop',
  tablet: 'tablet',
  mac: 'mac',
};

const slugify = (name) =>
  String(name)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

async function run() {
  await connectDB();

  const devices = await Device.find({ isActive: true }).select('brand category').lean();
  const bySlug = new Map();

  for (const device of devices) {
    if (!device.brand || !CATEGORY_MAP[device.category]) continue;
    const slug = slugify(device.brand);
    const category = CATEGORY_MAP[device.category];
    if (!bySlug.has(slug)) {
      bySlug.set(slug, {
        name: device.brand,
        slug,
        logoUrl: LOGO_LIBRARY[slug] || '',
        categories: new Set([category]),
      });
    } else {
      bySlug.get(slug).categories.add(category);
      if (!bySlug.get(slug).logoUrl && LOGO_LIBRARY[slug]) {
        bySlug.get(slug).logoUrl = LOGO_LIBRARY[slug];
      }
    }
  }

  // Ensure constants logos exist even if devices missing for some brands
  const extras = [
    { name: 'Apple', cats: ['mobile', 'laptop', 'tablet', 'mac'] },
    { name: 'Samsung', cats: ['mobile', 'laptop', 'tablet'] },
  ];
  for (const extra of extras) {
    const slug = slugify(extra.name);
    if (!bySlug.has(slug)) {
      bySlug.set(slug, {
        name: extra.name,
        slug,
        logoUrl: LOGO_LIBRARY[slug] || '',
        categories: new Set(extra.cats),
      });
    } else {
      extra.cats.forEach((c) => bySlug.get(slug).categories.add(c));
    }
  }

  let upserted = 0;
  for (const item of bySlug.values()) {
    const cats = [...item.categories];
    const offers = new Set(['sell']);
    if (cats.includes('mobile') || cats.includes('tablet')) {
      offers.add('buy');
      offers.add('repair');
    }
    if (cats.includes('laptop') || cats.includes('mac')) {
      offers.add('buy');
    }

    await Brand.findOneAndUpdate(
      { slug: item.slug },
      {
        $set: {
          name: item.name,
          logoUrl: item.logoUrl,
          categories: cats,
          offers: [...offers],
          isActive: true,
        },
        $setOnInsert: {
          slug: item.slug,
          sortOrder: 0,
          color: '#2F6BFF',
        },
      },
      { upsert: true, new: true },
    );
    upserted += 1;
  }

  console.log(`Seeded/updated ${upserted} brands (offers: sell/buy/repair where applicable).`);
  await mongoose.disconnect();
}

run().catch(async (err) => {
  console.error(err);
  await mongoose.disconnect();
  process.exit(1);
});
