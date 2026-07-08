import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import Device from "../models/Device.js";

const devices = [
    // ══════════════════════════════════════════════════════
    //  APPLE — iPad All Series
    // ══════════════════════════════════════════════════════
    {
        category: "tablet",
        brand: "Apple",
        modelName: "iPad Air 1st Gen (Wi-Fi Only)",
        slug: "apple-ipad-air-1st-gen-wi-fi-only",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-ipad-air.jpg",
        variants: [
            { storage: "16 GB", basePrice: 2660 },
            { storage: "32GB", basePrice: 2900 },
            { storage: "64GB", basePrice: 3350 },
            { storage: "128GB", basePrice: 3940 }
        ]
    },
    {
        category: "tablet",
        brand: "Apple",
        modelName: "iPad Air 1st Gen (Wi-Fi + Cellular)",
        slug: "apple-ipad-air-1st-gen-wi-fi-cellular",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-ipad-air.jpg",
        variants: [
            { storage: "16 GB", basePrice: 2660 },
            { storage: "32GB", basePrice: 2900 },
            { storage: "64GB", basePrice: 3350 },
            { storage: "128GB", basePrice: 3940 }
        ]
    },
    {
        category: "tablet",
        brand: "Apple",
        modelName: "iPad Air 2nd Gen (Wi-Fi Only)",
        slug: "apple-ipad-air-2nd-gen-wi-fi-only",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-ipad2-new.jpg",
        variants: [
            { storage: "16 GB", basePrice: 3050 },
            { storage: "32GB", basePrice: 3290 },
            { storage: "64GB", basePrice: 4620 },
            { storage: "128GB", basePrice: 5370 }
        ]
    },
    {
        category: "tablet",
        brand: "Apple",
        modelName: "iPad Air 2nd Gen (Wi-Fi + Cellular)",
        slug: "apple-ipad-air-2nd-gen-wi-fi-cellular",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-ipad2-new.jpg",
        variants: [
            { storage: "16 GB", basePrice: 3740 },
            { storage: "32GB", basePrice: 4620 },
            { storage: "64GB", basePrice: 5460 },
            { storage: "128GB", basePrice: 5850 }
        ]
    },
    {
        category: "tablet",
        brand: "Apple",
        modelName: "iPad Air 3rd Gen (Wi-Fi Only)",
        slug: "apple-ipad-air-3rd-gen-wi-fi-only",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-ipad-3-new.jpg",
        variants: [
            { storage: "64GB", basePrice: 13200 },
            { storage: "256GB", basePrice: 16100 }
        ]
    },
    {
        category: "tablet",
        brand: "Apple",
        modelName: "iPad Air 3rd Gen (Wi-Fi + Cellular)",
        slug: "apple-ipad-air-3rd-gen-wi-fi-cellular",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-ipad-3-new.jpg",
        variants: [
            { storage: "64GB", basePrice: 14400 },
            { storage: "256GB", basePrice: 17200 }
        ]
    },
    {
        category: "tablet",
        brand: "Apple",
        modelName: "iPad Air 4th Gen (Wi-Fi Only)",
        slug: "apple-ipad-air-4th-gen-wi-fi-only",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-ipad-3-new.jpg",
        variants: [
            { storage: "64GB", basePrice: 19700 },
            { storage: "256GB", basePrice: 20700 }
        ]
    },
    {
        category: "tablet",
        brand: "Apple",
        modelName: "iPad Air 4th Gen (Wi-Fi + Cellular)",
        slug: "apple-ipad-air-4th-gen-wi-fi-cellular",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-ipad-3-new.jpg",
        variants: [
            { storage: "64GB", basePrice: 20800 },
            { storage: "256GB", basePrice: 21600 }
        ]
    },
    {
        category: "tablet",
        brand: "Apple",
        modelName: "iPad Mini 1st Gen (Wi-Fi Only)",
        slug: "apple-ipad-mini-1st-gen-wi-fi-only",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-ipad-mini-final.jpg",
        variants: [
            { storage: "16GB", basePrice: 1330 },
            { storage: "32GB", basePrice: 1540 },
            { storage: "64GB", basePrice: 1730 }
        ]
    },
    {
        category: "tablet",
        brand: "Apple",
        modelName: "iPad Mini 1st Gen (Wi-Fi + Cellular)",
        slug: "apple-ipad-mini-1st-gen-wi-fi-cellular",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-ipad-mini-final.jpg",
        variants: [
            { storage: "16GB", basePrice: 1490 },
            { storage: "32GB", basePrice: 1960 },
            { storage: "64GB", basePrice: 2050 }
        ]
    },
    {
        category: "tablet",
        brand: "Apple",
        modelName: "iPad Mini 2nd Gen (Wi-Fi Only)",
        slug: "apple-ipad-mini-2nd-gen-wi-fi-only",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-ipad-mini2.jpg",
        variants: [
            { storage: "16GB", basePrice: 2210 },
            { storage: "32GB", basePrice: 2160 },
            { storage: "64GB", basePrice: 2800 },
            { storage: "128GB", basePrice: 3080 }
        ]
    },
    {
        category: "tablet",
        brand: "Apple",
        modelName: "iPad Mini 2nd Gen (Wi-Fi + Cellular)",
        slug: "apple-ipad-mini-2nd-gen-wi-fi-cellular",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-ipad-mini2.jpg",
        variants: [
            { storage: "16GB", basePrice: 2430 },
            { storage: "32GB", basePrice: 2660 },
            { storage: "64GB", basePrice: 3270 },
            { storage: "128GB", basePrice: 3650 }
        ]
    },
    {
        category: "tablet",
        brand: "Apple",
        modelName: "iPad Mini 3rd Gen (Wi-Fi Only)",
        slug: "apple-ipad-mini-3rd-gen-wi-fi-only",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-ipad-mini-3-new.jpg",
        variants: [
            { storage: "16GB", basePrice: 2210 },
            { storage: "64GB", basePrice: 2850 },
            { storage: "128GB", basePrice: 3440 }
        ]
    },
    {
        category: "tablet",
        brand: "Apple",
        modelName: "iPad Mini 3rd Gen (Wi-Fi + Cellular)",
        slug: "apple-ipad-mini-3rd-gen-wi-fi-cellular",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-ipad-mini-3-new.jpg",
        variants: [
            { storage: "16GB", basePrice: 2950 },
            { storage: "64GB", basePrice: 3440 },
            { storage: "128GB", basePrice: 3840 }
        ]
    },
    {
        category: "tablet",
        brand: "Apple",
        modelName: "iPad Mini 4th Gen (Wi-Fi Only)",
        slug: "apple-ipad-mini-4th-gen-wi-fi-only",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-ipad-mini-4.jpg",
        variants: [
            { storage: "16GB", basePrice: 3340 },
            { storage: "32GB", basePrice: 4330 },
            { storage: "64GB", basePrice: 4520 },
            { storage: "128GB", basePrice: 6200 }
        ]
    },
    {
        category: "tablet",
        brand: "Apple",
        modelName: "iPad Mini 4th Gen (Wi-Fi + Cellular)",
        slug: "apple-ipad-mini-4th-gen-wi-fi-cellular",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-ipad-mini-4.jpg",
        variants: [
            { storage: "16GB", basePrice: 5020 },
            { storage: "32GB", basePrice: 6500 },
            { storage: "64GB", basePrice: 7190 },
            { storage: "128GB", basePrice: 7180 }
        ]
    },
    {
        category: "tablet",
        brand: "Apple",
        modelName: "iPad mini 5th Gen (Wi-Fi Only)",
        slug: "apple-ipad-mini-5th-gen-wi-fi-only",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-ipad-mini-2019.jpg",
        variants: [
            { storage: "64GB", basePrice: 12250 },
            { storage: "256GB", basePrice: 12250 }
        ]
    },
    {
        category: "tablet",
        brand: "Apple",
        modelName: "iPad mini 5th Gen (Wi-Fi + Cellular)",
        slug: "apple-ipad-mini-5th-gen-wi-fi-cellular",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-ipad-mini-2019.jpg",
        variants: [
            { storage: "64GB", basePrice: 13550 },
            { storage: "256GB", basePrice: 14450 }
        ]
    },
    {
        category: "tablet",
        brand: "Apple",
        modelName: "iPad mini 6th Gen (Wi-Fi Only)",
        slug: "apple-ipad-mini-6th-gen-wi-fi-only",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-ipad-mini-2021.jpg",
        variants: [
            { storage: "64GB", basePrice: 21150 },
            { storage: "256GB", basePrice: 22320 }
        ]
    },
    {
        category: "tablet",
        brand: "Apple",
        modelName: "iPad mini 6th Gen (Wi-Fi + Cellular)",
        slug: "apple-ipad-mini-6th-gen-wi-fi-cellular",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-ipad-mini-2021.jpg",
        variants: [
            { storage: "64GB", basePrice: 23200 },
            { storage: "256GB", basePrice: 24390 }
        ]
    },
    {
        category: "tablet",
        brand: "Apple",
        modelName: "iPad Pro 12.9″ 1st Gen (Wi-Fi Only)",
        slug: "apple-ipad-pro-12-9-1st-gen-wi-fi-only",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-ipad-pro-.jpg",
        variants: [
            { storage: "32GB", basePrice: 10050 },
            { storage: "128GB", basePrice: 10740 },
            { storage: "256GB", basePrice: 11340 }
        ]
    },
    {
        category: "tablet",
        brand: "Apple",
        modelName: "iPad Pro 12.9″ 1st Gen (Wi-Fi+Cellular)",
        slug: "apple-ipad-pro-12-9-1st-gen-wi-fi-cellular",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-ipad-pro-.jpg",
        variants: [
            { storage: "32GB", basePrice: 11630 },
            { storage: "128GB", basePrice: 12320 },
            { storage: "256GB", basePrice: 13700 }
        ]
    },
    {
        category: "tablet",
        brand: "Apple",
        modelName: "iPad Pro 12.9″ 2nd Gen (Wi-Fi Only)",
        slug: "apple-ipad-pro-12-9-2nd-gen-wi-fi-only",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-ipad-pro-129-2017.jpg",
        variants: [
            { storage: "64GB", basePrice: 12670 },
            { storage: "256GB", basePrice: 13950 },
            { storage: "512GB", basePrice: 16700 }
        ]
    },
    {
        category: "tablet",
        brand: "Apple",
        modelName: "iPad Pro 12.9″ 2nd Gen (Wi-Fi+Cellular)",
        slug: "apple-ipad-pro-12-9-2nd-gen-wi-fi-cellular",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-ipad-pro-129-2017.jpg",
        variants: [
            { storage: "64GB", basePrice: 14640 },
            { storage: "256GB", basePrice: 16610 },
            { storage: "512GB", basePrice: 18380 }
        ]
    },
    {
        category: "tablet",
        brand: "Apple",
        modelName: "iPad Pro 12.9″ 3rd Gen (Wi-Fi Only)",
        slug: "apple-ipad-pro-12-9-3rd-gen-wi-fi-only",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-ipad-pro-129-2018.jpg",
        variants: [
            { storage: "64GB", basePrice: 17410 },
            { storage: "256GB", basePrice: 19020 },
            { storage: "512GB", basePrice: 22660 },
            { storage: "1TB", basePrice: 26110 }
        ]
    },
    {
        category: "tablet",
        brand: "Apple",
        modelName: "iPad Pro 12.9″ 3rd Gen (Wi-Fi+Cellular)",
        slug: "apple-ipad-pro-12-9-3rd-gen-wi-fi-cellular",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-ipad-pro-129-2018.jpg",
        variants: [
            { storage: "64GB", basePrice: 20710 },
            { storage: "256GB", basePrice: 23910 },
            { storage: "512GB", basePrice: 25420 },
            { storage: "1TB", basePrice: 27780 }
        ]
    },
    {
        category: "tablet",
        brand: "Apple",
        modelName: "iPad Pro 12.9″ 4th Gen (Wi-Fi Only)",
        slug: "apple-ipad-pro-12-9-4th-gen-wi-fi-only",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-ipad-pro-12-2020.jpg",
        variants: [
            { storage: "128GB", basePrice: 24630 },
            { storage: "256GB", basePrice: 25220 },
            { storage: "512GB", basePrice: 29820 },
            { storage: "1TB", basePrice: 32020 }
        ]
    },
    {
        category: "tablet",
        brand: "Apple",
        modelName: "iPad Pro 12.9″ 4th Gen (Wi-Fi+Cellular)",
        slug: "apple-ipad-pro-12-9-4th-gen-wi-fi-cellular",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-ipad-pro-12-2020.jpg",
        variants: [
            { storage: "128GB", basePrice: 26650 },
            { storage: "256GB", basePrice: 28510 },
            { storage: "512GB", basePrice: 30280 },
            { storage: "1TB", basePrice: 33890 }
        ]
    },
    {
        category: "tablet",
        brand: "Apple",
        modelName: "iPad Pro 12.9″ 5th Gen (Wi-Fi Only)",
        slug: "apple-ipad-pro-12-9-5th-gen-wi-fi-only",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-ipad-pro-129-2021.jpg",
        variants: [
            { storage: "128GB", basePrice: 35170 },
            { storage: "256GB", basePrice: 37440 },
            { storage: "512GB", basePrice: 41570 },
            { storage: "1TB", basePrice: 44530 },
            { storage: "2TB", basePrice: 48470 }
        ]
    },
    {
        category: "tablet",
        brand: "Apple",
        modelName: "iPad Pro 12.9″ 5th Gen (Wi-Fi+Cellular)",
        slug: "apple-ipad-pro-12-9-5th-gen-wi-fi-cellular",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-ipad-pro-129-2021.jpg",
        variants: [
            { storage: "128GB", basePrice: 37630 },
            { storage: "256GB", basePrice: 40490 },
            { storage: "512GB", basePrice: 46000 },
            { storage: "1TB", basePrice: 48470 },
            { storage: "2TB", basePrice: 52900 }
        ]
    },
    {
        category: "tablet",
        brand: "Apple",
        modelName: "iPad Pro 9.7″ 1st Gen (Wi-Fi Only)",
        slug: "apple-ipad-pro-9-7-1st-gen-wi-fi-only",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-ipad-pro-97.jpg",
        variants: [
            { storage: "32GB", basePrice: 10040 },
            { storage: "128GB", basePrice: 10130 },
            { storage: "256GB", basePrice: 11210 }
        ]
    },
    {
        category: "tablet",
        brand: "Apple",
        modelName: "iPad Pro 9.7″ 1st Gen (Wi-Fi+Cellular)",
        slug: "apple-ipad-pro-9-7-1st-gen-wi-fi-cellular",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-ipad-pro-97.jpg",
        variants: [
            { storage: "32GB", basePrice: 9940 },
            { storage: "128GB", basePrice: 11520 },
            { storage: "256GB", basePrice: 12400 }
        ]
    },
    {
        category: "tablet",
        brand: "Apple",
        modelName: "iPad 9.7″ 5th Gen (Wi-Fi Only)",
        slug: "apple-ipad-9-7-5th-gen-wi-fi-only",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-ipad-97-2017.jpg",
        variants: [
            { storage: "32GB", basePrice: 8900 },
            { storage: "128GB", basePrice: 9000 },
            { storage: "128 GB", basePrice: 9600 }
        ]
    },
    {
        category: "tablet",
        brand: "Apple",
        modelName: "iPad 9.7″ 6th Gen (Wi-Fi Only)",
        slug: "apple-ipad-9-7-6th-gen-wi-fi-only",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-ipad-97-2018.jpg",
        variants: [
            { storage: "32 GB", basePrice: 10000 },
            { storage: "128 GB", basePrice: 11300 }
        ]
    },
    {
        category: "tablet",
        brand: "Apple",
        modelName: "iPad 9.7″ 6th Gen (Wi-Fi+Cellular)",
        slug: "apple-ipad-9-7-6th-gen-wi-fi-cellular",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-ipad-97-2018.jpg",
        variants: [
            { storage: "32 GB", basePrice: 10250 },
            { storage: "128 GB", basePrice: 12100 }
        ]
    },
    {
        category: "tablet",
        brand: "Apple",
        modelName: "iPad Pro 10.5″ 2nd Gen (Wi-Fi Only)",
        slug: "apple-ipad-pro-10-5-2nd-gen-wi-fi-only",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-ipad-pro-105-2017.jpg",
        variants: [
            { storage: "64GB", basePrice: 13100 },
            { storage: "256GB", basePrice: 14880 },
            { storage: "512GB", basePrice: 16140 }
        ]
    },
    {
        category: "tablet",
        brand: "Apple",
        modelName: "iPad Pro 10.5″ 2nd Gen (Wi-Fi+Cellular)",
        slug: "apple-ipad-pro-10-5-2nd-gen-wi-fi-cellular",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-ipad-pro-105-2017.jpg",
        variants: [
            { storage: "64GB", basePrice: 13790 },
            { storage: "256GB", basePrice: 15470 },
            { storage: "512GB", basePrice: 19310 }
        ]
    },
    {
        category: "tablet",
        brand: "Apple",
        modelName: "iPad 10.2″ 7th Gen (Wi-Fi Only)",
        slug: "apple-ipad-10-2-7th-gen-wi-fi-only",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-ipad7-102-inches.jpg",
        variants: [
            { storage: "32 GB", basePrice: 11600 },
            { storage: "128 GB", basePrice: 12200 }
        ]
    },
    {
        category: "tablet",
        brand: "Apple",
        modelName: "iPad 10.2″ 7th Gen (Wi-Fi+Cellular)",
        slug: "apple-ipad-10-2-7th-gen-wi-fi-cellular",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-ipad7-102-inches.jpg",
        variants: [
            { storage: "32 GB", basePrice: 12300 },
            { storage: "128 GB", basePrice: 13600 }
        ]
    },
    {
        category: "tablet",
        brand: "Apple",
        modelName: "iPad Air M2 11″ (Wi-Fi Only)",
        slug: "apple-ipad-air-m2-11-wi-fi-only",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-ipad-air-11-2024.jpg",
        variants: [
            { storage: "128GB", basePrice: 30800 },
            { storage: "256GB", basePrice: 33600 },
            { storage: "512GB", basePrice: 35870 },
            { storage: "1TB", basePrice: 38820 }
        ]
    },
    {
        category: "tablet",
        brand: "Apple",
        modelName: "iPad Air M2 11″ (Wi-Fi + Cellular)",
        slug: "apple-ipad-air-m2-11-wi-fi-cellular",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-ipad-air-11-2024.jpg",
        variants: [
            { storage: "128GB", basePrice: 38900 },
            { storage: "256GB", basePrice: 40700 },
            { storage: "512GB", basePrice: 42760 },
            { storage: "1TB", basePrice: 46700 }
        ]
    },
    {
        category: "tablet",
        brand: "Apple",
        modelName: "iPad Air M2 13″ (Wi-Fi Only)",
        slug: "apple-ipad-air-m2-13-wi-fi-only",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-ipad-air-13-2024.jpg",
        variants: [
            { storage: "128GB", basePrice: 40500 },
            { storage: "256GB", basePrice: 43100 },
            { storage: "512GB", basePrice: 47100 },
            { storage: "1TB", basePrice: 49560 }
        ]
    },
    {
        category: "tablet",
        brand: "Apple",
        modelName: "iPad Air M2 13″ (Wi-Fi + Cellular)",
        slug: "apple-ipad-air-m2-13-wi-fi-cellular",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-ipad-air-13-2024.jpg",
        variants: [
            { storage: "128GB", basePrice: 51400 },
            { storage: "256GB", basePrice: 55000 },
            { storage: "512GB", basePrice: 56370 },
            { storage: "1TB", basePrice: 58040 }
        ]
    },
    {
        category: "tablet",
        brand: "Apple",
        modelName: "iPad Pro M4 11″ (Wi-Fi Only)",
        slug: "apple-ipad-pro-m4-11-wi-fi-only",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-ipad-pro-11-2024.jpg",
        variants: [
            { storage: "256GB", basePrice: 49850 },
            { storage: "512GB", basePrice: 55610 },
            { storage: "1TB", basePrice: 60830 },
            { storage: "2TB", basePrice: 65750 }
        ]
    },
    {
        category: "tablet",
        brand: "Apple",
        modelName: "iPad Pro M4 11″ (Wi-Fi + Cellular)",
        slug: "apple-ipad-pro-m4-11-wi-fi-cellular",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-ipad-pro-11-2024.jpg",
        variants: [
            { storage: "256GB", basePrice: 55850 },
            { storage: "512GB", basePrice: 62730 },
            { storage: "1TB", basePrice: 67970 },
            { storage: "2TB", basePrice: 72250 }
        ]
    },
    {
        category: "tablet",
        brand: "Apple",
        modelName: "iPad Pro M4 13″ (Wi-Fi Only)",
        slug: "apple-ipad-pro-m4-13-wi-fi-only",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-ipad-pro-13-2024.jpg",
        variants: [
            { storage: "256GB", basePrice: 64050 },
            { storage: "512GB", basePrice: 69770 },
            { storage: "1TB", basePrice: 74350 },
            { storage: "2TB", basePrice: 79050 }
        ]
    },
    {
        category: "tablet",
        brand: "Apple",
        modelName: "iPad Pro M4 13″ (Wi-Fi + Cellular)",
        slug: "apple-ipad-pro-m4-13-wi-fi-cellular",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-ipad-pro-13-2024.jpg",
        variants: [
            { storage: "256GB", basePrice: 70550 },
            { storage: "512GB", basePrice: 78250 },
            { storage: "1TB", basePrice: 82050 },
            { storage: "2TB", basePrice: 85750 }
        ]
    },
    {
        category: "tablet",
        brand: "Apple",
        modelName: "iPad 10.2″ 8th Gen (Wi-Fi Only)",
        slug: "apple-ipad-10-2-8th-gen-wi-fi-only",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-ipad8-102-inches-2020.jpg",
        variants: [
            { storage: "32 GB", basePrice: 12500 },
            { storage: "128 GB", basePrice: 14000 }
        ]
    },
    {
        category: "tablet",
        brand: "Apple",
        modelName: "iPad 10.2″ 8th Gen (Wi-Fi+Cellular)",
        slug: "apple-ipad-10-2-8th-gen-wi-fi-cellular",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-ipad8-102-inches-2020.jpg",
        variants: [
            { storage: "32 GB", basePrice: 13900 },
            { storage: "128 GB", basePrice: 15800 }
        ]
    },
    {
        category: "tablet",
        brand: "Apple",
        modelName: "iPad 10.2″ 9th Gen (Wi-Fi Only)",
        slug: "apple-ipad-10-2-9th-gen-wi-fi-only",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-ipad-102-2021-.jpg",
        variants: [
            { storage: "64GB", basePrice: 15400 },
            { storage: "256GB", basePrice: 16800 }
        ]
    },
    {
        category: "tablet",
        brand: "Apple",
        modelName: "iPad 10.2″ 9th Gen (Wi-Fi+Cellular)",
        slug: "apple-ipad-10-2-9th-gen-wi-fi-cellular",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-ipad-102-2021-.jpg",
        variants: [
            { storage: "64GB", basePrice: 17200 },
            { storage: "256GB", basePrice: 19100 }
        ]
    },
    {
        category: "tablet",
        brand: "Apple",
        modelName: "iPad Pro 11″ 1st Gen (Wi-Fi Only)",
        slug: "apple-ipad-pro-11-1st-gen-wi-fi-only",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-ipad-pro-11-2018.jpg",
        variants: [
            { storage: "64GB", basePrice: 15950 },
            { storage: "256GB", basePrice: 17350 },
            { storage: "512GB", basePrice: 19650 },
            { storage: "1TB", basePrice: 22650 }
        ]
    },
    {
        category: "tablet",
        brand: "Apple",
        modelName: "iPad Pro 11″ 1st Gen (Wi-Fi+Cellular)",
        slug: "apple-ipad-pro-11-1st-gen-wi-fi-cellular",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-ipad-pro-11-2018.jpg",
        variants: [
            { storage: "64GB", basePrice: 18350 },
            { storage: "256GB", basePrice: 20350 },
            { storage: "512GB", basePrice: 22950 },
            { storage: "1TB", basePrice: 25590 }
        ]
    },
    {
        category: "tablet",
        brand: "Apple",
        modelName: "iPad Pro 11″ 2nd Gen (Wi-Fi Only)",
        slug: "apple-ipad-pro-11-2nd-gen-wi-fi-only",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-ipad-pro-11-2020.jpg",
        variants: [
            { storage: "128GB", basePrice: 18750 },
            { storage: "256GB", basePrice: 21150 },
            { storage: "512GB", basePrice: 23750 },
            { storage: "1TB", basePrice: 26530 }
        ]
    },
    {
        category: "tablet",
        brand: "Apple",
        modelName: "iPad Pro 11″ 2nd Gen (Wi-Fi+Cellular)",
        slug: "apple-ipad-pro-11-2nd-gen-wi-fi-cellular",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-ipad-pro-11-2020.jpg",
        variants: [
            { storage: "128GB", basePrice: 21050 },
            { storage: "256GB", basePrice: 24150 },
            { storage: "512GB", basePrice: 25960 },
            { storage: "1TB", basePrice: 29190 }
        ]
    },
    {
        category: "tablet",
        brand: "Apple",
        modelName: "iPad Pro 11″ 3rd Gen (Wi-Fi Only)",
        slug: "apple-ipad-pro-11-3rd-gen-wi-fi-only",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-ipad-pro-11-2021.jpg",
        variants: [
            { storage: "128GB", basePrice: 27150 },
            { storage: "256GB", basePrice: 29450 },
            { storage: "512GB", basePrice: 33690 },
            { storage: "1TB", basePrice: 38230 },
            { storage: "2TB", basePrice: 41450 }
        ]
    },
    {
        category: "tablet",
        brand: "Apple",
        modelName: "iPad Pro 11″ 3rd Gen (Wi-Fi+Cellular)",
        slug: "apple-ipad-pro-11-3rd-gen-wi-fi-cellular",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-ipad-pro-11-2021.jpg",
        variants: [
            { storage: "128GB", basePrice: 33550 },
            { storage: "256GB", basePrice: 35850 },
            { storage: "512GB", basePrice: 39170 },
            { storage: "1TB", basePrice: 42450 },
            { storage: "2TB", basePrice: 45450 }
        ]
    },
    {
        category: "tablet",
        brand: "Apple",
        modelName: "iPad Air 5th Gen (Wi-Fi Only)",
        slug: "apple-ipad-air-5th-gen-wi-fi-only",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-ipad-air-2022.jpg",
        variants: [
            { storage: "64 GB", basePrice: 22400 },
            { storage: "256 GB", basePrice: 24200 }
        ]
    },
    {
        category: "tablet",
        brand: "Apple",
        modelName: "iPad Air 5th Gen (Wi-Fi + Cellular)",
        slug: "apple-ipad-air-5th-gen-wi-fi-cellular",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-ipad-air-2022.jpg",
        variants: [
            { storage: "64 GB", basePrice: 27400 },
            { storage: "256 GB", basePrice: 29900 }
        ]
    },
    {
        category: "tablet",
        brand: "Apple",
        modelName: "iPad 10.9″ 10th Gen (WiFi Only)",
        slug: "apple-ipad-10-9-10th-gen-wifi-only",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-ipad-10-2022.jpg",
        variants: [
            { storage: "64 GB", basePrice: 16400 },
            { storage: "256 GB", basePrice: 20500 }
        ]
    },
    {
        category: "tablet",
        brand: "Apple",
        modelName: "iPad 10.9″ 10th Gen (WiFi+Cellular)",
        slug: "apple-ipad-10-9-10th-gen-wifi-cellular",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-ipad-10-2022.jpg",
        variants: [
            { storage: "64 GB", basePrice: 20800 },
            { storage: "256 GB", basePrice: 23100 }
        ]
    },
    {
        category: "tablet",
        brand: "Apple",
        modelName: "iPad Pro 11″ 4th Gen (WiFi Only)",
        slug: "apple-ipad-pro-11-4th-gen-wifi-only",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-ipad-pro-11-2022.jpg",
        variants: [
            { storage: "128GB", basePrice: 38850 },
            { storage: "256GB", basePrice: 41600 },
            { storage: "512GB", basePrice: 46220 },
            { storage: "1TB", basePrice: 49200 },
            { storage: "2TB", basePrice: 54800 }
        ]
    },
    {
        category: "tablet",
        brand: "Apple",
        modelName: "iPad Pro 11″ 4th Gen (WiFi+Cellular)",
        slug: "apple-ipad-pro-11-4th-gen-wifi-cellular",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-ipad-pro-11-2022.jpg",
        variants: [
            { storage: "128GB", basePrice: 46200 },
            { storage: "256GB", basePrice: 48700 },
            { storage: "512GB", basePrice: 51200 },
            { storage: "1TB", basePrice: 53200 },
            { storage: "2TB", basePrice: 57800 }
        ]
    },
    {
        category: "tablet",
        brand: "Apple",
        modelName: "iPad Pro 12.9″ 6th Gen (Wi-Fi Only)",
        slug: "apple-ipad-pro-12-9-6th-gen-wi-fi-only",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-ipad-pro-129-2022.jpg",
        variants: [
            { storage: "128GB", basePrice: 48170 },
            { storage: "256GB", basePrice: 52010 },
            { storage: "512GB", basePrice: 55260 },
            { storage: "1TB", basePrice: 58220 },
            { storage: "2TB", basePrice: 63630 }
        ]
    },
    {
        category: "tablet",
        brand: "Apple",
        modelName: "iPad Pro 12.9″ 6th Gen (Wi-Fi+Cellular)",
        slug: "apple-ipad-pro-12-9-6th-gen-wi-fi-cellular",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-ipad-pro-129-2022.jpg",
        variants: [
            { storage: "128GB", basePrice: 56150 },
            { storage: "256GB", basePrice: 59510 },
            { storage: "512GB", basePrice: 63630 },
            { storage: "1TB", basePrice: 65370 },
            { storage: "2TB", basePrice: 69050 }
        ]
    },
    {
        category: "tablet",
        brand: "Apple",
        modelName: "iPad Mini 7th Gen (Wi-Fi Only)",
        slug: "apple-ipad-mini-7th-gen-wi-fi-only",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-ipad-mini-2024.jpg",
        variants: [
            { storage: "128GB", basePrice: 25800 },
            { storage: "256GB", basePrice: 29300 },
            { storage: "512GB", basePrice: 34780 }
        ]
    },
    {
        category: "tablet",
        brand: "Apple",
        modelName: "iPad Mini 7th Gen (Wi-Fi + Cellular)",
        slug: "apple-ipad-mini-7th-gen-wi-fi-cellular",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-ipad-mini-2024.jpg",
        variants: [
            { storage: "128GB", basePrice: 34280 },
            { storage: "256GB", basePrice: 37240 },
            { storage: "512GB", basePrice: 41670 }
        ]
    },
    {
        category: "tablet",
        brand: "Apple",
        modelName: "iPad 11th Gen Wi-Fi Only",
        slug: "apple-ipad-11th-gen-wi-fi-only",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-ipad-11-inch-2025.jpg",
        variants: [
            { storage: "128GB", basePrice: 22550 },
            { storage: "256GB", basePrice: 25150 },
            { storage: "512GB", basePrice: 30750 }
        ]
    },
    {
        category: "tablet",
        brand: "Apple",
        modelName: "iPad 11th Gen Wi-Fi + Cellular",
        slug: "apple-ipad-11th-gen-wi-fi-cellular",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-ipad-11-inch-2025.jpg",
        variants: [
            { storage: "128GB", basePrice: 26750 },
            { storage: "256GB", basePrice: 31750 },
            { storage: "512GB", basePrice: 37750 }
        ]
    },
    {
        category: "tablet",
        brand: "Apple",
        modelName: "iPad Air M3 11″ (Wi-Fi Only)",
        slug: "apple-ipad-air-m3-11-wi-fi-only",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-ipad-air-11-2025.jpg",
        variants: [
            { storage: "128GB", basePrice: 36100 },
            { storage: "256GB", basePrice: 40100 },
            { storage: "512GB", basePrice: 44730 },
            { storage: "1TB", basePrice: 52120 }
        ]
    },
    {
        category: "tablet",
        brand: "Apple",
        modelName: "iPad Air M3 11″ (Wi-Fi + Cellular)",
        slug: "apple-ipad-air-m3-11-wi-fi-cellular",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-ipad-air-11-2025.jpg",
        variants: [
            { storage: "128GB", basePrice: 46000 },
            { storage: "256GB", basePrice: 49400 },
            { storage: "512GB", basePrice: 54390 },
            { storage: "1TB", basePrice: 60300 }
        ]
    },
    {
        category: "tablet",
        brand: "Apple",
        modelName: "iPad Air M3 13″ (Wi-Fi Only)",
        slug: "apple-ipad-air-m3-13-wi-fi-only",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-ipad-air-13-2025.jpg",
        variants: [
            { storage: "128GB", basePrice: 47500 },
            { storage: "256GB", basePrice: 49500 },
            { storage: "512GB", basePrice: 58330 },
            { storage: "1TB", basePrice: 64240 }
        ]
    },
    {
        category: "tablet",
        brand: "Apple",
        modelName: "iPad Air M3 13″ (Wi-Fi + Cellular)",
        slug: "apple-ipad-air-m3-13-wi-fi-cellular",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-ipad-air-13-2025.jpg",
        variants: [
            { storage: "128GB", basePrice: 58000 },
            { storage: "256GB", basePrice: 60700 },
            { storage: "512GB", basePrice: 67200 },
            { storage: "1TB", basePrice: 73110 }
        ]
    },
    {
        category: "tablet",
        brand: "Apple",
        modelName: "iPad Pro 11-inch M5 Wi-Fi Only",
        slug: "apple-ipad-pro-11-inch-m5-wi-fi-only",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-ipad-pro-11-2024.jpg",
        variants: [
            { storage: "256GB", basePrice: 63700 },
            { storage: "512GB", basePrice: 72700 },
            { storage: "1TB", basePrice: 88700 },
            { storage: "2TB", basePrice: 98700 }
        ]
    },
    {
        category: "tablet",
        brand: "Apple",
        modelName: "iPad Pro 11-inch M5 Wi-Fi + Cellular",
        slug: "apple-ipad-pro-11-inch-m5-wi-fi-cellular",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-ipad-pro-11-2024.jpg",
        variants: [
            { storage: "256GB", basePrice: 76700 },
            { storage: "512GB", basePrice: 86700 },
            { storage: "1TB", basePrice: 96700 },
            { storage: "2TB", basePrice: 108700 }
        ]
    },
    {
        category: "tablet",
        brand: "Apple",
        modelName: "iPad Pro 13-inch M5 Wi-Fi Only",
        slug: "apple-ipad-pro-13-inch-m5-wi-fi-only",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-ipad-pro-13-2024.jpg",
        variants: [
            { storage: "256GB", basePrice: 83700 },
            { storage: "512GB", basePrice: 93700 },
            { storage: "1TB", basePrice: 103700 },
            { storage: "2TB", basePrice: 113700 }
        ]
    },
    {
        category: "tablet",
        brand: "Apple",
        modelName: "iPad Pro 13-inch M5 Wi-Fi + Cellular",
        slug: "apple-ipad-pro-13-inch-m5-wi-fi-cellular",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-ipad-pro-13-2024.jpg",
        variants: [
            { storage: "256GB", basePrice: 96700 },
            { storage: "512GB", basePrice: 106700 },
            { storage: "1TB", basePrice: 113700 },
            { storage: "2TB", basePrice: 123700 }
        ]
    },
    {
        category: "tablet",
        brand: "Apple",
        modelName: "iPad Air M4 11″ (Wi-Fi Only)",
        slug: "apple-ipad-air-m4-11-wi-fi-only",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-ipad-air-11-2025.jpg",
        variants: [
            { storage: "128GB", basePrice: 41200 },
            { storage: "256GB", basePrice: 46100 },
            { storage: "512GB", basePrice: 56200 },
            { storage: "1TB", basePrice: 67200 }
        ]
    },
    {
        category: "tablet",
        brand: "Apple",
        modelName: "iPad Air M4 11″ (Wi-Fi + Cellular)",
        slug: "apple-ipad-air-m4-11-wi-fi-cellular",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-ipad-air-11-2025.jpg",
        variants: [
            { storage: "128GB", basePrice: 50200 },
            { storage: "256GB", basePrice: 55100 },
            { storage: "512GB", basePrice: 65200 },
            { storage: "1TB", basePrice: 76200 }
        ]
    },
    {
        category: "tablet",
        brand: "Apple",
        modelName: "iPad Air M4 13″ (Wi-Fi Only)",
        slug: "apple-ipad-air-m4-13-wi-fi-only",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-ipad-air-13-2025.jpg",
        variants: [
            { storage: "128GB", basePrice: 54200 },
            { storage: "256GB", basePrice: 58100 },
            { storage: "512GB", basePrice: 67200 },
            { storage: "1TB", basePrice: 76200 }
        ]
    },
    {
        category: "tablet",
        brand: "Apple",
        modelName: "iPad Air M4 13″ (Wi-Fi + Cellular)",
        slug: "apple-ipad-air-m4-13-wi-fi-cellular",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-ipad-air-13-2025.jpg",
        variants: [
            { storage: "128GB", basePrice: 62200 },
            { storage: "256GB", basePrice: 67100 },
            { storage: "512GB", basePrice: 76200 },
            { storage: "1TB", basePrice: 86200 }
        ]
    },
];

async function seed() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");
        await Device.deleteMany({ category: "tablet", brand: "Apple" });
        console.log("Cleared existing Apple tablet devices");
        await Device.insertMany(devices);
        console.log(`✅ Seeded ${devices.length} Apple tablet devices successfully`);
        process.exit(0);
    } catch (err) {
        console.error("❌ Seed failed:", err.message);
        process.exit(1);
    }
}

seed();