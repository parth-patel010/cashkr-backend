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
    //  MI — All Series
    // ══════════════════════════════════════════════════════
    mkDevice({
        brand: 'MI', modelName: 'Mi Notebook', slug: 'mi-mi-notebook',
        processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Budget',
        imageUrl: "https://i01.appmifile.com/webfile/globalimg/products/pc/mi-notebook-14/specs-header.png",
        variants: [{ basePrice: 16030 }],
    }),
    mkDevice({
        brand: 'MI', modelName: 'Mi Air Series', slug: 'mi-mi-air-series',
        processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Budget',
        imageUrl: "https://i.gadgets360cdn.com/products/large/1553591944_635_mi_notebook_air_12_5_2019.jpg?downsize=*:180",
        variants: [{ basePrice: 9100 }],
    }),
    mkDevice({
        brand: 'MI', modelName: 'Mi Pro Series', slug: 'mi-mi-pro-series',
        processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Budget',
        imageUrl: "https://i02.appmifile.com/350_operator_sg/25/08/2021/03423ae857b24c28541e0e9fd27436bd.png?f=webp",
        variants: [{ basePrice: 12470 }],
    }),
    mkDevice({
        brand: 'MI', modelName: 'RedmiBook Series', slug: 'mi-redmibook-series',
        processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Budget',
        imageUrl: "https://i01.appmifile.com/webfile/globalimg/products/pc/redmi-book-pro/specs01.png",
        variants: [{ basePrice: 13850 }],
    }),
];

async function seed() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');
        await Device.deleteMany({ category: 'laptop', brand: 'MI' });
        console.log('Cleared existing MI laptop devices');
        await Device.insertMany(devices);
        console.log(`✅ Seeded ${devices.length} MI laptop devices successfully`);
        process.exit(0);
    } catch (err) {
        console.error('❌ Seed failed:', err.message);
        process.exit(1);
    }
}

seed();