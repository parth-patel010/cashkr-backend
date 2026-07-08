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
    lessThan1: 1.0, oneToTwo: 0.88, twoToThree: 0.75,
    lessThan3: 0.92, threeToEleven: 0.78, aboveEleven: 0.62,
    threeToFour: 0.48, fourToFive: 0.36, moreThan5: 0.22,
};

const screenMultipliers = {
    noIssue: 1.0, minorScratch: 0.96, deadPixels: 0.82,
    crackedWorks: 0.68, crackedBroken: 0.45,
};

const conditionMultipliers = { likenew: 1.0, good: 0.88, fair: 0.72, poor: 0.50 };

const accessoriesBonus = { bill: 300, box: 500, charger: 800, withBoxAndCharger: 800, originalCharger: 500, thirdPartyCharger: 200, none: 0 };

function mkDevice({ brand, modelName, slug, processorFamily, generation, tier, variants, gpuType }) {
    return {
        category: 'mac',
        brand,
        modelName,
        slug,
        imageUrl: '',
        processorFamily: processorFamily || '',
        generation: generation || '',
        gpuType: gpuType || '',
        isGamingLaptop: false,
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
    //  Apple iMac — All Series
    // ══════════════════════════════════════════════════════
  {
    category: "mac",
    brand: "Apple",
    modelName: "iMac 21.5 inches",
    slug: "apple-imac-21-5-inches",
    imageUrl: "https://fdn.gsmarena.com/imgroot//news/15/10/new-imac/-728/gsmarena_002.jpg",
    processorFamily: "Intel Core i5",
    generation: "Intel",
    gpuType: "",
    isGamingLaptop: false,
    tier: "Mid-range",
    variants: [
      { processor: "Intel Core i5", generation: "Intel", ram: "8GB", storage: "256GB SSD", storageType: "SSD", basePrice: 30250 },
      { processor: "Intel Core i5", generation: "Intel", ram: "16GB", storage: "512GB SSD", storageType: "SSD", basePrice: 34000 }
    ],
    conditionMultipliers,
    ageMultipliers,
    screenMultipliers,
    functionalDeductions: commonFunctionalDeductions,
    screenDeductions: commonScreenDeductions,
    bodyDeductions: commonBodyDeductions,
    accessoriesBonus,
    isActive: true
  },
  {
    category: "mac",
    brand: "Apple",
    modelName: "iMac 27 inches",
    slug: "apple-imac-27-inches",
    imageUrl: "https://fdn.gsmarena.com/imgroot/news/20/08/imac-2020/-727/gsmarena_003.jpg",
    processorFamily: "Intel Core i5",
    generation: "Intel",
    gpuType: "",
    isGamingLaptop: false,
    tier: "Mid-range",
    variants: [
      { processor: "Intel Core i5", generation: "Intel", ram: "8GB", storage: "256GB SSD", storageType: "SSD", basePrice: 33350 },
      { processor: "Intel Core i5", generation: "Intel", ram: "16GB", storage: "512GB SSD", storageType: "SSD", basePrice: 38000 }
    ],
    conditionMultipliers,
    ageMultipliers,
    screenMultipliers,
    functionalDeductions: commonFunctionalDeductions,
    screenDeductions: commonScreenDeductions,
    bodyDeductions: commonBodyDeductions,
    accessoriesBonus,
    isActive: true
  },
  {
    category: "mac",
    brand: "Apple",
    modelName: "iMac 24 inches",
    slug: "apple-imac-24-inches",
    imageUrl: "https://fdn.gsmarena.com/imgroot/news/23/10/apple-24-inch-m3-imac-official/inline/-1200x500m/gsmarena_003.jpg",
    processorFamily: "Apple M1",
    generation: "M-Series",
    gpuType: "",
    isGamingLaptop: false,
    tier: "Premium",
    variants: [
      { processor: "Apple M1", generation: "M-Series", ram: "8GB", storage: "256GB SSD", storageType: "SSD", basePrice: 45000 },
      { processor: "Apple M1", generation: "M-Series", ram: "16GB", storage: "512GB SSD", storageType: "SSD", basePrice: 52000 }
    ],
    conditionMultipliers,
    ageMultipliers,
    screenMultipliers,
    functionalDeductions: commonFunctionalDeductions,
    screenDeductions: commonScreenDeductions,
    bodyDeductions: commonBodyDeductions,
    accessoriesBonus,
    isActive: true
  }
];

async function seed() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');
        await Device.deleteMany({ category: 'mac', brand: 'Apple' });
        console.log('Cleared existing Apple iMac devices');
        await Device.insertMany(devices);
        console.log(`✅ Seeded ${devices.length} Apple iMac devices successfully`);
        process.exit(0);
    } catch (err) {
        console.error('❌ Seed failed:', err.message);
        process.exit(1);
    }
}

seed();
