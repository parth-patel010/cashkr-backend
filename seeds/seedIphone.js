import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import Device from "../models/Device.js";

const devices = [
  // ══════════════════════════════════════════════════════
  //  APPLE — iPhone Series
  // ══════════════════════════════════════════════════════
  {
    category: "mobile",
    brand: "Apple",
    modelName: "iPhone 6",
    slug: "apple-iphone-6",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-6.jpg",
    variants: [
      { storage: "16GB", basePrice: 1670 },
      { storage: "32GB", basePrice: 1930 },
      { storage: "64GB", basePrice: 2120 },
      { storage: "128GB", basePrice: 2320 }
    ]
  },
  {
    category: "mobile",
    brand: "Apple",
    modelName: "iPhone 6 Plus",
    slug: "apple-iphone-6-plus",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-6-plus.jpg",
    variants: [
      { storage: "16GB", basePrice: 2200 },
      { storage: "64GB", basePrice: 2500 },
      { storage: "128GB", basePrice: 2760 }
    ]
  },
  {
    category: "mobile",
    brand: "Apple",
    modelName: "iPhone 6s",
    slug: "apple-iphone-6s",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-6s.jpg",
    variants: [
      { storage: "16GB", basePrice: 2080 },
      { storage: "32GB", basePrice: 2390 },
      { storage: "64GB", basePrice: 2750 },
      { storage: "128GB", basePrice: 2800 }
    ]
  },
  {
    category: "mobile",
    brand: "Apple",
    modelName: "iPhone 6s Plus",
    slug: "apple-iphone-6s-plus",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-6s-plus.jpg",
    variants: [
      { storage: "16GB", basePrice: 2390 },
      { storage: "32GB", basePrice: 2950 },
      { storage: "64GB", basePrice: 3520 },
      { storage: "128GB", basePrice: 3820 }
    ]
  },
  {
    category: "mobile",
    brand: "Apple",
    modelName: "iPhone SE 1st Gen",
    slug: "apple-iphone-se-1st-gen",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-se.jpg",
    variants: [
      { storage: "16GB", basePrice: 1700 },
      { storage: "32GB", basePrice: 2050 },
      { storage: "64GB", basePrice: 2200 },
      { storage: "128GB", basePrice: 2270 }
    ]
  },
  {
    category: "mobile",
    brand: "Apple",
    modelName: "iPhone 7",
    slug: "apple-iphone-7",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-7v.jpg",
    variants: [
      { storage: "32GB", basePrice: 4430 },
      { storage: "128GB", basePrice: 4660 },
      { storage: "256GB", basePrice: 4770 }
    ]
  },
  {
    category: "mobile",
    brand: "Apple",
    modelName: "iPhone 7 Plus",
    slug: "apple-iphone-7-plus",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-7-plus-r.jpg",
    variants: [
      { storage: "32GB", basePrice: 5190 },
      { storage: "128GB", basePrice: 5680 },
      { storage: "256GB", basePrice: 6100 }
    ]
  },
  {
    category: "mobile",
    brand: "Apple",
    modelName: "iPhone 8",
    slug: "apple-iphone-8",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-8.jpg",
    variants: [
      { storage: "64GB", basePrice: 5870 },
      { storage: "128GB", basePrice: 6210 },
      { storage: "256GB", basePrice: 6480 }
    ]
  },
  {
    category: "mobile",
    brand: "Apple",
    modelName: "iPhone 8 Plus",
    slug: "apple-iphone-8-plus",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-8-plus-new.jpg",
    variants: [
      { storage: "64GB", basePrice: 7120 },
      { storage: "128GB", basePrice: 7310 },
      { storage: "256GB", basePrice: 7840 }
    ]
  },
  {
    category: "mobile",
    brand: "Apple",
    modelName: "iPhone X",
    slug: "apple-iphone-x",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-x.jpg",
    variants: [
      { storage: "64GB", basePrice: 9780 },
      { storage: "256GB", basePrice: 10310 }
    ]
  },
  {
    category: "mobile",
    brand: "Apple",
    modelName: "iPhone XR",
    slug: "apple-iphone-xr",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-xr-new.jpg",
    variants: [
      { storage: "64GB", basePrice: 9850 },
      { storage: "128GB", basePrice: 10710 },
      { storage: "256GB", basePrice: 11160 }
    ]
  },
  {
    category: "mobile",
    brand: "Apple",
    modelName: "iPhone XS",
    slug: "apple-iphone-xs",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-xs-new.jpg",
    variants: [
      { storage: "64GB", basePrice: 10640 },
      { storage: "256GB", basePrice: 11860 },
      { storage: "512GB", basePrice: 12230 }
    ]
  },
  {
    category: "mobile",
    brand: "Apple",
    modelName: "iPhone XS Max",
    slug: "apple-iphone-xs-max",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-xs-max-new1.jpg",
    variants: [
      { storage: "64GB", basePrice: 12240 },
      { storage: "256GB", basePrice: 13130 },
      { storage: "512GB", basePrice: 13530 }
    ]
  },
  {
    category: "mobile",
    brand: "Apple",
    modelName: "iPhone 11",
    slug: "apple-iphone-11",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-11.jpg",
    variants: [
      { storage: "64GB", basePrice: 13380 },
      { storage: "128GB", basePrice: 14110 },
      { storage: "256GB", basePrice: 14840 }
    ]
  },
  {
    category: "mobile",
    brand: "Apple",
    modelName: "iPhone 11 Pro",
    slug: "apple-iphone-11-pro",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-11-pro.jpg",
    variants: [
      { storage: "64GB", basePrice: 16450 },
      { storage: "256GB", basePrice: 17860 },
      { storage: "512GB", basePrice: 18390 }
    ]
  },
  {
    category: "mobile",
    brand: "Apple",
    modelName: "iPhone 11 Pro Max",
    slug: "apple-iphone-11-pro-max",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-11-pro.jpg",
    variants: [
      { storage: "64GB", basePrice: 17440 },
      { storage: "256GB", basePrice: 19710 },
      { storage: "512GB", basePrice: 20280 }
    ]
  },
  {
    category: "mobile",
    brand: "Apple",
    modelName: "iPhone SE 2020",
    slug: "apple-iphone-se-2020",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-se-2020.jpg",
    variants: [
      { storage: "64GB", basePrice: 7290 },
      { storage: "128GB", basePrice: 7770 },
      { storage: "256GB", basePrice: 8340 }
    ]
  },
  {
    category: "mobile",
    brand: "Apple",
    modelName: "iPhone 12",
    slug: "apple-iphone-12",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-12.jpg",
    variants: [
      { storage: "64GB", basePrice: 16930 },
      { storage: "128GB", basePrice: 17740 },
      { storage: "256GB", basePrice: 19520 }
    ]
  },
  {
    category: "mobile",
    brand: "Apple",
    modelName: "iPhone 12 Mini",
    slug: "apple-iphone-12-mini",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-12-mini.jpg",
    variants: [
      { storage: "64GB", basePrice: 13980 },
      { storage: "128GB", basePrice: 15930 },
      { storage: "256GB", basePrice: 16490 }
    ]
  },
  {
    category: "mobile",
    brand: "Apple",
    modelName: "iPhone 12 Pro",
    slug: "apple-iphone-12-pro",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-12-pro.jpg",
    variants: [
      { storage: "128GB", basePrice: 23730 },
      { storage: "256GB", basePrice: 25350 },
      { storage: "512GB", basePrice: 26080 }
    ]
  },
  {
    category: "mobile",
    brand: "Apple",
    modelName: "iPhone 12 Pro Max",
    slug: "apple-iphone-12-pro-max",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-12-pro-max.jpg",
    variants: [
      { storage: "128GB", basePrice: 25110 },
      { storage: "256GB", basePrice: 26490 },
      { storage: "512GB", basePrice: 27780 }
    ]
  },
  {
    category: "mobile",
    brand: "Apple",
    modelName: "iPhone 13",
    slug: "apple-iphone-13",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-13.jpg",
    variants: [
      { storage: "128GB", basePrice: 24120 },
      { storage: "256GB", basePrice: 25570 },
      { storage: "512GB", basePrice: 26300 }
    ]
  },
  {
    category: "mobile",
    brand: "Apple",
    modelName: "iPhone 13 Mini",
    slug: "apple-iphone-13-mini",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-13-mini.jpg",
    variants: [
      { storage: "128GB", basePrice: 21510 },
      { storage: "256GB", basePrice: 22000 },
      { storage: "512GB", basePrice: 22270 }
    ]
  },
  {
    category: "mobile",
    brand: "Apple",
    modelName: "iPhone 13 Pro",
    slug: "apple-iphone-13-pro",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-13-pro.jpg",
    variants: [
      { storage: "128GB", basePrice: 33750 },
      { storage: "256GB", basePrice: 35210 },
      { storage: "512GB", basePrice: 36340 },
      { storage: "1TB", basePrice: 37150 }
    ]
  },
  {
    category: "mobile",
    brand: "Apple",
    modelName: "iPhone 13 Pro Max",
    slug: "apple-iphone-13-pro-max",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-13-pro-max.jpg",
    variants: [
      { storage: "128GB", basePrice: 36290 },
      { storage: "256GB", basePrice: 37910 },
      { storage: "512GB", basePrice: 38970 },
      { storage: "1TB", basePrice: 39620 }
    ]
  },
  {
    category: "mobile",
    brand: "Apple",
    modelName: "iPhone SE 2022",
    slug: "apple-iphone-se-2022",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-se-2022.jpg",
    variants: [
      { storage: "64GB", basePrice: 11590 },
      { storage: "128GB", basePrice: 12160 },
      { storage: "256GB", basePrice: 12810 }
    ]
  },
  {
    category: "mobile",
    brand: "Apple",
    modelName: "iPhone 14",
    slug: "apple-iphone-14",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-14.jpg",
    variants: [
      { storage: "128GB", basePrice: 26240 },
      { storage: "256GB", basePrice: 28030 },
      { storage: "512GB", basePrice: 28750 }
    ]
  },
  {
    category: "mobile",
    brand: "Apple",
    modelName: "iPhone 14 Pro",
    slug: "apple-iphone-14-pro",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-14-pro.jpg",
    variants: [
      { storage: "128GB", basePrice: 42450 },
      { storage: "256GB", basePrice: 44480 },
      { storage: "512GB", basePrice: 46910 },
      { storage: "1TB", basePrice: 47470 }
    ]
  },
  {
    category: "mobile",
    brand: "Apple",
    modelName: "iPhone 14 Pro Max",
    slug: "apple-iphone-14-pro-max",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-14-pro-max.jpg",
    variants: [
      { storage: "128GB", basePrice: 45080 },
      { storage: "256GB", basePrice: 47420 },
      { storage: "512GB", basePrice: 48150 },
      { storage: "1TB", basePrice: 49130 }
    ]
  },
  {
    category: "mobile",
    brand: "Apple",
    modelName: "iPhone 14 Plus",
    slug: "apple-iphone-14-plus",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-14-plus.jpg",
    variants: [
      { storage: "128GB", basePrice: 28840 },
      { storage: "256GB", basePrice: 30050 },
      { storage: "512GB", basePrice: 31270 }
    ]
  },
  {
    category: "mobile",
    brand: "Apple",
    modelName: "iPhone 15",
    slug: "apple-iphone-15",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-15.jpg",
    variants: [
      { storage: "128GB", basePrice: 37090 },
      { storage: "256GB", basePrice: 42800 },
      { storage: "512GB", basePrice: 45080 }
    ]
  },
  {
    category: "mobile",
    brand: "Apple",
    modelName: "iPhone 15 Pro",
    slug: "apple-iphone-15-pro",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-15-pro.jpg",
    variants: [
      { storage: "128GB", basePrice: 62890 },
      { storage: "256GB", basePrice: 67760 },
      { storage: "512GB", basePrice: 69420 },
      { storage: "1TB", basePrice: 70300 }
    ]
  },
  {
    category: "mobile",
    brand: "Apple",
    modelName: "iPhone 15 Pro Max",
    slug: "apple-iphone-15-pro-max",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-15-pro-max.jpg",
    variants: [
      { storage: "256GB", basePrice: 74590 },
      { storage: "512GB", basePrice: 76540 },
      { storage: "1TB", basePrice: 79070 }
    ]
  },
  {
    category: "mobile",
    brand: "Apple",
    modelName: "iPhone 15 Plus",
    slug: "apple-iphone-15-plus",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-15-plus.jpg",
    variants: [
      { storage: "128GB", basePrice: 44510 },
      { storage: "256GB", basePrice: 48000 },
      { storage: "512GB", basePrice: 48960 }
    ]
  },
  {
    category: "mobile",
    brand: "Apple",
    modelName: "iPhone 16",
    slug: "apple-iphone-16",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-16.jpg",
    variants: [
      { storage: "128GB", basePrice: 45080 },
      { storage: "256GB", basePrice: 49980 },
      { storage: "512GB", basePrice: 52470 }
    ]
  },
  {
    category: "mobile",
    brand: "Apple",
    modelName: "iPhone 16 Plus",
    slug: "apple-iphone-16-plus",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-16-plus.jpg",
    variants: [
      { storage: "128GB", basePrice: 52430 },
      { storage: "256GB", basePrice: 53410 },
      { storage: "512GB", basePrice: 55040 }
    ]
  },
  {
    category: "mobile",
    brand: "Apple",
    modelName: "iPhone 16 Pro",
    slug: "apple-iphone-16-pro",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-16-pro.jpg",
    variants: [
      { storage: "128GB", basePrice: 73000 },
      { storage: "256GB", basePrice: 77000 },
      { storage: "512GB", basePrice: 79000 },
      { storage: "1TB", basePrice: 80500 }
    ]
  },
  {
    category: "mobile",
    brand: "Apple",
    modelName: "iPhone 16 Pro Max",
    slug: "apple-iphone-16-pro-max",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-16-pro-max.jpg",
    variants: [
      { storage: "256GB", basePrice: 88000 },
      { storage: "512GB", basePrice: 92000 },
      { storage: "1TB", basePrice: 93500 }
    ]
  },
  {
    category: "mobile",
    brand: "Apple",
    modelName: "iPhone 16E",
    slug: "apple-iphone-16e",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-16e.jpg",
    variants: [
      { storage: "128GB", basePrice: 36000 },
      { storage: "256GB", basePrice: 39000 },
      { storage: "512GB", basePrice: 41600 }
    ]
  },
  {
    category: "mobile",
    brand: "Apple",
    modelName: "iPhone 17",
    slug: "apple-iphone-17",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-17.jpg",
    variants: [
      { storage: "256GB", basePrice: 57000 },
      { storage: "512GB", basePrice: 65000 }
    ]
  },
  {
    category: "mobile",
    brand: "Apple",
    modelName: "iPhone 17 Air",
    slug: "apple-iphone-17-air",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-air.jpg",
    variants: [
      { storage: "256GB", basePrice: 68000 },
      { storage: "512GB", basePrice: 77000 },
      { storage: "1TB", basePrice: 87000 }
    ]
  },
  {
    category: "mobile",
    brand: "Apple",
    modelName: "iPhone 17 Pro",
    slug: "apple-iphone-17-pro",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-17-pro.jpg",
    variants: [
      { storage: "256GB", basePrice: 98000 },
      { storage: "512GB", basePrice: 103000 },
      { storage: "1TB", basePrice: 108000 }
    ]
  },
  {
    category: "mobile",
    brand: "Apple",
    modelName: "iPhone 17 Pro Max",
    slug: "apple-iphone-17-pro-max",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-17-pro-max.jpg",
    variants: [
      { storage: "256GB", basePrice: 104000 },
      { storage: "512GB", basePrice: 111000 },
      { storage: "1TB", basePrice: 115500 },
      { storage: "2TB", basePrice: 122500 }
    ]
  },
  {
    category: "mobile",
    brand: "Apple",
    modelName: "iPhone 17e",
    slug: "apple-iphone-17e",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-17e.jpg",
    variants: [
      { storage: "256GB", basePrice: 46000 },
      { storage: "512GB", basePrice: 54000 }
    ]
  },
];

// ─── SEED FUNCTION ────────────────────────────────────────────────────────────

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");
    await Device.deleteMany({ category: "mobile", brand: "Apple" });
    console.log("Cleared existing Apple mobile devices");
    await Device.insertMany(devices);
    console.log(`✅ Seeded ${devices.length} Apple mobile devices successfully`);
    process.exit(0);
  } catch (err) {
    console.error("❌ Seed failed:", err.message);
    process.exit(1);
  }
}

seed();