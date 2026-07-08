import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import Device from "../models/Device.js";

const devices = [
    // ══════════════════════════════════════════════════════
    //  NOTHING — All Series
    // ══════════════════════════════════════════════════════
    {
        category: "mobile",
        brand: "Nothing",
        modelName: "Phone 1",
        slug: "nothing-phone-1",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/nothing-phone-1.jpg",
        variants: [
            { storage: "8 GB/128 GB", basePrice: 12430 },
            { storage: "8 GB/256 GB", basePrice: 13030 },
            { storage: "12 GB/256 GB", basePrice: 13380 }
        ]
    },
    {
        category: "mobile",
        brand: "Nothing",
        modelName: "Phone 2",
        slug: "nothing-phone-2",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/nothing-phone2.jpg",
        variants: [
            { storage: "8 GB/128 GB", basePrice: 18990 },
            { storage: "12 GB/256 GB", basePrice: 19660 },
            { storage: "12 GB/512 GB", basePrice: 20160 }
        ]
    },
    {
        category: "mobile",
        brand: "Nothing",
        modelName: "Phone 2a 5G",
        slug: "nothing-phone-2a-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/nothing-phone-2a.jpg",
        variants: [
            { storage: "8 GB/128 GB", basePrice: 15210 },
            { storage: "8 GB/256 GB", basePrice: 15670 },
            { storage: "12 GB/256 GB", basePrice: 16360 }
        ]
    },
    {
        category: "mobile",
        brand: "Nothing",
        modelName: "CMF by Nothing Phone 1",
        slug: "nothing-cmf-by-nothing-phone-1",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/nothing-phone-1.jpg",
        variants: [
            { storage: "6 GB/128 GB", basePrice: 9890 },
            { storage: "8 GB/128 GB", basePrice: 10940 }
        ]
    },
    {
        category: "mobile",
        brand: "Nothing",
        modelName: "Phone 2a Plus",
        slug: "nothing-phone-2a-plus",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/nothing-phone-2a-plus.jpg",
        variants: [
            { storage: "8 GB/256 GB", basePrice: 16760 },
            { storage: "12 GB/256 GB", basePrice: 17310 }
        ]
    },
    {
        category: "mobile",
        brand: "Nothing",
        modelName: "Phone 3a",
        slug: "nothing-phone-3a",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/nothing-phone-3a.jpg",
        variants: [
            { storage: "8 GB/128 GB", basePrice: 18010 },
            { storage: "8 GB/256 GB", basePrice: 19530 }
        ]
    },
    {
        category: "mobile",
        brand: "Nothing",
        modelName: "Phone 3a Pro",
        slug: "nothing-phone-3a-pro",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/nothing-phone-3a-pro.jpg",
        variants: [
            { storage: "8 GB/128 GB", basePrice: 20400 },
            { storage: "8 GB/256 GB", basePrice: 21690 },
            { storage: "12 GB/256 GB", basePrice: 22500 }
        ]
    },
    {
        category: "mobile",
        brand: "Nothing",
        modelName: "Phone 2 Pro 5G",
        slug: "nothing-phone-2-pro-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/nothing-cmf-phone-2-pro.jpg",
        variants: [
            { storage: "8 GB/128 GB", basePrice: 12700 },
            { storage: "8 GB/256 GB", basePrice: 14100 }
        ]
    },
    {
        category: "mobile",
        brand: "Nothing",
        modelName: "Phone 3",
        slug: "nothing-phone-3",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/nothing-phone-3.jpg",
        variants: [
            { storage: "12 GB/256 GB", basePrice: 32000 },
            { storage: "16 GB/512 GB", basePrice: 32400 }
        ]
    },
    {
        category: "mobile",
        brand: "Nothing",
        modelName: "Phone 3a Lite",
        slug: "nothing-phone-3a-lite",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/nothing-phone-3a.jpg",
        variants: [
            { storage: "8 GB/128 GB", basePrice: 14000 },
            { storage: "8 GB/256 GB", basePrice: 15000 }
        ]
    },
    {
        category: "mobile",
        brand: "Nothing",
        modelName: "Phone 4a",
        slug: "nothing-phone-4a",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/nothing-phone-4a.jpg",
        variants: [
            { storage: "8 GB/128 GB", basePrice: 22500 },
            { storage: "8 GB/256 GB", basePrice: 24300 },
            { storage: "12 GB/256 GB", basePrice: 25600 }
        ]
    },
    {
        category: "mobile",
        brand: "Nothing",
        modelName: "Phone 4a Pro",
        slug: "nothing-phone-4a-pro",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/nothing-phone-4a-pro.jpg",
        variants: [
            { storage: "8 GB/128 GB", basePrice: 27400 },
            { storage: "8 GB/256 GB", basePrice: 29000 },
            { storage: "12 GB/256 GB", basePrice: 31200 }
        ]
    },
];

// ─── SEED FUNCTION ────────────────────────────────────────────────────────────

async function seed() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");
        await Device.deleteMany({ category: "mobile", brand: "Nothing" });
        console.log("Cleared existing Nothing devices");
        await Device.insertMany(devices);
        console.log(`✅ Seeded ${devices.length} Nothing devices successfully`);
        process.exit(0);
    } catch (err) {
        console.error("❌ Seed failed:", err.message);
        process.exit(1);
    }
}

seed();