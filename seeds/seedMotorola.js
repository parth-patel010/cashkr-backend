import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import Device from "../models/Device.js";

const devices = [
    // ══════════════════════════════════════════════════════
    //  MOTOROLA — All Series
    // ══════════════════════════════════════════════════════
    {
        category: "mobile",
        brand: "Motorola",
        modelName: "One Power",
        slug: "motorola-one-power",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/motorola/motorola-one-power-1.jpg",
        variants: [
            { storage: "4GB / 64GB", basePrice: 2270 }
        ]
    },
    {
        category: "mobile",
        brand: "Motorola",
        modelName: "Moto G6 Plus",
        slug: "motorola-moto-g6-plus",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/motorola/motorola-moto-g6-plus-2.jpg",
        variants: [
            { storage: "6GB / 64GB", basePrice: 1970 }
        ]
    },
    {
        category: "mobile",
        brand: "Motorola",
        modelName: "Moto Z2 Force",
        slug: "motorola-moto-z2-force",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/motorola/motorola-moto-z2-force-1.jpg",
        variants: [
            { storage: "6GB / 64GB", basePrice: 1670 }
        ]
    },
    {
        category: "mobile",
        brand: "Motorola",
        modelName: "Moto G6",
        slug: "motorola-moto-g6",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/motorola/motorola-moto-g6-2.jpg",
        variants: [
            { storage: "3GB / 32GB", basePrice: 1210 },
            { storage: "4GB / 64GB", basePrice: 1690 }
        ]
    },
    {
        category: "mobile",
        brand: "Motorola",
        modelName: "Moto G7 Power",
        slug: "motorola-moto-g7-power",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/motorola-moto-g7-power.jpg",
        variants: [
            { storage: "4GB / 64GB", basePrice: 1970 }
        ]
    },
    {
        category: "mobile",
        brand: "Motorola",
        modelName: "Moto G7",
        slug: "motorola-moto-g7",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/motorola-moto-g7.jpg",
        variants: [
            { storage: "4GB / 64GB", basePrice: 1740 }
        ]
    },
    {
        category: "mobile",
        brand: "Motorola",
        modelName: "Moto One",
        slug: "motorola-moto-one",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/motorola/motorola-one-5g-ace-1.jpg",
        variants: [
            { storage: "4GB / 64GB", basePrice: 1970 }
        ]
    },
    {
        category: "mobile",
        brand: "Motorola",
        modelName: "One Vision",
        slug: "motorola-one-vision",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/motorola-one-vision.jpg",
        variants: [
            { storage: "4GB / 128GB", basePrice: 2270 }
        ]
    },
    {
        category: "mobile",
        brand: "Motorola",
        modelName: "One Action",
        slug: "motorola-one-action",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/motorola/motorola-one-action-denim-gray.jpg",
        variants: [
            { storage: "4GB / 128GB", basePrice: 2540 }
        ]
    },
    {
        category: "mobile",
        brand: "Motorola",
        modelName: "Moto E6s",
        slug: "motorola-moto-e6s",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/motorola/motorola-moto-e6s-2020-1.jpg",
        variants: [
            { storage: "4GB / 64GB", basePrice: 2080 }
        ]
    },
    {
        category: "mobile",
        brand: "Motorola",
        modelName: "One Macro",
        slug: "motorola-one-macro",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/motorola/motorola-one-macro-1.jpg",
        variants: [
            { storage: "4GB / 64GB", basePrice: 2040 }
        ]
    },
    {
        category: "mobile",
        brand: "Motorola",
        modelName: "Moto Edge Plus",
        slug: "motorola-moto-edge-plus",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/motorola/motorola-edge-plus-1.jpg",
        variants: [
            { storage: "12Gb / 256GB", basePrice: 8180 }
        ]
    },
    {
        category: "mobile",
        brand: "Motorola",
        modelName: "Moto G8 Power Lite",
        slug: "motorola-moto-g8-power-lite",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/motorola-moto-g8-power-lite.jpg",
        variants: [
            { storage: "4GB / 64GB", basePrice: 2760 }
        ]
    },
    {
        category: "mobile",
        brand: "Motorola",
        modelName: "Moto Razr",
        slug: "motorola-moto-razr",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/motorola/motorola-razr-50-1.jpg",
        variants: [
            { storage: "6GB / 128GB", basePrice: 9660 }
        ]
    },
    {
        category: "mobile",
        brand: "Motorola",
        modelName: "One Fusion Plus",
        slug: "motorola-one-fusion-plus",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/motorola-one-fusion-plus.jpg",
        variants: [
            { storage: "6GB / 128GB", basePrice: 4510 }
        ]
    },
    {
        category: "mobile",
        brand: "Motorola",
        modelName: "Moto G9",
        slug: "motorola-moto-g9",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/motorola-moto-g9.jpg",
        variants: [
            { storage: "4GB / 64GB", basePrice: 2760 }
        ]
    },
    {
        category: "mobile",
        brand: "Motorola",
        modelName: "Moto E7 Plus",
        slug: "motorola-moto-e7-plus",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/motorola-moto-e7-plus.jpg",
        variants: [
            { storage: "4GB / 64GB", basePrice: 2800 }
        ]
    },
    {
        category: "mobile",
        brand: "Motorola",
        modelName: "Moto Razr 5G",
        slug: "motorola-moto-razr-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/motorola/motorola-razr-5g-brush-gold-0.jpg",
        variants: [
            { storage: "8GB / 256GB", basePrice: 12870 }
        ]
    },
    {
        category: "mobile",
        brand: "Motorola",
        modelName: "Moto G9 Power",
        slug: "motorola-moto-g9-power",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/motorola-moto-g9-power.jpg",
        variants: [
            { storage: "4 GB/64 GB", basePrice: 2840 }
        ]
    },
    {
        category: "mobile",
        brand: "Motorola",
        modelName: "Moto G 5G",
        slug: "motorola-moto-g-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/motorola-moto-g-5g.jpg",
        variants: [
            { storage: "6 GB/128 GB", basePrice: 4960 }
        ]
    },
    {
        category: "mobile",
        brand: "Motorola",
        modelName: "Moto G30",
        slug: "motorola-moto-g30",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/motorola-moto-g30.jpg",
        variants: [
            { storage: "4 GB/64 GB", basePrice: 3180 }
        ]
    },
    {
        category: "mobile",
        brand: "Motorola",
        modelName: "Moto G10 Power",
        slug: "motorola-moto-g10-power",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/motorola-moto-g10-power.jpg",
        variants: [
            { storage: "4 GB/64 GB", basePrice: 3030 }
        ]
    },
    {
        category: "mobile",
        brand: "Motorola",
        modelName: "Moto E7 Power",
        slug: "motorola-moto-e7-power",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/motorola-moto-e7-power.jpg",
        variants: [
            { storage: "2 GB/32 GB", basePrice: 2230 },
            { storage: "4 GB/64 GB", basePrice: 2710 }
        ]
    },
    {
        category: "mobile",
        brand: "Motorola",
        modelName: "Moto G60",
        slug: "motorola-moto-g60",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/motorola-moto-g60.jpg",
        variants: [
            { storage: "6 GB/128 GB", basePrice: 5180 }
        ]
    },
    {
        category: "mobile",
        brand: "Motorola",
        modelName: "Moto Edge 20 Pro",
        slug: "motorola-moto-edge-20-pro",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/motorola/motorola-edge20-pro-01.jpg",
        variants: [
            { storage: "8 GB/128 GB", basePrice: 7800 }
        ]
    },
    {
        category: "mobile",
        brand: "Motorola",
        modelName: "Moto G40 Fusion",
        slug: "motorola-moto-g40-fusion",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/motorola/motorola-moto-g40-fusion-1.jpg",
        variants: [
            { storage: "4 GB/64 GB", basePrice: 4050 },
            { storage: "6 GB/128 GB", basePrice: 4880 }
        ]
    },
    {
        category: "mobile",
        brand: "Motorola",
        modelName: "Moto Edge 20 Fusion",
        slug: "motorola-moto-edge-20-fusion",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/motorola/motorola-edge-20-fusion-01.jpg",
        variants: [
            { storage: "6 GB/128 GB", basePrice: 6550 },
            { storage: "8 GB/128 GB", basePrice: 6890 }
        ]
    },
    {
        category: "mobile",
        brand: "Motorola",
        modelName: "Moto Edge 20",
        slug: "motorola-moto-edge-20",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/motorola/motorola-edge-20-1.jpg",
        variants: [
            { storage: "8 GB/128 GB", basePrice: 6930 }
        ]
    },
    {
        category: "mobile",
        brand: "Motorola",
        modelName: "Moto G31",
        slug: "motorola-moto-g31",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/motorola/motorola-moto-g31-baby-blue-1.jpg",
        variants: [
            { storage: "4 GB/64 GB", basePrice: 3670 },
            { storage: "6 GB/128 GB", basePrice: 4050 }
        ]
    },
    {
        category: "mobile",
        brand: "Motorola",
        modelName: "Moto Edge 60 Fusion",
        slug: "motorola-moto-edge-60-fusion",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/motorola/motorola-edge-60-fusion-1.jpg",
        variants: [
            { storage: "8 GB/128 GB", basePrice: 14700 },
            { storage: "8 GB/256 GB", basePrice: 16730 },
            { storage: "12 GB/256 GB", basePrice: 17300 }
        ]
    },
    {
        category: "mobile",
        brand: "Motorola",
        modelName: "Moto Razr 60",
        slug: "motorola-moto-razr-60",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/motorola/motorola-razr-60-1.jpg",
        variants: [
            { storage: "8 GB/256 GB", basePrice: 27730 }
        ]
    },
    {
        category: "mobile",
        brand: "Motorola",
        modelName: "Moto Edge 60 Stylus",
        slug: "motorola-moto-edge-60-stylus",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/motorola/motorola-moto-g-stylus-5g-2025-1.jpg",
        variants: [
            { storage: "8 GB/256 GB", basePrice: 14910 }
        ]
    },
    {
        category: "mobile",
        brand: "Motorola",
        modelName: "Moto Edge 60",
        slug: "motorola-moto-edge-60",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/motorola/motorola-edge-60-1.jpg",
        variants: [
            { storage: "12 GB/256 GB", basePrice: 17700 }
        ]
    },
    {
        category: "mobile",
        brand: "Motorola",
        modelName: "Moto G96 5G",
        slug: "motorola-moto-g96-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/motorola/motorola-g96-1.jpg",
        variants: [
            { storage: "8 GB/128 GB", basePrice: 12200 },
            { storage: "8 GB/256 GB", basePrice: 13130 }
        ]
    },
    {
        category: "mobile",
        brand: "Motorola",
        modelName: "Moto G86 Power 5G",
        slug: "motorola-moto-g86-power-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/motorola/motorola-moto-g86-power-1.jpg",
        variants: [
            { storage: "8 GB/128 GB", basePrice: 11740 }
        ]
    },
    {
        category: "mobile",
        brand: "Motorola",
        modelName: "Moto Razr 60 Ultra",
        slug: "motorola-moto-razr-60-ultra",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/motorola/motorola-razr-60-ultra-1.jpg",
        variants: [
            { storage: "16 GB/512 GB", basePrice: 46740 }
        ]
    },
    {
        category: "mobile",
        brand: "Motorola",
        modelName: "Moto Edge 70",
        slug: "motorola-moto-edge-70",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/motorola/motorola-edge-70-5g-1.jpg",
        variants: [
            { storage: "8 GB/256 GB", basePrice: 20650 }
        ]
    },
    {
        category: "mobile",
        brand: "Motorola",
        modelName: "Moto G57 Power 5G",
        slug: "motorola-moto-g57-power-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/motorola/motorola-moto-g57-power-1.jpg",
        variants: [
            { storage: "8 GB/128 GB", basePrice: 8850 }
        ]
    },
    {
        category: "mobile",
        brand: "Motorola",
        modelName: "Moto G06 Power",
        slug: "motorola-moto-g06-power",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/motorola-moto-g06-power.jpg",
        variants: [
            { storage: "4 GB/64 GB", basePrice: 4950 }
        ]
    },
    {
        category: "mobile",
        brand: "Motorola",
        modelName: "Moto Signature",
        slug: "motorola-moto-signature",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/motorola/motorola-signature-1.jpg",
        variants: [
            { storage: "12 GB/256 GB", basePrice: 38000 },
            { storage: "16 GB/512 GB", basePrice: 39000 },
            { storage: "16 GB/1 TB", basePrice: 43000 }
        ]
    },
    {
        category: "mobile",
        brand: "Motorola",
        modelName: "Moto G67 Power 5G",
        slug: "motorola-moto-g67-power-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/motorola/motorola-moto-g100-cn-1.jpg",
        variants: [
            { storage: "8 GB/128 GB", basePrice: 10450 },
            { storage: "8 GB/256 GB", basePrice: 12350 }
        ]
    },
    {
        category: "mobile",
        brand: "Motorola",
        modelName: "Moto Edge 70 Fusion",
        slug: "motorola-moto-edge-70-fusion",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/motorola/motorola-edge-70-fusion-1.jpg",
        variants: [
            { storage: "8 GB/128 GB", basePrice: 18310 },
            { storage: "8 GB/256 GB", basePrice: 20370 },
            { storage: "12 GB/256 GB", basePrice: 22000 }
        ]
    },
    {
        category: "mobile",
        brand: "Motorola",
        modelName: "Moto G51 5G",
        slug: "motorola-moto-g51-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/motorola/motorola-moto-g51-5g-bright-silver-1.jpg",
        variants: [
            { storage: "4 GB/64 GB", basePrice: 5340 }
        ]
    },
    {
        category: "mobile",
        brand: "Motorola",
        modelName: "Moto E40",
        slug: "motorola-moto-e40",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/motorola/motorola-moto-e40-1.jpg",
        variants: [
            { storage: "4 GB/64 GB", basePrice: 3590 }
        ]
    },
    {
        category: "mobile",
        brand: "Motorola",
        modelName: "Moto Edge 30 Pro",
        slug: "motorola-moto-edge-30-pro",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/motorola/motorola-edge-30-pro-1.jpg",
        variants: [
            { storage: "8 GB/128 GB", basePrice: 9320 }
        ]
    },
    {
        category: "mobile",
        brand: "Motorola",
        modelName: "Moto Edge 30",
        slug: "motorola-moto-edge-30",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/motorola/motorola-edge-30-1.jpg",
        variants: [
            { storage: "6 GB/128 GB", basePrice: 8600 },
            { storage: "8 GB/128 GB", basePrice: 8940 }
        ]
    },
    {
        category: "mobile",
        brand: "Motorola",
        modelName: "Moto G52",
        slug: "motorola-moto-g52",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/motorola-moto-g52.jpg",
        variants: [
            { storage: "4 GB/64 GB", basePrice: 3980 },
            { storage: "6 GB/128 GB", basePrice: 4670 }
        ]
    },
    {
        category: "mobile",
        brand: "Motorola",
        modelName: "Moto G71 5G",
        slug: "motorola-moto-g71-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/motorola/motorola-moto-g71-5g-neptune-green-1.jpg",
        variants: [
            { storage: "6 GB/128 GB", basePrice: 6480 }
        ]
    },
    {
        category: "mobile",
        brand: "Motorola",
        modelName: "Moto G82 5G",
        slug: "motorola-moto-g82-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/motorola/motorola-moto-g82-1.jpg",
        variants: [
            { storage: "6 GB/128 GB", basePrice: 7160 },
            { storage: "8 GB/128 GB", basePrice: 7910 }
        ]
    },
    {
        category: "mobile",
        brand: "Motorola",
        modelName: "Moto G22",
        slug: "motorola-moto-g22",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/motorola-moto-g22.jpg",
        variants: [
            { storage: "4 GB/64 GB", basePrice: 3750 }
        ]
    },
    {
        category: "mobile",
        brand: "Motorola",
        modelName: "Moto G42",
        slug: "motorola-moto-g42",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/motorola/moto-g42-01.jpg",
        variants: [
            { storage: "4 GB/64 GB", basePrice: 3520 }
        ]
    },
    {
        category: "mobile",
        brand: "Motorola",
        modelName: "Moto G32",
        slug: "motorola-moto-g32",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/motorola-moto-g32.jpg",
        variants: [
            { storage: "4 GB/64 GB", basePrice: 4170 },
            { storage: "8 GB/128 GB", basePrice: 4580 }
        ]
    },
    {
        category: "mobile",
        brand: "Motorola",
        modelName: "Moto Edge 30 Fusion",
        slug: "motorola-moto-edge-30-fusion",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/motorola/motorola-edge30-fusion-1.jpg",
        variants: [
            { storage: "8 GB/128 GB", basePrice: 10150 }
        ]
    },
    {
        category: "mobile",
        brand: "Motorola",
        modelName: "Moto Edge 30 Ultra",
        slug: "motorola-moto-edge-30-ultra",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/motorola/motorola-edge30-ultra-1.jpg",
        variants: [
            { storage: "8 GB/128 GB", basePrice: 12500 },
            { storage: "12 GB/256 GB", basePrice: 13100 }
        ]
    },
    {
        category: "mobile",
        brand: "Motorola",
        modelName: "Moto G72",
        slug: "motorola-moto-g72",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/motorola/motorola-moto-g72-5g-03.jpg",
        variants: [
            { storage: "6 GB/128 GB", basePrice: 5110 }
        ]
    },
    {
        category: "mobile",
        brand: "Motorola",
        modelName: "Moto G62 5G",
        slug: "motorola-moto-g62-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/motorola/motorola-moto-g62-1.jpg",
        variants: [
            { storage: "6 GB/128 GB", basePrice: 6360 },
            { storage: "8 GB/128 GB", basePrice: 6830 }
        ]
    },
    {
        category: "mobile",
        brand: "Motorola",
        modelName: "Moto e32s",
        slug: "motorola-moto-e32s",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/motorola/motorola-moto-e32s-05.jpg",
        variants: [
            { storage: "3 GB/32 GB", basePrice: 2690 },
            { storage: "4 GB/64 GB", basePrice: 2990 }
        ]
    },
    {
        category: "mobile",
        brand: "Motorola",
        modelName: "Moto E13",
        slug: "motorola-moto-e13",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/motorola-moto-e13.jpg",
        variants: [
            { storage: "2 GB/64 GB", basePrice: 3830 },
            { storage: "4 GB/64 GB", basePrice: 4070 },
            { storage: "8 GB/128 GB", basePrice: 4270 }
        ]
    },
    {
        category: "mobile",
        brand: "Motorola",
        modelName: "Moto e32",
        slug: "motorola-moto-e32",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/motorola-moto-e32.jpg",
        variants: [
            { storage: "4 GB/64 GB", basePrice: 3220 }
        ]
    },
    {
        category: "mobile",
        brand: "Motorola",
        modelName: "Moto G73 5G",
        slug: "motorola-moto-g73-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/motorola/motorola-moto-g73-1.jpg",
        variants: [
            { storage: "8 GB/128 GB", basePrice: 7270 }
        ]
    },
    {
        category: "mobile",
        brand: "Motorola",
        modelName: "Moto e22s",
        slug: "motorola-moto-e22s",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/motorola-moto-e22s.jpg",
        variants: [
            { storage: "4 GB/64 GB", basePrice: 3200 }
        ]
    },
    {
        category: "mobile",
        brand: "Motorola",
        modelName: "Moto G8 Plus",
        slug: "motorola-moto-g8-plus",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/motorola-moto-g8-plus.jpg",
        variants: [
            { storage: "4 GB/64 GB", basePrice: 2760 }
        ]
    },
    {
        category: "mobile",
        brand: "Motorola",
        modelName: "Moto G13",
        slug: "motorola-moto-g13",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/motorola-moto-g13.jpg",
        variants: [
            { storage: "4 GB/64 GB", basePrice: 2460 },
            { storage: "4 GB/128 GB", basePrice: 3220 }
        ]
    },
    {
        category: "mobile",
        brand: "Motorola",
        modelName: "Moto Edge 40",
        slug: "motorola-moto-edge-40",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/motorola/motorola-edge40-1.jpg",
        variants: [
            { storage: "8 GB/256 GB", basePrice: 14550 }
        ]
    },
    {
        category: "mobile",
        brand: "Motorola",
        modelName: "Moto Razr 40 Ultra",
        slug: "motorola-moto-razr-40-ultra",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/motorola/motorola-razr-40-ultra-1.jpg",
        variants: [
            { storage: "8 GB/256 GB", basePrice: 22670 }
        ]
    },
    {
        category: "mobile",
        brand: "Motorola",
        modelName: "Moto G14",
        slug: "motorola-moto-g14",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/motorola/moto-g14-1.jpg",
        variants: [
            { storage: "4 GB/128 GB", basePrice: 4740 }
        ]
    },
    {
        category: "mobile",
        brand: "Motorola",
        modelName: "Moto G54 5G",
        slug: "motorola-moto-g54-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/motorola/motorola-moto-g54-1.jpg",
        variants: [
            { storage: "8 GB/128 GB", basePrice: 9400 },
            { storage: "12 GB/256 GB", basePrice: 10490 }
        ]
    },
    {
        category: "mobile",
        brand: "Motorola",
        modelName: "Moto G84 5G",
        slug: "motorola-moto-g84-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/motorola/motorola-moto-g84-1.jpg",
        variants: [
            { storage: "12 GB/256 GB", basePrice: 10910 }
        ]
    },
    {
        category: "mobile",
        brand: "Motorola",
        modelName: "Moto Edge 40 Neo",
        slug: "motorola-moto-edge-40-neo",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/motorola/motorola-edge-40-neo-1.jpg",
        variants: [
            { storage: "8 GB/128 GB", basePrice: 13310 },
            { storage: "12 GB/256 GB", basePrice: 14120 }
        ]
    },
    {
        category: "mobile",
        brand: "Motorola",
        modelName: "Moto G34 5G",
        slug: "motorola-moto-g34-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/motorola/motorola-moto-g34-china-1.jpg",
        variants: [
            { storage: "4 GB/128 GB", basePrice: 6860 },
            { storage: "8 GB/128 GB", basePrice: 7690 }
        ]
    },
    {
        category: "mobile",
        brand: "Motorola",
        modelName: "Moto G64 5G",
        slug: "motorola-moto-g64-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/motorola/motorola-moto-g64-1.jpg",
        variants: [
            { storage: "8 GB/128 GB", basePrice: 8920 },
            { storage: "12 GB/256 GB", basePrice: 9750 }
        ]
    },
    {
        category: "mobile",
        brand: "Motorola",
        modelName: "Moto Edge 50 Pro",
        slug: "motorola-moto-edge-50-pro",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/motorola/motorola-edge50-pro-1.jpg",
        variants: [
            { storage: "8 GB/256 GB", basePrice: 16790 },
            { storage: "12 GB/256 GB", basePrice: 17120 }
        ]
    },
    {
        category: "mobile",
        brand: "Motorola",
        modelName: "Moto Edge 50 Fusion",
        slug: "motorola-moto-edge-50-fusion",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/motorola/motorola-edge-50-fusion-1.jpg",
        variants: [
            { storage: "8 GB/128 GB", basePrice: 13960 },
            { storage: "12 GB/256 GB", basePrice: 15070 }
        ]
    },
    {
        category: "mobile",
        brand: "Motorola",
        modelName: "Moto G04",
        slug: "motorola-moto-g04",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/motorola/motorola-moto-g04-0.jpg",
        variants: [
            { storage: "4 GB/64 GB", basePrice: 3630 },
            { storage: "8 GB/128 GB", basePrice: 3820 }
        ]
    },
    {
        category: "mobile",
        brand: "Motorola",
        modelName: "Moto G24 Power",
        slug: "motorola-moto-g24-power",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/motorola-moto-g24-power.jpg",
        variants: [
            { storage: "4 GB/128 GB", basePrice: 3280 },
            { storage: "8 GB/128 GB", basePrice: 3580 }
        ]
    },
    {
        category: "mobile",
        brand: "Motorola",
        modelName: "Moto G85 5G",
        slug: "motorola-moto-g85-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/motorola/motorola-moto-g85-1.jpg",
        variants: [
            { storage: "8 GB/128 GB", basePrice: 12150 },
            { storage: "12 GB/256 GB", basePrice: 12970 }
        ]
    },
    {
        category: "mobile",
        brand: "Motorola",
        modelName: "Moto Edge 50 Ultra",
        slug: "motorola-moto-edge-50-ultra",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/motorola/motorola-edge-50-ultra-0.jpg",
        variants: [
            { storage: "12 GB/512 GB", basePrice: 25960 }
        ]
    },
    {
        category: "mobile",
        brand: "Motorola",
        modelName: "Moto Razr 50 Ultra",
        slug: "motorola-moto-razr-50-ultra",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/motorola/motorola-razr-50-ultra-1.jpg",
        variants: [
            { storage: "12 GB/512 GB", basePrice: 33810 }
        ]
    },
    {
        category: "mobile",
        brand: "Motorola",
        modelName: "Moto Edge 50",
        slug: "motorola-moto-edge-50",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/motorola/motorola-edge-50-5g-1.jpg",
        variants: [
            { storage: "8 GB/256 GB", basePrice: 15600 }
        ]
    },
    {
        category: "mobile",
        brand: "Motorola",
        modelName: "Moto G04s",
        slug: "motorola-moto-g04s",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/motorola/motorola-moto-g04s-0.jpg",
        variants: [
            { storage: "4 GB/64 GB", basePrice: 3920 }
        ]
    },
    {
        category: "mobile",
        brand: "Motorola",
        modelName: "Moto G45 5G",
        slug: "motorola-moto-g45-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/motorola-moto-g45-5g.jpg",
        variants: [
            { storage: "4 GB/128 GB", basePrice: 6570 },
            { storage: "8 GB/128 GB", basePrice: 8190 }
        ]
    },
    {
        category: "mobile",
        brand: "Motorola",
        modelName: "Moto Razr 50",
        slug: "motorola-moto-razr-50",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/motorola/motorola-razr-50-1.jpg",
        variants: [
            { storage: "8 GB/256 GB", basePrice: 23360 }
        ]
    },
    {
        category: "mobile",
        brand: "Motorola",
        modelName: "Moto Edge 50 Neo",
        slug: "motorola-moto-edge-50-neo",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/motorola/motorola-edge-50-neo-1.jpg",
        variants: [
            { storage: "8 GB/256 GB", basePrice: 14530 }
        ]
    },
    {
        category: "mobile",
        brand: "Motorola",
        modelName: "Moto G35 5G",
        slug: "motorola-moto-g35-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/motorola-moto-g35-5g.jpg",
        variants: [
            { storage: "4 GB/128 GB", basePrice: 7250 },
            { storage: "8 GB/128 GB", basePrice: 8180 }
        ]
    },
    {
        category: "mobile",
        brand: "Motorola",
        modelName: "Moto G05",
        slug: "motorola-moto-g05",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/motorola/mototola-moto-g05-1.jpg",
        variants: [
            { storage: "4 GB/64 GB", basePrice: 5040 }
        ]
    },
    {
        category: "mobile",
        brand: "Motorola",
        modelName: "Moto Edge 60 Pro",
        slug: "motorola-moto-edge-60-pro",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/motorola/motorola-edge-60-pro-1.jpg",
        variants: [
            { storage: "8 GB/256 GB", basePrice: 19300 },
            { storage: "12 GB/256 GB", basePrice: 22000 },
            { storage: "16 GB/512 GB", basePrice: 23800 }
        ]
    },
];

// ─── SEED FUNCTION ────────────────────────────────────────────────────────────

async function seed() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");
        await Device.deleteMany({ category: "mobile", brand: "Motorola" });
        console.log("Cleared existing Motorola devices");
        await Device.insertMany(devices);
        console.log(`✅ Seeded ${devices.length} Motorola devices successfully`);
        process.exit(0);
    } catch (err) {
        console.error("❌ Seed failed:", err.message);
        process.exit(1);
    }
}

seed();