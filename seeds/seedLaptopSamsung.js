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
    //  SAMSUNG — All Series
    // ══════════════════════════════════════════════════════
    mkDevice({
        brand: 'Samsung', modelName: 'Galaxy Book Go Series', slug: 'samsung-galaxy-book-go-series',
        processorFamily: 'Intel Core i7', generation: '11th Gen', tier: 'Budget',
        imageUrl:"https://fdn.gsmarena.com/imgroot/news/21/06/samsung-galaxy-book-go-ofic/-1200/gsmarena_002.jpg",
        variants: [{ basePrice: 10860 }],
    }),
    mkDevice({
        brand: 'Samsung', modelName: 'Galaxy Book2 Series', slug: 'samsung-galaxy-book2-series',
        processorFamily: 'Intel Core i7', generation: '11th Gen', tier: 'Budget',
        imageUrl:"https://m.media-amazon.com/images/I/41KhXf3htkL._SY300_SX300_QL70_FMwebp_.jpg",
        variants: [{ basePrice: 21990 }],
    }),
    mkDevice({
        brand: 'Samsung', modelName: 'Galaxy Book2 360 Series', slug: 'samsung-galaxy-book2-360-series',
        processorFamily: 'Intel Core i7', generation: '11th Gen', tier: 'Mid-range',
        imageUrl:"https://images.samsung.com/is/image/samsung/assets/in/galaxy-book/feature/buy/book2-pro-360/update_0602/1.jpg?imbypass=true",
        variants: [{ basePrice: 27340 }],
    }),
    mkDevice({
        brand: 'Samsung', modelName: 'Galaxy Book2 Pro Series', slug: 'samsung-galaxy-book2-pro-series',
        processorFamily: 'Intel Core i7', generation: '11th Gen', tier: 'Mid-range',
        imageUrl:"https://m.media-amazon.com/images/I/41AbfBW8VPL._SY300_SX300_QL70_FMwebp_.jpg",
        variants: [{ basePrice: 29060 }],
    }),
    mkDevice({
        brand: 'Samsung', modelName: 'Galaxy Book2 Pro 360 Series', slug: 'samsung-galaxy-book2-pro-360-series',
        processorFamily: 'Intel Core i7', generation: '11th Gen', tier: 'Mid-range',
        imageUrl:"https://images.samsung.com/is/image/samsung/assets/in/galaxy-book/feature/buy/book2-pro/update_0602/1.jpg?imbypass=true",
        variants: [{ basePrice: 29490 }],
    }),
    mkDevice({
        brand: 'Samsung', modelName: 'Galaxy Book3 Series', slug: 'samsung-galaxy-book3-series',
        processorFamily: 'Intel Core i7', generation: '11th Gen', tier: 'Mid-range',
        imageUrl:"https://rukmini1.flixcart.com/image/1500/1500/xif0q/computer/s/e/f/-original-imahfu5n4hjfjejw.jpeg?q=70",
        variants: [{ basePrice: 30000 }],
    }),
    mkDevice({
        brand: 'Samsung', modelName: 'Galaxy Book3 360 Series', slug: 'samsung-galaxy-book3-360-series',
        processorFamily: 'Intel Core i7', generation: '11th Gen', tier: 'Mid-range',
        imageUrl:"https://images.samsung.com/is/image/samsung/p6pim/in/feature/164360731/in-feature-galaxy-book3-360-13-3-inch-with-s-pen-np730-535677264?$FB_TYPE_A_MO_JPG$",
        variants: [{ basePrice: 33000 }],
    }),
    mkDevice({
        brand: 'Samsung', modelName: 'Galaxy Book3 Ultra Series', slug: 'samsung-galaxy-book3-ultra-series',
        processorFamily: 'Intel Core i7', generation: '11th Gen', tier: 'Mid-range',
        imageUrl:"https://images.samsung.com/is/image/samsung/p6pim/in/2302/gallery/in-galaxy-book3-ultra-16-inch-np960-np960xfh-xa1in-534939100?$Q90_684_547_JPG$",
        variants: [{ basePrice: 55000 }],
    }),
    mkDevice({
        brand: 'Samsung', modelName: 'Galaxy Book3 Pro 360 Series', slug: 'samsung-galaxy-book3-pro-360-series',
        processorFamily: 'Intel Core i7', generation: '11th Gen', tier: 'Mid-range',
        imageUrl:"https://m.media-amazon.com/images/I/41uyvNBsqWL._SY300_SX300_QL70_FMwebp_.jpg",
        variants: [{ basePrice: 40000 }],
    }),
    mkDevice({
        brand: 'Samsung', modelName: 'Galaxy Book4 Series', slug: 'samsung-galaxy-book4-series',
        processorFamily: 'Intel Core i7', generation: '11th Gen', tier: 'Mid-range',
        imageUrl:"https://images.samsung.com/is/image/samsung/assets/in/galaxy-book/galaxy-book4-series/Galaxy-Book4_Pro_720x540_.png?$720_N_PNG$",
        variants: [{ basePrice: 29830 }],
    }),
    mkDevice({
        brand: 'Samsung', modelName: 'Galaxy Book4 360 Series', slug: 'samsung-galaxy-book4-360-series',
        processorFamily: 'Intel Core i7', generation: '11th Gen', tier: 'Mid-range',
        imageUrl:"https://m.media-amazon.com/images/I/41eRd4zWSjL._SY300_SX300_QL70_FMwebp_.jpg",
        variants: [{ basePrice: 31470 }],
    }),
    mkDevice({
        brand: 'Samsung', modelName: 'Galaxy Book4 Pro Series', slug: 'samsung-galaxy-book4-pro-series',
        processorFamily: 'Intel Core i7', generation: '11th Gen', tier: 'Mid-range',
        imageUrl:"https://m.media-amazon.com/images/I/419TYg1U54L._SY300_SX300_QL70_FMwebp_.jpg",
        variants: [{ basePrice: 30870 }],
    }),
    mkDevice({
        brand: 'Samsung', modelName: 'Galaxy Book4 Pro 360 Series', slug: 'samsung-galaxy-book4-pro-360-series',
        processorFamily: 'Intel Core i7', generation: '11th Gen', tier: 'Mid-range',
        imageUrl:"https://m.media-amazon.com/images/I/41b8WpjzWqL._SY300_SX300_QL70_FMwebp_.jpg",
        variants: [{ basePrice: 45000 }],
    }),
    mkDevice({
        brand: 'Samsung', modelName: 'Galaxy Book4 Ultra Series', slug: 'samsung-galaxy-book4-ultra-series',
        processorFamily: 'Intel Core i7', generation: '11th Gen', tier: 'Mid-range',
        imageUrl:"https://m.media-amazon.com/images/I/3165VVLGZjL._SX450_.jpg",
        variants: [{ basePrice: 50000 }],
    }),
    mkDevice({
        brand: 'Samsung', modelName: 'Galaxy Book4 Edge Series', slug: 'samsung-galaxy-book4-edge-series',
        processorFamily: 'Intel Core i7', generation: '11th Gen', tier: 'Gaming',
        imageUrl:"https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcTI06ZYevODWLkl3F34KNcZn6S2Ietaa8MgeEALTk83s1dKCfVCRUdwGWEdmyfjvrOoRL-j-oiBKPDZPzu9Z9Ipivono8iXqw",
        gpuType: 'NVIDIA GTX 1650', isGaming: true,
        variants: [{ basePrice: 30000 }],
    }),
    mkDevice({
        brand: 'Samsung', modelName: 'Galaxy Book5 360 Series', slug: 'samsung-galaxy-book5-360-series',
        processorFamily: 'Intel Core i7', generation: '11th Gen', tier: 'Mid-range',
        imageUrl:"https://images.samsung.com/is/image/samsung/assets/in/galaxy-book5/buy/Galaxy-Book5-Pro_Carousel_Gray_UK_PC.jpg?imbypass=true",
        variants: [{ basePrice: 43460 }],
    }),
    mkDevice({
        brand: 'Samsung', modelName: 'Galaxy Book5 Pro Series', slug: 'samsung-galaxy-book5-pro-series',
        processorFamily: 'Intel Core i7', generation: '11th Gen', tier: 'Mid-range',
        imageUrl:"https://images.samsung.com/is/image/samsung/assets/in/galaxy-book5/buy/Galaxy-Book5-Pro_Carousel_Gray_UK_PC.jpg?imbypass=true",
        variants: [{ basePrice: 46680 }],
    }),
    mkDevice({
        brand: 'Samsung', modelName: 'Galaxy Book5 Pro 360 Series', slug: 'samsung-galaxy-book5-pro-360-series',
        processorFamily: 'Intel Core i7', generation: '11th Gen', tier: 'Mid-range',
        imageUrl:"https://images.samsung.com/is/image/samsung/assets/in/galaxy-book5/buy/Galaxy-Book5-Pro_Carousel_Gray_UK_PC.jpg?imbypass=true",
        variants: [{ basePrice: 49900 }],
    }),
    mkDevice({
        brand: 'Samsung', modelName: 'Galaxy Book5 Series', slug: 'samsung-galaxy-book5-series',
        processorFamily: 'Intel Core i7', generation: '11th Gen', tier: 'Mid-range',
        imageUrl:"https://images.samsung.com/is/image/samsung/assets/in/galaxy-book/galaxy-book5/buy/Galaxy-Book5-Image-Carousel_UK_Gray_PC.jpg?imbypass=true",
        variants: [{ basePrice: 42100 }],
    }),
    mkDevice({
        brand: 'Samsung', modelName: 'Others Samsung Series', slug: 'samsung-others-samsung-series',
        processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Budget',
        imageUrl:"https://images.samsung.com/is/image/samsung/p6pim/in/np740vjg-kg1in/gallery/in-galaxy-book6-14-inch-np740vjgg-np740vjg-kg1in-thumb-551774486?$Q90_330_330_F_PNG$",
        variants: [{ basePrice: 4030 }],
    }),
];

async function seed() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');
        await Device.deleteMany({ category: 'laptop', brand: 'Samsung' });
        console.log('Cleared existing Samsung laptop devices');
        await Device.insertMany(devices);
        console.log(`✅ Seeded ${devices.length} Samsung laptop devices successfully`);
        process.exit(0);
    } catch (err) {
        console.error('❌ Seed failed:', err.message);
        process.exit(1);
    }
}

seed();