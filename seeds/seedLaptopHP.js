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
  //  HP — All Series
  // ══════════════════════════════════════════════════════
  mkDevice({
    brand: 'HP', modelName: 'ZBook 8 Series', slug: 'hp-zbook-8-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Mid-range',
    imageUrl: "https://in-media.apjonlinecdn.com/catalog/product/cache/b3b166914d87ce343d4dc5ec5117b502/h/p/hp-zbook-8-g1i-14-inch-mobile-workstation-machuw14-frontopen_10.png",
    variants: [{ basePrice: 35000 }],
  }),
  mkDevice({
    brand: 'HP', modelName: 'ZBook Firefly Series', slug: 'hp-zbook-firefly-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Mid-range',
    imageUrl: "https://in-media.apjonlinecdn.com/catalog/product/cache/b3b166914d87ce343d4dc5ec5117b502/c/0/c08924906_1_11.png",
    variants: [{ basePrice: 40000 }],
  }),
  mkDevice({
    brand: 'HP', modelName: 'ZBook Fury Series', slug: 'hp-zbook-fury-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Mid-range',
    imageUrl: "https://in-media.apjonlinecdn.com/catalog/product/cache/b3b166914d87ce343d4dc5ec5117b502/c/0/c08953287_2_7.png",
    variants: [{ basePrice: 45000 }],
  }),
  mkDevice({
    brand: 'HP', modelName: 'ZBook Power Series', slug: 'hp-zbook-power-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Mid-range',
    imageUrl: "https://in-media.apjonlinecdn.com/catalog/product/cache/b3b166914d87ce343d4dc5ec5117b502/c/0/c08679273_5_1.png",
    variants: [{ basePrice: 45000 }],
  }),
  mkDevice({
    brand: 'HP', modelName: 'ZBook Studio Series', slug: 'hp-zbook-studio-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Mid-range',
    imageUrl: "https://in-media.apjonlinecdn.com/catalog/product/cache/314dec89b3219941707ad62ccc90e585/c/0/c08679471_4_1.png",
    variants: [{ basePrice: 45000 }],
  }),
  mkDevice({
    brand: 'HP', modelName: 'ZBook X Series', slug: 'hp-zbook-x-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Mid-range',
    imageUrl: "https://in-media.apjonlinecdn.com/catalog/product/cache/b3b166914d87ce343d4dc5ec5117b502/h/p/hp-zbook-x-16-inch-mobile-workstation-helm-frontopen_5.png",
    variants: [{ basePrice: 40000 }],
  }),
  mkDevice({
    brand: 'HP', modelName: 'Pavilion Series', slug: 'hp-pavilion-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Budget',
    imageUrl: "https://i.gadgets360cdn.com/products/large/hp-pavilion-13-db-1200x800-1614152442.jpg?downsize=*:180",
    variants: [{ basePrice: 6680 }],
  }),
  mkDevice({
    brand: 'HP', modelName: 'HP 15 Series', slug: 'hp-hp-15-series',
    processorFamily: 'Intel Core i3', generation: '10th Gen', tier: 'Budget',
    imageUrl: "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcTdh3z_7A295haAx5ICjrSYboSJoSLHXsKNxLGN6q0Z05HVPtjX3MPv3PHq7voYSoL2EZ-Pz8AzfFwWv7lZf69xGePcSCXClZZHPpCAc1Uw4C7B8Paerk1KRQ",
    variants: [{ basePrice: 13390 }],
  }),
  mkDevice({
    brand: 'HP', modelName: 'HP Notebook Series', slug: 'hp-hp-notebook-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Budget',
    imageUrl: "https://in-media.apjonlinecdn.com/catalog/product/cache/b3b166914d87ce343d4dc5ec5117b502/c/0/c08484491_1_16.png",
    variants: [{ basePrice: 11210 }],
  }),
  mkDevice({
    brand: 'HP', modelName: 'Probook Series', slug: 'hp-probook-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Budget',
    imageUrl: "https://in-media.apjonlinecdn.com/catalog/product/cache/b3b166914d87ce343d4dc5ec5117b502/c/0/c08935868_5.png",
    variants: [{ basePrice: 10700 }],
  }),
  mkDevice({
    brand: 'HP', modelName: 'Elitebook Series', slug: 'hp-elitebook-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Budget',
    imageUrl: "https://in-media.apjonlinecdn.com/catalog/product/cache/b3b166914d87ce343d4dc5ec5117b502/C/2/C27TGPT-1_T1752108568.png",
    variants: [{ basePrice: 15030 }],
  }),
  mkDevice({
    brand: 'HP', modelName: 'G Series', slug: 'hp-g-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Budget',
    imageUrl: "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcQwP4Uq0pqYsIKgID2dgq2OMCgssLVMFkRhaVsw5oUghg8_U7EPni54ppLH1pF4zb5uIz_sX9nfAbm6frnl8Ugfu-1Z_9uiAJGj30NDjraiTXF_d1NqkNcN",
    variants: [{ basePrice: 7830 }],
  }),
  mkDevice({
    brand: 'HP', modelName: 'Envy Series', slug: 'hp-envy-series',
    processorFamily: 'Intel Core i7', generation: '11th Gen', tier: 'Budget',
    imageUrl: "https://www.hp.com/content/dam/sites/worldwide/personal-computers/consumer/laptops-and-2-n-1s/envy/redesign/ai-updates/Piston%20and%20Piston%20Non-AI%20.png",
    variants: [{ basePrice: 12610 }],
  }),
  mkDevice({
    brand: 'HP', modelName: 'HP 14 Series', slug: 'hp-hp-14-series',
    processorFamily: 'Intel Core i3', generation: '10th Gen', tier: 'Budget',
    imageUrl: "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcSo7KYvziO51wtgCIUUMqNlatvb9OhGD3x9zJdsgu0CnVXPR7RL_dXp_9mztkgIzHpmhV_BIY-rwGVBxLSgZeyMNrdfQ13PgpesR3SlNx6HcdKI7gTG09De",
    variants: [{ basePrice: 11710 }],
  }),
  mkDevice({
    brand: 'HP', modelName: 'Pavilion Power Series', slug: 'hp-pavilion-power-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Budget',
    imageUrl: "https://s3bg.cashify.in/gpro/uploads/2022/02/04084649/hp-pavilion-power-15-cb053tx-2fk58pa-core-i5-7th-gen-8-gb-1-tb-128-gb-ssd-windows-10-4-gb-front.jpg",
    variants: [{ basePrice: 6310 }],
  }),
  mkDevice({
    brand: 'HP', modelName: 'HP 300 Series', slug: 'hp-hp-300-series',
    processorFamily: 'Intel Core i3', generation: '10th Gen', tier: 'Budget',
    imageUrl: "https://www.hp.com/content/dam/sites/worldwide/printers/custom-table/image-6-1@2x.jpg",
    variants: [{ basePrice: 11100 }],
  }),
  mkDevice({
    brand: 'HP', modelName: 'Spectre Series', slug: 'hp-spectre-series',
    processorFamily: 'Intel Core i7', generation: '11th Gen', tier: 'Budget',
    imageUrl: "https://in-files.apjonlinecdn.com/landingpages/content-pages/hp-spectre-x360/images/deep_dive_v2.png",
    variants: [{ basePrice: 16780 }],
  }),
  mkDevice({
    brand: 'HP', modelName: 'Split Series', slug: 'hp-split-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Budget',
    imageUrl: "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcQJO4xt8cl1C8m56-ZWLFMkzjcbhxdQh1WCfukQRlrW_EE1--ic",
    variants: [{ basePrice: 2130 }],
  }),
  mkDevice({
    brand: 'HP', modelName: 'HP Chromebook Series', slug: 'hp-hp-chromebook-series',
    processorFamily: 'Intel Core i3', generation: '10th Gen', tier: 'Budget',
    imageUrl: "https://www.hp.com/content/dam/sites/worldwide/personal-computers/consumer/laptops/home/chromebook/hero-banner-image-desktop@2x.jpg",
    variants: [{ basePrice: 4150 }],
  }),
  mkDevice({
    brand: 'HP', modelName: 'Omen Series', slug: 'hp-omen-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Gaming',
    gpuType: 'NVIDIA GTX 1650', isGaming: true,
    imageUrl: "https://in-media.apjonlinecdn.com/catalog/product/cache/b3b166914d87ce343d4dc5ec5117b502/o/m/omen-gaming-laptop-16-shadowblack-kb-hanna-front_15.png",
    variants: [{ basePrice: 15860 }],
  }),
  mkDevice({
    brand: 'HP', modelName: '200 Series', slug: 'hp-200-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Budget',
    imageUrl: "https://hp.widen.net/content/puf2mnqqhl/png/puf2mnqqhl.png?w=800&h=600&dpi=72&color=ffffff00",
    variants: [{ basePrice: 9590 }],
  }),
  mkDevice({
    brand: 'HP', modelName: 'HP 17 Series', slug: 'hp-hp-17-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Budget',
    imageUrl: "https://hp.widen.net/content/hvbwhsoy7i/webp/hvbwhsoy7i.png?dpi=72&color=ffffff00&w=270",
    variants: [{ basePrice: 10920 }],
  }),
  mkDevice({
    brand: 'HP', modelName: 'Stream Series', slug: 'hp-stream-series',
    processorFamily: 'Intel Core i3', generation: '10th Gen', tier: 'Budget',
    imageUrl: "https://m.media-amazon.com/images/I/31RKTHa7L+L._SY300_SX300_QL70_FMwebp_.jpg",
    variants: [{ basePrice: 2610 }],
  }),
  mkDevice({
    brand: 'HP', modelName: 'ZBook Series', slug: 'hp-zbook-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Budget',
    imageUrl: "https://in-media.apjonlinecdn.com/catalog/product/cache/b3b166914d87ce343d4dc5ec5117b502/h/p/hp-zbook-8-g1i-14-inch-mobile-workstation-machuw14-frontopen_10.png",
    variants: [{ basePrice: 22730 }],
  }),
  mkDevice({
    brand: 'HP', modelName: 'Pavilion Gaming Series', slug: 'hp-pavilion-gaming-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Gaming',
    gpuType: 'NVIDIA GTX 1650', isGaming: true,
    imageUrl: "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcQAdGE4f78uwElKoB1L92-Ix5wXmuAr3RqZD4AB-M8Xn_hELzW3Z8w_M3ZYRIIEblBvke3lgaQugi5GAu5NxlEH40_s9wkG",
    variants: [{ basePrice: 23280 }],
  }),
  mkDevice({
    brand: 'HP', modelName: 'SlateBook Series', slug: 'hp-slatebook-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Budget',
    imageUrl: "https://m.media-amazon.com/images/I/410uyxQWUYL.jpg",
    variants: [{ basePrice: 2650 }],
  }),
  mkDevice({
    brand: 'HP', modelName: 'Victus Series', slug: 'hp-victus-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Gaming',
    gpuType: 'NVIDIA GTX 1650', isGaming: true,
    imageUrl: "https://in-media.apjonlinecdn.com/catalog/product/cache/b3b166914d87ce343d4dc5ec5117b502/c/0/c08192495_51.png",
    variants: [{ basePrice: 23950 }],
  }),
  mkDevice({
    brand: 'HP', modelName: 'Other HP Series', slug: 'hp-other-hp-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Budget',
    imageUrl: "https://in-media.apjonlinecdn.com/catalog/product/cache/b3b166914d87ce343d4dc5ec5117b502/c/0/c08484491_1_16.png",
    variants: [{ basePrice: 4690 }],
  }),
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    await Device.deleteMany({ category: 'laptop', brand: 'HP' });
    console.log('Cleared existing HP laptop devices');
    await Device.insertMany(devices);
    console.log(`✅ Seeded ${devices.length} HP laptop devices successfully`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  }
}

seed();