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
  //  ASUS — All Series
  // ══════════════════════════════════════════════════════
  mkDevice({
    brand: 'Asus', modelName: 'Asus X Series', slug: 'asus-asus-x-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Budget',
    imageUrl:"https://rukminim2.flixcart.com/image/767/767/jzrb53k0pkrrdj/computer/q/g/s/asus-na-laptop-original-imafghne5mngm84f.jpeg?q=90",
    variants: [{ basePrice: 5690 }],
  }),
  mkDevice({
    brand: 'Asus', modelName: 'VivoBook Series', slug: 'asus-vivobook-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Budget',
    imageUrl:"https://dlcdnwebimgs.asus.com/gain/af5a7e38-7e68-49b2-a5dd-58ecafc738fc/w800/fwebp",
    variants: [{ basePrice: 9250 }],
  }),
  mkDevice({
    brand: 'Asus', modelName: 'Asus K Series', slug: 'asus-asus-k-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Budget',
    imageUrl:"https://dlcdnwebimgs.asus.com/gain/8b72cfc0-a56d-49db-b773-98af2a17cea2/w800/fwebp",
    variants: [{ basePrice: 10140 }],
  }),
  mkDevice({
    brand: 'Asus', modelName: 'Asus R Series', slug: 'asus-asus-r-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Budget',
    imageUrl:"https://m.media-amazon.com/images/I/81DS5JsYV1L._SX450_.jpg",
    variants: [{ basePrice: 5540 }],
  }),
  mkDevice({
    brand: 'Asus', modelName: 'Asus E Series', slug: 'asus-asus-e-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Budget',
    imageUrl:"https://dlcdnwebimgs.asus.com/gain/eae82249-db83-4eb2-b191-8121bb38d2f5//fwebp",
    variants: [{ basePrice: 4290 }],
  }),
  mkDevice({
    brand: 'Asus', modelName: 'ROG Series', slug: 'asus-rog-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Gaming',
    gpuType: 'NVIDIA GTX 1650', isGaming: true,
    imageUrl:"https://dlcdnwebimgs.asus.com/gain/19DCD70E-163A-40C3-AC02-7A8F3447A2BE/w717/h525/fwebp/w260",
    variants: [{ basePrice: 18560 }],
  }),
  mkDevice({
    brand: 'Asus', modelName: 'EeeBook Series', slug: 'asus-eeebook-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Budget',
    imageUrl:"https://in.store.asus.com/media/catalog/product/1/6/160b8c13e_173444_b_dq9aoaieyurd7izz.jpg?quality=80&bg-color=255,255,255&fit=bounds&height=360&width=360&canvas=360:360",
    variants: [{ basePrice: 3090 }],
  }),
  mkDevice({
    brand: 'Asus', modelName: 'Asus A Series', slug: 'asus-asus-a-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Budget',
    imageUrl:"https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcRAR0GiPrAy6PPJwTOqQOyLCLRhDCyKUBb7vfp9ei2Fgzt86KG0U6TD1tw6E6aA63j_ZGqZMghES3CLzjlQlS_ooNnLlarG9CvgAYQHD0I",
    variants: [{ basePrice: 7770 }],
  }),
  mkDevice({
    brand: 'Asus', modelName: 'VivoBook S Series', slug: 'asus-vivobook-s-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Budget',
    imageUrl:"https://dlcdnwebimgs.asus.com/gain/db4d139c-69d6-4f57-91cd-46761642e137/w800/fwebp",
    variants: [{ basePrice: 7040 }],
  }),
  mkDevice({
    brand: 'Asus', modelName: 'Asus F Series', slug: 'asus-asus-f-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Budget',
    imageUrl:"https://dlcdnwebimgs.asus.com/gain/8c753484-c6f3-4780-a593-d54acbf50676/w800/fwebp",
    variants: [{ basePrice: 10240 }],
  }),
  mkDevice({
    brand: 'Asus', modelName: 'TUF Gaming Series', slug: 'asus-tuf-gaming-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Gaming',
    imageUrl:"https://dlcdnwebimgs.asus.com/files/media/1635a8a8-fdd1-4db9-a4b0-75f86c9c5873/v1/img-webp/kv/tuf-f16.webp",
    gpuType: 'NVIDIA GTX 1650', isGaming: true,
    variants: [{ basePrice: 25000 }],
  }),
  mkDevice({
    brand: 'Asus', modelName: 'ZenBook Series', slug: 'asus-zenbook-series',
    processorFamily: 'Intel Core i7', generation: '11th Gen', tier: 'Budget',
    imageUrl:"https://dlcdnwebimgs.asus.com/gain/53d4a89d-7321-473b-bfc9-505466b60408/w800/fwebp",
    variants: [{ basePrice: 9080 }],
  }),
  mkDevice({
    brand: 'Asus', modelName: 'Gaming Series', slug: 'asus-gaming-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Gaming',
    gpuType: 'NVIDIA GTX 1650', isGaming: true,
    imageUrl:"https://www.asus.com/media/Odin/Websites/global/ProductLine/20241205103330/P_setting_xxx_0_90_end_185.png?webp",
    variants: [{ basePrice: 7830 }],
  }),
  mkDevice({
    brand: 'Asus', modelName: 'Asus Q Series', slug: 'asus-asus-q-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Budget',
    imageUrl:"https://dlcdnwebimgs.asus.com/gain/86f15091-e270-47d4-a23f-fcddf1b9502f/w300/fwebp",
    variants: [{ basePrice: 5540 }],
  }),
  mkDevice({
    brand: 'Asus', modelName: 'Asus N Series', slug: 'asus-asus-n-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Budget',
    imageUrl:"https://dlcdnwebimgs.asus.com/gain/ae1cb9f5-2934-4294-8ccb-12e4eeb4a28d/w800/fwebp",
    variants: [{ basePrice: 6210 }],
  }),
  mkDevice({
    brand: 'Asus', modelName: 'VivoBook Pro Series', slug: 'asus-vivobook-pro-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Budget',
    imageUrl:"https://dlcdnwebimgs.asus.com/gain/f2269880-0d59-471f-a9b2-099e7cc5c0d2/w800/fwebp",
    variants: [{ basePrice: 9080 }],
  }),
  mkDevice({
    brand: 'Asus', modelName: 'Asus FX Series', slug: 'asus-asus-fx-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Budget',
    imageUrl:"https://www.asus.com/media/global/gallery/wNX1CF6nAqwwleG4_setting_xxx_0_90_end_800.png",
    variants: [{ basePrice: 5590 }],
  }),
  mkDevice({
    brand: 'Asus', modelName: 'ROG Strix Series', slug: 'asus-rog-strix-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Gaming',
    gpuType: 'NVIDIA GTX 1650', isGaming: true,
    imageUrl:"https://dlcdnwebimgs.asus.com/gain/A8B01A63-E378-467B-B5D1-D3151C19E5FD/w717/h525/fwebp/w260",
    variants: [{ basePrice: 28400 }],
  }),
  mkDevice({
    brand: 'Asus', modelName: 'AsusPro P Series', slug: 'asus-asuspro-p-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Budget',
    imageUrl:"https://dlcdnwebimgs.asus.com/gain/3615bd20-7b18-4bc1-91cd-415f2c6623d6/w185/fwebp",
    variants: [{ basePrice: 12920 }],
  }),
  mkDevice({
    brand: 'Asus', modelName: 'ZenBook U Series', slug: 'asus-zenbook-u-series',
    processorFamily: 'Intel Core i7', generation: '11th Gen', tier: 'Budget',
    imageUrl:"https://www.asus.com/media/Odin/Websites/global/ProductLine/20210107110320/P_setting_xxx_0_90_end_185.png?webp",
    variants: [{ basePrice: 4290 }],
  }),
  mkDevice({
    brand: 'Asus', modelName: 'ZenBook Flip Series', slug: 'asus-zenbook-flip-series',
    processorFamily: 'Intel Core i7', generation: '11th Gen', tier: 'Budget',
    imageUrl:"https://dlcdnwebimgs.asus.com/gain/dc960661-0bcf-4674-9f5c-7c2ccdcd7cb1/w800/fwebp",
    variants: [{ basePrice: 15800 }],
  }),
  mkDevice({
    brand: 'Asus', modelName: 'Asus Chromebook Series', slug: 'asus-asus-chromebook-series',
    processorFamily: 'Intel Core i3', generation: '10th Gen', tier: 'Budget',
    imageUrl:"https://dlcdnwebimgs.asus.com/gain/bd4a9eab-e0a0-4ff5-afae-792e0a801299/w185/fwebp",
    variants: [{ basePrice: 2140 }],
  }),
  mkDevice({
    brand: 'Asus', modelName: 'VivoBook Flip Series', slug: 'asus-vivobook-flip-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Budget',
    imageUrl:"https://dlcdnwebimgs.asus.com/gain/2b75a7c0-8aa1-4294-bf1a-12287bb06760/w185/fwebp",
    variants: [{ basePrice: 10920 }],
  }),
  mkDevice({
    brand: 'Asus', modelName: 'Asus Chromebook Flip Series', slug: 'asus-asus-chromebook-flip-series',
    processorFamily: 'Intel Core i3', generation: '10th Gen', tier: 'Budget',
    imageUrl:"https://dlcdnwebimgs.asus.com/gain/63328b91-bc48-4317-a088-9a415ecdfdb4/w800/fwebp",
    variants: [{ basePrice: 17370 }],
  }),
  mkDevice({
    brand: 'Asus', modelName: 'Asus B Series', slug: 'asus-asus-b-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Budget',
    imageUrl:"https://dlcdnwebimgs.asus.com/gain/3f447865-7815-414e-9b68-49221b69d529/w185/fwebp",
    variants: [{ basePrice: 7550 }],
  }),
  mkDevice({
    brand: 'Asus', modelName: 'Asus NX Series', slug: 'asus-asus-nx-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Budget',
    imageUrl:"https://dlcdnwebimgs.asus.com/gain/6e18d750-7a62-4bd8-9053-e60385eaaef5/w800/fwebp",
    variants: [{ basePrice: 8220 }],
  }),
  mkDevice({
    brand: 'Asus', modelName: 'Asus P series', slug: 'asus-asus-p-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Budget',
    imageUrl:"https://dlcdnwebimgs.asus.com/gain/90b9e7e7-0e1d-484b-9938-571901d4c029/w185/fwebp",
    variants: [{ basePrice: 5540 }],
  }),
  mkDevice({
    brand: 'Asus', modelName: 'ZenBook S Series', slug: 'asus-zenbook-s-series',
    processorFamily: 'Intel Core i7', generation: '11th Gen', tier: 'Budget',
    imageUrl:"https://dlcdnwebimgs.asus.com/gain/c5308549-ac28-42f6-baa4-5a98906c2d1d/w800/fwebp",
    variants: [{ basePrice: 5540 }],
  }),
  mkDevice({
    brand: 'Asus', modelName: 'AsusPro B Series', slug: 'asus-asuspro-b-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Budget',
    imageUrl:"https://dlcdnwebimgs.asus.com/gain/3f447865-7815-414e-9b68-49221b69d529/w185/fwebp",
    variants: [{ basePrice: 12920 }],
  }),
  mkDevice({
    brand: 'Asus', modelName: 'Asus FZ Series', slug: 'asus-asus-fz-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Budget',
    imageUrl:"https://dlcdnwebimgs.asus.com/gain/45542e0a-cfe1-4df7-840a-8898de542793/w185/w184/fwebp",
    variants: [{ basePrice: 8220 }],
  }),
  mkDevice({
    brand: 'Asus', modelName: 'ZenBook Pro Series', slug: 'asus-zenbook-pro-series',
    processorFamily: 'Intel Core i7', generation: '11th Gen', tier: 'Mid-range',
    imageUrl:"https://dlcdnwebimgs.asus.com/gain/096bd769-b48d-41ea-9eb5-7d305aa8a6fe//fwebp",
    variants: [{ basePrice: 26050 }],
  }),
  mkDevice({
    brand: 'Asus', modelName: 'ROG Zephyrus Series', slug: 'asus-rog-zephyrus-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Gaming',
    gpuType: 'NVIDIA GTX 1650', isGaming: true,
    imageUrl:"https://dlcdnwebimgs.asus.com/gain/B198DD60-EFF9-43C6-8CDE-28E65E811CE8/w185/fwebp",
    variants: [{ basePrice: 32920 }],
  }),
  mkDevice({
    brand: 'Asus', modelName: 'Asus V Series', slug: 'asus-asus-v-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Budget',
    imageUrl:"https://dlcdnwebimgs.asus.com/gain/9c0932c2-838a-4993-b02c-8487dd7d0b58/w800/fwebp",
    variants: [{ basePrice: 4290 }],
  }),
  mkDevice({
    brand: 'Asus', modelName: 'ProArt StudioBook Series', slug: 'asus-proart-studiobook-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Mid-range',
    imageUrl:"https://dlcdnwebimgs.asus.com/gain/2496af20-0c43-41ed-94d7-1eda080bd857/w800/fwebp",
    variants: [{ basePrice: 26830 }],
  }),
  mkDevice({
    brand: 'Asus', modelName: 'Other Asus Series', slug: 'asus-other-asus-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Budget',
    imageUrl:"https://dlcdnwebimgs.asus.com/gain/838fbdac-6d10-4190-8e52-d4b9463f5d23/w800/fwebp",
    variants: [{ basePrice: 4290 }],
  }),
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    await Device.deleteMany({ category: 'laptop', brand: 'Asus' });
    console.log('Cleared existing Asus laptop devices');
    await Device.insertMany(devices);
    console.log(`✅ Seeded ${devices.length} Asus laptop devices successfully`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  }
}

seed();