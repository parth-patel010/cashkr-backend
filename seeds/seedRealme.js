import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import Device from "../models/Device.js";

const devices = [
    // ══════════════════════════════════════════════════════
    //  REALME — All Series
    // ══════════════════════════════════════════════════════
    {
        category: "mobile",
        brand: "Realme",
        modelName: "Realme 2 Pro",
        slug: "realme-realme-2-pro",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/oppo/oppo-realme-2-pro-1.jpg",
        variants: [
            { storage: "4 GB/64 GB", basePrice: 2470 },
            { storage: "6 GB/64 GB", basePrice: 2700 },
            { storage: "8 GB/128 GB", basePrice: 2940 }
        ]
    },
    {
        category: "mobile",
        brand: "Realme",
        modelName: "Realme C1 2019",
        slug: "realme-realme-c1-2019",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/oppo/oppo-realme-c1-1.jpg",
        variants: [
            { storage: "2 GB/32 GB", basePrice: 1820 },
            { storage: "3 GB/32 GB", basePrice: 2010 }
        ]
    },
    {
        category: "mobile",
        brand: "Realme",
        modelName: "Realme C1",
        slug: "realme-realme-c1",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/oppo/oppo-realme-c1-2.jpg",
        variants: [
            { storage: "2 GB/16 GB", basePrice: 1740 }
        ]
    },
    {
        category: "mobile",
        brand: "Realme",
        modelName: "Realme 2",
        slug: "realme-realme-2",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/oppo/oppo-realme-2-1.jpg",
        variants: [
            { storage: "3 GB/32 GB", basePrice: 2080 },
            { storage: "4 GB/64 GB", basePrice: 2670 },
            { storage: "6 GB/128 GB", basePrice: 2960 }
        ]
    },
    {
        category: "mobile",
        brand: "Realme",
        modelName: "Realme U1",
        slug: "realme-realme-u1",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/realme/realme-u1-0.jpg",
        variants: [
            { storage: "3 GB/32 GB", basePrice: 2240 },
            { storage: "4 GB/64 GB", basePrice: 2630 },
            { storage: "3 GB/64 GB", basePrice: 2360 }
        ]
    },
    {
        category: "mobile",
        brand: "Realme",
        modelName: "Realme 3",
        slug: "realme-realme-3",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/realme/realme-3-1.jpg",
        variants: [
            { storage: "3 GB/32 GB", basePrice: 2320 },
            { storage: "4 GB/64 GB", basePrice: 2860 },
            { storage: "3 GB/64 GB", basePrice: 2630 }
        ]
    },
    {
        category: "mobile",
        brand: "Realme",
        modelName: "Realme 3 Pro",
        slug: "realme-realme-3-pro",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/realme/realme-3pro-3.jpg",
        variants: [
            { storage: "4 GB/64 GB", basePrice: 3290 },
            { storage: "6 GB/64 GB", basePrice: 3480 },
            { storage: "6 GB/128 GB", basePrice: 3820 }
        ]
    },
    {
        category: "mobile",
        brand: "Realme",
        modelName: "Realme C2",
        slug: "realme-realme-c2",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/realme/realme-c2-1.jpg",
        variants: [
            { storage: "2 GB/16 GB", basePrice: 2010 },
            { storage: "3 GB/32 GB", basePrice: 2310 },
            { storage: "2 GB/32 GB", basePrice: 2200 }
        ]
    },
    {
        category: "mobile",
        brand: "Realme",
        modelName: "Realme X",
        slug: "realme-realme-x",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/realme/realme-x-10.jpg",
        variants: [
            { storage: "4 GB/128 GB", basePrice: 4710 },
            { storage: "8 GB/128 GB", basePrice: 5130 }
        ]
    },
    {
        category: "mobile",
        brand: "Realme",
        modelName: "Realme 3i",
        slug: "realme-realme-3i",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/realme/realme-3i-01.jpg",
        variants: [
            { storage: "3 GB/32 GB", basePrice: 2360 },
            { storage: "4 GB/64 GB", basePrice: 2780 }
        ]
    },
    {
        category: "mobile",
        brand: "Realme",
        modelName: "Realme 5",
        slug: "realme-realme-5",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/realme/realme-5-rmx1911-2.jpg",
        variants: [
            { storage: "3 GB/32 GB", basePrice: 2800 },
            { storage: "4 GB/64 GB", basePrice: 3180 },
            { storage: "4 GB/128 GB", basePrice: 3510 }
        ]
    },
    {
        category: "mobile",
        brand: "Realme",
        modelName: "Realme 5 Pro",
        slug: "realme-realme-5-pro",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/realme/realme-5-pro-rmx1971-1.jpg",
        variants: [
            { storage: "4 GB/64 GB", basePrice: 3660 },
            { storage: "6 GB/64 GB", basePrice: 3820 },
            { storage: "8 GB/128 GB", basePrice: 4060 }
        ]
    },
    {
        category: "mobile",
        brand: "Realme",
        modelName: "Realme 8",
        slug: "realme-realme-8",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/realme/realme-8-1.jpg",
        variants: [
            { storage: "4 GB/128 GB", basePrice: 5140 },
            { storage: "6 GB/128 GB", basePrice: 5380 },
            { storage: "8 GB/128 GB", basePrice: 5800 }
        ]
    },
    {
        category: "mobile",
        brand: "Realme",
        modelName: "Realme 8 Pro",
        slug: "realme-realme-8-pro",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/realme/realme-8-pro-ofic-1.jpg",
        variants: [
            { storage: "6 GB/128 GB", basePrice: 5900 },
            { storage: "8 GB/128 GB", basePrice: 6290 }
        ]
    },
    {
        category: "mobile",
        brand: "Realme",
        modelName: "Realme C21",
        slug: "realme-realme-c21",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/realme/realme-c21-1.jpg",
        variants: [
            { storage: "3 GB/32 GB", basePrice: 3200 },
            { storage: "4 GB/64 GB", basePrice: 3400 }
        ]
    },
    {
        category: "mobile",
        brand: "Realme",
        modelName: "Realme C20",
        slug: "realme-realme-c20",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/realme/realme-c20.jpg",
        variants: [
            { storage: "2 GB/32 GB", basePrice: 2630 }
        ]
    },
    {
        category: "mobile",
        brand: "Realme",
        modelName: "Realme C25",
        slug: "realme-realme-c25",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/realme/realme-c25-1.jpg",
        variants: [
            { storage: "4 GB/64 GB", basePrice: 3400 },
            { storage: "4 GB/128 GB", basePrice: 3670 }
        ]
    },
    {
        category: "mobile",
        brand: "Realme",
        modelName: "Realme X7 Max 5G",
        slug: "realme-realme-x7-max-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/realme/realme-x7-max-5g-1.jpg",
        variants: [
            { storage: "8 GB/128 GB", basePrice: 8140 },
            { storage: "12 GB/256 GB", basePrice: 8670 }
        ]
    },
    {
        category: "mobile",
        brand: "Realme",
        modelName: "Realme C25s",
        slug: "realme-realme-c25s",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/realme/realme-c25s-1.jpg",
        variants: [
            { storage: "4 GB/64 GB", basePrice: 3750 },
            { storage: "4 GB/128 GB", basePrice: 4060 }
        ]
    },
    {
        category: "mobile",
        brand: "Realme",
        modelName: "Realme Narzo 30",
        slug: "realme-realme-narzo-30",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/realme/realme-narzo-30-1.jpg",
        variants: [
            { storage: "4 GB/64 GB", basePrice: 4270 },
            { storage: "6 GB/64 GB", basePrice: 4450 },
            { storage: "6 GB/128 GB", basePrice: 4920 }
        ]
    },
    {
        category: "mobile",
        brand: "Realme",
        modelName: "Realme Narzo 30 5G",
        slug: "realme-realme-narzo-30-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/realme/realme-narzo-30-5g-1.jpg",
        variants: [
            { storage: "4 GB/64 GB", basePrice: 5830 },
            { storage: "6 GB/128 GB", basePrice: 6820 }
        ]
    },
    {
        category: "mobile",
        brand: "Realme",
        modelName: "Realme 8 5G",
        slug: "realme-realme-8-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/realme/realme-8-5g-1.jpg",
        variants: [
            { storage: "4 GB/64 GB", basePrice: 6100 },
            { storage: "4 GB/128 GB", basePrice: 6510 },
            { storage: "8 GB/128 GB", basePrice: 7200 }
        ]
    },
    {
        category: "mobile",
        brand: "Realme",
        modelName: "Realme C11 2021",
        slug: "realme-realme-c11-2021",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/realme/realme-c11-2021-2.jpg",
        variants: [
            { storage: "2 GB/32 GB", basePrice: 2820 },
            { storage: "4 GB/64 GB", basePrice: 3290 }
        ]
    },
    {
        category: "mobile",
        brand: "Realme",
        modelName: "Realme GT 5G",
        slug: "realme-realme-gt-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/realme/realme-gt-5g-1.jpg",
        variants: [
            { storage: "8 GB/128 GB", basePrice: 8260 },
            { storage: "12 GB/256 GB", basePrice: 8960 }
        ]
    },
    {
        category: "mobile",
        brand: "Realme",
        modelName: "Realme GT Master Edition",
        slug: "realme-realme-gt-master-edition",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/realme/realme-gt-master-1.jpg",
        variants: [
            { storage: "6 GB/128 GB", basePrice: 7720 },
            { storage: "8 GB/128 GB", basePrice: 7960 },
            { storage: "8 GB/256 GB", basePrice: 8500 }
        ]
    },
    {
        category: "mobile",
        brand: "Realme",
        modelName: "Realme C21Y",
        slug: "realme-realme-c21y",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/realme/realme-c21y-1.jpg",
        variants: [
            { storage: "3 GB/32 GB", basePrice: 3090 },
            { storage: "4 GB/64 GB", basePrice: 3290 }
        ]
    },
    {
        category: "mobile",
        brand: "Realme",
        modelName: "Realme 8i",
        slug: "realme-realme-8i",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/realme/realme-8i-1.jpg",
        variants: [
            { storage: "4 GB/64 GB", basePrice: 4440 },
            { storage: "6 GB/128 GB", basePrice: 4780 }
        ]
    },
    {
        category: "mobile",
        brand: "Realme",
        modelName: "Realme C55",
        slug: "realme-realme-c55",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/realme/realme-c55-1.jpg",
        variants: [
            { storage: "4 GB/64 GB", basePrice: 5440 },
            { storage: "6 GB/64 GB", basePrice: 6470 },
            { storage: "8 GB/128 GB", basePrice: 6900 }
        ]
    },
    {
        category: "mobile",
        brand: "Realme",
        modelName: "Realme C33 2023",
        slug: "realme-realme-c33-2023",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/realme/realme-c33-2.jpg",
        variants: [
            { storage: "4 GB/64 GB", basePrice: 4300 },
            { storage: "4 GB/128 GB", basePrice: 4900 }
        ]
    },
    {
        category: "mobile",
        brand: "Realme",
        modelName: "Realme Narzo N53",
        slug: "realme-realme-narzo-n53",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/realme/realme-narzo-n53-1.jpg",
        variants: [
            { storage: "4 GB/64 GB", basePrice: 5300 },
            { storage: "6 GB/128 GB", basePrice: 5950 },
            { storage: "8 GB/128 GB", basePrice: 6250 }
        ]
    },
    {
        category: "mobile",
        brand: "Realme",
        modelName: "Realme 11 Pro 5G",
        slug: "realme-realme-11-pro-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/realme/realme-11-pro-2.jpg",
        variants: [
            { storage: "8 GB/128 GB", basePrice: 13090 },
            { storage: "8 GB/256 GB", basePrice: 14100 },
            { storage: "12 GB/256 GB", basePrice: 14490 }
        ]
    },
    {
        category: "mobile",
        brand: "Realme",
        modelName: "Realme 11 Pro Plus 5G",
        slug: "realme-realme-11-pro-plus-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/realme/realme-11-pro-plus-2.jpg",
        variants: [
            { storage: "8 GB/256 GB", basePrice: 15150 },
            { storage: "12 GB/256 GB", basePrice: 15570 }
        ]
    },
    {
        category: "mobile",
        brand: "Realme",
        modelName: "Realme Narzo N55",
        slug: "realme-realme-narzo-n55",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/realme/realme-narzo-n55-1.jpg",
        variants: [
            { storage: "4 GB/64 GB", basePrice: 5950 },
            { storage: "6 GB/128 GB", basePrice: 6220 }
        ]
    },
    {
        category: "mobile",
        brand: "Realme",
        modelName: "Realme C53",
        slug: "realme-realme-c53",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/realme/realme-c53-1.jpg",
        variants: [
            { storage: "4 GB/128 GB", basePrice: 5210 },
            { storage: "6 GB/64 GB", basePrice: 5140 },
            { storage: "6 GB/128 GB", basePrice: 5540 }
        ]
    },
    {
        category: "mobile",
        brand: "Realme",
        modelName: "Realme Narzo 60 5G",
        slug: "realme-realme-narzo-60-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/realme/realme-narzo60-5g-1.jpg",
        variants: [
            { storage: "8 GB/128 GB", basePrice: 10140 },
            { storage: "8 GB/256 GB", basePrice: 10670 }
        ]
    },
    {
        category: "mobile",
        brand: "Realme",
        modelName: "Realme Narzo 60 Pro 5G",
        slug: "realme-realme-narzo-60-pro-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/realme/realme-narzo60-pro-5g-1.jpg",
        variants: [
            { storage: "8 GB/128 GB", basePrice: 14190 },
            { storage: "12 GB/256 GB", basePrice: 15090 },
            { storage: "12 GB/1 TB", basePrice: 15990 }
        ]
    },
    {
        category: "mobile",
        brand: "Realme",
        modelName: "Realme 11x 5G",
        slug: "realme-realme-11x-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/realme/realme-11x-5g-1.jpg",
        variants: [
            { storage: "6 GB/128 GB", basePrice: 8610 },
            { storage: "8 GB/128 GB", basePrice: 8780 }
        ]
    },
    {
        category: "mobile",
        brand: "Realme",
        modelName: "Realme 11 5G",
        slug: "realme-realme-11-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/realme/realme-11-5g-tw-1.jpg",
        variants: [
            { storage: "8 GB/128 GB", basePrice: 9550 },
            { storage: "8 GB/256 GB", basePrice: 10860 }
        ]
    },
    {
        category: "mobile",
        brand: "Realme",
        modelName: "Realme Narzo 60X 5G",
        slug: "realme-realme-narzo-60x-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/realme/realme-narzo-60x-5g-1.jpg",
        variants: [
            { storage: "4 GB/128 GB", basePrice: 8230 },
            { storage: "6 GB/128 GB", basePrice: 8700 }
        ]
    },
    {
        category: "mobile",
        brand: "Realme",
        modelName: "Realme C67 5G",
        slug: "realme-realme-c67-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/realme/realme-c67-5g-1.jpg",
        variants: [
            { storage: "4 GB/128 GB", basePrice: 6880 },
            { storage: "6 GB/128 GB", basePrice: 7720 }
        ]
    },
    {
        category: "mobile",
        brand: "Realme",
        modelName: "Realme C51",
        slug: "realme-realme-c51",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/realme/realme-c51-1.jpg",
        variants: [
            { storage: "4 GB/128 GB", basePrice: 5200 },
            { storage: "4 GB/64 GB", basePrice: 4750 }
        ]
    },
    {
        category: "mobile",
        brand: "Realme",
        modelName: "Realme Narzo 70 Turbo 5G",
        slug: "realme-realme-narzo-70-turbo-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/realme/realme-narzo-70-turbo-1.jpg",
        variants: [
            { storage: "6 GB/128 GB", basePrice: 9600 },
            { storage: "8 GB/128 GB", basePrice: 10050 },
            { storage: "12 GB/256 GB", basePrice: 10680 }
        ]
    },
    {
        category: "mobile",
        brand: "Realme",
        modelName: "Realme P1 Speed 5G",
        slug: "realme-realme-p1-speed-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/realme/realme-p1-speed-1.jpg",
        variants: [
            { storage: "8 GB/128 GB", basePrice: 8300 },
            { storage: "12 GB/256 GB", basePrice: 9250 }
        ]
    },
    {
        category: "mobile",
        brand: "Realme",
        modelName: "Realme 14x 5G",
        slug: "realme-realme-14x-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/realme/realme-c73-1.jpg",
        variants: [
            { storage: "6 GB/128 GB", basePrice: 9250 },
            { storage: "8 GB/128 GB", basePrice: 10050 }
        ]
    },
    {
        category: "mobile",
        brand: "Realme",
        modelName: "Realme 14 Pro 5G",
        slug: "realme-realme-14-pro-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/realme/realme-14pro-1.jpg",
        variants: [
            { storage: "8 GB/128 GB", basePrice: 15790 },
            { storage: "8 GB/256 GB", basePrice: 16320 }
        ]
    },
    {
        category: "mobile",
        brand: "Realme",
        modelName: "Realme 14 Pro Plus 5G",
        slug: "realme-realme-14-pro-plus-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/realme/realme-14pro-plus-1.jpg",
        variants: [
            { storage: "8 GB/128 GB", basePrice: 17800 },
            { storage: "8 GB/256 GB", basePrice: 18700 },
            { storage: "12 GB/256 GB", basePrice: 19180 },
            { storage: "12 GB/512 GB", basePrice: 20910 }
        ]
    },
    {
        category: "mobile",
        brand: "Realme",
        modelName: "Realme Narzo N63",
        slug: "realme-realme-narzo-n63",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/realme/realme-narzo-n63.jpg",
        variants: [
            { storage: "4 GB/64 GB", basePrice: 3880 },
            { storage: "4 GB/128 GB", basePrice: 4390 }
        ]
    },
    {
        category: "mobile",
        brand: "Realme",
        modelName: "Realme P3X 5G",
        slug: "realme-realme-p3x-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/realme/realme-p3x-5g-1.jpg",
        variants: [
            { storage: "6 GB/128 GB", basePrice: 8350 },
            { storage: "8 GB/128 GB", basePrice: 8800 }
        ]
    },
    {
        category: "mobile",
        brand: "Realme",
        modelName: "Realme P3 5G",
        slug: "realme-realme-p3-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/realme/realme-p3-5g-1.jpg",
        variants: [
            { storage: "6 GB/128 GB", basePrice: 10350 },
            { storage: "8 GB/128 GB", basePrice: 11420 },
            { storage: "8 GB/256 GB", basePrice: 11930 }
        ]
    },
    {
        category: "mobile",
        brand: "Realme",
        modelName: "Realme P3 Pro 5G",
        slug: "realme-realme-p3-pro-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/realme/realme-p3-pro-5g-1.jpg",
        variants: [
            { storage: "8 GB/128 GB", basePrice: 12750 },
            { storage: "8 GB/256 GB", basePrice: 13570 },
            { storage: "12 GB/256 GB", basePrice: 14590 }
        ]
    },
    {
        category: "mobile",
        brand: "Realme",
        modelName: "Realme P3 Ultra 5G",
        slug: "realme-realme-p3-ultra-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/realme/realme-p3-ultra-5g-1.jpg",
        variants: [
            { storage: "8 GB/128 GB", basePrice: 14590 },
            { storage: "8 GB/256 GB", basePrice: 15400 },
            { storage: "12 GB/256 GB", basePrice: 15810 }
        ]
    },
    {
        category: "mobile",
        brand: "Realme",
        modelName: "Realme 14 Pro Lite 5G",
        slug: "realme-realme-14-pro-lite-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/realme/realme-13-pro-1.jpg",
        variants: [
            { storage: "8 GB/128 GB", basePrice: 13060 },
            { storage: "8 GB/256 GB", basePrice: 13970 }
        ]
    },
    {
        category: "mobile",
        brand: "Realme",
        modelName: "Realme C75 5G",
        slug: "realme-realme-c75-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/realme/realme-c75-5g-1.jpg",
        variants: [
            { storage: "4 GB/128 GB", basePrice: 8210 },
            { storage: "6 GB/128 GB", basePrice: 8850 }
        ]
    },
    {
        category: "mobile",
        brand: "Realme",
        modelName: "Realme Narzo 80x 5G",
        slug: "realme-realme-narzo-80x-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/realme/realme-narzo-80x-5g-1.jpg",
        variants: [
            { storage: "6 GB/128 GB", basePrice: 8100 },
            { storage: "8 GB/128 GB", basePrice: 8700 }
        ]
    },
    {
        category: "mobile",
        brand: "Realme",
        modelName: "Realme Narzo Power 5G",
        slug: "realme-realme-narzo-power-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/realme/realme-narzo-power-1.jpg",
        variants: [
            { storage: "8 GB/128 GB", basePrice: 17750 },
            { storage: "8 GB/256 GB", basePrice: 19500 }
        ]
    },
    {
        category: "mobile",
        brand: "Realme",
        modelName: "Realme P4 Lite",
        slug: "realme-realme-p4-lite",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/realme/realme-p4-lite-5g-1.jpg",
        variants: [
            { storage: "4 GB/64 GB", basePrice: 6830 },
            { storage: "4 GB/128 GB", basePrice: 8160 },
            { storage: "6 GB/128 GB", basePrice: 9500 }
        ]
    },
    {
        category: "mobile",
        brand: "Realme",
        modelName: "Realme 16 5G",
        slug: "realme-realme-16-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/realme/realme-16-1.jpg",
        variants: [
            { storage: "8 GB/128 GB", basePrice: 22100 },
            { storage: "8 GB/256 GB", basePrice: 23800 },
            { storage: "12 GB/256 GB", basePrice: 25500 }
        ]
    },
    {
        category: "mobile",
        brand: "Realme",
        modelName: "Realme P4 Lite 5G",
        slug: "realme-realme-p4-lite-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/realme/realme-p4-lite-5g-1.jpg",
        variants: [
            { storage: "4 GB/64 GB", basePrice: 8800 },
            { storage: "4 GB/128 GB", basePrice: 9400 },
            { storage: "6 GB/128 GB", basePrice: 10700 }
        ]
    },
    {
        category: "mobile",
        brand: "Realme",
        modelName: "Realme Narzo 100 Lite 5G",
        slug: "realme-realme-narzo-100-lite-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/realme/realme-narzo-100-lite-1.jpg",
        variants: [
            { storage: "4 GB/64 GB", basePrice: 9000 },
            { storage: "4 GB/128 GB", basePrice: 9600 },
            { storage: "6 GB/128 GB", basePrice: 10800 }
        ]
    },
    {
        category: "mobile",
        brand: "Realme",
        modelName: "Realme XT",
        slug: "realme-realme-xt",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/realme/realme-xt.jpg",
        variants: [
            { storage: "4 GB/64 GB", basePrice: 4290 },
            { storage: "6 GB/64 GB", basePrice: 4580 },
            { storage: "8 GB/128 GB", basePrice: 4960 }
        ]
    },
    {
        category: "mobile",
        brand: "Realme",
        modelName: "Realme 5s",
        slug: "realme-realme-5s",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/realme/realme-5s-1.jpg",
        variants: [
            { storage: "4 GB/64 GB", basePrice: 3130 },
            { storage: "4 GB/128 GB", basePrice: 3520 }
        ]
    },
    {
        category: "mobile",
        brand: "Realme",
        modelName: "Realme X2 Pro",
        slug: "realme-realme-x2-pro",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/realme/realme-x2-pro-1.jpg",
        variants: [
            { storage: "6 GB/64 GB", basePrice: 4750 },
            { storage: "8 GB/128 GB", basePrice: 5170 },
            { storage: "12 GB/256 GB", basePrice: 5480 }
        ]
    },
    {
        category: "mobile",
        brand: "Realme",
        modelName: "Realme X2",
        slug: "realme-realme-x2",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/realme/realme-xt-730g.jpg",
        variants: [
            { storage: "4 GB/64 GB", basePrice: 4140 },
            { storage: "6 GB/128 GB", basePrice: 4600 },
            { storage: "8 GB/128 GB", basePrice: 5020 },
            { storage: "8 GB/256 GB", basePrice: 5260 }
        ]
    },
    {
        category: "mobile",
        brand: "Realme",
        modelName: "Realme 5i",
        slug: "realme-realme-5i",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/realme/realme-5i-3.jpg",
        variants: [
            { storage: "4 GB/64 GB", basePrice: 3780 },
            { storage: "4 GB/128 GB", basePrice: 4010 }
        ]
    },
    {
        category: "mobile",
        brand: "Realme",
        modelName: "Realme C3",
        slug: "realme-realme-c3",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/realme/realme-c3-2020-2.jpg",
        variants: [
            { storage: "4 GB/64 GB", basePrice: 3450 },
            { storage: "3 GB/32 GB", basePrice: 3140 }
        ]
    },
    {
        category: "mobile",
        brand: "Realme",
        modelName: "Realme X50 Pro",
        slug: "realme-realme-x50-pro",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/realme/realme-x50-pro-5g-1.jpg",
        variants: [
            { storage: "6 GB/128 GB", basePrice: 6640 },
            { storage: "8 GB/128 GB", basePrice: 6880 },
            { storage: "12 GB/256 GB", basePrice: 7410 }
        ]
    },
    {
        category: "mobile",
        brand: "Realme",
        modelName: "Realme 6",
        slug: "realme-realme-6",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/realme/realme-6-1.jpg",
        variants: [
            { storage: "4 GB/64 GB", basePrice: 4190 },
            { storage: "6 GB/64 GB", basePrice: 4630 },
            { storage: "6 GB/128 GB", basePrice: 4850 },
            { storage: "8 GB/128 GB", basePrice: 5020 }
        ]
    },
    {
        category: "mobile",
        brand: "Realme",
        modelName: "Realme 6 Pro",
        slug: "realme-realme-6-pro",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/realme/realme-6-pro-1.jpg",
        variants: [
            { storage: "6 GB/64 GB", basePrice: 4520 },
            { storage: "6 GB/128 GB", basePrice: 4950 },
            { storage: "8 GB/128 GB", basePrice: 5130 }
        ]
    },
    {
        category: "mobile",
        brand: "Realme",
        modelName: "Realme Narzo 10",
        slug: "realme-realme-narzo-10",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/realme/realme-narzo-10-1.jpg",
        variants: [
            { storage: "4 GB/128 GB", basePrice: 3850 }
        ]
    },
    {
        category: "mobile",
        brand: "Realme",
        modelName: "Realme Narzo 10A",
        slug: "realme-realme-narzo-10a",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/realme/realme-narzo-10a-2.jpg",
        variants: [
            { storage: "3 GB/32 GB", basePrice: 3240 },
            { storage: "4 GB/64 GB", basePrice: 3510 }
        ]
    },
    {
        category: "mobile",
        brand: "Realme",
        modelName: "Realme X3",
        slug: "realme-realme-x3",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/realme/realme-x3-1.jpg",
        variants: [
            { storage: "6 GB/128 GB", basePrice: 5410 },
            { storage: "8 GB/128 GB", basePrice: 5830 }
        ]
    },
    {
        category: "mobile",
        brand: "Realme",
        modelName: "Realme 8s 5G",
        slug: "realme-realme-8s-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/realme/realme-8s-5g-1.jpg",
        variants: [
            { storage: "6 GB/128 GB", basePrice: 7130 },
            { storage: "8 GB/128 GB", basePrice: 7710 }
        ]
    },
    {
        category: "mobile",
        brand: "Realme",
        modelName: "Realme C25Y",
        slug: "realme-realme-c25y",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/realme/realme-c25y-1.jpg",
        variants: [
            { storage: "4 GB/64 GB", basePrice: 3980 },
            { storage: "4 GB/128 GB", basePrice: 4240 }
        ]
    },
    {
        category: "mobile",
        brand: "Realme",
        modelName: "Realme Narzo 50A",
        slug: "realme-realme-narzo-50a",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/realme/realme-narzo-50a-1.jpg",
        variants: [
            { storage: "4 GB/64 GB", basePrice: 3940 },
            { storage: "4 GB/128 GB", basePrice: 4250 }
        ]
    },
    {
        category: "mobile",
        brand: "Realme",
        modelName: "Realme Narzo 50i",
        slug: "realme-realme-narzo-50i",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/realme/realme-narzo-50i-1.jpg",
        variants: [
            { storage: "2 GB/32 GB", basePrice: 3090 },
            { storage: "4 GB/64 GB", basePrice: 3600 }
        ]
    },
    {
        category: "mobile",
        brand: "Realme",
        modelName: "Realme GT NEO 2",
        slug: "realme-realme-gt-neo-2",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/realme/realme-gt-neo2-1.jpg",
        variants: [
            { storage: "8 GB/128 GB", basePrice: 8500 },
            { storage: "12 GB/256 GB", basePrice: 8960 }
        ]
    },
    {
        category: "mobile",
        brand: "Realme",
        modelName: "Realme 9i",
        slug: "realme-realme-9i",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/realme/realme-9i-1.jpg",
        variants: [
            { storage: "4 GB/64 GB", basePrice: 4480 },
            { storage: "4 GB/128 GB", basePrice: 4800 },
            { storage: "6 GB/128 GB", basePrice: 4960 }
        ]
    },
    {
        category: "mobile",
        brand: "Realme",
        modelName: "Realme 9 Pro 5G",
        slug: "realme-realme-9-pro-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/realme/realme-9-pro-3.jpg",
        variants: [
            { storage: "6 GB/128 GB", basePrice: 7460 },
            { storage: "8 GB/128 GB", basePrice: 7910 }
        ]
    },
    {
        category: "mobile",
        brand: "Realme",
        modelName: "Realme 9 Pro Plus 5G",
        slug: "realme-realme-9-pro-plus-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/realme/realme-9-pro-plus-1.jpg",
        variants: [
            { storage: "6 GB/128 GB", basePrice: 7860 },
            { storage: "8 GB/128 GB", basePrice: 8440 },
            { storage: "8 GB/256 GB", basePrice: 8810 }
        ]
    },
    {
        category: "mobile",
        brand: "Realme",
        modelName: "Realme Narzo 50",
        slug: "realme-realme-narzo-50",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/realme/realme-narzo-50-1.jpg",
        variants: [
            { storage: "4 GB/64 GB", basePrice: 4590 },
            { storage: "6 GB/128 GB", basePrice: 4910 }
        ]
    },
    {
        category: "mobile",
        brand: "Realme",
        modelName: "Realme C35",
        slug: "realme-realme-c35",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/realme/realme-c35-1.jpg",
        variants: [
            { storage: "4 GB/64 GB", basePrice: 3750 },
            { storage: "4 GB/128 GB", basePrice: 4390 },
            { storage: "6 GB/128 GB", basePrice: 4810 }
        ]
    },
    {
        category: "mobile",
        brand: "Realme",
        modelName: "Realme 9 5G",
        slug: "realme-realme-9-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/realme/realme-9-5g-global-1.jpg",
        variants: [
            { storage: "4 GB/64 GB", basePrice: 6550 },
            { storage: "6 GB/128 GB", basePrice: 7210 }
        ]
    },
    {
        category: "mobile",
        brand: "Realme",
        modelName: "Realme 9 5G Speed Edition",
        slug: "realme-realme-9-5g-speed-edition",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/realme/realme-9-5g-speed-edition-1.jpg",
        variants: [
            { storage: "6 GB/128 GB", basePrice: 7230 },
            { storage: "8 GB/128 GB", basePrice: 7540 }
        ]
    },
    {
        category: "mobile",
        brand: "Realme",
        modelName: "Realme C31",
        slug: "realme-realme-c31",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/realme/realme-c31-5.jpg",
        variants: [
            { storage: "3 GB/32 GB", basePrice: 2630 },
            { storage: "4 GB/64 GB", basePrice: 3270 }
        ]
    },
    {
        category: "mobile",
        brand: "Realme",
        modelName: "Realme GT 2",
        slug: "realme-realme-gt-2",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/realme/realme-gt2-1.jpg",
        variants: [
            { storage: "8 GB/128 GB", basePrice: 9130 },
            { storage: "12 GB/256 GB", basePrice: 9730 }
        ]
    },
    {
        category: "mobile",
        brand: "Realme",
        modelName: "Realme GT 2 Pro",
        slug: "realme-realme-gt-2-pro",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/realme/realme-gt2-pro-1.jpg",
        variants: [
            { storage: "8 GB/128 GB", basePrice: 9730 },
            { storage: "12 GB/256 GB", basePrice: 10120 }
        ]
    },
    {
        category: "mobile",
        brand: "Realme",
        modelName: "Realme 12 Pro 5G",
        slug: "realme-realme-12-pro-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/realme/realme-12-pro-2.jpg",
        variants: [
            { storage: "8 GB/128 GB", basePrice: 13310 },
            { storage: "8 GB/256 GB", basePrice: 14620 },
            { storage: "12 GB/256 GB", basePrice: 14980 }
        ]
    },
    {
        category: "mobile",
        brand: "Realme",
        modelName: "Realme 12 Pro Plus 5G",
        slug: "realme-realme-12-pro-plus-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/realme/realme-12-pro-plus-0.jpg",
        variants: [
            { storage: "8 GB/128 GB", basePrice: 14650 },
            { storage: "8 GB/256 GB", basePrice: 15220 },
            { storage: "12 GB/256 GB", basePrice: 16010 }
        ]
    },
    {
        category: "mobile",
        brand: "Realme",
        modelName: "Realme 12 5G",
        slug: "realme-realme-12-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/realme/realme-12-5g-1.jpg",
        variants: [
            { storage: "6 GB/128 GB", basePrice: 9700 },
            { storage: "8 GB/128 GB", basePrice: 10450 }
        ]
    },
    {
        category: "mobile",
        brand: "Realme",
        modelName: "Realme 12 Plus 5G",
        slug: "realme-realme-12-plus-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/realme/realme-12-plus-1.jpg",
        variants: [
            { storage: "8 GB/128 GB", basePrice: 10800 },
            { storage: "8 GB/256 GB", basePrice: 11760 }
        ]
    },
    {
        category: "mobile",
        brand: "Realme",
        modelName: "Realme 12x 5G",
        slug: "realme-realme-12x-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/realme/realme-12x-1.jpg",
        variants: [
            { storage: "4 GB/128 GB", basePrice: 7300 },
            { storage: "6 GB/128 GB", basePrice: 9520 },
            { storage: "8 GB/128 GB", basePrice: 10000 }
        ]
    },
    {
        category: "mobile",
        brand: "Realme",
        modelName: "Realme P1 5G",
        slug: "realme-realme-p1-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/realme/realme-p1-1.jpg",
        variants: [
            { storage: "6 GB/128 GB", basePrice: 9260 },
            { storage: "8 GB/128 GB", basePrice: 9800 },
            { storage: "8 GB/256 GB", basePrice: 10140 }
        ]
    },
    {
        category: "mobile",
        brand: "Realme",
        modelName: "Realme P1 Pro 5G",
        slug: "realme-realme-p1-pro-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/realme/realme-p1-pro-1.jpg",
        variants: [
            { storage: "8 GB/128 GB", basePrice: 9000 },
            { storage: "8 GB/256 GB", basePrice: 9500 },
            { storage: "12 GB/256 GB", basePrice: 9950 }
        ]
    },
    {
        category: "mobile",
        brand: "Realme",
        modelName: "Realme Narzo 70 5G",
        slug: "realme-realme-narzo-70-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/realme/realme-narzo-70-1.jpg",
        variants: [
            { storage: "6 GB/128 GB", basePrice: 7600 },
            { storage: "8 GB/128 GB", basePrice: 8580 }
        ]
    },
    {
        category: "mobile",
        brand: "Realme",
        modelName: "Realme Narzo 70 Pro 5G",
        slug: "realme-realme-narzo-70-pro-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/realme/realme-narzo-70-pro-1.jpg",
        variants: [
            { storage: "8 GB/128 GB", basePrice: 10090 },
            { storage: "8 GB/256 GB", basePrice: 10980 }
        ]
    },
    {
        category: "mobile",
        brand: "Realme",
        modelName: "Realme Narzo 70x 5G",
        slug: "realme-realme-narzo-70x-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/realme/realme-narzo-70x-1.jpg",
        variants: [
            { storage: "4 GB/128 GB", basePrice: 6140 },
            { storage: "6 GB/128 GB", basePrice: 7100 },
            { storage: "8 GB/128 GB", basePrice: 7600 }
        ]
    },
    {
        category: "mobile",
        brand: "Realme",
        modelName: "Realme GT 6T 5G",
        slug: "realme-realme-gt-6t-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/realme/realme-gt-neo6-se-1.jpg",
        variants: [
            { storage: "8 GB/128 GB", basePrice: 14690 },
            { storage: "8 GB/256 GB", basePrice: 15880 },
            { storage: "12 GB/256 GB", basePrice: 16690 },
            { storage: "12 GB/512 GB", basePrice: 18190 }
        ]
    },
    {
        category: "mobile",
        brand: "Realme",
        modelName: "Realme Narzo N65 5G",
        slug: "realme-realme-narzo-n65-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/realme/realme-narzo-n65-1.jpg",
        variants: [
            { storage: "4 GB/128 GB", basePrice: 5850 },
            { storage: "6 GB/128 GB", basePrice: 6250 },
            { storage: "8 GB/128 GB", basePrice: 6640 }
        ]
    },
    {
        category: "mobile",
        brand: "Realme",
        modelName: "Realme C73 5G",
        slug: "realme-realme-c73-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/realme/realme-c73-1.jpg",
        variants: [
            { storage: "4 GB/64 GB", basePrice: 6800 },
            { storage: "4 GB/128 GB", basePrice: 7700 }
        ]
    },
    {
        category: "mobile",
        brand: "Realme",
        modelName: "Realme 14T 5G",
        slug: "realme-realme-14t-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/realme/realme-14t-1.jpg",
        variants: [
            { storage: "8 GB/128 GB", basePrice: 11240 },
            { storage: "8 GB/256 GB", basePrice: 12440 }
        ]
    },
    {
        category: "mobile",
        brand: "Realme",
        modelName: "Realme GT 7",
        slug: "realme-realme-gt-7",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/realme/realme-gt-7-1.jpg",
        variants: [
            { storage: "8 GB/256 GB", basePrice: 23660 },
            { storage: "12 GB/256 GB", basePrice: 24990 },
            { storage: "12 GB/512 GB", basePrice: 27230 },
            { storage: "16 GB/512 GB", basePrice: 30190 }
        ]
    },
    {
        category: "mobile",
        brand: "Realme",
        modelName: "Realme GT 7 Pro 5G",
        slug: "realme-realme-gt-7-pro-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/realme/realme-gt7-pro-1.jpg",
        variants: [
            { storage: "12 GB/256 GB", basePrice: 30400 },
            { storage: "16 GB/512 GB", basePrice: 35290 }
        ]
    },
    {
        category: "mobile",
        brand: "Realme",
        modelName: "Realme GT 7T",
        slug: "realme-realme-gt-7t",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/realme/realme-gt-7t-1.jpg",
        variants: [
            { storage: "8 GB/256 GB", basePrice: 19200 },
            { storage: "12 GB/256 GB", basePrice: 21500 },
            { storage: "12 GB/512 GB", basePrice: 23000 }
        ]
    },
    {
        category: "mobile",
        brand: "Realme",
        modelName: "Realme Narzo 80 Pro 5G",
        slug: "realme-realme-narzo-80-pro-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/realme/realme-narzo-80-pro-5g-1.jpg",
        variants: [
            { storage: "8 GB/128 GB", basePrice: 11680 },
            { storage: "8 GB/256 GB", basePrice: 12650 },
            { storage: "12 GB/256 GB", basePrice: 13460 }
        ]
    },
    {
        category: "mobile",
        brand: "Realme",
        modelName: "Realme Narzo 80 Lite 5G",
        slug: "realme-realme-narzo-80-lite-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/realme/realme-narzo-80-lite-1.jpg",
        variants: [
            { storage: "4 GB/128 GB", basePrice: 6780 },
            { storage: "6 GB/128 GB", basePrice: 7500 }
        ]
    },
    {
        category: "mobile",
        brand: "Realme",
        modelName: "Realme C71",
        slug: "realme-realme-c71",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/realme/realme-c75-5g-1.jpg",
        variants: [
            { storage: "6 GB/128 GB", basePrice: 5300 }
        ]
    },
    {
        category: "mobile",
        brand: "Realme",
        modelName: "Realme 15 5G",
        slug: "realme-realme-15-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/realme/realme-15-int-1.jpg",
        variants: [
            { storage: "8 GB/128 GB", basePrice: 16900 },
            { storage: "8 GB/256 GB", basePrice: 17920 },
            { storage: "12 GB/256 GB", basePrice: 18770 }
        ]
    },
    {
        category: "mobile",
        brand: "Realme",
        modelName: "Realme 15 Pro 5G",
        slug: "realme-realme-15-pro-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/realme/realme-15-pro-01.jpg",
        variants: [
            { storage: "8 GB/128 GB", basePrice: 17800 },
            { storage: "8 GB/256 GB", basePrice: 19150 },
            { storage: "12 GB/256 GB", basePrice: 20000 },
            { storage: "12 GB/512 GB", basePrice: 22000 }
        ]
    },
    {
        category: "mobile",
        brand: "Realme",
        modelName: "Realme 15T 5G",
        slug: "realme-realme-15t-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/realme/realme-15t-5g-1.jpg",
        variants: [
            { storage: "8 GB/128 GB", basePrice: 13810 },
            { storage: "8 GB/256 GB", basePrice: 16160 },
            { storage: "12 GB/256 GB", basePrice: 17240 }
        ]
    },
    {
        category: "mobile",
        brand: "Realme",
        modelName: "Realme Narzo 80 Lite 4G",
        slug: "realme-realme-narzo-80-lite-4g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/realme/realme-narzo-80-lite-4g-01.jpg",
        variants: [
            { storage: "4 GB/64 GB", basePrice: 5200 },
            { storage: "6 GB/128 GB", basePrice: 5810 }
        ]
    },
    {
        category: "mobile",
        brand: "Realme",
        modelName: "Realme P3 Lite 5G",
        slug: "realme-realme-p3-lite-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/realme/realme-c75-5g-1.jpg",
        variants: [
            { storage: "4 GB/128 GB", basePrice: 7290 },
            { storage: "6 GB/128 GB", basePrice: 7550 }
        ]
    },
    {
        category: "mobile",
        brand: "Realme",
        modelName: "Realme X3 SuperZoom",
        slug: "realme-realme-x3-superzoom",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/realme/realme-x3-superzoom-1.jpg",
        variants: [
            { storage: "8 GB/128 GB", basePrice: 5260 },
            { storage: "8 GB/256 GB", basePrice: 5760 },
            { storage: "12 GB/256 GB", basePrice: 5990 }
        ]
    },
    {
        category: "mobile",
        brand: "Realme",
        modelName: "Realme C11",
        slug: "realme-realme-c11",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/realme/realme-c11-1.jpg",
        variants: [
            { storage: "2 GB/32 GB", basePrice: 2770 }
        ]
    },
    {
        category: "mobile",
        brand: "Realme",
        modelName: "Realme C12",
        slug: "realme-realme-c12",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/realme/realme-c12-1.jpg",
        variants: [
            { storage: "3 GB/32 GB", basePrice: 3150 },
            { storage: "4 GB/64 GB", basePrice: 3590 }
        ]
    },
    {
        category: "mobile",
        brand: "Realme",
        modelName: "Realme 6i",
        slug: "realme-realme-6i",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/realme/realme-6i-0.jpg",
        variants: [
            { storage: "4 GB/64 GB", basePrice: 4010 },
            { storage: "6 GB/64 GB", basePrice: 4480 }
        ]
    },
    {
        category: "mobile",
        brand: "Realme",
        modelName: "Realme 7 Pro",
        slug: "realme-realme-7-pro",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/realme/realme-7-pro-1.jpg",
        variants: [
            { storage: "6 GB/128 GB", basePrice: 5380 },
            { storage: "8 GB/128 GB", basePrice: 5680 }
        ]
    },
    {
        category: "mobile",
        brand: "Realme",
        modelName: "Realme C15",
        slug: "realme-realme-c15",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/realme/realme-c15-1.jpg",
        variants: [
            { storage: "3 GB/32 GB", basePrice: 3130 },
            { storage: "3 GB/64 GB", basePrice: 3480 },
            { storage: "4 GB/64 GB", basePrice: 3790 }
        ]
    },
    {
        category: "mobile",
        brand: "Realme",
        modelName: "Realme 7",
        slug: "realme-realme-7",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/realme/realme-7-1.jpg",
        variants: [
            { storage: "6 GB/64 GB", basePrice: 4580 },
            { storage: "8 GB/128 GB", basePrice: 5230 }
        ]
    },
    {
        category: "mobile",
        brand: "Realme",
        modelName: "Realme Narzo 20 Pro",
        slug: "realme-realme-narzo-20-pro",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/realme/realme-narzo-20-pro-1.jpg",
        variants: [
            { storage: "6 GB/64 GB", basePrice: 4200 },
            { storage: "8 GB/128 GB", basePrice: 4670 }
        ]
    },
    {
        category: "mobile",
        brand: "Realme",
        modelName: "Realme Narzo 20",
        slug: "realme-realme-narzo-20",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/realme/realme-narzo-20-1.jpg",
        variants: [
            { storage: "4 GB/64 GB", basePrice: 4090 },
            { storage: "4 GB/128 GB", basePrice: 4390 }
        ]
    },
    {
        category: "mobile",
        brand: "Realme",
        modelName: "Realme Narzo 20A",
        slug: "realme-realme-narzo-20a",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/realme/realme-narzo-20a-1.jpg",
        variants: [
            { storage: "3 GB/32 GB", basePrice: 3320 },
            { storage: "4 GB/64 GB", basePrice: 3750 }
        ]
    },
    {
        category: "mobile",
        brand: "Realme",
        modelName: "Realme 7i",
        slug: "realme-realme-7i",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/realme/realme-7i-1.jpg",
        variants: [
            { storage: "4 GB/64 GB", basePrice: 3820 },
            { storage: "4 GB/128 GB", basePrice: 4450 }
        ]
    },
    {
        category: "mobile",
        brand: "Realme",
        modelName: "Realme C15 Qualcomm Edition",
        slug: "realme-realme-c15-qualcomm-edition",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/realme/realme-c15-qualcomm-edition-1.jpg",
        variants: [
            { storage: "3 GB/32 GB", basePrice: 3130 },
            { storage: "4 GB/64 GB", basePrice: 3400 }
        ]
    },
    {
        category: "mobile",
        brand: "Realme",
        modelName: "Realme X7",
        slug: "realme-realme-x7",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/realme/realme-x7-5g-1.jpg",
        variants: [
            { storage: "6 GB/128 GB", basePrice: 7120 },
            { storage: "8 GB/128 GB", basePrice: 7420 }
        ]
    },
    {
        category: "mobile",
        brand: "Realme",
        modelName: "Realme X7 Pro",
        slug: "realme-realme-x7-pro",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/realme/realme-x7-pro-5g-1.jpg",
        variants: [
            { storage: "8 GB/128 GB", basePrice: 7690 }
        ]
    },
    {
        category: "mobile",
        brand: "Realme",
        modelName: "Realme Narzo 30A",
        slug: "realme-realme-narzo-30a",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/realme/realme-narzo-30a-1.jpg",
        variants: [
            { storage: "3 GB/32 GB", basePrice: 3480 },
            { storage: "4 GB/64 GB", basePrice: 3940 }
        ]
    },
    {
        category: "mobile",
        brand: "Realme",
        modelName: "Realme Narzo 30 Pro 5G",
        slug: "realme-realme-narzo-30-pro-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/realme/realme-narzo-30-pro-3.jpg",
        variants: [
            { storage: "6 GB/64 GB", basePrice: 6550 },
            { storage: "8 GB/128 GB", basePrice: 6910 }
        ]
    },
    {
        category: "mobile",
        brand: "Realme",
        modelName: "Realme 9",
        slug: "realme-realme-9",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/realme/realme-9-4g-1.jpg",
        variants: [
            { storage: "6 GB/128 GB", basePrice: 5680 },
            { storage: "8 GB/128 GB", basePrice: 5980 }
        ]
    },
    {
        category: "mobile",
        brand: "Realme",
        modelName: "Realme GT Neo 3",
        slug: "realme-realme-gt-neo-3",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/realme/realme-gt-neo3-0.jpg",
        variants: [
            { storage: "8 GB/128 GB", basePrice: 9470 },
            { storage: "8 GB/256 GB", basePrice: 9580 }
        ]
    },
    {
        category: "mobile",
        brand: "Realme",
        modelName: "Realme Narzo 50A Prime",
        slug: "realme-realme-narzo-50a-prime",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/realme/realme-narzo-50a-prime-1.jpg",
        variants: [
            { storage: "4 GB/64 GB", basePrice: 3900 },
            { storage: "4 GB/128 GB", basePrice: 4360 }
        ]
    },
    {
        category: "mobile",
        brand: "Realme",
        modelName: "Realme C30",
        slug: "realme-realme-c30",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/realme/realme-c30-1.jpg",
        variants: [
            { storage: "2 GB/32 GB", basePrice: 2740 },
            { storage: "3 GB/32 GB", basePrice: 3010 }
        ]
    },
    {
        category: "mobile",
        brand: "Realme",
        modelName: "Realme 9i 5G",
        slug: "realme-realme-9i-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/realme/realme-9i-5g-1.jpg",
        variants: [
            { storage: "4 GB/64 GB", basePrice: 5070 },
            { storage: "6 GB/128 GB", basePrice: 6220 }
        ]
    },
    {
        category: "mobile",
        brand: "Realme",
        modelName: "Realme GT NEO 3 150W",
        slug: "realme-realme-gt-neo-3-150w",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/realme/realme-gt-neo3-0.jpg",
        variants: [
            { storage: "12 GB/256 GB", basePrice: 10740 }
        ]
    },
    {
        category: "mobile",
        brand: "Realme",
        modelName: "Realme GT NEO 3T",
        slug: "realme-realme-gt-neo-3t",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/realme/neo-3t-1.jpg",
        variants: [
            { storage: "6 GB/128 GB", basePrice: 8710 },
            { storage: "8 GB/128 GB", basePrice: 9080 },
            { storage: "8 GB/256 GB", basePrice: 9270 }
        ]
    },
    {
        category: "mobile",
        brand: "Realme",
        modelName: "Realme C33",
        slug: "realme-realme-c33",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/realme/realme-c33-2.jpg",
        variants: [
            { storage: "3 GB/32 GB", basePrice: 2940 },
            { storage: "4 GB/64 GB", basePrice: 3940 }
        ]
    },
    {
        category: "mobile",
        brand: "Realme",
        modelName: "Realme C30s",
        slug: "realme-realme-c30s",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/realme/realme-c30s-1.jpg",
        variants: [
            { storage: "2 GB/32 GB", basePrice: 2940 },
            { storage: "4 GB/64 GB", basePrice: 3240 }
        ]
    },
    {
        category: "mobile",
        brand: "Realme",
        modelName: "Realme Narzo 50 5G",
        slug: "realme-realme-narzo-50-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/realme/realme-narzo-50-5g-1.jpg",
        variants: [
            { storage: "4 GB/64 GB", basePrice: 5130 },
            { storage: "4 GB/128 GB", basePrice: 5560 },
            { storage: "6 GB/128 GB", basePrice: 6330 }
        ]
    },
    {
        category: "mobile",
        brand: "Realme",
        modelName: "Realme Narzo 50 Pro 5G",
        slug: "realme-realme-narzo-50-pro-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/realme/realme-narzo-50-pro-5g-1.jpg",
        variants: [
            { storage: "6 GB/128 GB", basePrice: 7830 },
            { storage: "8 GB/128 GB", basePrice: 8100 }
        ]
    },
    {
        category: "mobile",
        brand: "Realme",
        modelName: "Realme Narzo 50i Prime",
        slug: "realme-realme-narzo-50i-prime",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/realme/realme-narzo-50i-prime-1.jpg",
        variants: [
            { storage: "3 GB/32 GB", basePrice: 3200 },
            { storage: "4 GB/64 GB", basePrice: 3510 }
        ]
    },
    {
        category: "mobile",
        brand: "Realme",
        modelName: "Realme 10 Pro 5G",
        slug: "realme-realme-10-pro-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/realme/realme-10-pro-1.jpg",
        variants: [
            { storage: "6 GB/128 GB", basePrice: 7650 },
            { storage: "8 GB/128 GB", basePrice: 7880 }
        ]
    },
    {
        category: "mobile",
        brand: "Realme",
        modelName: "Realme 10 Pro Plus 5G",
        slug: "realme-realme-10-pro-plus-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/realme/realme-10-pro-plus-1.jpg",
        variants: [
            { storage: "6 GB/128 GB", basePrice: 9350 },
            { storage: "8 GB/128 GB", basePrice: 9770 },
            { storage: "8 GB/256 GB", basePrice: 10040 }
        ]
    },
    {
        category: "mobile",
        brand: "Realme",
        modelName: "Realme 10",
        slug: "realme-realme-10",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/realme/realme-10-1.jpg",
        variants: [
            { storage: "4 GB/64 GB", basePrice: 4870 },
            { storage: "8 GB/128 GB", basePrice: 5600 }
        ]
    },
    {
        category: "mobile",
        brand: "Realme",
        modelName: "Realme GT 6",
        slug: "realme-realme-gt-6",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/realme/realme-gt6-1.jpg",
        variants: [
            { storage: "8 GB/256 GB", basePrice: 16990 },
            { storage: "12 GB/256 GB", basePrice: 17490 },
            { storage: "16 GB/512 GB", basePrice: 20690 }
        ]
    },
    {
        category: "mobile",
        brand: "Realme",
        modelName: "Realme C65 5G",
        slug: "realme-realme-c65-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/realme/realme-12x-1.jpg",
        variants: [
            { storage: "4 GB/64 GB", basePrice: 4320 },
            { storage: "4 GB/128 GB", basePrice: 5060 },
            { storage: "6 GB/128 GB", basePrice: 5610 },
            { storage: "8 GB/128 GB", basePrice: 7690 }
        ]
    },
    {
        category: "mobile",
        brand: "Realme",
        modelName: "Realme C61",
        slug: "realme-realme-c61",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/realme/realme-c61-int-1.jpg",
        variants: [
            { storage: "4 GB/64 GB", basePrice: 4120 },
            { storage: "4 GB/128 GB", basePrice: 4360 },
            { storage: "6 GB/128 GB", basePrice: 4650 }
        ]
    },
    {
        category: "mobile",
        brand: "Realme",
        modelName: "Realme Narzo N61",
        slug: "realme-realme-narzo-n61",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/realme/realme-narzo-n61-02.jpg",
        variants: [
            { storage: "4 GB/64 GB", basePrice: 3600 },
            { storage: "6 GB/128 GB", basePrice: 4550 }
        ]
    },
    {
        category: "mobile",
        brand: "Realme",
        modelName: "Realme C63",
        slug: "realme-realme-c63",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/realme/realme-c63-1.jpg",
        variants: [
            { storage: "4 GB/64 GB", basePrice: 4690 },
            { storage: "4 GB/128 GB", basePrice: 5250 }
        ]
    },
    {
        category: "mobile",
        brand: "Realme",
        modelName: "Realme C63 5G",
        slug: "realme-realme-c63-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/realme/realme-v60-1.jpg",
        variants: [
            { storage: "4 GB/128 GB", basePrice: 5900 },
            { storage: "6 GB/128 GB", basePrice: 6400 },
            { storage: "8 GB/128 GB", basePrice: 6750 }
        ]
    },
    {
        category: "mobile",
        brand: "Realme",
        modelName: "Realme P2 Pro 5G",
        slug: "realme-realme-p2-pro-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/realme/realme-p2-pro-1.jpg",
        variants: [
            { storage: "8 GB/128 GB", basePrice: 9800 },
            { storage: "12 GB/256 GB", basePrice: 10690 },
            { storage: "12 GB/512 GB", basePrice: 12690 }
        ]
    },
    {
        category: "mobile",
        brand: "Realme",
        modelName: "Realme 13 5G",
        slug: "realme-realme-13-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/realme/realme-13-5g-1.jpg",
        variants: [
            { storage: "8 GB/128 GB", basePrice: 10340 },
            { storage: "8 GB/256 GB", basePrice: 10900 }
        ]
    },
    {
        category: "mobile",
        brand: "Realme",
        modelName: "Realme 13 Plus 5G",
        slug: "realme-realme-13-plus-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/realme/realme-13-plus-5g-1.jpg",
        variants: [
            { storage: "8 GB/128 GB", basePrice: 11090 },
            { storage: "8 GB/256 GB", basePrice: 11690 },
            { storage: "12 GB/256 GB", basePrice: 12690 }
        ]
    },
    {
        category: "mobile",
        brand: "Realme",
        modelName: "Realme 13 Pro 5G",
        slug: "realme-realme-13-pro-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/realme/realme-13-pro-1.jpg",
        variants: [
            { storage: "8 GB/128 GB", basePrice: 13960 },
            { storage: "8 GB/256 GB", basePrice: 16020 },
            { storage: "12 GB/512 GB", basePrice: 16220 }
        ]
    },
    {
        category: "mobile",
        brand: "Realme",
        modelName: "Realme 13 Pro Plus 5G",
        slug: "realme-realme-13-pro-plus-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/realme/realme-13-pro-plus-1.jpg",
        variants: [
            { storage: "8 GB/256 GB", basePrice: 15890 },
            { storage: "12 GB/256 GB", basePrice: 16940 },
            { storage: "12 GB/512 GB", basePrice: 17250 }
        ]
    },
    {
        category: "mobile",
        brand: "Realme",
        modelName: "Realme P4 5G",
        slug: "realme-realme-p4-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/realme/realme-p4-00.jpg",
        variants: [
            { storage: "6 GB/128 GB", basePrice: 12450 },
            { storage: "8 GB/128 GB", basePrice: 12900 },
            { storage: "8 GB/256 GB", basePrice: 13250 }
        ]
    },
    {
        category: "mobile",
        brand: "Realme",
        modelName: "Realme P4 Pro 5G",
        slug: "realme-realme-p4-pro-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/realme/realme-p4-pro-00.jpg",
        variants: [
            { storage: "8 GB/128 GB", basePrice: 15300 },
            { storage: "8 GB/256 GB", basePrice: 16010 },
            { storage: "12 GB/256 GB", basePrice: 17750 }
        ]
    },
    {
        category: "mobile",
        brand: "Realme",
        modelName: "Realme 15X 5G",
        slug: "realme-realme-15x-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/realme/realme-15x-2.jpg",
        variants: [
            { storage: "6 GB/128 GB", basePrice: 11840 },
            { storage: "8 GB/128 GB", basePrice: 13010 },
            { storage: "8 GB/256 GB", basePrice: 13670 }
        ]
    },
    {
        category: "mobile",
        brand: "Realme",
        modelName: "Realme C85 5G",
        slug: "realme-realme-c85-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/realme/realme-c85-1.jpg",
        variants: [
            { storage: "4 GB/128 GB", basePrice: 9280 },
            { storage: "6 GB/128 GB", basePrice: 10510 }
        ]
    },
    {
        category: "mobile",
        brand: "Realme",
        modelName: "Realme GT 8 Pro",
        slug: "realme-realme-gt-8-pro",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/realme/realme-gt8-pro-cn-0.jpg",
        variants: [
            { storage: "12 GB/256 GB", basePrice: 39780 },
            { storage: "16 GB/512 GB", basePrice: 42840 }
        ]
    },
    {
        category: "mobile",
        brand: "Realme",
        modelName: "Realme 16 Pro 5G",
        slug: "realme-realme-16-pro-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/realme/realme-16-pro-1.jpg",
        variants: [
            { storage: "8 GB/128 GB", basePrice: 23000 },
            { storage: "8 GB/256 GB", basePrice: 24500 },
            { storage: "12 GB/256 GB", basePrice: 26500 }
        ]
    },
    {
        category: "mobile",
        brand: "Realme",
        modelName: "Realme Narzo 90x 5G",
        slug: "realme-realme-narzo-90x-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/realme/realme-narzo-90x-1.jpg",
        variants: [
            { storage: "4 GB/128 GB", basePrice: 9180 },
            { storage: "6 GB/128 GB", basePrice: 10150 },
            { storage: "8 GB/128 GB", basePrice: 10650 }
        ]
    },
    {
        category: "mobile",
        brand: "Realme",
        modelName: "Realme P4x 5G",
        slug: "realme-realme-p4x-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/realme/realme-p4x-1.jpg",
        variants: [
            { storage: "6 GB/128 GB", basePrice: 9690 },
            { storage: "8 GB/128 GB", basePrice: 10510 },
            { storage: "8 GB/256 GB", basePrice: 11320 }
        ]
    },
    {
        category: "mobile",
        brand: "Realme",
        modelName: "Realme P4 Power 5G",
        slug: "realme-realme-p4-power-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/realme/realme-p4-power-1.jpg",
        variants: [
            { storage: "8 GB/128 GB", basePrice: 17700 },
            { storage: "8 GB/256 GB", basePrice: 19000 },
            { storage: "12 GB/256 GB", basePrice: 20810 }
        ]
    },
    {
        category: "mobile",
        brand: "Realme",
        modelName: "Realme 16 Pro Plus 5G",
        slug: "realme-realme-16-pro-plus-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/realme/realme-16-pro-plus-1.jpg",
        variants: [
            { storage: "8 GB/128 GB", basePrice: 27000 },
            { storage: "8 GB/256 GB", basePrice: 28700 },
            { storage: "12 GB/256 GB", basePrice: 30200 }
        ]
    },
    {
        category: "mobile",
        brand: "Realme",
        modelName: "Realme C83 5G",
        slug: "realme-realme-c83-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/realme/realme-c83-0.jpg",
        variants: [
            { storage: "4 GB/64 GB", basePrice: 9640 },
            { storage: "4 GB/128 GB", basePrice: 10400 },
            { storage: "6 GB/128 GB", basePrice: 11530 }
        ]
    },
    {
        category: "mobile",
        brand: "Realme",
        modelName: "Realme Narzo 90 5G",
        slug: "realme-realme-narzo-90-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/realme/realme-narzo-90-1.jpg",
        variants: [
            { storage: "6 GB/128 GB", basePrice: 11530 },
            { storage: "8 GB/128 GB", basePrice: 12550 }
        ]
    },
];

// ─── SEED FUNCTION ────────────────────────────────────────────────────────────

async function seed() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");
        await Device.deleteMany({ category: "mobile", brand: "Realme" });
        console.log("Cleared existing Realme devices");
        await Device.insertMany(devices);
        console.log(`✅ Seeded ${devices.length} Realme devices successfully`);
        process.exit(0);
    } catch (err) {
        console.error("❌ Seed failed:", err.message);
        process.exit(1);
    }
}

seed();