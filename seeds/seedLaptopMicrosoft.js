import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import Device from '../models/Device.js';

const commonFunctionalDeductions = {
  keyboard: 7,
  cdDrive: 7,
  trackpad: 18,
  battery: 6,
  speakers: 3,
  wifi: 5,
  ports: 8,
  webcam: 6,
  charging: 8,
  hardDisk: 10,
  motherboard: 35,
  bluetooth: 6,
};

const commonScreenDeductions = {
  screenCracked: 18,
  lineDiscolour: 18,
};

const commonBodyDeductions = {
  minorDentTop: 8,
  minorDentBase: 8,
  majorDentTop: 35,
  majorDentBase: 40,
  minorScratch: 5,
  majorScratch: 8,
};

const ageMultipliers = {
  lessThan3: 1.0, threeToEleven: 0.88, aboveEleven: 0.75,
  lessThan1: 0.92, oneToTwo: 0.78, twoToThree: 0.62,
  threeToFour: 0.48, fourToFive: 0.36, moreThan5: 0.22,
};

const screenMultipliers = {
  noIssue: 1.0, minorScratch: 0.96, deadPixels: 0.82,
  crackedWorks: 0.68, crackedBroken: 0.45,
};

const conditionMultipliers = { likenew: 1.0, good: 0.88, fair: 0.72, poor: 0.50 };

const accessoriesBonus = { bill: 300, box: 500, charger: 800, withBoxAndCharger: 800, originalCharger: 500, thirdPartyCharger: 200, none: 0 };

function mkDevice({ brand, modelName, slug, processorFamily, generation, tier, variants, gpuType, isGaming, imageUrl }) {
  return {
    category: 'laptop',
    brand,
    modelName,
    slug,
    imageUrl: imageUrl || '',
    processorFamily: processorFamily || '',
    generation: generation || '',
    gpuType: gpuType || '',
    isGamingLaptop: !!isGaming,
    tier: tier || 'Mid-range',
    variants: variants.map(v => ({
      processor: v.processor || processorFamily || '',
      generation: v.generation || generation || '',
      ram: v.ram || '',
      storage: v.storage || 'Standard',
      storageType: v.storage?.includes('HDD') ? 'HDD' : 'SSD',
      basePrice: v.basePrice,
    })),
    conditionMultipliers,
    ageMultipliers,
    screenMultipliers,
    functionalDeductions: commonFunctionalDeductions,
    screenDeductions: commonScreenDeductions,
    bodyDeductions: commonBodyDeductions,
    accessoriesBonus,
    isActive: true,
  };
}

