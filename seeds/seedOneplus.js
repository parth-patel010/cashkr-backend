import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import Device from "../models/Device.js";

const devices = [
    // ══════════════════════════════════════════════════════
    //  ONEPLUS — All Series
    // ══════════════════════════════════════════════════════
    {
        category: "mobile",
        brand: "OnePlus",
        modelName: "6T",
        slug: "oneplus-6t",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/oneplus-6t-thunder-purple.jpg",
        variants: [
            { storage: "6GB / 128GB", basePrice: 5000 },
            { storage: "8GB / 128GB", basePrice: 5540 },
            { storage: "8GB / 256GB", basePrice: 5630 }
        ]
    },
    {
        category: "mobile",
        brand: "OnePlus",
        modelName: "One Plus 6",
        slug: "oneplus-one-plus-6",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/oneplus-6-red.jpg",
        variants: [
            { storage: "6GB / 64GB", basePrice: 3940 },
            { storage: "8GB / 128GB", basePrice: 4040 },
            { storage: "8GB / 256GB", basePrice: 4170 }
        ]
    },
    {
        category: "mobile",
        brand: "OnePlus",
        modelName: "5T",
        slug: "oneplus-5t",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/oneplus-5t.jpg",
        variants: [
            { storage: "6GB / 64GB", basePrice: 2570 },
            { storage: "8GB / 128GB", basePrice: 2930 }
        ]
    },
    {
        category: "mobile",
        brand: "OnePlus",
        modelName: "One Plus 5",
        slug: "oneplus-one-plus-5",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/oneplus-5.jpg",
        variants: [
            { storage: "6GB / 64GB", basePrice: 2420 },
            { storage: "8GB / 128GB", basePrice: 2780 }
        ]
    },
    {
        category: "mobile",
        brand: "OnePlus",
        modelName: "3T",
        slug: "oneplus-3t",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/oneplus-3t-.jpg",
        variants: [
            { storage: "64GB", basePrice: 1860 },
            { storage: "128GB", basePrice: 2040 }
        ]
    },
    {
        category: "mobile",
        brand: "OnePlus",
        modelName: "One Plus 3",
        slug: "oneplus-one-plus-3",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/oneplus-3.jpg",
        variants: [
            { storage: "6GB / 64GB", basePrice: 1700 }
        ]
    },
    {
        // FIX: GSMArena spells the McLaren edition as "maclaren" (no leading 'c')
        category: "mobile",
        brand: "OnePlus",
        modelName: "6T McLaren",
        slug: "oneplus-6t-mclaren",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/oneplus-6t-mclaren-edition.jpg",
        variants: [
            { storage: "10GB / 256GB", basePrice: 5640 }
        ]
    },
    {
        category: "mobile",
        brand: "OnePlus",
        modelName: "One Plus 7",
        slug: "oneplus-one-plus-7",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/oneplus-7--.jpg",
        variants: [
            { storage: "6GB / 128GB", basePrice: 5610 },
            { storage: "8GB / 256GB", basePrice: 6210 }
        ]
    },
    {
        category: "mobile",
        brand: "OnePlus",
        modelName: "One Plus 7 Pro",
        slug: "oneplus-one-plus-7-pro",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/oneplus-7-pro-r1.jpg",
        variants: [
            { storage: "6GB / 128GB", basePrice: 7570 },
            { storage: "8GB / 256GB", basePrice: 7850 },
            { storage: "12GB / 256GB", basePrice: 8000 }
        ]
    },
    {
        category: "mobile",
        brand: "OnePlus",
        modelName: "One Plus 7T",
        slug: "oneplus-one-plus-7t",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/oneplus-7t-.jpg",
        variants: [
            { storage: "128GB", basePrice: 6210 },
            { storage: "256GB", basePrice: 6590 }
        ]
    },
    {
        category: "mobile",
        brand: "OnePlus",
        modelName: "One Plus 7T Pro",
        slug: "oneplus-one-plus-7t-pro",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/oneplus-7t-pro.jpg",
        variants: [
            { storage: "8GB / 256GB", basePrice: 8180 },
            { storage: "12GB / 256GB", basePrice: 8630 }
        ]
    },
    {
        category: "mobile",
        brand: "OnePlus",
        modelName: "One Plus 8",
        slug: "oneplus-one-plus-8",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/oneplus-8.jpg",
        variants: [
            { storage: "6GB / 128GB", basePrice: 9660 },
            { storage: "8GB / 128GB", basePrice: 10000 },
            { storage: "12GB / 256GB", basePrice: 10450 }
        ]
    },
    {
        category: "mobile",
        brand: "OnePlus",
        modelName: "One Plus 8 Pro",
        slug: "oneplus-one-plus-8-pro",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/oneplus-8-pro.jpg",
        variants: [
            { storage: "8GB / 128GB", basePrice: 11930 },
            { storage: "12GB / 256GB", basePrice: 12570 }
        ]
    },
    {
        // FIX: full edition suffix required in filename
        category: "mobile",
        brand: "OnePlus",
        modelName: "7T Pro McLaren Edition",
        slug: "oneplus-7t-pro-mclaren-edition",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/oneplus-7t-pro-5g-mclaren-edition-.jpg",
        variants: [
            { storage: "12GB / 256GB", basePrice: 9090 }
        ]
    },
    {
        category: "mobile",
        brand: "OnePlus",
        modelName: "One Plus Nord",
        slug: "oneplus-one-plus-nord",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/oneplus-nord.jpg",
        variants: [
            { storage: "6GB / 64GB", basePrice: 6780 },
            { storage: "8GB / 128GB", basePrice: 8260 },
            { storage: "12GB / 256GB", basePrice: 8750 }
        ]
    },
    {
        category: "mobile",
        brand: "OnePlus",
        modelName: "One Plus 8T",
        slug: "oneplus-one-plus-8t",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/oneplus-8t.jpg",
        variants: [
            { storage: "8GB / 128GB", basePrice: 9500 },
            { storage: "12GB / 256GB", basePrice: 9910 }
        ]
    },
    {
        category: "mobile",
        brand: "OnePlus",
        modelName: "One Plus 9 5G",
        slug: "oneplus-one-plus-9-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/oneplus-9-.jpg",
        variants: [
            { storage: "8GB / 128GB", basePrice: 9660 },
            { storage: "12GB / 256GB", basePrice: 9920 }
        ]
    },
    {
        category: "mobile",
        brand: "OnePlus",
        modelName: "One Plus 9R 5G",
        slug: "oneplus-one-plus-9r-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/oneplus-9r.jpg",
        variants: [
            { storage: "8GB / 128GB", basePrice: 9090 },
            { storage: "12GB / 256GB", basePrice: 9770 }
        ]
    },
    {
        category: "mobile",
        brand: "OnePlus",
        modelName: "One Plus 9 Pro 5G",
        slug: "oneplus-one-plus-9-pro-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/oneplus-9-pro-.jpg",
        variants: [
            { storage: "8GB / 128GB", basePrice: 12040 },
            { storage: "12GB / 256GB", basePrice: 13330 }
        ]
    },
    {
        category: "mobile",
        brand: "OnePlus",
        modelName: "One Plus Nord CE 5G",
        slug: "oneplus-one-plus-nord-ce-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/oneplus-nord-ce-5g.jpg",
        variants: [
            { storage: "6GB / 128GB", basePrice: 7120 },
            { storage: "8GB / 128GB", basePrice: 7500 },
            { storage: "12GB / 256GB", basePrice: 7840 }
        ]
    },
    {
        category: "mobile",
        brand: "OnePlus",
        modelName: "One Plus Nord 2 5G",
        slug: "oneplus-one-plus-nord-2-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/oneplus-nord-2-5g.jpg",
        variants: [
            { storage: "6GB / 128GB", basePrice: 8410 },
            { storage: "8GB / 128GB", basePrice: 9240 },
            { storage: "12GB / 256GB", basePrice: 9660 }
        ]
    },
    {
        // FIX: GSMArena uses the -5g suffix in the filename
        category: "mobile",
        brand: "OnePlus",
        modelName: "One Plus 9RT 5G",
        slug: "oneplus-one-plus-9rt-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/oneplus-9-rt-r.jpg",
        variants: [
            { storage: "8GB / 128GB", basePrice: 10110 },
            { storage: "12GB / 256GB", basePrice: 11210 }
        ]
    },
    {
        category: "mobile",
        brand: "OnePlus",
        modelName: "One Plus Nord CE 2 5G",
        slug: "oneplus-one-plus-nord-ce-2-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/oneplus-nord-ce-2-5g.jpg",
        variants: [
            { storage: "6GB / 128GB", basePrice: 8480 },
            { storage: "8GB / 128GB", basePrice: 9010 }
        ]
    },
    {
        category: "mobile",
        brand: "OnePlus",
        modelName: "One Plus 10 Pro 5G",
        slug: "oneplus-one-plus-10-pro-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/oneplus-10-pro.jpg",
        variants: [
            { storage: "8GB / 128GB", basePrice: 14570 },
            { storage: "12GB / 256GB", basePrice: 15630 }
        ]
    },
    {
        // FIX: GSMArena uses "ce2-lite" (no hyphen between ce and 2)
        category: "mobile",
        brand: "OnePlus",
        modelName: "One Plus Nord CE 2 Lite 5G",
        slug: "oneplus-one-plus-nord-ce-2-lite-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/oneplus-nord-ce-2-lite-5g-0.jpg",
        variants: [
            { storage: "6GB / 128GB", basePrice: 7570 },
            { storage: "8GB / 128GB", basePrice: 7990 }
        ]
    },
    {
        category: "mobile",
        brand: "OnePlus",
        modelName: "One Plus 10R 5G",
        slug: "oneplus-one-plus-10r-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/oneplus-10r.jpg",
        variants: [
            { storage: "8GB / 128GB", basePrice: 9830 },
            { storage: "12GB / 256GB", basePrice: 10560 }
        ]
    },
    {
        category: "mobile",
        brand: "OnePlus",
        modelName: "One Plus Nord 2T 5G",
        slug: "oneplus-one-plus-nord-2t-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/oneplus-nord-2t.jpg",
        variants: [
            { storage: "8GB / 128GB", basePrice: 9280 },
            { storage: "12GB / 256GB", basePrice: 9850 }
        ]
    },
    {
        category: "mobile",
        brand: "OnePlus",
        modelName: "One Plus 10T 5G",
        slug: "oneplus-one-plus-10t-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/oneplus-10t.jpg",
        variants: [
            { storage: "8GB / 128GB", basePrice: 14010 },
            { storage: "12GB / 256GB", basePrice: 14490 },
            { storage: "16GB / 256GB", basePrice: 15710 }
        ]
    },
    {
        category: "mobile",
        brand: "OnePlus",
        modelName: "One Plus 11 5G",
        slug: "oneplus-one-plus-11-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/oneplus-11.jpg",
        variants: [
            { storage: "8GB / 128GB", basePrice: 27970 },
            { storage: "16GB / 256GB", basePrice: 25390 }
        ]
    },
    {
        // GSMArena tracks Marble Odyssey as a colour variant of the standard OnePlus 11 —
        // no dedicated bigpic asset exists, so we reuse the standard OnePlus 11 image.
        category: "mobile",
        brand: "OnePlus",
        modelName: "One Plus 11 5G Marble Edition",
        slug: "oneplus-one-plus-11-5g-marble-edition",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/oneplus-11.jpg",
        variants: [
            { storage: "16GB / 256GB", basePrice: 26630 }
        ]
    },
    {
        // FIX: GSMArena uses the -5g suffix in the filename
        category: "mobile",
        brand: "OnePlus",
        modelName: "One Plus 11R 5G",
        slug: "oneplus-one-plus-11r-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/oneplus-ace2.jpg",
        variants: [
            { storage: "8GB / 128GB", basePrice: 20160 },
            { storage: "16GB / 256GB", basePrice: 21020 },
            { storage: "18GB / 512GB", basePrice: 21870 }
        ]
    },
    {
        // Verified GSMArena bigpic filename has a trailing dash before .jpg
        category: "mobile",
        brand: "OnePlus",
        modelName: "One Plus Nord CE 3 Lite 5G",
        slug: "oneplus-one-plus-nord-ce-3-lite-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/oneplus-nord-ce-3-lite-.jpg",
        variants: [
            { storage: "128GB", basePrice: 11410 },
            { storage: "256GB", basePrice: 12080 }
        ]
    },
    {
        // Verified GSMArena bigpic filename is oneplus-nord-3r.jpg
        category: "mobile",
        brand: "OnePlus",
        modelName: "One Plus Nord 3 5G",
        slug: "oneplus-one-plus-nord-3-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/oneplus-nord-3r.jpg",
        variants: [
            { storage: "8GB / 128GB", basePrice: 14270 },
            { storage: "16GB / 256GB", basePrice: 15220 }
        ]
    },
    {
        // Verified GSMArena bigpic filename is oneplus-nord-ce3-5g.jpg
        category: "mobile",
        brand: "OnePlus",
        modelName: "One Plus Nord CE 3 5G",
        slug: "oneplus-one-plus-nord-ce-3-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/oneplus-nord-ce3-5g.jpg",
        variants: [
            { storage: "8GB / 128GB", basePrice: 13440 },
            { storage: "12GB / 256GB", basePrice: 14070 }
        ]
    },
    {
        category: "mobile",
        brand: "OnePlus",
        modelName: "One Plus Open",
        slug: "oneplus-one-plus-open",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/oneplus-open-10.jpg",
        variants: [
            { storage: "16GB / 512GB", basePrice: 54320 }
        ]
    },
    {
        category: "mobile",
        brand: "OnePlus",
        modelName: "One Plus 12",
        slug: "oneplus-one-plus-12",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/oneplus-12.jpg",
        variants: [
            { storage: "12GB / 256GB", basePrice: 35190 },
            { storage: "16GB / 512GB", basePrice: 37180 }
        ]
    },
    {
        category: "mobile",
        brand: "OnePlus",
        modelName: "One Plus 12R",
        slug: "oneplus-one-plus-12r",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/oneplus-12r.jpg",
        variants: [
            { storage: "8GB / 128GB", basePrice: 24730 },
            { storage: "8GB / 256GB", basePrice: 25390 },
            { storage: "16GB / 256GB", basePrice: 26340 }
        ]
    },
    {
        // FIX: GSMArena uses "nord-ce-4-5g" with the full 5g suffix
        category: "mobile",
        brand: "OnePlus",
        modelName: "One Plus Nord CE 4 5G",
        slug: "oneplus-one-plus-nord-ce-4-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/oneplus-nord-ce4-.jpg",
        variants: [
            { storage: "128GB", basePrice: 13540 },
            { storage: "256GB", basePrice: 15460 }
        ]
    },
    {
        category: "mobile",
        brand: "OnePlus",
        modelName: "One Plus Nord CE 4 Lite 5G",
        slug: "oneplus-one-plus-nord-ce-4-lite-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/oneplus-nord-ce4-lite-intl.jpg",
        variants: [
            { storage: "128GB", basePrice: 13030 },
            { storage: "256GB", basePrice: 13500 }
        ]
    },
    {
        // FIX: GSMArena uses "nord4" (no hyphen before 4)
        category: "mobile",
        brand: "OnePlus",
        modelName: "One Plus Nord 4",
        slug: "oneplus-one-plus-nord-4",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/oneplus-nord4.jpg",
        variants: [
            { storage: "8GB / 128GB", basePrice: 17880 },
            { storage: "8GB / 256GB", basePrice: 19510 },
            { storage: "12GB / 256GB", basePrice: 19970 }
        ]
    },
    {
        category: "mobile",
        brand: "OnePlus",
        modelName: "One Plus 13",
        slug: "oneplus-one-plus-13",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/oneplus-13.jpg",
        variants: [
            { storage: "12GB / 256GB", basePrice: 44600 },
            { storage: "16GB / 512GB", basePrice: 46200 },
            { storage: "24GB / 1TB", basePrice: 50500 }
        ]
    },
    {
        category: "mobile",
        brand: "OnePlus",
        modelName: "One Plus 13R",
        slug: "oneplus-one-plus-13r",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/oneplus-13r.jpg",
        variants: [
            { storage: "12GB / 256GB", basePrice: 28000 },
            { storage: "16GB / 512GB", basePrice: 29800 }
        ]
    },
    {
        // Verified GSMArena bigpic filename has a trailing dash before .jpg
        category: "mobile",
        brand: "OnePlus",
        modelName: "One Plus 13S",
        slug: "oneplus-one-plus-13s",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/oneplus-13s-.jpg",
        variants: [
            { storage: "256GB", basePrice: 35000 },
            { storage: "512GB", basePrice: 37500 }
        ]
    },
    {
        // Verified GSMArena bigpic filename is oneplus-nord5.jpg (no dash, no -5g suffix)
        category: "mobile",
        brand: "OnePlus",
        modelName: "One Plus Nord 5",
        slug: "oneplus-one-plus-nord-5",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/oneplus-nord5.jpg",
        variants: [
            { storage: "8GB / 256GB", basePrice: 23200 },
            { storage: "12GB / 256GB", basePrice: 25500 },
            { storage: "12GB / 512GB", basePrice: 26000 }
        ]
    },
    {
        category: "mobile",
        brand: "OnePlus",
        modelName: "One Plus Nord CE 5",
        slug: "oneplus-one-plus-nord-ce-5",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/oneplus-nord-ce5.jpg",
        variants: [
            { storage: "8GB / 128GB", basePrice: 16900 },
            { storage: "8GB / 256GB", basePrice: 18300 },
            { storage: "12GB / 256GB", basePrice: 19200 }
        ]
    },
    {
        category: "mobile",
        brand: "OnePlus",
        modelName: "One Plus 15",
        slug: "oneplus-one-plus-15",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/oneplus-15.jpg",
        variants: [
            { storage: "12GB / 256GB", basePrice: 53300 },
            { storage: "16GB / 512GB", basePrice: 55800 }
        ]
    },
    {
        category: "mobile",
        brand: "OnePlus",
        modelName: "One Plus 15R",
        slug: "oneplus-one-plus-15r",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/oneplus-15r.jpg",
        variants: [
            { storage: "256GB", basePrice: 32500 },
            { storage: "512GB", basePrice: 34200 }
        ]
    },
    {
        // Verified GSMArena bigpic filename is oneplus-turbo-6.jpg (Nord 6 is
        // listed on GSMArena under its Chinese "Ace/Turbo" naming)
        category: "mobile",
        brand: "OnePlus",
        modelName: "One Plus Nord 6 5G",
        slug: "oneplus-one-plus-nord-6-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/oneplus-turbo-6.jpg",
        variants: [
            { storage: "8GB / 256GB", basePrice: 26500 },
            { storage: "12GB / 256GB", basePrice: 28500 }
        ]
    },
];

// ─── SEED FUNCTION ────────────────────────────────────────────────────────────

async function seed() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");
        await Device.deleteMany({ brand: "OnePlus" });
        console.log("🗑️  Cleared existing OnePlus devices");
        await Device.insertMany(devices);
        console.log(`✅ Seeded ${devices.length} mobile devices successfully`);
        process.exit(0);
    } catch (err) {
        console.error("❌ Seed failed:", err);
        process.exit(1);
    }
}
seed();