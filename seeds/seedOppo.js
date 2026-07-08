import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import Device from "../models/Device.js";

const devices = [
    // ══════════════════════════════════════════════════════
    //  OPPO — All Series
    // ══════════════════════════════════════════════════════
    {
        category: "mobile",
        brand: "Oppo",
        modelName: "A7",
        slug: "oppo-a7",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/oppo-a7.jpg",
        variants: [
            { storage: "4GB / 64GB", basePrice: 2380 },
            { storage: "3GB / 64GB", basePrice: 2040 }
        ]
    },
    {
        category: "mobile",
        brand: "Oppo",
        modelName: "F9 Pro",
        slug: "oppo-f9-pro",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/oppo/oppo-f9-1.jpg",
        variants: [
            { storage: "6GB / 64GB", basePrice: 2670 },
            { storage: "6GB / 128GB", basePrice: 2970 }
        ]
    },
    {
        category: "mobile",
        brand: "Oppo",
        modelName: "F9",
        slug: "oppo-f9",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/oppo-f9.jpg",
        variants: [
            { storage: "4GB / 64GB", basePrice: 2640 }
        ]
    },
    {
        category: "mobile",
        brand: "Oppo",
        modelName: "A3s",
        slug: "oppo-a3s",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/oppo-a3s.jpg",
        variants: [
            { storage: "2GB / 16GB", basePrice: 1740 },
            { storage: "3GB / 32GB", basePrice: 1930 },
            { storage: "4GB / 64GB", basePrice: 2120 }
        ]
    },
    {
        category: "mobile",
        brand: "Oppo",
        modelName: "Find X",
        slug: "oppo-find-x",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/oppo-find-x.jpg",
        variants: [
            { storage: "8GB / 256GB", basePrice: 6970 }
        ]
    },
    {
        category: "mobile",
        brand: "Oppo",
        modelName: "A5",
        slug: "oppo-a5",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/oppo-a5.jpg",
        variants: [
            { storage: "32GB", basePrice: 2460 },
            { storage: "64GB", basePrice: 2690 }
        ]
    },
    {
        category: "mobile",
        brand: "Oppo",
        modelName: "F7",
        slug: "oppo-f7",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/oppo-f7.jpg",
        variants: [
            { storage: "4GB / 64GB", basePrice: 2380 },
            { storage: "6GB / 128GB", basePrice: 2600 }
        ]
    },
    {
        category: "mobile",
        brand: "Oppo",
        modelName: "A83",
        slug: "oppo-a83",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/oppo-a83.jpg",
        variants: [
            { storage: "3GB / 32GB", basePrice: 1440 },
            { storage: "4GB / 64GB", basePrice: 1670 },
            { storage: "2GB / 16GB", basePrice: 1360 }
        ]
    },
    {
        category: "mobile",
        brand: "Oppo",
        modelName: "F5 Youth",
        slug: "oppo-f5-youth",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/oppo/oppo-f5-youth-a73.jpg",
        variants: [
            { storage: "3GB / 32GB", basePrice: 1700 }
        ]
    },
    {
        category: "mobile",
        brand: "Oppo",
        modelName: "F5",
        slug: "oppo-f5",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/oppo/oppo-f5-youth-a73-1.jpg",
        variants: [
            { storage: "4GB / 32GB", basePrice: 1780 },
            { storage: "6GB / 64GB", basePrice: 1930 }
        ]
    },
    {
        category: "mobile",
        brand: "Oppo",
        modelName: "R11",
        slug: "oppo-r11",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/oppo-r11.jpg",
        variants: [
            { storage: "4GB / 64GB", basePrice: 2270 }
        ]
    },
    {
        category: "mobile",
        brand: "Oppo",
        modelName: "A77",
        slug: "oppo-a77",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/oppo/oppo-a77-5g-1.jpg",
        variants: [
            { storage: "4GB / 64GB", basePrice: 1490 }
        ]
    },
    {
        category: "mobile",
        brand: "Oppo",
        modelName: "F3",
        slug: "oppo-f3",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/oppo/oppo-f3-5.jpg",
        variants: [
            { storage: "4GB / 64GB", basePrice: 1480 }
        ]
    },
    {
        category: "mobile",
        brand: "Oppo",
        modelName: "F3 Plus",
        slug: "oppo-f3-plus",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/oppo-f3-plus.jpg",
        variants: [
            { storage: "4GB / 64GB", basePrice: 1860 },
            { storage: "6GB / 64GB", basePrice: 2230 }
        ]
    },
    {
        category: "mobile",
        brand: "Oppo",
        modelName: "A57",
        slug: "oppo-a57",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/oppo-a57.jpg",
        variants: [
            { storage: "3GB / 32GB", basePrice: 1510 }
        ]
    },
    {
        category: "mobile",
        brand: "Oppo",
        modelName: "F1s",
        slug: "oppo-f1s",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/oppo-f1s.jpg",
        variants: [
            { storage: "3GB / 32GB", basePrice: 1190 },
            { storage: "4GB / 64GB", basePrice: 1330 }
        ]
    },
    {
        category: "mobile",
        brand: "Oppo",
        modelName: "F1 Plus",
        slug: "oppo-f1-plus",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/oppo-f1-plus.jpg",
        variants: [
            { storage: "4GB / 64GB", basePrice: 1260 }
        ]
    },
    {
        category: "mobile",
        brand: "Oppo",
        modelName: "R17",
        slug: "oppo-r17",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/oppo/oppo-r17-1.jpg",
        variants: [
            { storage: "8GB / 128GB", basePrice: 4170 }
        ]
    },
    {
        category: "mobile",
        brand: "Oppo",
        modelName: "K1",
        slug: "oppo-k1",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/oppo/oppo-k1-1.jpg",
        variants: [
            { storage: "4GB / 64GB", basePrice: 3030 },
            { storage: "6GB / 64GB", basePrice: 3180 }
        ]
    },
    {
        category: "mobile",
        brand: "Oppo",
        modelName: "F11 Pro",
        slug: "oppo-f11-pro",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/oppo/oppo-f11-pro-10.jpg",
        variants: [
            { storage: "64GB", basePrice: 4040 },
            { storage: "128GB", basePrice: 4440 }
        ]
    },
    {
        category: "mobile",
        brand: "Oppo",
        modelName: "A16K",
        slug: "oppo-a16k",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/oppo-a16k.jpg",
        variants: [
            { storage: "3GB / 32GB", basePrice: 2840 },
            { storage: "4GB / 64GB", basePrice: 3450 }
        ]
    },
    {
        category: "mobile",
        brand: "Oppo",
        modelName: "Reno7 5G",
        slug: "oppo-reno7-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/oppo/oppo-reno7-0.jpg",
        variants: [
            { storage: "8GB / 256GB", basePrice: 8480 }
        ]
    },
    {
        category: "mobile",
        brand: "Oppo",
        modelName: "Reno7 Pro 5G",
        slug: "oppo-reno7-pro-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/oppo/oppo-reno7-pro-5g-1.jpg",
        variants: [
            { storage: "12GB / 256GB", basePrice: 10250 }
        ]
    },
    {
        category: "mobile",
        brand: "Oppo",
        modelName: "A76",
        slug: "oppo-a76",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/oppo/oppo-a36-1.jpg",
        variants: [
            { storage: "6GB / 128GB", basePrice: 5000 }
        ]
    },
    {
        category: "mobile",
        brand: "Oppo",
        modelName: "K10",
        slug: "oppo-k10",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/oppo-k10.jpg",
        variants: [
            { storage: "6GB / 128GB", basePrice: 4800 },
            { storage: "8GB / 128GB", basePrice: 5040 }
        ]
    },
    {
        category: "mobile",
        brand: "Oppo",
        modelName: "A16e",
        slug: "oppo-a16e",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/oppo/oppo-a16e-1.jpg",
        variants: [
            { storage: "3GB / 32GB", basePrice: 3220 },
            { storage: "4GB / 64GB", basePrice: 3840 }
        ]
    },
    {
        category: "mobile",
        brand: "Oppo",
        modelName: "F21 Pro",
        slug: "oppo-f21-pro",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/oppo/oppo-reno7-4g-1.jpg",
        variants: [
            { storage: "8GB / 128GB", basePrice: 6260 }
        ]
    },
    {
        category: "mobile",
        brand: "Oppo",
        modelName: "F21 Pro 5G",
        slug: "oppo-f21-pro-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/oppo/oppo-f21-pro-5g-1.jpg",
        variants: [
            { storage: "8GB / 128GB", basePrice: 7830 }
        ]
    },
    {
        category: "mobile",
        brand: "Oppo",
        modelName: "A96",
        slug: "oppo-a96",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/oppo-a96.jpg",
        variants: [
            { storage: "8GB / 128GB", basePrice: 5410 }
        ]
    },
    {
        category: "mobile",
        brand: "Oppo",
        modelName: "K10 5G",
        slug: "oppo-k10-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/oppo/oppo-k10-5g-india-1.jpg",
        variants: [
            { storage: "6GB / 128GB", basePrice: 6480 },
            { storage: "8GB / 128GB", basePrice: 7220 }
        ]
    },
    {
        category: "mobile",
        brand: "Oppo",
        modelName: "Reno8 5G",
        slug: "oppo-reno8-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/oppo/oppo-reno8-02.jpg",
        variants: [
            { storage: "8GB / 128GB", basePrice: 9390 }
        ]
    },
    {
        category: "mobile",
        brand: "Oppo",
        modelName: "Reno8 Pro 5G",
        slug: "oppo-reno8-pro-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/oppo/oppo-reno8-pro-02.jpg",
        variants: [
            { storage: "12GB / 256GB", basePrice: 11130 }
        ]
    },
    {
        category: "mobile",
        brand: "Oppo",
        modelName: "A57 2022",
        slug: "oppo-a57-2022",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/oppo/oppo-a57-5g-2.jpg",
        variants: [
            { storage: "4GB / 64GB", basePrice: 4290 }
        ]
    },
    {
        category: "mobile",
        brand: "Oppo",
        modelName: "F21s Pro",
        slug: "oppo-f21s-pro",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/oppo/oppo-f21-pro-5g-1.jpg",
        variants: [
            { storage: "8GB / 128GB", basePrice: 6160 }
        ]
    },
    {
        category: "mobile",
        brand: "Oppo",
        modelName: "F21s Pro Plus 5G",
        slug: "oppo-f21s-pro-plus-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/oppo/oppo-f21-pro-5g-1.jpg",
        variants: [
            { storage: "8GB / 128GB", basePrice: 7410 }
        ]
    },
    {
        category: "mobile",
        brand: "Oppo",
        modelName: "A77 2022",
        slug: "oppo-a77-2022",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/oppo/oppo-a77-5g-1.jpg",
        variants: [
            { storage: "64GB", basePrice: 3070 },
            { storage: "128GB", basePrice: 4050 }
        ]
    },
    {
        category: "mobile",
        brand: "Oppo",
        modelName: "A17K",
        slug: "oppo-a17k",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/oppo-a17k.jpg",
        variants: [
            { storage: "3GB / 64GB", basePrice: 3570 }
        ]
    },
    {
        category: "mobile",
        brand: "Oppo",
        modelName: "A77s",
        slug: "oppo-a77s",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/oppo-a77s.jpg",
        variants: [
            { storage: "8GB / 128GB", basePrice: 5320 }
        ]
    },
    {
        category: "mobile",
        brand: "Oppo",
        modelName: "A78 5G",
        slug: "oppo-a78-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/oppo/oppo-a58-1.jpg",
        variants: [
            { storage: "8GB / 128GB", basePrice: 10200 }
        ]
    },
    {
        category: "mobile",
        brand: "Oppo",
        modelName: "Reno8T 5G",
        slug: "oppo-reno8t-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/oppo/oppo-reno8-t-1.jpg",
        variants: [
            { storage: "8GB / 128GB", basePrice: 11060 }
        ]
    },
    {
        category: "mobile",
        brand: "Oppo",
        modelName: "Find N2 Flip 5G",
        slug: "oppo-find-n2-flip-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/oppo/oppo-find-n2-flip-1.jpg",
        variants: [
            { storage: "8GB / 256GB", basePrice: 18710 }
        ]
    },
    {
        category: "mobile",
        brand: "Oppo",
        modelName: "F23 5G",
        slug: "oppo-f23-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/oppo-f23-5g.jpg",
        variants: [
            { storage: "8GB / 256GB", basePrice: 11720 }
        ]
    },
    {
        category: "mobile",
        brand: "Oppo",
        modelName: "Reno10 5G",
        slug: "oppo-reno10-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/oppo/oppo-reno10-international-1.jpg",
        variants: [
            { storage: "8GB / 256GB", basePrice: 15920 }
        ]
    },
    {
        category: "mobile",
        brand: "Oppo",
        modelName: "Reno10 Pro 5G",
        slug: "oppo-reno10-pro-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/oppo/oppo-reno10-pro-international-1.jpg",
        variants: [
            { storage: "12GB / 256GB", basePrice: 18180 }
        ]
    },
    {
        category: "mobile",
        brand: "Oppo",
        modelName: "Reno10 Pro Plus 5G",
        slug: "oppo-reno10-pro-plus-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/oppo/oppo-reno10-pro-plus-10.jpg",
        variants: [
            { storage: "12GB / 256GB", basePrice: 20290 }
        ]
    },
    {
        category: "mobile",
        brand: "Oppo",
        modelName: "A78",
        slug: "oppo-a78",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/oppo/oppo-a58-1.jpg",
        variants: [
            { storage: "8GB / 128GB", basePrice: 7500 }
        ]
    },
    {
        category: "mobile",
        brand: "Oppo",
        modelName: "Find N3 Flip 5G",
        slug: "oppo-find-n3-flip-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/oppo/oppo-find-n3-flip-1.jpg",
        variants: [
            { storage: "12GB / 256GB", basePrice: 24500 }
        ]
    },
    {
        category: "mobile",
        brand: "Oppo",
        modelName: "A58",
        slug: "oppo-a58",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/oppo-a58.jpg",
        variants: [
            { storage: "6GB / 128GB", basePrice: 6530 }
        ]
    },
    {
        category: "mobile",
        brand: "Oppo",
        modelName: "F31 Pro 5G",
        slug: "oppo-f31-pro-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/oppo/oppo-f31-pro-1.jpg",
        variants: [
            { storage: "8 GB/128 GB", basePrice: 17480 },
            { storage: "8 GB/256 GB", basePrice: 19400 },
            { storage: "12 GB/256 GB", basePrice: 20720 }
        ]
    },
    {
        category: "mobile",
        brand: "Oppo",
        modelName: "K13 Turbo Pro 5G",
        slug: "oppo-k13-turbo-pro-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/oppo/oppo-k13-turbo-pro-02.jpg",
        variants: [
            { storage: "8 GB/256 GB", basePrice: 22000 },
            { storage: "12 GB/256 GB", basePrice: 23000 }
        ]
    },
    {
        category: "mobile",
        brand: "Oppo",
        modelName: "K13 Turbo 5G",
        slug: "oppo-k13-turbo-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/oppo/oppo-k13-turbo-02.jpg",
        variants: [
            { storage: "8 GB/128 GB", basePrice: 17400 },
            { storage: "8 GB/256 GB", basePrice: 18700 }
        ]
    },
    {
        category: "mobile",
        brand: "Oppo",
        modelName: "F31 5G",
        slug: "oppo-f31-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/oppo/oppo-a6-pro-4g-1.jpg",
        variants: [
            { storage: "8 GB/128 GB", basePrice: 16320 },
            { storage: "8 GB/256 GB", basePrice: 17200 }
        ]
    },
    {
        category: "mobile",
        brand: "Oppo",
        modelName: "F31 Pro Plus 5G",
        slug: "oppo-f31-pro-plus-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/oppo/oppo-f31-pro-plus-1.jpg",
        variants: [
            { storage: "8 GB/256 GB", basePrice: 21300 },
            { storage: "12 GB/256 GB", basePrice: 22300 }
        ]
    },
    {
        category: "mobile",
        brand: "Oppo",
        modelName: "Find X9 5G",
        slug: "oppo-find-x9-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/oppo/oppo-find-x9-1.jpg",
        variants: [
            { storage: "12 GB/256 GB", basePrice: 43300 },
            { storage: "16 GB/512 GB", basePrice: 47500 }
        ]
    },
    {
        category: "mobile",
        brand: "Oppo",
        modelName: "Find X9 Pro",
        slug: "oppo-find-x9-pro",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/oppo-find-x9-pro.jpg",
        variants: [
            { storage: "16 GB/512 GB", basePrice: 62500 }
        ]
    },
    {
        category: "mobile",
        brand: "Oppo",
        modelName: "A6x 5G",
        slug: "oppo-a6x-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/oppo-a6x-5g.jpg",
        variants: [
            { storage: "4 GB/64 GB", basePrice: 8810 },
            { storage: "4 GB/128 GB", basePrice: 9300 },
            { storage: "6 GB/128 GB", basePrice: 10050 }
        ]
    },
    {
        category: "mobile",
        brand: "Oppo",
        modelName: "Reno15 5G",
        slug: "oppo-reno15-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/oppo/oppo-reno-15c-1.jpg",
        variants: [
            { storage: "8 GB/256 GB", basePrice: 29430 },
            { storage: "12 GB/256 GB", basePrice: 31690 },
            { storage: "12 GB/512 GB", basePrice: 32600 }
        ]
    },
    {
        category: "mobile",
        brand: "Oppo",
        modelName: "Reno15 Pro Mini 5G",
        slug: "oppo-reno15-pro-mini-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/oppo/oppo-reno15-pro-mini-3.jpg",
        variants: [
            { storage: "12 GB/256 GB", basePrice: 36700 },
            { storage: "12 GB/512 GB", basePrice: 39000 }
        ]
    },
    {
        category: "mobile",
        brand: "Oppo",
        modelName: "Reno15 Pro 5G",
        slug: "oppo-reno15-pro-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/oppo/oppo-reno15-pro-global-1.jpg",
        variants: [
            { storage: "12 GB/256 GB", basePrice: 41500 },
            { storage: "12 GB/512 GB", basePrice: 44000 }
        ]
    },
    {
        category: "mobile",
        brand: "Oppo",
        modelName: "A6 Pro 5G",
        slug: "oppo-a6-pro-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/oppo/oppo-a6-pro-4g-1.jpg",
        variants: [
            { storage: "8 GB/128 GB", basePrice: 14260 },
            { storage: "8 GB/256 GB", basePrice: 15100 }
        ]
    },
    {
        category: "mobile",
        brand: "Oppo",
        modelName: "Reno 15c 5G",
        slug: "oppo-reno-15c-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/oppo/oppo-reno-15c-1.jpg",
        variants: [
            { storage: "8 GB/256 GB", basePrice: 21810 },
            { storage: "12 GB/256 GB", basePrice: 22700 }
        ]
    },
    {
        category: "mobile",
        brand: "Oppo",
        modelName: "K14x 5G",
        slug: "oppo-k14x-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/oppo/oppo-k14x-1.jpg",
        variants: [
            { storage: "4 GB/64 GB", basePrice: 8800 },
            { storage: "4 GB/128 GB", basePrice: 9950 },
            { storage: "6 GB/128 GB", basePrice: 11000 }
        ]
    },
    {
        category: "mobile",
        brand: "Oppo",
        modelName: "A5s",
        slug: "oppo-a5s",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/oppo/oppo-ax5s-2.jpg",
        variants: [
            { storage: "2GB / 32GB", basePrice: 2200 },
            { storage: "3GB / 32GB", basePrice: 2420 },
            { storage: "4GB / 64GB", basePrice: 2690 }
        ]
    },
    {
        category: "mobile",
        brand: "Oppo",
        modelName: "A1k",
        slug: "oppo-a1k",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/oppo-a1k.jpg",
        variants: [
            { storage: "2GB / 32GB", basePrice: 2320 }
        ]
    },
    {
        category: "mobile",
        brand: "Oppo",
        modelName: "F11",
        slug: "oppo-f11",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/oppo/oppo-f11-11.jpg",
        variants: [
            { storage: "4GB / 128GB", basePrice: 3280 },
            { storage: "6GB / 128GB", basePrice: 3680 }
        ]
    },
    {
        category: "mobile",
        brand: "Oppo",
        modelName: "Reno",
        slug: "oppo-reno",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/oppo-reno.jpg",
        variants: [
            { storage: "8GB / 128GB", basePrice: 4920 }
        ]
    },
    {
        category: "mobile",
        brand: "Oppo",
        modelName: "Reno 10x Zoom",
        slug: "oppo-reno-10x-zoom",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/oppo-reno-10x-zoom.jpg",
        variants: [
            { storage: "6GB / 128GB", basePrice: 5490 },
            { storage: "8GB / 256GB", basePrice: 5870 }
        ]
    },
    {
        category: "mobile",
        brand: "Oppo",
        modelName: "K3",
        slug: "oppo-k3",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/oppo-k3.jpg",
        variants: [
            { storage: "8GB / 128GB", basePrice: 4350 },
            { storage: "6GB / 64GB", basePrice: 4170 }
        ]
    },
    {
        category: "mobile",
        brand: "Oppo",
        modelName: "A9",
        slug: "oppo-a9",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/oppo-a9.jpg",
        variants: [
            { storage: "4GB / 128GB", basePrice: 3920 }
        ]
    },
    {
        category: "mobile",
        brand: "Oppo",
        modelName: "Reno 2Z",
        slug: "oppo-reno-2z",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/oppo/oppo-reno2z-1.jpg",
        variants: [
            { storage: "8GB / 256GB", basePrice: 5680 }
        ]
    },
    {
        category: "mobile",
        brand: "Oppo",
        modelName: "Reno 2",
        slug: "oppo-reno-2",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/oppo/oppo-reno2-1.jpg",
        variants: [
            { storage: "8GB / 256GB", basePrice: 5910 }
        ]
    },
    {
        category: "mobile",
        brand: "Oppo",
        modelName: "A5 2020",
        slug: "oppo-a5-2020",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/oppo-a5-2020.jpg",
        variants: [
            { storage: "3GB / 64GB", basePrice: 3030 },
            { storage: "4GB / 64GB", basePrice: 3180 },
            { storage: "4GB / 128GB", basePrice: 3290 },
            { storage: "6GB / 128GB", basePrice: 3450 }
        ]
    },
    {
        category: "mobile",
        brand: "Oppo",
        modelName: "A9 2020",
        slug: "oppo-a9-2020",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/oppo/oppo-a9-2020-1.jpg",
        variants: [
            { storage: "4GB / 128GB", basePrice: 3820 },
            { storage: "8GB / 128GB", basePrice: 4050 }
        ]
    },
    {
        category: "mobile",
        brand: "Oppo",
        modelName: "Reno2 F",
        slug: "oppo-reno2-f",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/oppo/oppo-reno-2f-2.jpg",
        variants: [
            { storage: "6GB / 256GB", basePrice: 5070 },
            { storage: "8GB / 128GB", basePrice: 5720 }
        ]
    },
    {
        category: "mobile",
        brand: "Oppo",
        modelName: "F15",
        slug: "oppo-f15",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/oppo/oppo-f15-cph2001-1.jpg",
        variants: [
            { storage: "4GB / 128GB", basePrice: 4640 },
            { storage: "8GB / 128GB", basePrice: 4960 }
        ]
    },
    {
        category: "mobile",
        brand: "Oppo",
        modelName: "A71 2018",
        slug: "oppo-a71-2018",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/oppo-a71-2018.jpg",
        variants: [
            { storage: "3GB / 16GB", basePrice: 1060 }
        ]
    },
    {
        category: "mobile",
        brand: "Oppo",
        modelName: "A31",
        slug: "oppo-a31",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/oppo-a31.jpg",
        variants: [
            { storage: "4GB / 64GB", basePrice: 3830 },
            { storage: "6GB / 128GB", basePrice: 4330 }
        ]
    },
    {
        category: "mobile",
        brand: "Oppo",
        modelName: "A12",
        slug: "oppo-a12",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/oppo-a12.jpg",
        variants: [
            { storage: "3GB / 32GB", basePrice: 2840 },
            { storage: "4GB / 64GB", basePrice: 3290 }
        ]
    },
    {
        category: "mobile",
        brand: "Oppo",
        modelName: "A52",
        slug: "oppo-a52",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/oppo-a52.jpg",
        variants: [
            { storage: "4GB / 128GB", basePrice: 4170 },
            { storage: "6GB / 128GB", basePrice: 4580 },
            { storage: "8GB / 128GB", basePrice: 4660 }
        ]
    },
    {
        category: "mobile",
        brand: "Oppo",
        modelName: "Find X2",
        slug: "oppo-find-x2",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/oppo-find-x2.jpg",
        variants: [
            { storage: "12GB / 256GB", basePrice: 10980 }
        ]
    },
    {
        category: "mobile",
        brand: "Oppo",
        modelName: "A38",
        slug: "oppo-a38",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/oppo-a38.jpg",
        variants: [
            { storage: "4GB / 128GB", basePrice: 5710 }
        ]
    },
    {
        category: "mobile",
        brand: "Oppo",
        modelName: "A17",
        slug: "oppo-a17",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/oppo-a17.jpg",
        variants: [
            { storage: "4GB / 64GB", basePrice: 3930 }
        ]
    },
    {
        category: "mobile",
        brand: "Oppo",
        modelName: "A18",
        slug: "oppo-a18",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/oppo/oppo-a18-1.jpg",
        variants: [
            { storage: "64GB", basePrice: 4590 },
            { storage: "128GB", basePrice: 4850 }
        ]
    },
    {
        category: "mobile",
        brand: "Oppo",
        modelName: "A79 5G",
        slug: "oppo-a79-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/oppo-a79-5g.jpg",
        variants: [
            { storage: "8GB / 128GB", basePrice: 10080 }
        ]
    },
    {
        category: "mobile",
        brand: "Oppo",
        modelName: "A59 5G",
        slug: "oppo-a59-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/oppo-a59-5g.jpg",
        variants: [
            { storage: "4GB / 128GB", basePrice: 8800 },
            { storage: "6GB / 128GB", basePrice: 9370 }
        ]
    },
    {
        category: "mobile",
        brand: "Oppo",
        modelName: "Reno11 5G",
        slug: "oppo-reno11-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/oppo/oppo-reno11-international-1.jpg",
        variants: [
            { storage: "128GB", basePrice: 15080 },
            { storage: "256GB", basePrice: 15750 }
        ]
    },
    {
        category: "mobile",
        brand: "Oppo",
        modelName: "Reno11 Pro 5G",
        slug: "oppo-reno11-pro-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/oppo/oppo-reno11-china-1.jpg",
        variants: [
            { storage: "12GB / 256GB", basePrice: 18580 }
        ]
    },
    {
        category: "mobile",
        brand: "Oppo",
        modelName: "F25 Pro 5G",
        slug: "oppo-f25-pro-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/oppo/oppo-f25-pro-1.jpg",
        variants: [
            { storage: "128GB", basePrice: 12600 },
            { storage: "256GB", basePrice: 13170 }
        ]
    },
    {
        category: "mobile",
        brand: "Oppo",
        modelName: "F27 Pro Plus 5G",
        slug: "oppo-f27-pro-plus-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/oppo/oppo-a3-pro-1.jpg",
        variants: [
            { storage: "128GB", basePrice: 14360 },
            { storage: "256GB", basePrice: 14950 }
        ]
    },
    {
        category: "mobile",
        brand: "Oppo",
        modelName: "F11 Pro Avenger Edition",
        slug: "oppo-f11-pro-avenger-edition",
        imageUrl: "https://fdn.gsmarena.com/imgroot/news/19/05/oppo-f11pro-avengers-hands-on/-727w2/gsmarena_005.jpg",
        variants: [
            { storage: "6GB / 128GB", basePrice: 4390 }
        ]
    },
    {
        category: "mobile",
        brand: "Oppo",
        modelName: "A3 Pro 5G",
        slug: "oppo-a3-pro-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/oppo/oppo-a3-pro-india-1.jpg",
        variants: [
            { storage: "128GB", basePrice: 10680 },
            { storage: "256GB", basePrice: 11410 }
        ]
    },
    {
        category: "mobile",
        brand: "Oppo",
        modelName: "Reno12 5G",
        slug: "oppo-reno12-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/oppo/oppo-reno12-1.jpg",
        variants: [
            { storage: "8GB / 256GB", basePrice: 16550 }
        ]
    },
    {
        category: "mobile",
        brand: "Oppo",
        modelName: "Reno12 Pro 5G",
        slug: "oppo-reno12-pro-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/oppo/oppo-reno12-pro-cn-1.jpg",
        variants: [
            { storage: "256GB", basePrice: 19260 },
            { storage: "512GB", basePrice: 19990 }
        ]
    },
    {
        category: "mobile",
        brand: "Oppo",
        modelName: "A3X 5G",
        slug: "oppo-a3x-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/oppo/oppo-a3x-1.jpg",
        variants: [
            { storage: "64GB", basePrice: 7980 },
            { storage: "128GB", basePrice: 8450 }
        ]
    },
    {
        category: "mobile",
        brand: "Oppo",
        modelName: "K12x 5G",
        slug: "oppo-k12x-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/oppo/oppo-k12x-int-1.jpg",
        variants: [
            { storage: "6GB / 128GB", basePrice: 8750 },
            { storage: "8GB / 256GB", basePrice: 9020 }
        ]
    },
    {
        category: "mobile",
        brand: "Oppo",
        modelName: "F27 5G",
        slug: "oppo-f27-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/oppo/oppo-f27-1.jpg",
        variants: [
            { storage: "8 GB/128 GB", basePrice: 13160 },
            { storage: "8 GB/256 GB", basePrice: 13720 }
        ]
    },
    {
        category: "mobile",
        brand: "Oppo",
        modelName: "A3 5G",
        slug: "oppo-a3-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/oppo/oppo-a3-int-1.jpg",
        variants: [
            { storage: "6 GB/128 GB", basePrice: 9600 }
        ]
    },
    {
        category: "mobile",
        brand: "Oppo",
        modelName: "A3x",
        slug: "oppo-a3x",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/oppo-a3x.jpg",
        variants: [
            { storage: "4 GB/64 GB", basePrice: 4900 },
            { storage: "4 GB/128 GB", basePrice: 5290 }
        ]
    },
    {
        category: "mobile",
        brand: "Oppo",
        modelName: "A6 5G",
        slug: "oppo-a6-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/oppo/oppo-a6-2.jpg",
        variants: [
            { storage: "4 GB/128 GB", basePrice: 12500 },
            { storage: "6 GB/128 GB", basePrice: 13260 },
            { storage: "6 GB/256 GB", basePrice: 14750 }
        ]
    },
    {
        category: "mobile",
        brand: "Oppo",
        modelName: "K14 5G",
        slug: "oppo-k14-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/oppo/oppo-k14-5g-1.jpg",
        variants: [
            { storage: "6 GB/128 GB", basePrice: 11700 },
            { storage: "6 GB/256 GB", basePrice: 12800 },
            { storage: "8 GB/256 GB", basePrice: 14300 }
        ]
    },
    {
        category: "mobile",
        brand: "Oppo",
        modelName: "A6s 5G",
        slug: "oppo-a6s-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/oppo/oppo-a6s-2.jpg",
        variants: [
            { storage: "4 GB/128 GB", basePrice: 11950 },
            { storage: "6 GB/128 GB", basePrice: 13400 }
        ]
    },
    {
        category: "mobile",
        brand: "Oppo",
        modelName: "F33 5G",
        slug: "oppo-f33-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/oppo/oppo-f33-1.jpg",
        variants: [
            { storage: "6 GB/128 GB", basePrice: 20980 },
            { storage: "8 GB/128 GB", basePrice: 22500 },
            { storage: "8 GB/256 GB", basePrice: 24700 }
        ]
    },
    {
        category: "mobile",
        brand: "Oppo",
        modelName: "F33 Pro 5G",
        slug: "oppo-f33-pro-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/oppo/oppo-f33-pro-1.jpg",
        variants: [
            { storage: "8 GB/128 GB", basePrice: 24000 },
            { storage: "8 GB/256 GB", basePrice: 25800 }
        ]
    },
    {
        category: "mobile",
        brand: "Oppo",
        modelName: "Find X9s",
        slug: "oppo-find-x9s",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/oppo-find-x9s.jpg",
        variants: [
            { storage: "12 GB/256 GB", basePrice: 42000 },
            { storage: "12 GB/512 GB", basePrice: 45000 }
        ]
    },
    {
        category: "mobile",
        brand: "Oppo",
        modelName: "Find X9 Ultra",
        slug: "oppo-find-x9-ultra",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/oppo/oppo-find-x9-ultra-5.jpg",
        variants: [
            { storage: "12 GB/512 GB", basePrice: 80000 }
        ]
    },
    {
        category: "mobile",
        brand: "Oppo",
        modelName: "A11k",
        slug: "oppo-a11k",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/oppo-a11k.jpg",
        variants: [
            { storage: "2GB / 32GB", basePrice: 2500 }
        ]
    },
    {
        category: "mobile",
        brand: "Oppo",
        modelName: "Reno3 Pro",
        slug: "oppo-reno3-pro",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/oppo/oppo-reno3-pro-0.jpg",
        variants: [
            { storage: "8GB / 128GB", basePrice: 5720 },
            { storage: "8GB / 256GB", basePrice: 5760 }
        ]
    },
    {
        category: "mobile",
        brand: "Oppo",
        modelName: "Reno4 Pro",
        slug: "oppo-reno4-pro",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/oppo-reno4-pro.jpg",
        variants: [
            { storage: "8GB / 128GB", basePrice: 6740 }
        ]
    },
    {
        category: "mobile",
        brand: "Oppo",
        modelName: "A53",
        slug: "oppo-a53",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/oppo-a53.jpg",
        variants: [
            { storage: "4GB / 64GB", basePrice: 4440 },
            { storage: "6GB / 128GB", basePrice: 5000 }
        ]
    },
    {
        category: "mobile",
        brand: "Oppo",
        modelName: "F17 Pro",
        slug: "oppo-f17-pro",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/oppo/oppo-f17-pro-1.jpg",
        variants: [
            { storage: "8GB / 128GB", basePrice: 5410 }
        ]
    },
    {
        category: "mobile",
        brand: "Oppo",
        modelName: "F17",
        slug: "oppo-f17",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/oppo-f17.jpg",
        variants: [
            { storage: "6GB / 128GB", basePrice: 5020 },
            { storage: "8GB / 128GB", basePrice: 5230 }
        ]
    },
    {
        category: "mobile",
        brand: "Oppo",
        modelName: "A33 2020",
        slug: "oppo-a33-2020",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/oppo/oppo-a32-1.jpg",
        variants: [
            { storage: "3GB / 32GB", basePrice: 3140 }
        ]
    },
    {
        category: "mobile",
        brand: "Oppo",
        modelName: "A15",
        slug: "oppo-a15",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/oppo-a15.jpg",
        variants: [
            { storage: "2GB / 32GB", basePrice: 2990 },
            { storage: "3GB / 32GB", basePrice: 3310 }
        ]
    },
    {
        category: "mobile",
        brand: "Oppo",
        modelName: "A15s",
        slug: "oppo-a15s",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/oppo-a15s.jpg",
        variants: [
            { storage: "4GB / 64GB", basePrice: 3510 },
            { storage: "4GB / 128GB", basePrice: 4090 }
        ]
    },
    {
        category: "mobile",
        brand: "Oppo",
        modelName: "Reno5 Pro 5G",
        slug: "oppo-reno5-pro-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/oppo/oppo-reno5-pro-5g-1.jpg",
        variants: [
            { storage: "8GB / 128GB", basePrice: 8990 }
        ]
    },
    {
        category: "mobile",
        brand: "Oppo",
        modelName: "F19 Pro",
        slug: "oppo-f19-pro",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/oppo/oppo-f19-pro-0.jpg",
        variants: [
            { storage: "128GB", basePrice: 5840 },
            { storage: "256GB", basePrice: 6020 }
        ]
    },
    {
        category: "mobile",
        brand: "Oppo",
        modelName: "F19 Pro Plus 5G",
        slug: "oppo-f19-pro-plus-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/oppo/oppo-f19-pro-plus-1.jpg",
        variants: [
            { storage: "8GB / 128GB", basePrice: 7310 }
        ]
    },
    {
        category: "mobile",
        brand: "Oppo",
        modelName: "F19",
        slug: "oppo-f19",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/oppo-f19.jpg",
        variants: [
            { storage: "6GB / 128GB", basePrice: 5480 }
        ]
    },
    {
        category: "mobile",
        brand: "Oppo",
        modelName: "A54",
        slug: "oppo-a54",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/oppo-a54.jpg",
        variants: [
            { storage: "4GB / 64GB", basePrice: 4350 },
            { storage: "4GB / 128GB", basePrice: 4750 },
            { storage: "6GB / 128GB", basePrice: 4920 }
        ]
    },
    {
        category: "mobile",
        brand: "Oppo",
        modelName: "A53s 5G",
        slug: "oppo-a53s-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/oppo-a53s-5g.jpg",
        variants: [
            { storage: "6GB / 128GB", basePrice: 6670 },
            { storage: "8GB / 128GB", basePrice: 7180 }
        ]
    },
    {
        category: "mobile",
        brand: "Oppo",
        modelName: "A54 5G",
        slug: "oppo-a54-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/oppo-a54-5g.jpg",
        variants: [
            { storage: "6GB / 128GB", basePrice: 7510 }
        ]
    },
    {
        category: "mobile",
        brand: "Oppo",
        modelName: "Reno6 5G",
        slug: "oppo-reno6-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/oppo-reno6-5g.jpg",
        variants: [
            { storage: "8GB / 128GB", basePrice: 8180 }
        ]
    },
    {
        category: "mobile",
        brand: "Oppo",
        modelName: "Reno6 Pro 5G",
        slug: "oppo-reno6-pro-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/oppo-reno6-pro-5g.jpg",
        variants: [
            { storage: "12GB / 256GB", basePrice: 9730 }
        ]
    },
    {
        category: "mobile",
        brand: "Oppo",
        modelName: "F19s",
        slug: "oppo-f19s",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/oppo-f19s.jpg",
        variants: [
            { storage: "6GB / 128GB", basePrice: 5040 }
        ]
    },
    {
        category: "mobile",
        brand: "Oppo",
        modelName: "A55",
        slug: "oppo-a55",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/oppo-a55.jpg",
        variants: [
            { storage: "4GB / 64GB", basePrice: 4580 },
            { storage: "4GB / 128GB", basePrice: 4850 },
            { storage: "6GB / 128GB", basePrice: 5120 }
        ]
    },
    {
        category: "mobile",
        brand: "Oppo",
        modelName: "A16",
        slug: "oppo-a16",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/oppo-a16.jpg",
        variants: [
            { storage: "4GB / 64GB", basePrice: 4490 }
        ]
    },
    {
        category: "mobile",
        brand: "Oppo",
        modelName: "Find X8 5G",
        slug: "oppo-find-x8-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/oppo/oppo-find-x8-1.jpg",
        variants: [
            { storage: "12 GB/256 GB", basePrice: 32830 },
            { storage: "16 GB/512 GB", basePrice: 36260 }
        ]
    },
    {
        category: "mobile",
        brand: "Oppo",
        modelName: "Find X8 Pro 5G",
        slug: "oppo-find-x8-pro-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/oppo/oppo-find-x8-pro-3.jpg",
        variants: [
            { storage: "16 GB/512 GB", basePrice: 46060 }
        ]
    },
    {
        category: "mobile",
        brand: "Oppo",
        modelName: "Reno13 5G",
        slug: "oppo-reno13-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/oppo/oppo-reno13-cn-1.jpg",
        variants: [
            { storage: "8 GB/128 GB", basePrice: 18290 },
            { storage: "8 GB/256 GB", basePrice: 19230 },
            { storage: "12 GB/512 GB", basePrice: 20200 }
        ]
    },
    {
        category: "mobile",
        brand: "Oppo",
        modelName: "Reno13 Pro 5G",
        slug: "oppo-reno13-pro-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/oppo/oppo-reno13-pro-cn-1.jpg",
        variants: [
            { storage: "12 GB/256 GB", basePrice: 23750 },
            { storage: "12 GB/512 GB", basePrice: 25400 }
        ]
    },
    {
        category: "mobile",
        brand: "Oppo",
        modelName: "F29 5G",
        slug: "oppo-f29-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/oppo/oppo-f29-1.jpg",
        variants: [
            { storage: "8 GB/128 GB", basePrice: 15450 },
            { storage: "8 GB/256 GB", basePrice: 16350 }
        ]
    },
    {
        category: "mobile",
        brand: "Oppo",
        modelName: "F29 Pro 5G",
        slug: "oppo-f29-pro-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/oppo/oppo-f29-pro-1.jpg",
        variants: [
            { storage: "8 GB/128 GB", basePrice: 16210 },
            { storage: "8 GB/256 GB", basePrice: 16650 },
            { storage: "12 GB/256 GB", basePrice: 17950 }
        ]
    },
    {
        category: "mobile",
        brand: "Oppo",
        modelName: "A5 Pro 5G",
        slug: "oppo-a5-pro-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/oppo/oppo-a5-pro-5g-int-1.jpg",
        variants: [
            { storage: "8 GB/128 GB", basePrice: 12150 },
            { storage: "8 GB/256 GB", basePrice: 13010 }
        ]
    },
    {
        category: "mobile",
        brand: "Oppo",
        modelName: "A5 5G",
        slug: "oppo-a5-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/oppo-a5-5g.jpg",
        variants: [
            { storage: "6 GB/128 GB", basePrice: 10300 },
            { storage: "8 GB/128 GB", basePrice: 10850 }
        ]
    },
    {
        category: "mobile",
        brand: "Oppo",
        modelName: "A5x 5G",
        slug: "oppo-a5x-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/oppo/oppo-a5x-1.jpg",
        variants: [
            { storage: "4 GB/64 GB", basePrice: 7400 },
            { storage: "4 GB/128 GB", basePrice: 8330 },
            { storage: "6 GB/128 GB", basePrice: 8970 }
        ]
    },
    {
        category: "mobile",
        brand: "Oppo",
        modelName: "K13 5G",
        slug: "oppo-k13-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/oppo-k13-5g.jpg",
        variants: [
            { storage: "8 GB/128 GB", basePrice: 12000 },
            { storage: "8 GB/256 GB", basePrice: 13070 }
        ]
    },
    {
        category: "mobile",
        brand: "Oppo",
        modelName: "K13x 5G",
        slug: "oppo-k13x-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/oppo-k13x-5g.jpg",
        variants: [
            { storage: "4 GB/128 GB", basePrice: 7450 },
            { storage: "6 GB/128 GB", basePrice: 8600 },
            { storage: "8 GB/128 GB", basePrice: 9100 }
        ]
    },
    {
        category: "mobile",
        brand: "Oppo",
        modelName: "Reno14 5G",
        slug: "oppo-reno14-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/oppo/oppo-reno14-0.jpg",
        variants: [
            { storage: "8 GB/256 GB", basePrice: 24000 },
            { storage: "12 GB/256 GB", basePrice: 25190 },
            { storage: "12 GB/512 GB", basePrice: 27700 }
        ]
    },
    {
        category: "mobile",
        brand: "Oppo",
        modelName: "Reno14 Pro 5G",
        slug: "oppo-reno14-pro-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/oppo/oppo-reno14-pro-1.jpg",
        variants: [
            { storage: "12 GB/256 GB", basePrice: 30550 },
            { storage: "12 GB/512 GB", basePrice: 33800 }
        ]
    },
    {
        category: "mobile",
        brand: "Oppo",
        modelName: "A5X",
        slug: "oppo-a5x",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/oppo-a5x.jpg",
        variants: [
            { storage: "4 GB/64 GB", basePrice: 5900 },
            { storage: "4 GB/128 GB", basePrice: 6350 }
        ]
    },
];

// ─── SEED FUNCTION ────────────────────────────────────────────────────────────

async function seed() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");
        await Device.deleteMany({ category: "mobile", brand: "Oppo" });
        console.log("Cleared existing Oppo devices");
        await Device.insertMany(devices);
        console.log(`✅ Seeded ${devices.length} Oppo devices successfully`);
        process.exit(0);
    } catch (err) {
        console.error("❌ Seed failed:", err.message);
        process.exit(1);
    }
}

seed();