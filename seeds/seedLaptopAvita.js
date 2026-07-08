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
    //  AVITA — All Series
    // ══════════════════════════════════════════════════════
    mkDevice({
        brand: 'Avita', modelName: 'Essential Series', slug: 'avita-essential-series',
        processorFamily: 'AMD A-Series', generation: 'AMD', tier: 'Budget',
        imageUrl:"https://m.media-amazon.com/images/I/41lL2WtvvAL._SY300_SX300_QL70_FMwebp_.jpg",
        variants: [{ basePrice: 3520 }],
    }),
    mkDevice({
        brand: 'Avita', modelName: 'Liber Series', slug: 'avita-liber-series',
        processorFamily: 'AMD A-Series', generation: 'AMD', tier: 'Budget',
        imageUrl:"https://m.media-amazon.com/images/I/41wvdNDWBlL._SY300_SX300_QL70_FMwebp_.jpg",
        variants: [{ basePrice: 8130 }],
    }),
    mkDevice({
        brand: 'Avita', modelName: 'Pura Series', slug: 'avita-pura-series',
        processorFamily: 'AMD A-Series', generation: 'AMD', tier: 'Budget',
        imageUrl:"https://m.media-amazon.com/images/I/310gqpSSwfL._SX300_SY300_QL70_FMwebp_.jpg",
        variants: [{ basePrice: 7360 }],
    }),
    mkDevice({
        brand: 'Avita', modelName: 'Cosmos Series', slug: 'avita-cosmos-series',
        processorFamily: 'AMD A-Series', generation: 'AMD', tier: 'Budget',
        imageUrl:"https://m.media-amazon.com/images/I/4163FcZNBDL._AC_UL480_FMwebp_QL65_.jpg",
        variants: [{ basePrice: 8390 }],
    }),
    mkDevice({
        brand: 'Avita', modelName: 'Magus Lite', slug: 'avita-magus-lite',
        processorFamily: 'AMD A-Series', generation: 'AMD', tier: 'Budget',
        imageUrl:"https://m.media-amazon.com/images/I/41c8zvP7u4L._SY300_SX300_QL70_FMwebp_.jpg",
        variants: [{ basePrice: 1870 }],
    }),
    mkDevice({
        brand: 'Avita', modelName: 'Admiror Series', slug: 'avita-admiror-series',
        processorFamily: 'AMD A-Series', generation: 'AMD', tier: 'Budget',
        imageUrl:"https://m.media-amazon.com/images/I/41SJ5Uniz+L._SY300_SX300_QL70_FMwebp_.jpg",
        variants: [{ basePrice: 10810 }],
    }),
];

async function seed() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');
        await Device.deleteMany({ category: 'laptop', brand: 'Avita' });
        console.log('Cleared existing Avita laptop devices');
        await Device.insertMany(devices);
        console.log(`✅ Seeded ${devices.length} Avita laptop devices successfully`);
        process.exit(0);
    } catch (err) {
        console.error('❌ Seed failed:', err.message);
        process.exit(1);
    }
}

seed();