import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import Device from "../models/Device.js";

const devices = [
    // ══════════════════════════════════════════════════════
    //  GOOGLE — All Series
    // ══════════════════════════════════════════════════════
    {
        category: "mobile",
        brand: "Google",
        modelName: "Pixel 4A",
        slug: "google-pixel-4a",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/google-pixel-4a.jpg",
        variants: [
            { storage: "6GB / 128GB", basePrice: 4390 }
        ]
    },
    {
        category: "mobile",
        brand: "Google",
        modelName: "Pixel 6A",
        slug: "google-pixel-6a",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/google-pixel-6a.jpg",
        variants: [
            { storage: "6GB / 128GB", basePrice: 10080 }
        ]
    },
    {
        category: "mobile",
        brand: "Google",
        modelName: "Pixel 7",
        slug: "google-pixel-7",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/google/google-pixel7-2.jpg",
        variants: [
            { storage: "128GB", basePrice: 14240 },
            { storage: "256GB", basePrice: 14160 }
        ]
    },
    {
        category: "mobile",
        brand: "Google",
        modelName: "Pixel 7 Pro",
        slug: "google-pixel-7-pro",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/google/google-pixel7-pro-2.jpg",
        variants: [
            { storage: "128GB", basePrice: 18470 },
            { storage: "256GB", basePrice: 19040 }
        ]
    },
    {
        category: "mobile",
        brand: "Google",
        modelName: "Pixel 7A",
        slug: "google-pixel-7a",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/google-pixel-7a.jpg",
        variants: [
            { storage: "8GB / 128GB", basePrice: 17120 }
        ]
    },
    {
        category: "mobile",
        brand: "Google",
        modelName: "Pixel 8",
        slug: "google-pixel-8",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/google-pixel-8.jpg",
        variants: [
            { storage: "128GB", basePrice: 24390 },
            { storage: "256GB", basePrice: 24800 }
        ]
    },
    {
        category: "mobile",
        brand: "Google",
        modelName: "Pixel 8 Pro",
        slug: "google-pixel-8-pro",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/google-pixel-8-pro.jpg",
        variants: [
            { storage: "128GB", basePrice: 31490 },
            { storage: "256GB", basePrice: 33220 },
            { storage: "512GB", basePrice: 33790 }
        ]
    },
    {
        category: "mobile",
        brand: "Google",
        modelName: "Pixel 8A",
        slug: "google-pixel-8a",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/google-pixel-8a.jpg",
        variants: [
            { storage: "128GB", basePrice: 23080 },
            { storage: "256GB", basePrice: 23370 }
        ]
    },
    {
        category: "mobile",
        brand: "Google",
        modelName: "Pixel 9",
        slug: "google-pixel-9",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/google/google-pixel-9-1.jpg",
        variants: [
            { storage: "12GB / 256GB", basePrice: 37630 }
        ]
    },
    {
        category: "mobile",
        brand: "Google",
        modelName: "Pixel 9 Pro XL",
        slug: "google-pixel-9-pro-xl",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/google/google-pixel-9-pro-xl-1.jpg",
        variants: [
            { storage: "256GB", basePrice: 54620 },
            { storage: "512GB", basePrice: 57120 }
        ]
    },
    {
        category: "mobile",
        brand: "Google",
        modelName: "Pixel 9 Pro Fold",
        slug: "google-pixel-9-pro-fold",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/google/google-pixel-9-pro-fold-3.jpg",
        variants: [
            { storage: "16GB / 256GB", basePrice: 69510 }
        ]
    },
    {
        category: "mobile",
        brand: "Google",
        modelName: "Pixel 9 Pro",
        slug: "google-pixel-9-pro",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/google/google-pixel-9-pro-1.jpg",
        variants: [
            { storage: "16GB / 256GB", basePrice: 50110 }
        ]
    },
    {
        category: "mobile",
        brand: "Google",
        modelName: "Pixel 9A",
        slug: "google-pixel-9a",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/google-pixel-9a.jpg",
        variants: [
            { storage: "8GB / 256GB", basePrice: 27700 }
        ]
    },
    {
        category: "mobile",
        brand: "Google",
        modelName: "Pixel 10",
        slug: "google-pixel-10",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/google/google-pixel-10-11.jpg",
        variants: [
            { storage: "12GB / 256GB", basePrice: 45500 }
        ]
    },
    {
        category: "mobile",
        brand: "Google",
        modelName: "Pixel 10 Pro",
        slug: "google-pixel-10-pro",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/google/google-pixel-10-pro-11.jpg",
        variants: [
            { storage: "16GB / 256GB", basePrice: 64900 }
        ]
    },
    {
        category: "mobile",
        brand: "Google",
        modelName: "Pixel 10 Pro XL",
        slug: "google-pixel-10-pro-xl",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/google/google-pixel-10-pro-xl-11.jpg",
        variants: [
            { storage: "16GB / 256GB", basePrice: 73000 }
        ]
    },
    {
        category: "mobile",
        brand: "Google",
        modelName: "Pixel 10 Pro Fold",
        slug: "google-pixel-10-pro-fold",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/google/google-pixel-10-pro-fold-00.jpg",
        variants: [
            { storage: "16GB / 256GB", basePrice: 98000 }
        ]
    },
    {
        category: "mobile",
        brand: "Google",
        modelName: "Pixel 10A",
        slug: "google-pixel-10a",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/google-pixel-10a.jpg",
        variants: [
            { storage: "8GB / 256GB", basePrice: 33200 }
        ]
    },
];

// ─── SEED FUNCTION ────────────────────────────────────────────────────────────

async function seed() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");
        await Device.deleteMany({ category: "mobile", brand: "Google" });
        console.log("Cleared existing Google devices");
        await Device.insertMany(devices);
        console.log(`✅ Seeded ${devices.length} Google devices successfully`);
        process.exit(0);
    } catch (err) {
        console.error("❌ Seed failed:", err.message);
        process.exit(1);
    }
}

seed();