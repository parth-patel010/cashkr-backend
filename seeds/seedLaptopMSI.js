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
  //  MSI — All Series
  // ══════════════════════════════════════════════════════
  mkDevice({
    brand: 'MSI', modelName: 'GL Series', slug: 'msi-gl-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Gaming',
    gpuType: 'NVIDIA GTX 1650', isGaming: true,
    imageUrl:"https://m.media-amazon.com/images/I/41FZYAnvXrL._SY300_SX300_QL70_FMwebp_.jpg",
    variants: [{ basePrice: 23690 }],
  }),
  mkDevice({
    brand: 'MSI', modelName: 'GF Series', slug: 'msi-gf-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Gaming',
    gpuType: 'NVIDIA GTX 1650', isGaming: true,
    imageUrl:"https://storage-asset.msi.com/global/picture/product/product_7_20170614132516_5940c8bc289d3.webp",
    variants: [{ basePrice: 20820 }],
  }),
  mkDevice({
    brand: 'MSI', modelName: 'Modern Series', slug: 'msi-modern-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Budget',
    imageUrl:"https://storage-asset.msi.com/global/picture/image/feature/nb/Modern/Modern14C12X/prod-phtoto-1c.png",
    variants: [{ basePrice: 21730 }],
  }),
  mkDevice({
    brand: 'MSI', modelName: 'GP Leopard Series', slug: 'msi-gp-leopard-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Gaming',
    gpuType: 'NVIDIA GTX 1650', isGaming: true,
    imageUrl:"https://storage-asset.msi.com/global/picture/product/product_1689904731d52a3a186941d863c0096113e55deef6.webp",
    variants: [{ basePrice: 23690 }],
  }),
  mkDevice({
    brand: 'MSI', modelName: 'GE Raider Series', slug: 'msi-ge-raider-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Gaming',
    gpuType: 'NVIDIA GTX 1650', isGaming: true,
    imageUrl:"https://storage-asset.msi.com/event/2021/nb/ADL-GE-series/images/pd.png",
    variants: [{ basePrice: 24660 }],
  }),
  mkDevice({
    brand: 'MSI', modelName: 'Prestige Series', slug: 'msi-prestige-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Gaming',
    gpuType: 'NVIDIA GTX 1650', isGaming: true,
    imageUrl:"https://asset-us-store.msi.com/image/cache/catalog/Pd_page/Laptops/2023/PRESTIGE16AI/PRESTIGE16AIEVO-1-1024x1024.png",
    variants: [{ basePrice: 21730 }],
  }),
  mkDevice({
    brand: 'MSI', modelName: 'GS Steath Series', slug: 'msi-gs-steath-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Gaming',
    gpuType: 'NVIDIA GTX 1650', isGaming: true,
    imageUrl:"https://storage-asset.msi.com/global/picture/product/product_6_20190311094950_5c85bebe95281.webp",
    variants: [{ basePrice: 20820 }],
  }),
  mkDevice({
    brand: 'MSI', modelName: 'GT Titan Series', slug: 'msi-gt-titan-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Gaming',
    gpuType: 'NVIDIA GTX 1650', isGaming: true,
    imageUrl:"https://storage-asset.msi.com/global/picture/product/product_8_20180207115102_5a7a77a607be4.webp",
    variants: [{ basePrice: 20820 }],
  }),
  mkDevice({
    brand: 'MSI', modelName: 'Alpha Series', slug: 'msi-alpha-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Gaming',
    gpuType: 'NVIDIA GTX 1650', isGaming: true,
    imageUrl:"https://storage-asset.msi.com/global/picture/product/product_9_20191210103234_5def03c22e422.webp",
    variants: [{ basePrice: 17250 }],
  }),
  mkDevice({
    brand: 'MSI', modelName: 'Creator Series', slug: 'msi-creator-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Budget',
    imageUrl:"https://storage-asset.msi.com/global/picture/product/product_17115259825481713f18800e99d95770d844b47d3d.webp",
    variants: [{ basePrice: 19970 }],
  }),
  mkDevice({
    brand: 'MSI', modelName: 'WP Series', slug: 'msi-wp-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Budget',
    imageUrl:"https://storage-asset.msi.com/global/picture/product/product_2_20190426143609_5cc2a6d92f5d8.webp",
    variants: [{ basePrice: 8950 }],
  }),
  mkDevice({
    brand: 'MSI', modelName: 'Delta Series', slug: 'msi-delta-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Gaming',
    gpuType: 'NVIDIA GTX 1650', isGaming: true,
    imageUrl:"https://storage-asset.msi.com/global/picture/product/product_162556625831782c2486474aac4f6cc3a269e44c56.webp",
    variants: [{ basePrice: 17950 }],
  }),
  mkDevice({
    brand: 'MSI', modelName: 'WT Series', slug: 'msi-wt-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Budget',
    imageUrl:"https://storage-asset.msi.com/global/picture/product/five_pictures1_3599_20151001111159560ca47f32bbd.webp",
    variants: [{ basePrice: 8950 }],
  }),
  mkDevice({
    brand: 'MSI', modelName: 'WS Series', slug: 'msi-ws-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Budget',
    imageUrl:"https://storage-asset.msi.com/global/picture/product/product_4_20190426140345_5cc29f41e5bbb.webp",
    variants: [{ basePrice: 8950 }],
  }),
  mkDevice({
    brand: 'MSI', modelName: 'WF Series', slug: 'msi-wf-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Budget',
    imageUrl:"https://storage-asset.msi.com/global/picture/product/product_16226197406129fb8cb53cd4117c41c45178f4671e.webp",
    variants: [{ basePrice: 8950 }],
  }),
  mkDevice({
    brand: 'MSI', modelName: 'WE Series', slug: 'msi-we-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Budget',
    imageUrl:"https://m.media-amazon.com/images/I/31ayWZL1wML._SY300_SX300_QL70_FMwebp_.jpg",
    variants: [{ basePrice: 8950 }],
  }),
  mkDevice({
    brand: 'MSI', modelName: 'Bravo Series', slug: 'msi-bravo-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Gaming',
    gpuType: 'NVIDIA GTX 1650', isGaming: true,
    imageUrl:"https://storage-asset.msi.com/global/picture/product/product_168973324771940358dc35896a2b847f16583c8290.webp",
    variants: [{ basePrice: 17950 }],
  }),
  mkDevice({
    brand: 'MSI', modelName: 'Summit Series', slug: 'msi-summit-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Mid-range',
    imageUrl:"https://storage-asset.msi.com/global/picture/image/feature/nb/2025_ARL/summitPro16-ai-a2hm/gallery/msi-summitpro-16-gallery04.jpg",
    variants: [{ basePrice: 27130 }],
  }),
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    await Device.deleteMany({ category: 'laptop', brand: 'MSI' });
    console.log('Cleared existing MSI laptop devices');
    await Device.insertMany(devices);
    console.log(`✅ Seeded ${devices.length} MSI laptop devices successfully`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  }
}

seed();