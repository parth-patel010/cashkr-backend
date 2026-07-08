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
    //  LG — All Series
    // ══════════════════════════════════════════════════════
    mkDevice({
        brand: 'LG', modelName: 'Other LG Series', slug: 'lg-other-lg-series',
        processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Budget',
        imageUrl:"https://www.lg.com/content/dam/channel/wcms/in/images/computers/14z90r-g_cp54a2_eail_in_c/lg-14Z90R-G-Laptop-front-view-350.jpg",
        variants: [{ basePrice: 6110 }],
    }),
    mkDevice({
        brand: 'LG', modelName: 'LG Gram Series', slug: 'lg-lg-gram-series',
        processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Budget',
        imageUrl:"https://www.lg.com/content/dam/channel/wcms/in/laptop/16z90r-g/revised-gallery/16Z90R-G.CP75A2-Basic-450.jpg/jcr:content/renditions/thum-350x350.jpeg",
        variants: [{ basePrice: 8500 }],
    }),
];

async function seed() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');
        await Device.deleteMany({ category: 'laptop', brand: 'LG' });
        console.log('Cleared existing LG laptop devices');
        await Device.insertMany(devices);
        console.log(`✅ Seeded ${devices.length} LG laptop devices successfully`);
        process.exit(0);
    } catch (err) {
        console.error('❌ Seed failed:', err.message);
        process.exit(1);
    }
}

seed();