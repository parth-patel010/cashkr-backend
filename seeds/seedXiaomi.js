import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import Device from "../models/Device.js";

const devices = [
    // ══════════════════════════════════════════════════════
    //  XIAOMI — All Series
    // ══════════════════════════════════════════════════════
    {
        category: "mobile",
        brand: "Xiaomi",
        modelName: "Redmi Note 6 Pro",
        slug: "xiaomi-redmi-note-6-pro",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-redmi-note-6-pro-2.jpg",
        variants: [
            { storage: "4GB / 64GB", basePrice: 2840 },
            { storage: "6GB / 64GB", basePrice: 3070 }
        ]
    },
    {
        category: "mobile",
        brand: "Xiaomi",
        modelName: "Mi A2",
        slug: "xiaomi-mi-a2",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-mi-a2-1.jpg",
        variants: [
            { storage: "4GB / 64GB", basePrice: 2500 },
            { storage: "6GB / 128GB", basePrice: 2850 }
        ]
    },
    {
        category: "mobile",
        brand: "Xiaomi",
        modelName: "Redmi 6",
        slug: "xiaomi-redmi-6",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/xiaomi-redmi-6.jpg",
        variants: [
            { storage: "32GB", basePrice: 1740 },
            { storage: "64GB", basePrice: 1820 }
        ]
    },
    {
        category: "mobile",
        brand: "Xiaomi",
        modelName: "Redmi 6 Pro",
        slug: "xiaomi-redmi-6-pro",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/xiaomi-redmi-6-pro.jpg",
        variants: [
            { storage: "3GB / 32GB", basePrice: 2160 },
            { storage: "4GB / 64GB", basePrice: 2280 }
        ]
    },
    {
        category: "mobile",
        brand: "Xiaomi",
        modelName: "Redmi 6A",
        slug: "xiaomi-redmi-6a",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/xiaomi-redmi-6a.jpg",
        variants: [
            { storage: "16GB", basePrice: 1410 },
            { storage: "32GB", basePrice: 1510 }
        ]
    },
    {
        category: "mobile",
        brand: "Xiaomi",
        modelName: "Redmi Y2",
        slug: "xiaomi-redmi-y2",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-redmi-s2-5.jpg",
        variants: [
            { storage: "3GB / 32GB", basePrice: 2120 },
            { storage: "4GB / 64GB", basePrice: 2200 }
        ]
    },
    {
        category: "mobile",
        brand: "Xiaomi",
        modelName: "Redmi 5",
        slug: "xiaomi-redmi-5",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/xiaomi-redmi-5.jpg",
        variants: [
            { storage: "2GB / 16GB", basePrice: 1590 },
            { storage: "3GB / 32GB", basePrice: 1700 },
            { storage: "4GB / 64GB", basePrice: 2010 }
        ]
    },
    {
        category: "mobile",
        brand: "Xiaomi",
        modelName: "Redmi Note 5 Pro",
        slug: "xiaomi-redmi-note-5-pro",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/xiaomi-redmi-note-5-pro.jpg",
        variants: [
            { storage: "4GB / 64GB", basePrice: 2500 },
            { storage: "6GB / 64GB", basePrice: 2650 }
        ]
    },
    {
        category: "mobile",
        brand: "Xiaomi",
        modelName: "Redmi Note 5",
        slug: "xiaomi-redmi-note-5",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-redmi-note-5-ai-dual-camera-1.jpg",
        variants: [
            { storage: "3GB / 32GB", basePrice: 1780 },
            { storage: "4GB / 64GB", basePrice: 2080 }
        ]
    },
    {
        category: "mobile",
        brand: "Xiaomi",
        modelName: "Redmi 5A",
        slug: "xiaomi-redmi-5a",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/xiaomi-redmi-5a.jpg",
        variants: [
            { storage: "2GB / 16GB", basePrice: 1140 },
            { storage: "3GB / 32GB", basePrice: 1290 }
        ]
    },
    {
        category: "mobile",
        brand: "Xiaomi",
        modelName: "Redmi Y1",
        slug: "xiaomi-redmi-y1",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-redmi-note-5a-1.jpg",
        variants: [
            { storage: "3GB / 32GB", basePrice: 1230 },
            { storage: "4GB / 64GB", basePrice: 1380 }
        ]
    },
    {
        category: "mobile",
        brand: "Xiaomi",
        modelName: "Redmi Y1 Lite",
        slug: "xiaomi-redmi-y1-lite",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-redmi-note-5as-1.jpg",
        variants: [
            { storage: "2GB / 16GB", basePrice: 980 }
        ]
    },
    {
        category: "mobile",
        brand: "Xiaomi",
        modelName: "Mi Mix 2",
        slug: "xiaomi-mi-mix-2",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-mi-mix2-0.jpg",
        variants: [
            { storage: "6GB / 128GB", basePrice: 2830 }
        ]
    },
    {
        category: "mobile",
        brand: "Xiaomi",
        modelName: "Mi Max 2",
        slug: "xiaomi-mi-max-2",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-mi-max-2-matte-black.jpg",
        variants: [
            { storage: "32GB", basePrice: 1680 },
            { storage: "64GB", basePrice: 1810 },
            { storage: "128GB", basePrice: 2220 }
        ]
    },
    {
        category: "mobile",
        brand: "Xiaomi",
        modelName: "Redmi Note 7",
        slug: "xiaomi-redmi-note-7",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/xiaomi-redmi-note-7.jpg",
        variants: [
            { storage: "3GB / 32GB", basePrice: 2420 },
            { storage: "4GB / 64GB", basePrice: 3030 }
        ]
    },
    {
        category: "mobile",
        brand: "Xiaomi",
        modelName: "Redmi Note 7 Pro",
        slug: "xiaomi-redmi-note-7-pro",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/xiaomi-redmi-note-7-pro.jpg",
        variants: [
            { storage: "4GB / 64GB", basePrice: 3760 },
            { storage: "6GB / 128GB", basePrice: 4090 },
            { storage: "6GB / 64GB", basePrice: 3820 }
        ]
    },
    {
        category: "mobile",
        brand: "Xiaomi",
        modelName: "Redmi Note 11",
        slug: "xiaomi-redmi-note-11",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-redmi-note-11-global-1.jpg",
        variants: [
            { storage: "4GB / 64GB", basePrice: 4540 },
            { storage: "6GB / 64GB", basePrice: 4740 },
            { storage: "6GB / 128GB", basePrice: 5100 }
        ]
    },
    {
        category: "mobile",
        brand: "Xiaomi",
        modelName: "Redmi Note 11S",
        slug: "xiaomi-redmi-note-11s",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-redmi-note-11s-global-1.jpg",
        variants: [
            { storage: "6GB / 64GB", basePrice: 5090 },
            { storage: "6GB / 128GB", basePrice: 5210 },
            { storage: "8GB / 128GB", basePrice: 5420 }
        ]
    },
    {
        category: "mobile",
        brand: "Xiaomi",
        modelName: "Redmi Note 11 Pro Plus 5G",
        slug: "xiaomi-redmi-note-11-pro-plus-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-redmi-note11-pro-plus-1.jpg",
        variants: [
            { storage: "6GB / 128GB", basePrice: 7530 },
            { storage: "8GB / 128GB", basePrice: 8020 },
            { storage: "8GB / 256GB", basePrice: 8390 }
        ]
    },
    {
        category: "mobile",
        brand: "Xiaomi",
        modelName: "Redmi Note 11 Pro",
        slug: "xiaomi-redmi-note-11-pro",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-redmi-note-11-pro-global-0.jpg",
        variants: [
            { storage: "6GB / 128GB", basePrice: 5570 },
            { storage: "8GB / 128GB", basePrice: 6070 }
        ]
    },
    {
        category: "mobile",
        brand: "Xiaomi",
        modelName: "Redmi 10",
        slug: "xiaomi-redmi-10",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/xiaomi-redmi-10.jpg",
        variants: [
            { storage: "4GB / 64GB", basePrice: 3760 },
            { storage: "6GB / 128GB", basePrice: 4060 }
        ]
    },
    {
        category: "mobile",
        brand: "Xiaomi",
        modelName: "12 Pro 5G",
        slug: "xiaomi-12-pro-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-redmi-note-12-pro-1.jpg",
        variants: [
            { storage: "8GB / 256GB", basePrice: 13390 },
            { storage: "12GB / 256GB", basePrice: 13940 }
        ]
    },
    {
        category: "mobile",
        brand: "Xiaomi",
        modelName: "Redmi 10 Prime 2022",
        slug: "xiaomi-redmi-10-prime-2022",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-redmi-10-prime-1.jpg",
        variants: [
            { storage: "64GB", basePrice: 4130 },
            { storage: "128GB", basePrice: 4320 }
        ]
    },
    {
        category: "mobile",
        brand: "Xiaomi",
        modelName: "Redmi 10A",
        slug: "xiaomi-redmi-10a",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/xiaomi-redmi-10a.jpg",
        variants: [
            { storage: "3GB / 32GB", basePrice: 2950 },
            { storage: "4GB / 64GB", basePrice: 3480 }
        ]
    },
    {
        category: "mobile",
        brand: "Xiaomi",
        modelName: "Redmi K50i 5G",
        slug: "xiaomi-redmi-k50i-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/xiaomi-redmi-k50i-5g.jpg",
        variants: [
            { storage: "6GB / 128GB", basePrice: 8260 },
            { storage: "8GB / 256GB", basePrice: 8560 }
        ]
    },
    {
        category: "mobile",
        brand: "Xiaomi",
        modelName: "Redmi 11 Prime 5G",
        slug: "xiaomi-redmi-11-prime-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-redmi-10-5g-1.jpg",
        variants: [
            { storage: "4GB / 64GB", basePrice: 5190 },
            { storage: "6GB / 128GB", basePrice: 5640 }
        ]
    },
    {
        category: "mobile",
        brand: "Xiaomi",
        modelName: "Redmi 10 Power",
        slug: "xiaomi-redmi-10-power",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-redmi-10-power-05.jpg",
        variants: [
            { storage: "8GB / 128GB", basePrice: 4810 }
        ]
    },
    {
        category: "mobile",
        brand: "Xiaomi",
        modelName: "Redmi Note 11 SE",
        slug: "xiaomi-redmi-note-11-se",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-redmi-note-11se-1.jpg",
        variants: [
            { storage: "6GB / 64GB", basePrice: 4800 }
        ]
    },
    {
        category: "mobile",
        brand: "Xiaomi",
        modelName: "Redmi 11 Prime",
        slug: "xiaomi-redmi-11-prime",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-redmi-11-prime-4g-0.jpg",
        variants: [
            { storage: "4GB / 64GB", basePrice: 4300 },
            { storage: "6GB / 128GB", basePrice: 4660 }
        ]
    },
    {
        category: "mobile",
        brand: "Xiaomi",
        modelName: "Redmi A1 Plus",
        slug: "xiaomi-redmi-a1-plus",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/xiaomi-redmi-a1-plus.jpg",
        variants: [
            { storage: "3GB / 32GB", basePrice: 2800 },
            { storage: "2GB / 32GB", basePrice: 2570 }
        ]
    },
    {
        category: "mobile",
        brand: "Xiaomi",
        modelName: "Redmi 12 Pro Plus 5G",
        slug: "xiaomi-redmi-12-pro-plus-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-redmi-note-12-pro-plus-1.jpg",
        variants: [
            { storage: "8GB / 256GB", basePrice: 11340 },
            { storage: "12GB / 256GB", basePrice: 12200 }
        ]
    },
    {
        category: "mobile",
        brand: "Xiaomi",
        modelName: "Redmi Note 12 5G",
        slug: "xiaomi-redmi-note-12-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/xiaomi-redmi-note-12-5g.jpg",
        variants: [
            { storage: "4GB / 128GB", basePrice: 7870 },
            { storage: "6GB / 128GB", basePrice: 8340 },
            { storage: "8GB / 256GB", basePrice: 9050 }
        ]
    },
    {
        category: "mobile",
        brand: "Xiaomi",
        modelName: "Redmi G0",
        slug: "xiaomi-redmi-g0",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-redmi-go-4.jpg",
        variants: [
            { storage: "8GB", basePrice: 830 },
            { storage: "16GB", basePrice: 1040 }
        ]
    },
    {
        category: "mobile",
        brand: "Xiaomi",
        modelName: "Redmi 7",
        slug: "xiaomi-redmi-7",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/xiaomi-redmi-7.jpg",
        variants: [
            { storage: "2GB / 16GB", basePrice: 2350 },
            { storage: "2GB / 32GB", basePrice: 2500 },
            { storage: "3GB / 32GB", basePrice: 2570 },
            { storage: "3GB / 64GB", basePrice: 2690 }
        ]
    },
    {
        category: "mobile",
        brand: "Xiaomi",
        modelName: "Redmi Note 7s",
        slug: "xiaomi-redmi-note-7s",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/xiaomi-redmi-note-7s.jpg",
        variants: [
            { storage: "3GB / 32GB", basePrice: 3290 },
            { storage: "4GB / 64GB", basePrice: 3450 }
        ]
    },
    {
        category: "mobile",
        brand: "Xiaomi",
        modelName: "Redmi Y3",
        slug: "xiaomi-redmi-y3",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/xiaomi-redmi-y3.jpg",
        variants: [
            { storage: "3GB / 32GB", basePrice: 2350 },
            { storage: "4GB / 64GB", basePrice: 2500 }
        ]
    },
    {
        category: "mobile",
        brand: "Xiaomi",
        modelName: "Black Shark 2",
        slug: "xiaomi-black-shark-2",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/xiaomi-black-shark-2.jpg",
        variants: [
            { storage: "6GB / 128GB", basePrice: 4920 },
            { storage: "12GB / 256GB", basePrice: 5910 }
        ]
    },
    {
        category: "mobile",
        brand: "Xiaomi",
        modelName: "Redmi K20",
        slug: "xiaomi-redmi-k20",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-redmi-k20pro-2.jpg",
        variants: [
            { storage: "64GB", basePrice: 4620 },
            { storage: "128GB", basePrice: 4960 }
        ]
    },
    {
        category: "mobile",
        brand: "Xiaomi",
        modelName: "Redmi K20 Pro",
        slug: "xiaomi-redmi-k20-pro",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-redmi-k20pro-1.jpg",
        variants: [
            { storage: "6GB / 128GB", basePrice: 5710 },
            { storage: "8GB / 256GB", basePrice: 6120 }
        ]
    },
    {
        category: "mobile",
        brand: "Xiaomi",
        modelName: "Redmi 7A",
        slug: "xiaomi-redmi-7a",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/xiaomi-redmi-7a.jpg",
        variants: [
            { storage: "2GB / 16GB", basePrice: 1440 },
            { storage: "3GB / 32GB", basePrice: 1720 },
            { storage: "2GB / 32GB", basePrice: 1590 }
        ]
    },
    {
        category: "mobile",
        brand: "Xiaomi",
        modelName: "Mi A3",
        slug: "xiaomi-mi-a3",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/xiaomi-mi-a3.jpg",
        variants: [
            { storage: "4GB / 64GB", basePrice: 3570 },
            { storage: "6GB / 128GB", basePrice: 4010 }
        ]
    },
    {
        category: "mobile",
        brand: "Xiaomi",
        modelName: "Redmi 8A",
        slug: "xiaomi-redmi-8a",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/xiaomi-redmi-8a.jpg",
        variants: [
            { storage: "2GB / 32GB", basePrice: 2200 },
            { storage: "3GB / 32GB", basePrice: 2460 }
        ]
    },
    {
        category: "mobile",
        brand: "Xiaomi",
        modelName: "Redmi 8",
        slug: "xiaomi-redmi-8",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/xiaomi-redmi-8.jpg",
        variants: [
            { storage: "4GB / 64GB", basePrice: 3330 }
        ]
    },
    {
        category: "mobile",
        brand: "Xiaomi",
        modelName: "Redmi Note 8",
        slug: "xiaomi-redmi-note-8",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/xiaomi-redmi-note-8.jpg",
        variants: [
            { storage: "3GB / 32GB", basePrice: 3560 },
            { storage: "4GB / 64GB", basePrice: 3710 },
            { storage: "6GB / 128GB", basePrice: 3980 }
        ]
    },
    {
        category: "mobile",
        brand: "Xiaomi",
        modelName: "Redmi Note 8 Pro",
        slug: "xiaomi-redmi-note-8-pro",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/xiaomi-redmi-note-8-pro.jpg",
        variants: [
            { storage: "6GB / 64GB", basePrice: 4170 },
            { storage: "6GB / 128GB", basePrice: 4430 },
            { storage: "8GB / 128GB", basePrice: 4580 }
        ]
    },
    {
        category: "mobile",
        brand: "Xiaomi",
        modelName: "Redmi Note 9 Pro",
        slug: "xiaomi-redmi-note-9-pro",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/xiaomi-redmi-note-9-pro.jpg",
        variants: [
            { storage: "4GB / 64GB", basePrice: 4360 },
            { storage: "4GB / 128GB", basePrice: 4670 },
            { storage: "6GB / 128GB", basePrice: 4930 }
        ]
    },
    {
        category: "mobile",
        brand: "Xiaomi",
        modelName: "Redmi Note 12 Pro 5G",
        slug: "xiaomi-redmi-note-12-pro-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-redmi-note-12-pro-1.jpg",
        variants: [
            { storage: "6GB / 128GB", basePrice: 9890 },
            { storage: "8GB / 128GB", basePrice: 10380 },
            { storage: "8GB / 256GB", basePrice: 10760 },
            { storage: "12GB / 256GB", basePrice: 11340 }
        ]
    },
    {
        category: "mobile",
        brand: "Xiaomi",
        modelName: "13 Pro 5G",
        slug: "xiaomi-13-pro-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-13-pro-black-1.jpg",
        variants: [
            { storage: "12GB / 256GB", basePrice: 25670 }
        ]
    },
    {
        category: "mobile",
        brand: "Xiaomi",
        modelName: "Redmi Note 12",
        slug: "xiaomi-redmi-note-12",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/xiaomi/redmi-note-12-5g-international-0.jpg",
        variants: [
            { storage: "64GB", basePrice: 5950 },
            { storage: "128GB", basePrice: 6700 }
        ]
    },
    {
        category: "mobile",
        brand: "Xiaomi",
        modelName: "Redmi A2 Plus",
        slug: "xiaomi-redmi-a2-plus",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/xiaomi-redmi-a2-plus.jpg",
        variants: [
            { storage: "2GB / 32GB", basePrice: 3750 },
            { storage: "4GB / 64GB", basePrice: 3930 },
            { storage: "4GB / 128GB", basePrice: 4070 }
        ]
    },
    {
        category: "mobile",
        brand: "Xiaomi",
        modelName: "Redmi A2",
        slug: "xiaomi-redmi-a2",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-redmi-a2-1.jpg",
        variants: [
            { storage: "2GB / 32GB", basePrice: 3200 },
            { storage: "2GB / 64GB", basePrice: 3530 },
            { storage: "4GB / 64GB", basePrice: 3750 }
        ]
    },
    {
        category: "mobile",
        brand: "Xiaomi",
        modelName: "Redmi 12 5G",
        slug: "xiaomi-redmi-12-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/xiaomi-redmi-12-5g.jpg",
        variants: [
            { storage: "4GB / 128GB", basePrice: 7290 },
            { storage: "6GB / 128GB", basePrice: 8390 },
            { storage: "8GB / 256GB", basePrice: 9250 }
        ]
    },
    {
        category: "mobile",
        brand: "Xiaomi",
        modelName: "Redmi 12C",
        slug: "xiaomi-redmi-12c",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/xiaomi-redmi-12c.jpg",
        variants: [
            { storage: "4GB / 64GB", basePrice: 4980 },
            { storage: "4GB / 128GB", basePrice: 5340 },
            { storage: "6GB / 128GB", basePrice: 5640 }
        ]
    },
    {
        category: "mobile",
        brand: "Xiaomi",
        modelName: "Redmi 12",
        slug: "xiaomi-redmi-12",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/xiaomi-redmi-12.jpg",
        variants: [
            { storage: "4GB / 128GB", basePrice: 5780 },
            { storage: "6GB / 128GB", basePrice: 6220 }
        ]
    },
    {
        category: "mobile",
        brand: "Xiaomi",
        modelName: "Redmi 13C",
        slug: "xiaomi-redmi-13c",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/xiaomi-redmi-13c.jpg",
        variants: [
            { storage: "4GB / 128GB", basePrice: 5290 },
            { storage: "6GB / 128GB", basePrice: 5490 },
            { storage: "8GB / 256GB", basePrice: 5930 }
        ]
    },
    {
        category: "mobile",
        brand: "Xiaomi",
        modelName: "Redmi 13C 5G",
        slug: "xiaomi-redmi-13c-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/xiaomi-redmi-13c-5g.jpg",
        variants: [
            { storage: "4GB / 128GB", basePrice: 6810 },
            { storage: "6GB / 128GB", basePrice: 7320 },
            { storage: "8GB / 256GB", basePrice: 7750 }
        ]
    },
    {
        category: "mobile",
        brand: "Xiaomi",
        modelName: "Redmi Note 13 5G",
        slug: "xiaomi-redmi-note-13-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/xiaomi-redmi-note-13-5g.jpg",
        variants: [
            { storage: "6GB / 128GB", basePrice: 9560 },
            { storage: "8GB / 256GB", basePrice: 9890 },
            { storage: "12GB / 256GB", basePrice: 10520 }
        ]
    },
    {
        category: "mobile",
        brand: "Xiaomi",
        modelName: "Redmi Note 13 Pro 5G",
        slug: "xiaomi-redmi-note-13-pro-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/xiaomi-redmi-note-13-pro-5g.jpg",
        variants: [
            { storage: "8GB / 128GB", basePrice: 11720 },
            { storage: "8GB / 256GB", basePrice: 12580 },
            { storage: "12GB / 256GB", basePrice: 13070 }
        ]
    },
    {
        category: "mobile",
        brand: "Xiaomi",
        modelName: "Redmi 8A Dual",
        slug: "xiaomi-redmi-8a-dual",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/xiaomi-redmi-8a-dual.jpg",
        variants: [
            { storage: "2GB / 32GB", basePrice: 2650 },
            { storage: "3GB / 32GB", basePrice: 2800 },
            { storage: "3GB / 64GB", basePrice: 2990 }
        ]
    },
    {
        category: "mobile",
        brand: "Xiaomi",
        modelName: "Redmi Note 9 Pro Max",
        slug: "xiaomi-redmi-note-9-pro-max",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/xiaomi-redmi-note-9-pro-max.jpg",
        variants: [
            { storage: "6GB / 64GB", basePrice: 4740 },
            { storage: "6GB / 128GB", basePrice: 5170 },
            { storage: "8GB / 128GB", basePrice: 5350 }
        ]
    },
    {
        category: "mobile",
        brand: "Xiaomi",
        modelName: "Redmi Note 9",
        slug: "xiaomi-redmi-note-9",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/xiaomi-redmi-note-9.jpg",
        variants: [
            { storage: "4GB / 64GB", basePrice: 4090 },
            { storage: "4GB / 128GB", basePrice: 4310 },
            { storage: "6GB / 128GB", basePrice: 4630 }
        ]
    },
    {
        category: "mobile",
        brand: "Xiaomi",
        modelName: "Redmi 9 Prime",
        slug: "xiaomi-redmi-9-prime",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-redmi-9-0.jpg",
        variants: [
            { storage: "64GB", basePrice: 3450 },
            { storage: "128GB", basePrice: 3790 }
        ]
    },
    {
        category: "mobile",
        brand: "Xiaomi",
        modelName: "Redmi 9",
        slug: "xiaomi-redmi-9",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/xiaomi-redmi-9.jpg",
        variants: [
            { storage: "64GB", basePrice: 3070 },
            { storage: "128GB", basePrice: 3330 }
        ]
    },
    {
        category: "mobile",
        brand: "Xiaomi",
        modelName: "Redmi 9A",
        slug: "xiaomi-redmi-9a",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/xiaomi/redmi-9a-01.jpg",
        variants: [
            { storage: "2GB / 32GB", basePrice: 2730 },
            { storage: "3GB / 32GB", basePrice: 2950 }
        ]
    },
    {
        category: "mobile",
        brand: "Xiaomi",
        modelName: "Redmi 9i",
        slug: "xiaomi-redmi-9i",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-redmi-9i.jpg",
        variants: [
            { storage: "64GB", basePrice: 3070 },
            { storage: "128GB", basePrice: 3290 }
        ]
    },
    {
        category: "mobile",
        brand: "Xiaomi",
        modelName: "Mi 10T",
        slug: "xiaomi-mi-10t",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-mi-10t-5g-1.jpg",
        variants: [
            { storage: "6GB / 128GB", basePrice: 7260 },
            { storage: "8GB / 128GB", basePrice: 7580 }
        ]
    },
    {
        category: "mobile",
        brand: "Xiaomi",
        modelName: "Mi 10T Pro",
        slug: "xiaomi-mi-10t-pro",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-mi-10t-pro-02.jpg",
        variants: [
            { storage: "8GB / 128GB", basePrice: 7760 }
        ]
    },
    {
        category: "mobile",
        brand: "Xiaomi",
        modelName: "Mi 10i",
        slug: "xiaomi-mi-10i",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-mi-10i-5g-1.jpg",
        variants: [
            { storage: "6GB / 64GB", basePrice: 6730 },
            { storage: "6GB / 128GB", basePrice: 7040 },
            { storage: "8GB / 128GB", basePrice: 7340 }
        ]
    },
    {
        category: "mobile",
        brand: "Xiaomi",
        modelName: "Redmi 9 Power",
        slug: "xiaomi-redmi-9-power",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/xiaomi-redmi-9-power.jpg",
        variants: [
            { storage: "4GB / 64GB", basePrice: 3560 },
            { storage: "4GB / 128GB", basePrice: 3750 },
            { storage: "6GB / 128GB", basePrice: 4010 }
        ]
    },
    {
        category: "mobile",
        brand: "Xiaomi",
        modelName: "Redmi Note 10",
        slug: "xiaomi-redmi-note-10",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-redmi-note10-1.jpg",
        variants: [
            { storage: "4GB / 64GB", basePrice: 4090 },
            { storage: "6GB / 128GB", basePrice: 4400 }
        ]
    },
    {
        category: "mobile",
        brand: "Xiaomi",
        modelName: "Redmi Note 10 Pro",
        slug: "xiaomi-redmi-note-10-pro",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-redmi-note10-pro-1.jpg",
        variants: [
            { storage: "6GB / 64GB", basePrice: 4440 },
            { storage: "6GB / 128GB", basePrice: 4980 },
            { storage: "8GB / 128GB", basePrice: 5390 }
        ]
    },
    {
        category: "mobile",
        brand: "Xiaomi",
        modelName: "Redmi Note 10 Pro Max",
        slug: "xiaomi-redmi-note-10-pro-max",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-redmi-note10-pro-india-10.jpg",
        variants: [
            { storage: "6GB / 64GB", basePrice: 4890 },
            { storage: "6GB / 128GB", basePrice: 5280 },
            { storage: "8GB / 128GB", basePrice: 5850 }
        ]
    },
    {
        category: "mobile",
        brand: "Xiaomi",
        modelName: "Redmi Note 13 Pro Plus 5G",
        slug: "xiaomi-redmi-note-13-pro-plus-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-redmi-note-13-pro-plus-01.jpg",
        variants: [
            { storage: "8GB / 256GB", basePrice: 14410 },
            { storage: "12GB / 256GB", basePrice: 15180 },
            { storage: "12GB / 512GB", basePrice: 16140 }
        ]
    },
    {
        category: "mobile",
        brand: "Xiaomi",
        modelName: "Redmi A3",
        slug: "xiaomi-redmi-a3",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/xiaomi-redmi-a3.jpg",
        variants: [
            { storage: "3GB / 64GB", basePrice: 4020 },
            { storage: "4GB / 128GB", basePrice: 4360 },
            { storage: "6GB / 128GB", basePrice: 4660 }
        ]
    },
    {
        category: "mobile",
        brand: "Xiaomi",
        modelName: "Xiaomi 14",
        slug: "xiaomi-xiaomi-14",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-14-01.jpg",
        variants: [
            { storage: "12GB / 512GB", basePrice: 27060 }
        ]
    },
    {
        category: "mobile",
        brand: "Xiaomi",
        modelName: "14 Ultra",
        slug: "xiaomi-14-ultra",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-14-ultra-01.jpg",
        variants: [
            { storage: "16GB / 512GB", basePrice: 38020 }
        ]
    },
    {
        category: "mobile",
        brand: "Xiaomi",
        modelName: "Redmi A1",
        slug: "xiaomi-redmi-a1",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-a1-1.jpg",
        variants: [
            { storage: "2GB / 32GB", basePrice: 2420 }
        ]
    },
    {
        category: "mobile",
        brand: "Xiaomi",
        modelName: "14 CIVI",
        slug: "xiaomi-14-civi",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-14-civi-11.jpg",
        variants: [
            { storage: "8GB / 256GB", basePrice: 18650 },
            { storage: "12GB / 512GB", basePrice: 19310 }
        ]
    },
    {
        category: "mobile",
        brand: "Xiaomi",
        modelName: "Redmi A3x",
        slug: "xiaomi-redmi-a3x",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-a3x-1.jpg",
        variants: [
            { storage: "3GB / 64GB", basePrice: 3680 },
            { storage: "4GB / 128GB", basePrice: 3970 }
        ]
    },
    {
        category: "mobile",
        brand: "Xiaomi",
        modelName: "Redmi 13 5G",
        slug: "xiaomi-redmi-13-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/xiaomi-redmi-13-5g.jpg",
        variants: [
            { storage: "6GB / 128GB", basePrice: 7910 },
            { storage: "8GB / 128GB", basePrice: 8480 }
        ]
    },
    {
        category: "mobile",
        brand: "Xiaomi",
        modelName: "Redmi Note 14 5G",
        slug: "xiaomi-redmi-note-14-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/xiaomi-redmi-note-14-5g.jpg",
        variants: [
            { storage: "6GB / 128GB", basePrice: 10070 },
            { storage: "8GB / 128GB", basePrice: 10400 },
            { storage: "8GB / 256GB", basePrice: 11490 }
        ]
    },
    {
        category: "mobile",
        brand: "Xiaomi",
        modelName: "Redmi Note 14 Pro 5G",
        slug: "xiaomi-redmi-note-14-pro-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/xiaomi-redmi-note-14-pro-5g.jpg",
        variants: [
            { storage: "128GB", basePrice: 14340 },
            { storage: "256GB", basePrice: 14950 }
        ]
    },
    {
        category: "mobile",
        brand: "Xiaomi",
        modelName: "Redmi Note 14 Pro Plus 5G",
        slug: "xiaomi-redmi-note-14-pro-plus-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/xiaomi-redmi-note-14-pro-plus-5g.jpg",
        variants: [
            { storage: "8GB / 128GB", basePrice: 17170 },
            { storage: "8GB / 256GB", basePrice: 18480 },
            { storage: "12GB / 512GB", basePrice: 19340 }
        ]
    },
    {
        category: "mobile",
        brand: "Xiaomi",
        modelName: "Redmi 14C 5G",
        slug: "xiaomi-redmi-14c-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-redmi-14c-5g-1.jpg",
        variants: [
            { storage: "4GB / 64GB", basePrice: 6510 },
            { storage: "4GB / 128GB", basePrice: 6920 },
            { storage: "6GB / 128GB", basePrice: 7780 }
        ]
    },
    {
        category: "mobile",
        brand: "Xiaomi",
        modelName: "Redmi A4 5G",
        slug: "xiaomi-redmi-a4-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-redmi-a4-5g-2.jpg",
        variants: [
            { storage: "4GB / 64GB", basePrice: 5500 },
            { storage: "4GB / 128GB", basePrice: 5800 },
            { storage: "6GB / 128GB", basePrice: 6270 }
        ]
    },
    {
        category: "mobile",
        brand: "Xiaomi",
        modelName: "Redmi A5",
        slug: "xiaomi-redmi-a5",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-redmi-a5-4g-4.jpg",
        variants: [
            { storage: "3GB / 64GB", basePrice: 4400 },
            { storage: "4GB / 128GB", basePrice: 4800 }
        ]
    },
    {
        category: "mobile",
        brand: "Xiaomi",
        modelName: "Xiaomi 15",
        slug: "xiaomi-xiaomi-15",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-15-1.jpg",
        variants: [
            { storage: "12GB / 512GB", basePrice: 38580 }
        ]
    },
    {
        category: "mobile",
        brand: "Xiaomi",
        modelName: "15 Ultra",
        slug: "xiaomi-15-ultra",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-15-ultra-5.jpg",
        variants: [
            { storage: "16GB / 512GB", basePrice: 61000 }
        ]
    },
    {
        category: "mobile",
        brand: "Xiaomi",
        modelName: "Mi 11X Pro",
        slug: "xiaomi-mi-11x-pro",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-mi11x-pro-0.jpg",
        variants: [
            { storage: "128GB", basePrice: 7610 },
            { storage: "256GB", basePrice: 8070 }
        ]
    },
    {
        category: "mobile",
        brand: "Xiaomi",
        modelName: "Mi 11 Ultra",
        slug: "xiaomi-mi-11-ultra",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-mi11-ultra-5g-k1-1.jpg",
        variants: [
            { storage: "12GB / 256GB", basePrice: 17300 }
        ]
    },
    {
        category: "mobile",
        brand: "Xiaomi",
        modelName: "Mi 11X",
        slug: "xiaomi-mi-11x",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-mi11x-1.jpg",
        variants: [
            { storage: "6GB / 128GB", basePrice: 7590 },
            { storage: "8GB / 128GB", basePrice: 7960 }
        ]
    },
    {
        category: "mobile",
        brand: "Xiaomi",
        modelName: "Mi 11 Lite",
        slug: "xiaomi-mi-11-lite",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-mi-11-lite-4g-1.jpg",
        variants: [
            { storage: "6GB / 128GB", basePrice: 5650 },
            { storage: "8GB / 128GB", basePrice: 6070 }
        ]
    },
    {
        category: "mobile",
        brand: "Xiaomi",
        modelName: "Redmi Note 10s",
        slug: "xiaomi-redmi-note-10s",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-redmi-note10s-1.jpg",
        variants: [
            { storage: "6GB / 64GB", basePrice: 4580 },
            { storage: "6GB / 128GB", basePrice: 4850 },
            { storage: "8GB / 128GB", basePrice: 5090 }
        ]
    },
    {
        category: "mobile",
        brand: "Xiaomi",
        modelName: "Redmi Note 10T 5G",
        slug: "xiaomi-redmi-note-10t-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/xiaomi-redmi-note-10t-5g.jpg",
        variants: [
            { storage: "4GB / 64GB", basePrice: 5700 },
            { storage: "6GB / 128GB", basePrice: 6270 }
        ]
    },
    {
        category: "mobile",
        brand: "Xiaomi",
        modelName: "Mi 10",
        slug: "xiaomi-mi-10",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-redmi-10-1.jpg",
        variants: [
            { storage: "128GB", basePrice: 10000 },
            { storage: "256GB", basePrice: 10340 }
        ]
    },
    {
        category: "mobile",
        brand: "Xiaomi",
        modelName: "Redmi 10 Prime",
        slug: "xiaomi-redmi-10-prime",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-redmi-10-prime-1.jpg",
        variants: [
            { storage: "4GB / 64GB", basePrice: 4010 },
            { storage: "6GB / 128GB", basePrice: 4500 }
        ]
    },
    {
        category: "mobile",
        brand: "Xiaomi",
        modelName: "11 Lite NE 5G",
        slug: "xiaomi-11-lite-ne-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-11-lite-5g-ne-1.jpg",
        variants: [
            { storage: "6GB / 128GB", basePrice: 8220 },
            { storage: "8GB / 128GB", basePrice: 8540 }
        ]
    },
    {
        category: "mobile",
        brand: "Xiaomi",
        modelName: "Redmi Note 10 Light",
        slug: "xiaomi-redmi-note-10-light",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-mi-note-10-lite-3.jpg",
        variants: [
            { storage: "4GB / 64GB", basePrice: 4210 },
            { storage: "4GB / 128GB", basePrice: 4360 },
            { storage: "6GB / 128GB", basePrice: 4670 }
        ]
    },
    {
        category: "mobile",
        brand: "Xiaomi",
        modelName: "Redmi Note 11T 5G",
        slug: "xiaomi-redmi-note-11t-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/xiaomi-redmi-note-11t-5g.jpg",
        variants: [
            { storage: "6GB / 64GB", basePrice: 6220 },
            { storage: "6GB / 128GB", basePrice: 6760 },
            { storage: "8GB / 128GB", basePrice: 7120 }
        ]
    },
    {
        category: "mobile",
        brand: "Xiaomi",
        modelName: "Redmi 9 Activ",
        slug: "xiaomi-redmi-9-activ",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/xiaomi-redmi-9-activ.jpg",
        variants: [
            { storage: "4GB / 64GB", basePrice: 2930 },
            { storage: "6GB / 128GB", basePrice: 3260 }
        ]
    },
    {
        category: "mobile",
        brand: "Xiaomi",
        modelName: "11i 5G",
        slug: "xiaomi-11i-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-11i-1.jpg",
        variants: [
            { storage: "6GB / 128GB", basePrice: 7300 },
            { storage: "8GB / 128GB", basePrice: 7460 }
        ]
    },
    {
        category: "mobile",
        brand: "Xiaomi",
        modelName: "11i Hypercharge 5G",
        slug: "xiaomi-11i-hypercharge-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-11i-hypercharge-1.jpg",
        variants: [
            { storage: "6GB / 128GB", basePrice: 7380 },
            { storage: "8GB / 128GB", basePrice: 7720 }
        ]
    },
    {
        category: "mobile",
        brand: "Xiaomi",
        modelName: "11T Pro 5G",
        slug: "xiaomi-11t-pro-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-11t-pro-1.jpg",
        variants: [
            { storage: "8GB / 128GB", basePrice: 8460 },
            { storage: "8GB / 256GB", basePrice: 9070 },
            { storage: "12GB / 256GB", basePrice: 9300 }
        ]
    },
    {
        category: "mobile",
        brand: "Xiaomi",
        modelName: "Redmi 15 5G",
        slug: "xiaomi-redmi-15-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/xiaomi-redmi-15-5g.jpg",
        variants: [
            { storage: "6GB / 128GB", basePrice: 10500 },
            { storage: "8GB / 128GB", basePrice: 11500 },
            { storage: "8GB / 256GB", basePrice: 12200 }
        ]
    },
    {
        category: "mobile",
        brand: "Xiaomi",
        modelName: "Redmi Note 14 SE 5G",
        slug: "xiaomi-redmi-note-14-se-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-redmi-note-14-5g-int-1.jpg",
        variants: [
            { storage: "6GB / 128GB", basePrice: 9000 }
        ]
    },
    {
        category: "mobile",
        brand: "Xiaomi",
        modelName: "Redmi 15C 5G",
        slug: "xiaomi-redmi-15c-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-redmi-15c-1.jpg",
        variants: [
            { storage: "4GB / 128GB", basePrice: 7980 },
            { storage: "6GB / 128GB", basePrice: 8890 },
            { storage: "8GB / 128GB", basePrice: 9440 }
        ]
    },
    {
        category: "mobile",
        brand: "Xiaomi",
        modelName: "Redmi Note 15 5G",
        slug: "xiaomi-redmi-note-15-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/xiaomi-redmi-note-15-5g.jpg",
        variants: [
            { storage: "128GB", basePrice: 16000 },
            { storage: "256GB", basePrice: 17000 }
        ]
    },
    {
        category: "mobile",
        brand: "Xiaomi",
        modelName: "Redmi Note 15 Pro 5G",
        slug: "xiaomi-redmi-note-15-pro-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/xiaomi-redmi-note-15-pro-5g.jpg",
        variants: [
            { storage: "128GB", basePrice: 20000 },
            { storage: "256GB", basePrice: 21200 }
        ]
    },
    {
        category: "mobile",
        brand: "Xiaomi",
        modelName: "Redmi Note 15 Pro Plus 5G",
        slug: "xiaomi-redmi-note-15-pro-plus-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/xiaomi-redmi-note-15-pro-plus-5g.jpg",
        variants: [
            { storage: "8GB / 256GB", basePrice: 25000 },
            { storage: "12GB / 512GB", basePrice: 26500 },
            { storage: "12GB / 512GB", basePrice: 28000 }
        ]
    },
    {
        category: "mobile",
        brand: "Xiaomi",
        modelName: "17 Ultra",
        slug: "xiaomi-17-ultra",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/xiaomi-17-ultra.jpg",
        variants: [
            { storage: "16GB / 512GB", basePrice: 77000 }
        ]
    },
    {
        category: "mobile",
        brand: "Xiaomi",
        modelName: "Xiaomi 17",
        slug: "xiaomi-xiaomi-17",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-17-b.jpg",
        variants: [
            { storage: "256GB", basePrice: 55000 },
            { storage: "512GB", basePrice: 60000 }
        ]
    },
    {
        category: "mobile",
        brand: "Xiaomi",
        modelName: "Redmi 15A 5G",
        slug: "xiaomi-redmi-15a-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-redmi-15a-1.jpg",
        variants: [
            { storage: "4GB / 64GB", basePrice: 8400 },
            { storage: "4GB / 128GB", basePrice: 9400 },
            { storage: "6GB / 128GB", basePrice: 10700 }
        ]
    },
];

// ─── SEED FUNCTION ────────────────────────────────────────────────────────────

async function seed() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");
        await Device.deleteMany({ category: "mobile", brand: "Xiaomi" });
        console.log("Cleared existing Xiaomi mobile devices");
        await Device.insertMany(devices);
        console.log(`✅ Seeded ${devices.length} mobile devices successfully`);
        process.exit(0);
    } catch (err) {
        console.error("❌ Seed failed:", err);
        process.exit(1);
    }
}

seed();