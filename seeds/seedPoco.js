import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import Device from "../models/Device.js";

const devices = [
    // ══════════════════════════════════════════════════════
    //  POCO — All Series
    // ══════════════════════════════════════════════════════
    {
        category: "mobile",
        brand: "Poco",
        modelName: "POCO F1",
        slug: "poco-poco-f1",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-pocophone-f1-2.jpg",
        variants: [
            { storage: "6 GB/64 GB", basePrice: 2970 },
            { storage: "6 GB/128 GB", basePrice: 3260 },
            { storage: "8 GB/256 GB", basePrice: 3600 }
        ]
    },
    {
        category: "mobile",
        brand: "Poco",
        modelName: "POCO X2",
        slug: "poco-poco-x2",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-poco-x2-1.jpg",
        variants: [
            { storage: "6 GB/64 GB", basePrice: 4210 },
            { storage: "6 GB/128 GB", basePrice: 4520 },
            { storage: "8 GB/256 GB", basePrice: 4750 }
        ]
    },
    {
        category: "mobile",
        brand: "Poco",
        modelName: "POCO M2 Pro",
        slug: "poco-poco-m2-pro",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/xiaomi/poco-m2-pro-01.jpg",
        variants: [
            { storage: "4 GB/64 GB", basePrice: 4280 },
            { storage: "6 GB/64 GB", basePrice: 4750 },
            { storage: "6 GB/128 GB", basePrice: 4920 }
        ]
    },
    {
        category: "mobile",
        brand: "Poco",
        modelName: "POCO M2",
        slug: "poco-poco-m2",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-poco-m2-mzb9921in-1.jpg",
        variants: [
            { storage: "6 GB/64 GB", basePrice: 3850 },
            { storage: "6 GB/128 GB", basePrice: 4200 },
            { storage: "8 GB/128 GB", basePrice: 4350 }
        ]
    },
    {
        category: "mobile",
        brand: "Poco",
        modelName: "POCO C3",
        slug: "poco-poco-c3",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-poco-c3-1.jpg",
        variants: [
            { storage: "3 GB/32 GB", basePrice: 3050 },
            { storage: "4 GB/64 GB", basePrice: 3290 }
        ]
    },
    {
        category: "mobile",
        brand: "Poco",
        modelName: "POCO X3",
        slug: "poco-poco-x3",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-poco-x3-1.jpg",
        variants: [
            { storage: "6 GB/64 GB", basePrice: 4600 },
            { storage: "6 GB/128 GB", basePrice: 4820 },
            { storage: "8 GB/128 GB", basePrice: 5130 }
        ]
    },
    {
        category: "mobile",
        brand: "Poco",
        modelName: "POCO M3",
        slug: "poco-poco-m3",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-poco-m3-0.jpg",
        variants: [
            { storage: "4 GB/64 GB", basePrice: 4090 },
            { storage: "6 GB/64 GB", basePrice: 4320 },
            { storage: "6 GB/128 GB", basePrice: 4720 }
        ]
    },
    {
        category: "mobile",
        brand: "Poco",
        modelName: "POCO X3 Pro",
        slug: "poco-poco-x3-pro",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-poco-x3-pro-1.jpg",
        variants: [
            { storage: "6 GB/128 GB", basePrice: 4960 },
            { storage: "8 GB/128 GB", basePrice: 5330 }
        ]
    },
    {
        category: "mobile",
        brand: "Poco",
        modelName: "POCO M3 Pro 5G",
        slug: "poco-poco-m3-pro-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-poco-m3-pro-5g-2.jpg",
        variants: [
            { storage: "4 GB/64 GB", basePrice: 5650 },
            { storage: "6 GB/128 GB", basePrice: 6400 }
        ]
    },
    {
        category: "mobile",
        brand: "Poco",
        modelName: "POCO F3 GT",
        slug: "poco-poco-f3-gt",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-poco-f3-gt-1.jpg",
        variants: [
            { storage: "6 GB/128 GB", basePrice: 7880 },
            { storage: "8 GB/128 GB", basePrice: 8140 },
            { storage: "8 GB/256 GB", basePrice: 8520 }
        ]
    },
    {
        category: "mobile",
        brand: "Poco",
        modelName: "POCO M2 Reloaded",
        slug: "poco-poco-m2-reloaded",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-poco-m2-reloaded-1.jpg",
        variants: [
            { storage: "4 GB/64 GB", basePrice: 3030 }
        ]
    },
    {
        category: "mobile",
        brand: "Poco",
        modelName: "POCO C31",
        slug: "poco-poco-c31",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-poco-c31-1.jpg",
        variants: [
            { storage: "3 GB/32 GB", basePrice: 3200 },
            { storage: "4 GB/64 GB", basePrice: 3510 }
        ]
    },
    {
        category: "mobile",
        brand: "Poco",
        modelName: "POCO M4 Pro 5G",
        slug: "poco-poco-m4-pro-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-poco-m4-pro-5g-1.jpg",
        variants: [
            { storage: "4 GB/64 GB", basePrice: 6210 },
            { storage: "6 GB/128 GB", basePrice: 6800 },
            { storage: "8 GB/128 GB", basePrice: 6890 }
        ]
    },
    {
        category: "mobile",
        brand: "Poco",
        modelName: "POCO X6 5G",
        slug: "poco-poco-x6-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-poco-x6-0.jpg",
        variants: [
            { storage: "8 GB/256 GB", basePrice: 10680 },
            { storage: "12 GB/256 GB", basePrice: 11090 },
            { storage: "12 GB/512 GB", basePrice: 12590 }
        ]
    },
    {
        category: "mobile",
        brand: "Poco",
        modelName: "POCO X6 Pro 5G",
        slug: "poco-poco-x6-pro-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-poco-x6-pro-0.jpg",
        variants: [
            { storage: "8 GB/256 GB", basePrice: 14210 },
            { storage: "12 GB/512 GB", basePrice: 14670 }
        ]
    },
    {
        category: "mobile",
        brand: "Poco",
        modelName: "POCO M6 5G",
        slug: "poco-poco-m6-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-poco-m6-5g-10.jpg",
        variants: [
            { storage: "4 GB/64 GB", basePrice: 5100 },
            { storage: "4 GB/128 GB", basePrice: 5440 },
            { storage: "6 GB/128 GB", basePrice: 5930 },
            { storage: "8 GB/256 GB", basePrice: 6320 }
        ]
    },
    {
        category: "mobile",
        brand: "Poco",
        modelName: "POCO C61",
        slug: "poco-poco-c61",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-poco-c61-1.jpg",
        variants: [
            { storage: "4 GB/64 GB", basePrice: 4450 },
            { storage: "6 GB/128 GB", basePrice: 4750 }
        ]
    },
    {
        category: "mobile",
        brand: "Poco",
        modelName: "POCO F6 5G",
        slug: "poco-poco-f6-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-poco-f6-1.jpg",
        variants: [
            { storage: "8 GB/256 GB", basePrice: 13720 },
            { storage: "12 GB/256 GB", basePrice: 14410 },
            { storage: "12 GB/512 GB", basePrice: 14990 }
        ]
    },
    {
        category: "mobile",
        brand: "Poco",
        modelName: "POCO X6 Neo 5G",
        slug: "poco-poco-x6-neo-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-poco-x6-neo-5.jpg",
        variants: [
            { storage: "8 GB/128 GB", basePrice: 8440 },
            { storage: "12 GB/256 GB", basePrice: 8780 }
        ]
    },
    {
        category: "mobile",
        brand: "Poco",
        modelName: "POCO X7 5G",
        slug: "poco-poco-x7-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-poco-x7-green.jpg",
        variants: [
            { storage: "8 GB/128 GB", basePrice: 11500 },
            { storage: "8 GB/256 GB", basePrice: 12000 }
        ]
    },
    {
        category: "mobile",
        brand: "Poco",
        modelName: "POCO M7 Pro 5G",
        slug: "poco-poco-m7-pro-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-poco-m7-pro-5g-1.jpg",
        variants: [
            { storage: "6 GB/128 GB", basePrice: 8370 },
            { storage: "8 GB/256 GB", basePrice: 8950 }
        ]
    },
    {
        category: "mobile",
        brand: "Poco",
        modelName: "POCO C75 5G",
        slug: "poco-poco-c75-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-poco-c75-5g-1.jpg",
        variants: [
            { storage: "4 GB/64 GB", basePrice: 5190 }
        ]
    },
    {
        category: "mobile",
        brand: "Poco",
        modelName: "POCO X7 Pro 5G",
        slug: "poco-poco-x7-pro-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-poco-x7-pro-1.jpg",
        variants: [
            { storage: "8 GB/256 GB", basePrice: 14290 },
            { storage: "12 GB/256 GB", basePrice: 16010 }
        ]
    },
    {
        category: "mobile",
        brand: "Poco",
        modelName: "POCO M6 Plus 5G",
        slug: "poco-poco-m6-plus-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-poco-m6-plus-01.jpg",
        variants: [
            { storage: "6 GB/128 GB", basePrice: 6400 },
            { storage: "8 GB/128 GB", basePrice: 6750 }
        ]
    },
    {
        category: "mobile",
        brand: "Poco",
        modelName: "POCO M7 5G",
        slug: "poco-poco-m7-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-poco-m7-pro-5g-1.jpg",
        variants: [
            { storage: "6 GB/128 GB", basePrice: 6100 },
            { storage: "8 GB/128 GB", basePrice: 6550 }
        ]
    },
    {
        category: "mobile",
        brand: "Poco",
        modelName: "POCO C71",
        slug: "poco-poco-c71",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-poco-c71-1.jpg",
        variants: [
            { storage: "4 GB/64 GB", basePrice: 3930 },
            { storage: "6 GB/128 GB", basePrice: 4180 }
        ]
    },
    {
        category: "mobile",
        brand: "Poco",
        modelName: "POCO F7 5G",
        slug: "poco-poco-f7-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-poco-f7-1.jpg",
        variants: [
            { storage: "12 GB/256 GB", basePrice: 20500 }
        ]
    },
    {
        category: "mobile",
        brand: "Poco",
        modelName: "POCO M7 Plus 5G",
        slug: "poco-poco-m7-plus-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-poco-m7-plus-1.jpg",
        variants: [
            { storage: "4 GB/128 GB", basePrice: 7850 },
            { storage: "6 GB/128 GB", basePrice: 8750 },
            { storage: "8 GB/128 GB", basePrice: 9250 }
        ]
    },
    {
        category: "mobile",
        brand: "Poco",
        modelName: "POCO M4 Pro",
        slug: "poco-poco-m4-pro",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-poco-m4-pro-1.jpg",
        variants: [
            { storage: "6 GB/64 GB", basePrice: 4540 },
            { storage: "6 GB/128 GB", basePrice: 4960 },
            { storage: "8 GB/128 GB", basePrice: 5110 }
        ]
    },
    {
        category: "mobile",
        brand: "Poco",
        modelName: "POCO X4 Pro 5G",
        slug: "poco-poco-x4-pro-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-poco-x4-pro-1.jpg",
        variants: [
            { storage: "6 GB/64 GB", basePrice: 6720 },
            { storage: "6 GB/128 GB", basePrice: 7340 },
            { storage: "8 GB/128 GB", basePrice: 7850 }
        ]
    },
    {
        category: "mobile",
        brand: "Poco",
        modelName: "POCO M4 5G",
        slug: "poco-poco-m4-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-poco-m4-5g-global-1.jpg",
        variants: [
            { storage: "4 GB/64 GB", basePrice: 5460 },
            { storage: "6 GB/128 GB", basePrice: 5840 }
        ]
    },
    {
        category: "mobile",
        brand: "Poco",
        modelName: "POCO F4 5G",
        slug: "poco-poco-f4-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-poco-f4-5g-1.jpg",
        variants: [
            { storage: "6 GB/128 GB", basePrice: 7040 },
            { storage: "8 GB/128 GB", basePrice: 7270 },
            { storage: "12 GB/256 GB", basePrice: 7720 }
        ]
    },
    {
        category: "mobile",
        brand: "Poco",
        modelName: "POCO M5",
        slug: "poco-poco-m5",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-poco-m5-1.jpg",
        variants: [
            { storage: "4 GB/64 GB", basePrice: 3900 },
            { storage: "6 GB/128 GB", basePrice: 4090 }
        ]
    },
    {
        category: "mobile",
        brand: "Poco",
        modelName: "POCO X5 Pro 5G",
        slug: "poco-poco-x5-pro-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-poco-x5-pro-5g-1.jpg",
        variants: [
            { storage: "6 GB/128 GB", basePrice: 10540 },
            { storage: "8 GB/256 GB", basePrice: 11190 }
        ]
    },
    {
        category: "mobile",
        brand: "Poco",
        modelName: "POCO C50",
        slug: "poco-poco-c50",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-poco-c50-1.jpg",
        variants: [
            { storage: "2 GB/32 GB", basePrice: 4250 },
            { storage: "3 GB/32 GB", basePrice: 4660 }
        ]
    },
    {
        category: "mobile",
        brand: "Poco",
        modelName: "POCO C55",
        slug: "poco-poco-c55",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-poco-c55-1.jpg",
        variants: [
            { storage: "4 GB/64 GB", basePrice: 4400 },
            { storage: "6 GB/128 GB", basePrice: 5050 }
        ]
    },
    {
        category: "mobile",
        brand: "Poco",
        modelName: "POCO X5 5G",
        slug: "poco-poco-x5-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-poco-x5-5g-1.jpg",
        variants: [
            { storage: "6 GB/128 GB", basePrice: 9510 },
            { storage: "8 GB/256 GB", basePrice: 10050 }
        ]
    },
    {
        category: "mobile",
        brand: "Poco",
        modelName: "POCO C51",
        slug: "poco-poco-c51",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-poco-c51-1.jpg",
        variants: [
            { storage: "4 GB/64 GB", basePrice: 4360 },
            { storage: "6 GB/128 GB", basePrice: 4700 }
        ]
    },
    {
        category: "mobile",
        brand: "Poco",
        modelName: "POCO F5 5G",
        slug: "poco-poco-f5-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-poco-f5-2.jpg",
        variants: [
            { storage: "8 GB/256 GB", basePrice: 12250 },
            { storage: "12 GB/256 GB", basePrice: 13230 }
        ]
    },
    {
        category: "mobile",
        brand: "Poco",
        modelName: "POCO M6 Pro 5G",
        slug: "poco-poco-m6-pro-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-poco-m6-pro-1.jpg",
        variants: [
            { storage: "4 GB/64 GB", basePrice: 6220 },
            { storage: "4 GB/128 GB", basePrice: 7400 },
            { storage: "6 GB/128 GB", basePrice: 7940 },
            { storage: "8 GB/256 GB", basePrice: 8330 }
        ]
    },
    {
        category: "mobile",
        brand: "Poco",
        modelName: "POCO C65",
        slug: "poco-poco-c65",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-poco-c65-1.jpg",
        variants: [
            { storage: "4 GB/128 GB", basePrice: 4580 },
            { storage: "6 GB/128 GB", basePrice: 4950 },
            { storage: "8 GB/256 GB", basePrice: 5350 }
        ]
    },
    {
        category: "mobile",
        brand: "Poco",
        modelName: "POCO C85 5G",
        slug: "poco-poco-c85-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-poco-c85-5g-1.jpg",
        variants: [
            { storage: "4 GB/128 GB", basePrice: 7340 },
            { storage: "6 GB/128 GB", basePrice: 7910 },
            { storage: "8 GB/128 GB", basePrice: 9300 }
        ]
    },
    {
        category: "mobile",
        brand: "Poco",
        modelName: "POCO M8 5G",
        slug: "poco-poco-m8-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-poco-m8-1.jpg",
        variants: [
            { storage: "6 GB/128 GB", basePrice: 13000 },
            { storage: "8 GB/128 GB", basePrice: 14000 },
            { storage: "8 GB/256 GB", basePrice: 15500 }
        ]
    },
    {
        category: "mobile",
        brand: "Poco",
        modelName: "POCO C85x",
        slug: "poco-poco-c85x",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-poco-c85x-1.jpg",
        variants: [
            { storage: "4 GB/64 GB", basePrice: 7450 },
            { storage: "4 GB/128 GB", basePrice: 8010 }
        ]
    },
    {
        category: "mobile",
        brand: "Poco",
        modelName: "POCO X8 Pro",
        slug: "poco-poco-x8-pro",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-poco-x8-pro-1.jpg",
        variants: [
            { storage: "8 GB/256 GB", basePrice: 21400 },
            { storage: "12 GB/256 GB", basePrice: 23400 }
        ]
    },
];

// ─── SEED FUNCTION ────────────────────────────────────────────────────────────

async function seed() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");
        await Device.deleteMany({ category: "mobile", brand: "Poco" });
        console.log("Cleared existing Poco devices");
        await Device.insertMany(devices);
        console.log(`✅ Seeded ${devices.length} Poco devices successfully`);
        process.exit(0);
    } catch (err) {
        console.error("❌ Seed failed:", err.message);
        process.exit(1);
    }
}

seed();