const devices = [
  // ══════════════════════════════════════════════════════
  //  MICROSOFT — All Series
  // ══════════════════════════════════════════════════════
  mkDevice({
    brand: 'Microsoft', modelName: 'Surface Pro Series', slug: 'microsoft-surface-pro-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Budget',
    imageUrl:"https://cdn-dynmedia-1.microsoft.com/is/image/microsoftcorp/pro-tab-platinum-12-inch-immersive-scroll-fy25?scl=1",
    variants: [{ basePrice: 7520 }],
  }),
  mkDevice({
    brand: 'Microsoft', modelName: 'Surface Pro 4 Series', slug: 'microsoft-surface-pro-4-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Budget',
    imageUrl:"https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcQmh4ns22H2h_7_dua_FCx0YbNBpibGTvJgCF9KqLNMgMCR8IzvVU-Uo8Ryo1flVQTR4RHxzQiIeJUd4qbeMgUVxi9Cq7jz",
    variants: [{ basePrice: 12810 }],
  }),
  mkDevice({
    brand: 'Microsoft', modelName: 'Surface Series', slug: 'microsoft-surface-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Budget',
    imageUrl:"https://images.ctfassets.net/jy9s7k22hbg4/4BgKPCq0EG8Hi0PQ1eotD6/7c227e900804805222c7adc58411db22/msft-surface-laptop-screen-sizes-13-ocean-fy26.jpg",
    variants: [{ basePrice: 4800 }],
  }),
  mkDevice({
    brand: 'Microsoft', modelName: 'Surface Book Series', slug: 'microsoft-surface-book-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Budget',
    imageUrl:"https://m.media-amazon.com/images/I/717iwhq63EL._SX450_.jpg",
    variants: [{ basePrice: 12350 }],
  }),
  mkDevice({
    brand: 'Microsoft', modelName: 'Surface Pro 3 Series', slug: 'microsoft-surface-pro-3-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Budget',
    imageUrl:"https://cdn-dynmedia-1.microsoft.com/is/image/microsoftcorp/Feature-Bing-Wallpaper-Giants-Causeway:VP2-859x557",
    variants: [{ basePrice: 10270 }],
  }),
  mkDevice({
    brand: 'Microsoft', modelName: 'Surface Book 2 Series', slug: 'microsoft-surface-book-2-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Budget',
    imageUrl:"https://cdn-dynmedia-1.microsoft.com/is/image/microsoftcorp/Feature-Bing-Wallpaper-Giants-Causeway:VP2-859x557",
    variants: [{ basePrice: 14260 }],
  }),
  mkDevice({
    brand: 'Microsoft', modelName: 'Surface Go Series', slug: 'microsoft-surface-go-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Budget',
    imageUrl:"https://m.media-amazon.com/images/I/31xc3r699pL._SX300_SY300_QL70_FMwebp_.jpg",
    variants: [{ basePrice: 3560 }],
  }),
  mkDevice({
    brand: 'Microsoft', modelName: 'Surface Pro 5 Series', slug: 'microsoft-surface-pro-5-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Budget',
    imageUrl:"https://m.media-amazon.com/images/I/41PIW0fDPwL._SX300_SY300_QL70_FMwebp_.jpg",
    variants: [{ basePrice: 14130 }],
  }),
  mkDevice({
    brand: 'Microsoft', modelName: 'Surface Laptop 2 Series', slug: 'microsoft-surface-laptop-2-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Budget',
    imageUrl:"https://m.media-amazon.com/images/I/51SgCX7YO6L._SY450_.jpg",
    variants: [{ basePrice: 14260 }],
  }),
  mkDevice({
    brand: 'Microsoft', modelName: 'Surface Pro 2 Series', slug: 'microsoft-surface-pro-2-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Budget',
    imageUrl:"https://cdn-dynmedia-1.microsoft.com/is/image/microsoftcorp/Feature-Bing-Wallpaper-Giants-Causeway:VP2-859x557",
    variants: [{ basePrice: 8400 }],
  }),
  mkDevice({
    brand: 'Microsoft', modelName: 'Surface Laptop 3 Series', slug: 'microsoft-surface-laptop-3-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Budget',
    imageUrl:"https://m.media-amazon.com/images/I/61G2clopQ3L._SX450_.jpg",
    variants: [{ basePrice: 17420 }],
  }),
  mkDevice({
    brand: 'Microsoft', modelName: 'Surface 2 Series', slug: 'microsoft-surface-2-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Budget',
    imageUrl:"https://m.media-amazon.com/images/I/51SgCX7YO6L._SY450_.jpg",
    variants: [{ basePrice: 4890 }],
  }),
  mkDevice({
    brand: 'Microsoft', modelName: 'Surface 3 Series', slug: 'microsoft-surface-3-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Budget',
    imageUrl:"https://cdn1.smartprix.com/rx-irL9tK1kI-w420-h420/microsoft-surface-3.webp",
    variants: [{ basePrice: 5490 }],
  }),
  mkDevice({
    brand: 'Microsoft', modelName: 'Surface Pro 6 Series', slug: 'microsoft-surface-pro-6-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Budget',
    imageUrl:"https://cdn-dynmedia-1.microsoft.com/is/image/microsoftcorp/Feature-Bing-Wallpaper-Giants-Causeway:VP2-859x557",
    variants: [{ basePrice: 16330 }],
  }),
  mkDevice({
    brand: 'Microsoft', modelName: 'Surface Laptop 4 Series', slug: 'microsoft-surface-laptop-4-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Budget',
    imageUrl:"https://m.media-amazon.com/images/I/717wZ9Wh4eL._SY450_.jpg",
    variants: [{ basePrice: 19340 }],
  }),
  mkDevice({
    brand: 'Microsoft', modelName: 'Surface Pro 7 Series', slug: 'microsoft-surface-pro-7-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Budget',
    imageUrl:"https://cdn-dynmedia-1.microsoft.com/is/image/microsoftcorp/Fullbleed-Hero-Surface-Pro-7-Plus-Teams-Transparent:VP2-859x540?fmt=png-alpha",
    variants: [{ basePrice: 19970 }],
  }),
  mkDevice({
    brand: 'Microsoft', modelName: 'Surface Laptop Series', slug: 'microsoft-surface-laptop-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Budget',
    imageUrl:"https://cdn-dynmedia-1.microsoft.com/is/image/microsoftcorp/13-laptop-platinum-center-render-fy25:VP2-859x540?fmt=png-alpha",
    variants: [{ basePrice: 12350 }],
  }),
  mkDevice({
    brand: 'Microsoft', modelName: 'Surface Book 3 Series', slug: 'microsoft-surface-book-3-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Budget',
    imageUrl:"https://m.media-amazon.com/images/I/717iwhq63EL._SX450_.jpg",
    variants: [{ basePrice: 17420 }],
  }),
  mkDevice({
    brand: 'Microsoft', modelName: 'Surface Pro X Series', slug: 'microsoft-surface-pro-x-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Budget',
    imageUrl:"https://m.media-amazon.com/images/I/31RMVSKxpeL._SY300_SX300_QL70_FMwebp_.jpg",
    variants: [{ basePrice: 23170 }],
  }),
  mkDevice({
    brand: 'Microsoft', modelName: 'Surface Go 2 Series', slug: 'microsoft-surface-go-2-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Budget',
    imageUrl:"https://m.media-amazon.com/images/I/41JG435-DVL._SY300_SX300_QL70_FMwebp_.jpg",
    variants: [{ basePrice: 8880 }],
  }),
  mkDevice({
    brand: 'Microsoft', modelName: 'Other Microsoft Series', slug: 'microsoft-other-microsoft-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Budget',
    imageUrl:"https://cdn-dynmedia-1.microsoft.com/is/image/microsoftcorp/family-non-color-hero-fy25?fmt=png-alpha&scl=1",
    variants: [{ basePrice: 10720 }],
  }),
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    await Device.deleteMany({ category: 'laptop', brand: 'Microsoft' });
    console.log('Cleared existing Microsoft laptop devices');
    await Device.insertMany(devices);
    console.log(`✅ Seeded ${devices.length} Microsoft laptop devices successfully`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  }
}

seed();