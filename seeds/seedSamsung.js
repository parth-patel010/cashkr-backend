import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import Device from "../models/Device.js";

const devices = [
    // ══════════════════════════════════════════════════════
    //  SAMSUNG — All Mobile Series
    // ══════════════════════════════════════════════════════
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy A14 5G",
        slug: "samsung-galaxy-a14-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-a14-5g.jpg",
        variants: [
            { storage: "4GB / 64GB", basePrice: 6980 },
            { storage: "4GB / 128GB", basePrice: 7760 },
            { storage: "6GB / 128GB", basePrice: 8290 },
            { storage: "8GB / 128GB", basePrice: 8880 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy A13",
        slug: "samsung-galaxy-a13",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-a13.jpg",
        variants: [
            { storage: "4GB / 64GB", basePrice: 3750 },
            { storage: "4GB / 128GB", basePrice: 4170 },
            { storage: "6GB / 128GB", basePrice: 4660 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy A03",
        slug: "samsung-galaxy-a03",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-a03.jpg",
        variants: [
            { storage: "3GB / 32GB", basePrice: 2240 },
            { storage: "4GB / 64GB", basePrice: 2690 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy A03 Core",
        slug: "samsung-galaxy-a03-core",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-a03-core.jpg",
        variants: [
            { storage: "2GB / 32GB", basePrice: 2150 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy A03s",
        slug: "samsung-galaxy-a03s",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-a03s.jpg",
        variants: [
            { storage: "3GB / 32GB", basePrice: 2150 },
            { storage: "4GB / 64GB", basePrice: 2980 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy A10",
        slug: "samsung-galaxy-a10",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-a10.jpg",
        variants: [
            { storage: "2GB / 32GB", basePrice: 1850 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy A10s",
        slug: "samsung-galaxy-a10s",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-a10s.jpg",
        variants: [
            { storage: "2GB / 32GB", basePrice: 1920 },
            { storage: "3GB / 32GB", basePrice: 2000 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy A12",
        slug: "samsung-galaxy-a12",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-a12-sm-a125-1.jpg",
        variants: [
            { storage: "4GB / 64GB", basePrice: 3500 },
            { storage: "4GB / 128GB", basePrice: 3710 },
            { storage: "6GB / 128GB", basePrice: 3980 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy A20",
        slug: "samsung-galaxy-a20",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-a20.jpg",
        variants: [
            { storage: "3GB / 32GB", basePrice: 2540 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy A20s",
        slug: "samsung-galaxy-a20s",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-a20s-sm-a207-1.jpg",
        variants: [
            { storage: "3GB / 32GB", basePrice: 2440 },
            { storage: "4GB / 64GB", basePrice: 2730 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy A21s",
        slug: "samsung-galaxy-a21s",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-a21s.jpg",
        variants: [
            { storage: "4GB / 64GB", basePrice: 3350 },
            { storage: "6GB / 64GB", basePrice: 3580 },
            { storage: "6GB / 128GB", basePrice: 3750 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy A22",
        slug: "samsung-galaxy-a22",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-a22.jpg",
        variants: [
            { storage: "4GB / 128GB", basePrice: 3850 },
            { storage: "6GB / 128GB", basePrice: 4220 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy A22 5G",
        slug: "samsung-galaxy-a22-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-a22-5g.jpg",
        variants: [
            { storage: "6GB / 128GB", basePrice: 6020 },
            { storage: "8GB / 128GB", basePrice: 6520 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy A23",
        slug: "samsung-galaxy-a23",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-a23.jpg",
        variants: [
            { storage: "6GB / 128GB", basePrice: 4520 },
            { storage: "8GB / 128GB", basePrice: 4940 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy A30",
        slug: "samsung-galaxy-a30",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-a30.jpg",
        variants: [
            { storage: "4GB / 64GB", basePrice: 2670 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy A30s",
        slug: "samsung-galaxy-a30s",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-a30s.jpg",
        variants: [
            { storage: "4GB / 64GB", basePrice: 2570 },
            { storage: "4GB / 128GB", basePrice: 2730 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy A31",
        slug: "samsung-galaxy-a31",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-a31.jpg",
        variants: [
            { storage: "6GB / 128GB", basePrice: 3580 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy A32",
        slug: "samsung-galaxy-a32",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-a32-4g-3.jpg",
        variants: [
            { storage: "6GB / 128GB", basePrice: 4810 },
            { storage: "8GB / 128GB", basePrice: 5340 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy A5 2017",
        slug: "samsung-galaxy-a5-2017",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-a5-2017-1.jpg",
        variants: [
            { storage: "3GB / 32GB", basePrice: 1080 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy A50",
        slug: "samsung-galaxy-a50",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-a50-sm-a505f-ds-1.jpg",
        variants: [
            { storage: "4GB / 64GB", basePrice: 2930 },
            { storage: "6GB / 64GB", basePrice: 3180 },
            { storage: "6GB / 128GB", basePrice: 3370 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy A50s",
        slug: "samsung-galaxy-a50s",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-a50s.jpg",
        variants: [
            { storage: "4GB / 128GB", basePrice: 2800 },
            { storage: "6GB / 128GB", basePrice: 3000 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy A51",
        slug: "samsung-galaxy-a51",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-a51-sm-a515-1.jpg",
        variants: [
            { storage: "6GB / 128GB", basePrice: 3940 },
            { storage: "8GB / 128GB", basePrice: 4140 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy A52",
        slug: "samsung-galaxy-a52",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-a52-4g-10.jpg",
        variants: [
            { storage: "6GB / 128GB", basePrice: 5420 },
            { storage: "8GB / 128GB", basePrice: 5790 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy A52s 5G",
        slug: "samsung-galaxy-a52s-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-a52s-5g.jpg",
        variants: [
            { storage: "6GB / 128GB", basePrice: 7620 },
            { storage: "8GB / 128GB", basePrice: 8190 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy A53 5G",
        slug: "samsung-galaxy-a53-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-a53-5g-1.jpg",
        variants: [
            { storage: "6GB / 128GB", basePrice: 6780 },
            { storage: "8GB / 128GB", basePrice: 7190 },
            { storage: "8GB / 256GB", basePrice: 7590 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy A6",
        slug: "samsung-galaxy-a6",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-a6-2018-1.jpg",
        variants: [
            { storage: "3GB / 32GB", basePrice: 1330 },
            { storage: "4GB / 32GB", basePrice: 1460 },
            { storage: "4GB / 64GB", basePrice: 1640 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy A6 Plus",
        slug: "samsung-galaxy-a6-plus",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-a6-plus-2018-1.jpg",
        variants: [
            { storage: "3GB / 32GB", basePrice: 1510 },
            { storage: "4GB / 32GB", basePrice: 1640 },
            { storage: "4GB / 64GB", basePrice: 1820 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy A7 2016",
        slug: "samsung-galaxy-a7-2016",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-a7-2016.jpg",
        variants: [
            { storage: "3GB / 16GB", basePrice: 1260 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy A7 2017",
        slug: "samsung-galaxy-a7-2017",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-a7-2017.jpg",
        variants: [
            { storage: "3GB / 32GB", basePrice: 1410 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy A7 (2018)",
        slug: "samsung-galaxy-a7-2018",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-a7-sm-a750f-1.jpg",
        variants: [
            { storage: "4GB / 64GB", basePrice: 1820 },
            { storage: "4GB / 128GB", basePrice: 2010 },
            { storage: "6GB / 128GB", basePrice: 2150 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy A70",
        slug: "samsung-galaxy-a70",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-a70.jpg",
        variants: [
            { storage: "6GB / 128GB", basePrice: 3700 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy A70s",
        slug: "samsung-galaxy-a70s",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-a70s-1.jpg",
        variants: [
            { storage: "6GB / 128GB", basePrice: 3460 },
            { storage: "8GB / 128GB", basePrice: 3690 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy A71",
        slug: "samsung-galaxy-a71",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-a71.jpg",
        variants: [
            { storage: "6GB / 128GB", basePrice: 4070 },
            { storage: "8GB / 128GB", basePrice: 4430 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy A72",
        slug: "samsung-galaxy-a72",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-a72-4g-10.jpg",
        variants: [
            { storage: "8GB / 128GB", basePrice: 6360 },
            { storage: "8GB / 256GB", basePrice: 6910 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy A73 5G",
        slug: "samsung-galaxy-a73-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-a73-5g.jpg",
        variants: [
            { storage: "8GB / 128GB", basePrice: 8930 },
            { storage: "8GB / 256GB", basePrice: 9660 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy A8 Plus",
        slug: "samsung-galaxy-a8-plus",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-a8-a730f-1.jpg",
        variants: [
            { storage: "6GB / 64GB", basePrice: 2300 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy A8 Star",
        slug: "samsung-galaxy-a8-star",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-a8-a9-star-1.jpg",
        variants: [
            { storage: "6GB / 64GB", basePrice: 1780 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy A80",
        slug: "samsung-galaxy-a80",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-a80-01.jpg",
        variants: [
            { storage: "8GB / 128GB", basePrice: 5040 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy A9 2018",
        slug: "samsung-galaxy-a9-2018",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-a9-2018.jpg",
        variants: [
            { storage: "6GB / 128GB", basePrice: 2260 },
            { storage: "8GB / 128GB", basePrice: 2480 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy A9 Pro",
        slug: "samsung-galaxy-a9-pro",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-a9-pro.jpg",
        variants: [
            { storage: "4GB / 32GB", basePrice: 1480 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy C7 Pro",
        slug: "samsung-galaxy-c7-pro",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-c7-pro.jpg",
        variants: [
            { storage: "4GB / 64GB", basePrice: 2110 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy C9 Pro",
        slug: "samsung-galaxy-c9-pro",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-c9-pro-4.jpg",
        variants: [
            { storage: "6GB / 64GB", basePrice: 2150 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy F02s",
        slug: "samsung-galaxy-f02s",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-f02s.jpg",
        variants: [
            { storage: "3GB / 32GB", basePrice: 2740 },
            { storage: "4GB / 64GB", basePrice: 2890 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy F12",
        slug: "samsung-galaxy-f12",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-f12.jpg",
        variants: [
            { storage: "4GB / 64GB", basePrice: 3230 },
            { storage: "4GB / 128GB", basePrice: 3650 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy F13",
        slug: "samsung-galaxy-f13",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-f13.jpg",
        variants: [
            { storage: "4GB / 64GB", basePrice: 3750 },
            { storage: "4GB / 128GB", basePrice: 4000 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy F22",
        slug: "samsung-galaxy-f22",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-f22.jpg",
        variants: [
            { storage: "4GB / 64GB", basePrice: 3500 },
            { storage: "6GB / 128GB", basePrice: 3810 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy F23 5G",
        slug: "samsung-galaxy-f23-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-f23-1.jpg",
        variants: [
            { storage: "4GB / 128GB", basePrice: 5890 },
            { storage: "6GB / 128GB", basePrice: 6190 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy F41",
        slug: "samsung-galaxy-f41",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-f41-sm-f415fds-1.jpg",
        variants: [
            { storage: "6GB / 64GB", basePrice: 3220 },
            { storage: "6GB / 128GB", basePrice: 3560 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy F42 5G",
        slug: "samsung-galaxy-f42-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-f42-5g.jpg",
        variants: [
            { storage: "6GB / 128GB", basePrice: 6340 },
            { storage: "8GB / 128GB", basePrice: 6930 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy F62",
        slug: "samsung-galaxy-f62",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-f62.jpg",
        variants: [
            { storage: "6GB / 128GB", basePrice: 4880 },
            { storage: "8GB / 128GB", basePrice: 5040 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy Fold",
        slug: "samsung-galaxy-fold",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-fold.jpg",
        variants: [
            { storage: "12GB / 512GB", basePrice: 12790 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy J2 2016",
        slug: "samsung-galaxy-j2-2016",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-j2-2016.jpg",
        variants: [
            { storage: "1.5GB / 8GB", basePrice: 810 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy J2 2017",
        slug: "samsung-galaxy-j2-2017",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-j2-2017-j200g-1.jpg",
        variants: [
            { storage: "1GB / 8GB", basePrice: 700 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy J2 2018",
        slug: "samsung-galaxy-j2-2018",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-j2-sm-j250-0.jpg",
        variants: [
            { storage: "2GB / 16GB", basePrice: 1190 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy J2 Ace",
        slug: "samsung-galaxy-j2-ace",
        imageUrl: "https://fdn.gsmarena.com/imgroot/news/17/01/galaxy-j2-india/-728/gsmarena_001.jpg",
        variants: [
            { storage: "1.5GB / 8GB", basePrice: 660 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy J2 Core",
        slug: "samsung-galaxy-j2-core",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-j2-core.jpg",
        variants: [
            { storage: "1GB / 8GB", basePrice: 740 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy J2 Core 2020",
        slug: "samsung-galaxy-j2-core-2020",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-j2-core-2020.jpg",
        variants: [
            { storage: "1GB / 16GB", basePrice: 1290 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy J2 pro",
        slug: "samsung-galaxy-j2-pro",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-j2-sm-j250-0.jpg",
        variants: [
            { storage: "2GB / 16GB", basePrice: 890 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy J3",
        slug: "samsung-galaxy-j3",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-j3.jpg",
        variants: [
            { storage: "1.5GB / 8GB", basePrice: 880 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy J3 2017",
        slug: "samsung-galaxy-j3-2017",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-j3-2017.jpg",
        variants: [
            { storage: "2GB / 16GB", basePrice: 1170 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy J3 Pro",
        slug: "samsung-galaxy-j3-pro",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-j3-pro-2.jpg",
        variants: [
            { storage: "2GB / 16GB", basePrice: 890 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy J4",
        slug: "samsung-galaxy-j4",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-j4-j400-1.jpg",
        variants: [
            { storage: "2GB / 16GB", basePrice: 1110 },
            { storage: "3GB / 32GB", basePrice: 1330 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy J4 Plus",
        slug: "samsung-galaxy-j4-plus",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-j4-plus-sm-j415f-1.jpg",
        variants: [
            { storage: "2GB / 32GB", basePrice: 1480 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy J5 2016",
        slug: "samsung-galaxy-j5-2016",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/samsung/sams-j5-6.jpg",
        variants: [
            { storage: "2GB / 16GB", basePrice: 890 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy J5 2017",
        slug: "samsung-galaxy-j5-2017",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-j5-2017-sm-j530-1.jpg",
        variants: [
            { storage: "2GB / 16GB", basePrice: 960 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy J5 Prime",
        slug: "samsung-galaxy-j5-prime",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-j5-prime.jpg",
        variants: [
            { storage: "2GB / 16GB", basePrice: 1130 },
            { storage: "3GB / 32GB", basePrice: 1200 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy J6",
        slug: "samsung-galaxy-j6",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-j6-j600-1.jpg",
        variants: [
            { storage: "3GB / 32GB", basePrice: 1530 },
            { storage: "4GB / 64GB", basePrice: 1700 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy J6 Plus",
        slug: "samsung-galaxy-j6-plus",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-j6-plus-sm-j610f-1.jpg",
        variants: [
            { storage: "4GB / 64GB", basePrice: 1890 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy J7 2016",
        slug: "samsung-galaxy-j7-2016",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-j7-2016.jpg",
        variants: [
            { storage: "2GB / 16GB", basePrice: 1110 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy J7 Duo",
        slug: "samsung-galaxy-j7-duo",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-j7-duo-sm-j720f-2.jpg",
        variants: [
            { storage: "4GB / 32GB", basePrice: 1410 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy J7 Max",
        slug: "samsung-galaxy-j7-max",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-j7-max.jpg",
        variants: [
            { storage: "4GB / 32GB", basePrice: 1440 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy J7 Nxt",
        slug: "samsung-galaxy-j7-nxt",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-j7-nxt-sm-j701fds-1.jpg",
        variants: [
            { storage: "2GB / 16GB", basePrice: 1190 },
            { storage: "3GB / 32GB", basePrice: 1410 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy J7 Prime",
        slug: "samsung-galaxy-j7-prime",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-j7-prime.jpg",
        variants: [
            { storage: "3GB / 16GB", basePrice: 1190 },
            { storage: "3GB / 32GB", basePrice: 1260 },
            { storage: "3GB / 64GB", basePrice: 1480 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy J7 Pro",
        slug: "samsung-galaxy-j7-pro",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-j7-pro.jpg",
        variants: [
            { storage: "3GB / 32GB", basePrice: 1000 },
            { storage: "3GB / 64GB", basePrice: 1110 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy J8",
        slug: "samsung-galaxy-j8",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-j8-j810-all-colors.jpg",
        variants: [
            { storage: "4GB / 64GB", basePrice: 2340 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy M01",
        slug: "samsung-galaxy-m01",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-m01.jpg",
        variants: [
            { storage: "3GB / 32GB", basePrice: 2180 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy M01 Core",
        slug: "samsung-galaxy-m01-core",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-a01core-sm-a013-1.jpg",
        variants: [
            { storage: "1GB / 16GB", basePrice: 1310 },
            { storage: "2GB / 32GB", basePrice: 1580 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy M01s",
        slug: "samsung-galaxy-m01s",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-m01s-m017f-1.jpg",
        variants: [
            { storage: "3GB / 32GB", basePrice: 2080 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy M02",
        slug: "samsung-galaxy-m02",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-m02.jpg",
        variants: [
            { storage: "2GB / 32GB", basePrice: 2460 },
            { storage: "3GB / 32GB", basePrice: 2690 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy M02s",
        slug: "samsung-galaxy-m02s",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-m02s.jpg",
        variants: [
            { storage: "3GB / 32GB", basePrice: 2260 },
            { storage: "4GB / 64GB", basePrice: 2840 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy M10",
        slug: "samsung-galaxy-m10",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-m10-m105f-1.jpg",
        variants: [
            { storage: "2GB / 16GB", basePrice: 2000 },
            { storage: "3GB / 32GB", basePrice: 2150 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy M10s",
        slug: "samsung-galaxy-m10s",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-m10s-m107f-1.jpg",
        variants: [
            { storage: "3GB / 32GB", basePrice: 2160 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy M11",
        slug: "samsung-galaxy-m11",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-m11-sm-m115-1.jpg",
        variants: [
            { storage: "3GB / 32GB", basePrice: 2390 },
            { storage: "4GB / 64GB", basePrice: 2950 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy M12",
        slug: "samsung-galaxy-m12",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-m12.jpg",
        variants: [
            { storage: "4GB / 64GB", basePrice: 3710 },
            { storage: "6GB / 128GB", basePrice: 3940 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy M20",
        slug: "samsung-galaxy-m20",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-m20-m205f-1.jpg",
        variants: [
            { storage: "3GB / 32GB", basePrice: 2080 },
            { storage: "4GB / 64GB", basePrice: 2230 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy M21",
        slug: "samsung-galaxy-m21",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-m21.jpg",
        variants: [
            { storage: "4GB / 64GB", basePrice: 3030 },
            { storage: "6GB / 128GB", basePrice: 3320 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy M21 2021 Edition",
        slug: "samsung-galaxy-m21-2021-edition",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-m21-2021-1.jpg",
        variants: [
            { storage: "4GB / 64GB", basePrice: 3270 },
            { storage: "6GB / 128GB", basePrice: 3390 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy M30",
        slug: "samsung-galaxy-m30",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-m30-sm-m305f-1.jpg",
        variants: [
            { storage: "3GB / 32GB", basePrice: 2450 },
            { storage: "4GB / 64GB", basePrice: 2690 },
            { storage: "6GB / 128GB", basePrice: 2920 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy M30s",
        slug: "samsung-galaxy-m30s",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-m30s-sm-m307f-1.jpg",
        variants: [
            { storage: "4GB / 64GB", basePrice: 2480 },
            { storage: "4GB / 128GB", basePrice: 2730 },
            { storage: "6GB / 128GB", basePrice: 2890 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy M31",
        slug: "samsung-galaxy-m31",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-m31-sm-m315f-1.jpg",
        variants: [
            { storage: "6GB / 64GB", basePrice: 3150 },
            { storage: "6GB / 128GB", basePrice: 3470 },
            { storage: "8GB / 128GB", basePrice: 3660 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy M31s",
        slug: "samsung-galaxy-m31s",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-m31s.jpg",
        variants: [
            { storage: "6GB / 128GB", basePrice: 3450 },
            { storage: "8GB / 128GB", basePrice: 4020 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy M32",
        slug: "samsung-galaxy-m32",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-m32.jpg",
        variants: [
            { storage: "4GB / 64GB", basePrice: 3450 },
            { storage: "6GB / 128GB", basePrice: 4210 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy M32 5G",
        slug: "samsung-galaxy-m32-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-m32-5g.jpg",
        variants: [
            { storage: "6GB / 128GB", basePrice: 6210 },
            { storage: "8GB / 128GB", basePrice: 6570 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy M33 5G",
        slug: "samsung-galaxy-m33-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-m33-1.jpg",
        variants: [
            { storage: "6GB / 128GB", basePrice: 6370 },
            { storage: "8GB / 128GB", basePrice: 6620 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy M40",
        slug: "samsung-galaxy-m40",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-m40-1.jpg",
        variants: [
            { storage: "6GB / 128GB", basePrice: 3150 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy M42 5G",
        slug: "samsung-galaxy-m42-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-m42-1.jpg",
        variants: [
            { storage: "6GB / 128GB", basePrice: 6320 },
            { storage: "8GB / 128GB", basePrice: 6650 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy M51",
        slug: "samsung-galaxy-m51",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-m51.jpg",
        variants: [
            { storage: "6GB / 128GB", basePrice: 4380 },
            { storage: "8GB / 128GB", basePrice: 4660 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy M52 5G",
        slug: "samsung-galaxy-m52-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-m52-5g-1.jpg",
        variants: [
            { storage: "6GB / 128GB", basePrice: 6900 },
            { storage: "8GB / 128GB", basePrice: 7170 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy M53 5G",
        slug: "samsung-galaxy-m53-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-m53-5g.jpg",
        variants: [
            { storage: "6GB / 128GB", basePrice: 7190 },
            { storage: "8GB / 128GB", basePrice: 7480 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy Note 5",
        slug: "samsung-galaxy-note-5",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-note5-5.jpg",
        variants: [
            { storage: "4GB / 32GB", basePrice: 2110 },
            { storage: "4GB / 64GB", basePrice: 2190 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy Note 8",
        slug: "samsung-galaxy-note-8",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-note8-5.jpg",
        variants: [
            { storage: "6GB / 64GB", basePrice: 4900 },
            { storage: "6GB / 128GB", basePrice: 5570 },
            { storage: "6GB / 256GB", basePrice: 6090 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy Note 9",
        slug: "samsung-galaxy-note-9",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-note9-1.jpg",
        variants: [
            { storage: "6GB / 128GB", basePrice: 5940 },
            { storage: "8GB / 512GB", basePrice: 6380 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy Note 10",
        slug: "samsung-galaxy-note-10",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-note10-aura-glow.jpg",
        variants: [
            { storage: "8GB / 256GB", basePrice: 9020 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy Note 10 Lite",
        slug: "samsung-galaxy-note-10-lite",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-note10-lite-1.jpg",
        variants: [
            { storage: "6GB / 128GB", basePrice: 5640 },
            { storage: "8GB / 128GB", basePrice: 6010 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy Note 10 Plus",
        slug: "samsung-galaxy-note-10-plus",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-note10-plus-aura-glow.jpg",
        variants: [
            { storage: "12GB / 256GB", basePrice: 9740 },
            { storage: "12GB / 512GB", basePrice: 9870 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy Note 20",
        slug: "samsung-galaxy-note-20",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-note20-1.jpg",
        variants: [
            { storage: "8GB / 256GB", basePrice: 9270 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy Note 20 Ultra 5G",
        slug: "samsung-galaxy-note-20-ultra-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-note20-ultra-1.jpg",
        variants: [
            { storage: "12GB / 256GB", basePrice: 14370 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy Note Fan Edition",
        slug: "samsung-galaxy-note-fan-edition",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-note-fe-n935.jpg",
        variants: [
            { storage: "4GB / 64GB", basePrice: 2800 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy On Max",
        slug: "samsung-galaxy-on-max",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-j7-max-g615f-1.jpg",
        variants: [
            { storage: "4GB / 32GB", basePrice: 1520 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy On Nxt",
        slug: "samsung-galaxy-on-nxt",
        imageUrl: "https://fdn.gsmarena.com/imgroot/news/16/10/galaxy-on-nxt-official/-728/gsmarena_001.jpg",
        variants: [
            { storage: "3GB / 16GB", basePrice: 1110 },
            { storage: "3GB / 32GB", basePrice: 1540 },
            { storage: "3GB / 64GB", basePrice: 1670 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy On5 Pro",
        slug: "samsung-galaxy-on5-pro",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-on5-1.jpg",
        variants: [
            { storage: "2GB / 16GB", basePrice: 980 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy On6",
        slug: "samsung-galaxy-on6",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-on6.jpg",
        variants: [
            { storage: "4GB / 64GB", basePrice: 1110 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy On7 Prime",
        slug: "samsung-galaxy-on7-prime",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-on7-2016-g6100-c1.jpg",
        variants: [
            { storage: "3GB / 32GB", basePrice: 1640 },
            { storage: "4GB / 64GB", basePrice: 1930 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy On7 Pro",
        slug: "samsung-galaxy-on7-pro",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-on7-1.jpg",
        variants: [
            { storage: "2GB / 16GB", basePrice: 1260 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy On8",
        slug: "samsung-galaxy-on8",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-j7-2016-1.jpg",
        variants: [
            { storage: "3GB / 16GB", basePrice: 1150 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy On8 2018",
        slug: "samsung-galaxy-on8-2018",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-j7-2016-1.jpg",
        variants: [
            { storage: "4GB / 64GB", basePrice: 1780 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy S10",
        slug: "samsung-galaxy-s10",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s10.jpg",
        variants: [
            { storage: "8GB / 128GB", basePrice: 7160 },
            { storage: "8GB / 512GB", basePrice: 7460 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy S10e",
        slug: "samsung-galaxy-s10e",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s10e.jpg",
        variants: [
            { storage: "6GB / 128GB", basePrice: 5790 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy S10 Lite",
        slug: "samsung-galaxy-s10-lite",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/samsung/sasmung-galaxy-s10-lite-2.jpg",
        variants: [
            { storage: "8GB / 128GB", basePrice: 5820 },
            { storage: "8GB / 512GB", basePrice: 6350 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy S10 Plus",
        slug: "samsung-galaxy-s10-plus",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-s10-1.jpg",
        variants: [
            { storage: "8GB / 128GB", basePrice: 7360 },
            { storage: "8GB / 512GB", basePrice: 7800 },
            { storage: "12GB / 1TB", basePrice: 9330 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy S20",
        slug: "samsung-galaxy-s20",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-s20-5g-r1.jpg",
        variants: [
            { storage: "8GB / 128GB", basePrice: 8890 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy S20 FE",
        slug: "samsung-galaxy-s20-fe",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-s20-fe-4g-1.jpg",
        variants: [
            { storage: "8GB / 128GB", basePrice: 7040 },
            { storage: "8GB / 256GB", basePrice: 7950 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy S20 FE 5G",
        slug: "samsung-galaxy-s20-fe-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s20-fe-5g.jpg",
        variants: [
            { storage: "8GB / 128GB", basePrice: 8370 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy S20 Plus",
        slug: "samsung-galaxy-s20-plus",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s20-plus.jpg",
        variants: [
            { storage: "8GB / 128GB", basePrice: 10130 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy S20 Ultra",
        slug: "samsung-galaxy-s20-ultra",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-s20-ultra-10.jpg",
        variants: [
            { storage: "12GB / 128GB", basePrice: 13580 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy S20 Ultra 5G",
        slug: "samsung-galaxy-s20-ultra-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-s20-ultra-10.jpg",
        variants: [
            { storage: "12GB / 128GB", basePrice: 14070 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy S21 5G",
        slug: "samsung-galaxy-s21-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-s21-5g-0.jpg",
        variants: [
            { storage: "8GB / 128GB", basePrice: 12180 },
            { storage: "8GB / 256GB", basePrice: 13000 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Samsung Galaxy S21 FE 5G",
        slug: "samsung-samsung-galaxy-s21-fe-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-s21-fe-5g-1.jpg",
        variants: [
            { storage: "8GB / 128GB", basePrice: 10630 },
            { storage: "8GB / 256GB", basePrice: 11360 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy S21 Plus 5G",
        slug: "samsung-galaxy-s21-plus-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-s21-plus-5g-1.jpg",
        variants: [
            { storage: "8GB / 128GB", basePrice: 13120 },
            { storage: "8GB / 256GB", basePrice: 13990 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy S21 Ultra 5G",
        slug: "samsung-galaxy-s21-ultra-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-s21-ultra-5g-1.jpg",
        variants: [
            { storage: "12GB / 256GB", basePrice: 17300 },
            { storage: "16GB / 256GB", basePrice: 19800 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy S22 5G",
        slug: "samsung-galaxy-s22-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s22-5g.jpg",
        variants: [
            { storage: "8GB / 128GB", basePrice: 15930 },
            { storage: "8GB / 256GB", basePrice: 16710 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy S22 Plus 5G",
        slug: "samsung-galaxy-s22-plus-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s22-plus-5g.jpg",
        variants: [
            { storage: "8GB / 128GB", basePrice: 16960 },
            { storage: "8GB / 256GB", basePrice: 17630 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy S22 Ultra 5G",
        slug: "samsung-galaxy-s22-ultra-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s22-ultra-5g.jpg",
        variants: [
            { storage: "12GB / 256GB", basePrice: 26600 },
            { storage: "12GB / 512GB", basePrice: 27410 },
            { storage: "12GB / 1TB", basePrice: 28380 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy S7",
        slug: "samsung-galaxy-s7",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-s7-1.jpg",
        variants: [
            { storage: "4GB / 32GB", basePrice: 2380 },
            { storage: "4GB / 64GB", basePrice: 2670 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy S7 Edge",
        slug: "samsung-galaxy-s7-edge",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-s7-edge-1.jpg",
        variants: [
            { storage: "4GB / 32GB", basePrice: 2560 },
            { storage: "4GB / 64GB", basePrice: 2810 },
            { storage: "4GB / 128GB", basePrice: 3100 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy S8",
        slug: "samsung-galaxy-s8",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-s8-.jpg",
        variants: [
            { storage: "4GB / 64GB", basePrice: 3600 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy S8 Plus",
        slug: "samsung-galaxy-s8-plus",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-s8-plus-.jpg",
        variants: [
            { storage: "4GB / 64GB", basePrice: 3930 },
            { storage: "6GB / 128GB", basePrice: 4120 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy S9",
        slug: "samsung-galaxy-s9",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-s9-1.jpg",
        variants: [
            { storage: "4GB / 64GB", basePrice: 4520 },
            { storage: "4GB / 128GB", basePrice: 4670 },
            { storage: "4GB / 256GB", basePrice: 4940 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy S9 Plus",
        slug: "samsung-galaxy-s9-plus",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-s9-plus-1.jpg",
        variants: [
            { storage: "6GB / 64GB", basePrice: 4600 },
            { storage: "6GB / 128GB", basePrice: 5040 },
            { storage: "6GB / 256GB", basePrice: 5200 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy Z Flip",
        slug: "samsung-galaxy-z-flip",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-z-flip-1.jpg",
        variants: [
            { storage: "8GB / 256GB", basePrice: 8640 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy Z Flip3 5G",
        slug: "samsung-galaxy-z-flip3-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-z-flip3-5g.jpg",
        variants: [
            { storage: "8GB / 128GB", basePrice: 12290 },
            { storage: "8GB / 256GB", basePrice: 12780 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy Z Fold2 5G",
        slug: "samsung-galaxy-z-fold2-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-z-fold2-5g.jpg",
        variants: [
            { storage: "12GB / 256GB", basePrice: 17440 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy Z Fold3 5G",
        slug: "samsung-galaxy-z-fold3-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-z-fold3-5g.jpg",
        variants: [
            { storage: "12GB / 256GB", basePrice: 21050 },
            { storage: "12GB / 512GB", basePrice: 21050 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy A33 5G",
        slug: "samsung-galaxy-a33-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-a33-5g.jpg",
        variants: [
            { storage: "6GB / 128GB", basePrice: 6440 },
            { storage: "8GB / 128GB", basePrice: 6950 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy M13",
        slug: "samsung-galaxy-m13",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-m13.jpg",
        variants: [
            { storage: "4GB / 64GB", basePrice: 4010 },
            { storage: "6GB / 128GB", basePrice: 4470 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy M13 5G",
        slug: "samsung-galaxy-m13-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-m13-5g.jpg",
        variants: [
            { storage: "4GB / 64GB", basePrice: 5230 },
            { storage: "6GB / 128GB", basePrice: 6190 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy Z Fold4",
        slug: "samsung-galaxy-z-fold4",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-z-fold4.jpg",
        variants: [
            { storage: "12GB / 256GB", basePrice: 28330 },
            { storage: "12GB / 512GB", basePrice: 29910 },
            { storage: "12GB / 1TB", basePrice: 32790 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy Z Flip4",
        slug: "samsung-galaxy-z-flip4",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-z-flip4-5g-01.jpg",
        variants: [
            { storage: "8GB / 128GB", basePrice: 15560 },
            { storage: "8GB / 256GB", basePrice: 15800 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy A04s",
        slug: "samsung-galaxy-a04s",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-a04s.jpg",
        variants: [
            { storage: "4GB / 64GB", basePrice: 3230 },
            { storage: "4GB / 128GB", basePrice: 3400 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy M32 Prime Edition",
        slug: "samsung-galaxy-m32-prime-edition",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-m32-1.jpg",
        variants: [
            { storage: "4GB / 64GB", basePrice: 4980 },
            { storage: "6GB / 128GB", basePrice: 5150 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy A04",
        slug: "samsung-galaxy-a04",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-a04.jpg",
        variants: [
            { storage: "3GB / 32GB", basePrice: 2390 },
            { storage: "4GB / 64GB", basePrice: 3000 },
            { storage: "4GB / 128GB", basePrice: 3650 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy S23 5G",
        slug: "samsung-galaxy-s23-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s23-5g.jpg",
        variants: [
            { storage: "8GB / 128GB", basePrice: 22790 },
            { storage: "8GB / 256GB", basePrice: 23410 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy S23 Plus 5G",
        slug: "samsung-galaxy-s23-plus-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s23-plus-5g.jpg",
        variants: [
            { storage: "8GB / 256GB", basePrice: 26600 },
            { storage: "8GB / 512GB", basePrice: 27330 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy S23 Ultra 5G",
        slug: "samsung-galaxy-s23-ultra-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s23-ultra-5g.jpg",
        variants: [
            { storage: "12GB / 256GB", basePrice: 36780 },
            { storage: "12GB / 512GB", basePrice: 38210 },
            { storage: "12GB / 1TB", basePrice: 39700 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy A23 5G",
        slug: "samsung-galaxy-a23-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-a23-5g.jpg",
        variants: [
            { storage: "6GB / 128GB", basePrice: 8580 },
            { storage: "8GB / 128GB", basePrice: 9120 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy M04",
        slug: "samsung-galaxy-m04",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-m04-.jpg",
        variants: [
            { storage: "4GB / 64GB", basePrice: 3320 },
            { storage: "4GB / 128GB", basePrice: 3460 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy A34 5G",
        slug: "samsung-galaxy-a34-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-a34-5.jpg",
        variants: [
            { storage: "6GB / 128GB", basePrice: 9900 },
            { storage: "8GB / 128GB", basePrice: 10230 },
            { storage: "8GB / 256GB", basePrice: 10780 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy F14 5G",
        slug: "samsung-galaxy-f14-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-f14-1.jpg",
        variants: [
            { storage: "4GB / 128GB", basePrice: 6790 },
            { storage: "6GB / 128GB", basePrice: 7090 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy F04",
        slug: "samsung-galaxy-f04",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-f04.jpg",
        variants: [
            { storage: "4GB / 64GB", basePrice: 2830 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy A54 5G",
        slug: "samsung-galaxy-a54-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-a54-5.jpg",
        variants: [
            { storage: "8GB / 128GB", basePrice: 13390 },
            { storage: "8GB / 256GB", basePrice: 13970 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy M14 5G",
        slug: "samsung-galaxy-m14-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-m14-5g-sm-m146-1.jpg",
        variants: [
            { storage: "4 GB/128 GB", basePrice: 7230 },
            { storage: "6 GB/128 GB", basePrice: 7470 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy A14",
        slug: "samsung-galaxy-a14",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-a14-4g-1.jpg",
        variants: [
            { storage: "4 GB/64 GB", basePrice: 5960 },
            { storage: "4 GB/128 GB", basePrice: 6450 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy Z Flip5",
        slug: "samsung-galaxy-z-flip5",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-z-flip5.jpg",
        variants: [
            { storage: "8 GB/256 GB", basePrice: 27410 },
            { storage: "8 GB/512 GB", basePrice: 28700 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy Z Fold5",
        slug: "samsung-galaxy-z-fold5",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-z-fold5.jpg",
        variants: [
            { storage: "12 GB/256 GB", basePrice: 49920 },
            { storage: "12 GB/512 GB", basePrice: 50880 },
            { storage: "12 GB/1 TB", basePrice: 54530 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy F54 5G",
        slug: "samsung-galaxy-f54-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-f54-5g.jpg",
        variants: [
            { storage: "8 GB/256 GB", basePrice: 10500 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy M34 5G",
        slug: "samsung-galaxy-m34-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-m34-5g.jpg",
        variants: [
            { storage: "6 GB/128 GB", basePrice: 8310 },
            { storage: "8 GB/128 GB", basePrice: 8930 },
            { storage: "8 GB/256 GB", basePrice: 9160 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy S23 FE 5G",
        slug: "samsung-galaxy-s23-fe-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-s23-fe-1.jpg",
        variants: [
            { storage: "8 GB/128 GB", basePrice: 16910 },
            { storage: "8 GB/256 GB", basePrice: 17770 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy F34 5G",
        slug: "samsung-galaxy-f34-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-f34-1.jpg",
        variants: [
            { storage: "6 GB/128 GB", basePrice: 8720 },
            { storage: "8 GB/128 GB", basePrice: 9300 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy A25 5G",
        slug: "samsung-galaxy-a25-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-a25-1.jpg",
        variants: [
            { storage: "6 GB/128 GB", basePrice: 10190 },
            { storage: "8 GB/128 GB", basePrice: 11520 },
            { storage: "8 GB/256 GB", basePrice: 11810 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy A15 5G",
        slug: "samsung-galaxy-a15-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-a15-5g.jpg",
        variants: [
            { storage: "6 GB/128 GB", basePrice: 8940 },
            { storage: "8 GB/128 GB", basePrice: 9180 },
            { storage: "8 GB/256 GB", basePrice: 9370 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy A05s",
        slug: "samsung-galaxy-a05s",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-a05s.jpg",
        variants: [
            { storage: "4 GB/128 GB", basePrice: 5270 },
            { storage: "6 GB/128 GB", basePrice: 5760 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy A05",
        slug: "samsung-galaxy-a05",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-a05.jpg",
        variants: [
            { storage: "4 GB/64 GB", basePrice: 4900 },
            { storage: "6 GB/128 GB", basePrice: 5270 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy S24 5G",
        slug: "samsung-galaxy-s24-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-s24-5g-sm-s921-1.jpg",
        variants: [
            { storage: "8 GB/128 GB", basePrice: 28960 },
            { storage: "8 GB/256 GB", basePrice: 34410 },
            { storage: "8 GB/512 GB", basePrice: 35540 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy S24 Plus 5G",
        slug: "samsung-galaxy-s24-plus-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-s24-plus-5g-sm-s926-1.jpg",
        variants: [
            { storage: "12 GB/256 GB", basePrice: 36190 },
            { storage: "12 GB/512 GB", basePrice: 36500 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy S24 Ultra 5G",
        slug: "samsung-galaxy-s24-ultra-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-s24-ultra-5g-sm-s928-0.jpg",
        variants: [
            { storage: "12 GB/256 GB", basePrice: 61340 },
            { storage: "12 GB/512 GB", basePrice: 63240 },
            { storage: "12 GB/1 TB", basePrice: 63810 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy F15 5G",
        slug: "samsung-galaxy-f15-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-f15-5g.jpg",
        variants: [
            { storage: "4 GB/128 GB", basePrice: 7330 },
            { storage: "6 GB/128 GB", basePrice: 8470 },
            { storage: "8 GB/128 GB", basePrice: 9100 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy A55 5G",
        slug: "samsung-galaxy-a55-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-a55-1.jpg",
        variants: [
            { storage: "8 GB/128 GB", basePrice: 15990 },
            { storage: "8 GB/256 GB", basePrice: 16780 },
            { storage: "12 GB/256 GB", basePrice: 18180 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy A35 5G",
        slug: "samsung-galaxy-a35-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-a35-1.jpg",
        variants: [
            { storage: "8 GB/128 GB", basePrice: 12500 },
            { storage: "8 GB/256 GB", basePrice: 13230 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy M55 5G",
        slug: "samsung-galaxy-m55-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-m55-1.jpg",
        variants: [
            { storage: "8 GB/128 GB", basePrice: 12940 },
            { storage: "8 GB/256 GB", basePrice: 13930 },
            { storage: "12 GB/256 GB", basePrice: 14930 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy M15 5G",
        slug: "samsung-galaxy-m15-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-m15-1.jpg",
        variants: [
            { storage: "4 GB/128 GB", basePrice: 7160 },
            { storage: "6 GB/128 GB", basePrice: 7600 },
            { storage: "8 GB/128 GB", basePrice: 7960 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy M14 4G",
        slug: "samsung-galaxy-m14-4g",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-m14-4g.jpg",
        variants: [
            { storage: "4 GB/64 GB", basePrice: 4920 },
            { storage: "6 GB/128 GB", basePrice: 5820 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy F55 5G",
        slug: "samsung-galaxy-f55-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-f55-1.jpg",
        variants: [
            { storage: "8 GB/128 GB", basePrice: 10840 },
            { storage: "8 GB/256 GB", basePrice: 12440 },
            { storage: "12 GB/256 GB", basePrice: 13230 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy Z Flip6 5G",
        slug: "samsung-galaxy-z-flip6-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-z-flip6-1.jpg",
        variants: [
            { storage: "12 GB/256 GB", basePrice: 36960 },
            { storage: "12 GB/512 GB", basePrice: 40800 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy Z Fold6 5G",
        slug: "samsung-galaxy-z-fold6-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-z-fold6-2.jpg",
        variants: [
            { storage: "12 GB/256 GB", basePrice: 69120 },
            { storage: "12 GB/512 GB", basePrice: 70750 },
            { storage: "12 GB/1 TB", basePrice: 73630 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy F14",
        slug: "samsung-galaxy-f14",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-f14.jpg",
        variants: [
            { storage: "4 GB/64 GB", basePrice: 4820 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy M35 5G",
        slug: "samsung-galaxy-m35-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-m35-1.jpg",
        variants: [
            { storage: "6 GB/128 GB", basePrice: 9690 },
            { storage: "8 GB/128 GB", basePrice: 9950 },
            { storage: "8 GB/256 GB", basePrice: 10090 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy S24 FE 5G",
        slug: "samsung-galaxy-s24-fe-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-s24-fe-1.jpg",
        variants: [
            { storage: "8 GB/128 GB", basePrice: 22350 },
            { storage: "8 GB/256 GB", basePrice: 25630 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy M55s 5G",
        slug: "samsung-galaxy-m55s-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-m55s-1.jpg",
        variants: [
            { storage: "8 GB/128 GB", basePrice: 11240 },
            { storage: "8 GB/256 GB", basePrice: 12440 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy M05",
        slug: "samsung-galaxy-m05",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-m05.jpg",
        variants: [
            { storage: "4 GB/64 GB", basePrice: 4520 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy A06",
        slug: "samsung-galaxy-a06",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-a06-11.jpg",
        variants: [
            { storage: "4 GB/64 GB", basePrice: 4670 },
            { storage: "4 GB/128 GB", basePrice: 5030 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy A16 5G",
        slug: "samsung-galaxy-a16-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-a16-5g.jpg",
        variants: [
            { storage: "6 GB/128 GB", basePrice: 9770 },
            { storage: "8 GB/128 GB", basePrice: 10510 },
            { storage: "8 GB/256 GB", basePrice: 11250 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy F05",
        slug: "samsung-galaxy-f05",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-f05.jpg",
        variants: [
            { storage: "4 GB/64 GB", basePrice: 4090 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy S25 5G",
        slug: "samsung-galaxy-s25-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-s25-sm-s931-1.jpg",
        variants: [
            { storage: "12 GB/128 GB", basePrice: 39470 },
            { storage: "12 GB/256 GB", basePrice: 44060 },
            { storage: "12 GB/512 GB", basePrice: 44700 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy S25 Plus 5G",
        slug: "samsung-galaxy-s25-plus-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-s25-plus-sm-s936-1.jpg",
        variants: [
            { storage: "12 GB/256 GB", basePrice: 49650 },
            { storage: "12 GB/512 GB", basePrice: 52780 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy S25 Ultra 5G",
        slug: "samsung-galaxy-s25-ultra-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-s25-ultra-sm-s938-1.jpg",
        variants: [
            { storage: "12 GB/256 GB", basePrice: 71130 },
            { storage: "12 GB/512 GB", basePrice: 74180 },
            { storage: "12 GB/1 TB", basePrice: 75600 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy A56 5G",
        slug: "samsung-galaxy-a56-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-a56-1.jpg",
        variants: [
            { storage: "8 GB/128 GB", basePrice: 24300 },
            { storage: "8 GB/256 GB", basePrice: 25680 },
            { storage: "12 GB/256 GB", basePrice: 27000 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy F06 5G",
        slug: "samsung-galaxy-f06-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-f06-5g.jpg",
        variants: [
            { storage: "4 GB/64 GB", basePrice: 5080 },
            { storage: "4 GB/128 GB", basePrice: 5580 },
            { storage: "6 GB/128 GB", basePrice: 6290 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy A36 5G",
        slug: "samsung-galaxy-a36-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-a36-1.jpg",
        variants: [
            { storage: "8 GB/128 GB", basePrice: 18100 },
            { storage: "8 GB/256 GB", basePrice: 18570 },
            { storage: "12 GB/256 GB", basePrice: 19690 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy A26 5G",
        slug: "samsung-galaxy-a26-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-a26-1.jpg",
        variants: [
            { storage: "6 GB/128 GB", basePrice: 11600 },
            { storage: "8 GB/128 GB", basePrice: 12350 },
            { storage: "8 GB/256 GB", basePrice: 13300 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy F16 5G",
        slug: "samsung-galaxy-f16-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-f16-5g.jpg",
        variants: [
            { storage: "4 GB/128 GB", basePrice: 8680 },
            { storage: "6 GB/128 GB", basePrice: 9060 },
            { storage: "8 GB/128 GB", basePrice: 9690 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy M06 5G",
        slug: "samsung-galaxy-m06-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-m06-5g.jpg",
        variants: [
            { storage: "4 GB/64 GB", basePrice: 5230 },
            { storage: "4 GB/128 GB", basePrice: 5840 },
            { storage: "6 GB/128 GB", basePrice: 6190 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy M16 5G",
        slug: "samsung-galaxy-m16-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-m16-5g-01.jpg",
        variants: [
            { storage: "4 GB/128 GB", basePrice: 8120 },
            { storage: "6 GB/128 GB", basePrice: 8680 },
            { storage: "8 GB/128 GB", basePrice: 9640 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy A06 5G",
        slug: "samsung-galaxy-a06-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-a06-5g.jpg",
        variants: [
            { storage: "4 GB/64 GB", basePrice: 5900 },
            { storage: "4 GB/128 GB", basePrice: 6600 },
            { storage: "6 GB/128 GB", basePrice: 7570 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy M56 5G",
        slug: "samsung-galaxy-m56-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-m56-5g.jpg",
        variants: [
            { storage: "8 GB/128 GB", basePrice: 14750 },
            { storage: "8 GB/256 GB", basePrice: 17000 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy S25 Edge",
        slug: "samsung-galaxy-s25-edge",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s25-edge.jpg",
        variants: [
            { storage: "12 GB/256 GB", basePrice: 51350 },
            { storage: "12 GB/512 GB", basePrice: 56110 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy Z Fold 7",
        slug: "samsung-galaxy-z-fold-7",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-z-fold7-3.jpg",
        variants: [
            { storage: "12 GB/256 GB", basePrice: 94800 },
            { storage: "12 GB/512 GB", basePrice: 96800 },
            { storage: "16 GB/1 TB", basePrice: 100000 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy M36 5G",
        slug: "samsung-galaxy-m36-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-m36-5g.jpg",
        variants: [
            { storage: "6 GB/128 GB", basePrice: 10500 },
            { storage: "8 GB/128 GB", basePrice: 12000 },
            { storage: "8 GB/256 GB", basePrice: 12500 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy F36 5G",
        slug: "samsung-galaxy-f36-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-f36-1.jpg",
        variants: [
            { storage: "6 GB/128 GB", basePrice: 11100 },
            { storage: "8 GB/128 GB", basePrice: 12180 },
            { storage: "8 GB/256 GB", basePrice: 13200 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy Z Flip 7",
        slug: "samsung-galaxy-z-flip-7",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-z-flip7-03.jpg",
        variants: [
            { storage: "12 GB/256 GB", basePrice: 58500 },
            { storage: "12 GB/512 GB", basePrice: 60000 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy Z Flip7 FE 5G",
        slug: "samsung-galaxy-z-flip7-fe-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-z-flip7-fe-2.jpg",
        variants: [
            { storage: "8 GB/128 GB", basePrice: 51000 },
            { storage: "8 GB/256 GB", basePrice: 52900 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy F56 5G",
        slug: "samsung-galaxy-f56-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-f56-5g.jpg",
        variants: [
            { storage: "8 GB/128 GB", basePrice: 15830 },
            { storage: "8 GB/256 GB", basePrice: 18470 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy A17 5G",
        slug: "samsung-galaxy-a17-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-a17-5g.jpg",
        variants: [
            { storage: "6 GB/128 GB", basePrice: 11600 },
            { storage: "8 GB/128 GB", basePrice: 12500 },
            { storage: "8 GB/256 GB", basePrice: 13430 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy M15 5G Prime Edition",
        slug: "samsung-galaxy-m15-5g-prime-edition",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-m15-1.jpg",
        variants: [
            { storage: "4 GB/128 GB", basePrice: 6900 },
            { storage: "6 GB/128 GB", basePrice: 7610 },
            { storage: "8 GB/128 GB", basePrice: 8630 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy A07",
        slug: "samsung-galaxy-a07",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-a07.jpg",
        variants: [
            { storage: "4 GB/64 GB", basePrice: 5590 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy M07",
        slug: "samsung-galaxy-m07",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-m07.jpg",
        variants: [
            { storage: "4 GB/64 GB", basePrice: 4950 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy F07",
        slug: "samsung-galaxy-f07",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-f07.jpg",
        variants: [
            { storage: "4 GB/64 GB", basePrice: 4870 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy F17 5G",
        slug: "samsung-galaxy-f17-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-f17-5g-11.jpg",
        variants: [
            { storage: "4 GB/128 GB", basePrice: 8750 },
            { storage: "6 GB/128 GB", basePrice: 9930 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy S25 FE",
        slug: "samsung-galaxy-s25-fe",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s25-fe.jpg",
        variants: [
            { storage: "8 GB/128 GB", basePrice: 33500 },
            { storage: "8 GB/256 GB", basePrice: 36000 },
            { storage: "8 GB/512 GB", basePrice: 40000 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy M17 5G",
        slug: "samsung-galaxy-m17-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-a17.jpg",
        variants: [
            { storage: "4 GB/128 GB", basePrice: 9200 },
            { storage: "6 GB/128 GB", basePrice: 10190 },
            { storage: "8 GB/128 GB", basePrice: 10750 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy S26",
        slug: "samsung-galaxy-s26",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s26.jpg",
        variants: [
            { storage: "12 GB/256 GB", basePrice: 55900 },
            { storage: "12 GB/512 GB", basePrice: 61000 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy S26 Plus",
        slug: "samsung-galaxy-s26-plus",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s26-plus.jpg",
        variants: [
            { storage: "12 GB/256 GB", basePrice: 73000 },
            { storage: "12 GB/512 GB", basePrice: 78000 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy S26 Ultra",
        slug: "samsung-galaxy-s26-ultra",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s26-ultra.jpg",
        variants: [
            { storage: "12 GB/256 GB", basePrice: 83000 },
            { storage: "12 GB/512 GB", basePrice: 88500 },
            { storage: "16 GB/1 TB", basePrice: 105000 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy A07 5G",
        slug: "samsung-galaxy-a07-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-a07-5g.jpg",
        variants: [
            { storage: "4 GB/128 GB", basePrice: 10780 },
            { storage: "6 GB/128 GB", basePrice: 11650 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy F70e 5G",
        slug: "samsung-galaxy-f70e-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-f70e-1.jpg",
        variants: [
            { storage: "4 GB/128 GB", basePrice: 8900 },
            { storage: "6 GB/128 GB", basePrice: 9600 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy A57 5G",
        slug: "samsung-galaxy-a57-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-a57-4.jpg",
        variants: [
            { storage: "8 GB/256 GB", basePrice: 36900 },
            { storage: "12 GB/256 GB", basePrice: 39950 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy A37 5G",
        slug: "samsung-galaxy-a37-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-a37-4.jpg",
        variants: [
            { storage: "8 GB/128 GB", basePrice: 25620 },
            { storage: "8 GB/256 GB", basePrice: 29550 },
            { storage: "12 GB/256 GB", basePrice: 33000 }
        ]
    },
    {
        category: "mobile",
        brand: "Samsung",
        modelName: "Galaxy M17e 5G",
        slug: "samsung-galaxy-m17e-5g",
        imageUrl: "https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-m17e-1.jpg",
        variants: [
            { storage: "4 GB/128 GB", basePrice: 9300 },
            { storage: "6 GB/128 GB", basePrice: 10700 }
        ]
    },
];

// ─── SEED FUNCTION ────────────────────────────────────────────────────────────

async function seed() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");
        await Device.deleteMany({ category: "mobile", brand: "Samsung" });
        console.log("Cleared existing Samsung mobile devices");
        await Device.insertMany(devices);
        console.log(`✅ Seeded ${devices.length} Samsung mobile devices successfully`);
        process.exit(0);
    } catch (err) {
        console.error("❌ Seed failed:", err.message);
        process.exit(1);
    }
}

seed();