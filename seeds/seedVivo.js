import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import Device from "../models/Device.js";

const devices = [
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "NEX",
    slug: "vivo-nex",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-nex-s.jpg",
    variants: [
      { storage: "8GB / 128GB", basePrice: 4490 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "S1",
    slug: "vivo-s1",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-s1.jpg",
    variants: [
      { storage: "4GB / 128GB", basePrice: 4000 },
      { storage: "6GB / 64GB", basePrice: 4010 },
      { storage: "6GB / 128GB", basePrice: 4140 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "S1 Pro",
    slug: "vivo-s1-pro",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-s1-pro.jpg",
    variants: [
      { storage: "8GB / 128GB", basePrice: 4810 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "T1",
    slug: "vivo-t1",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-t1.jpg",
    variants: [
      { storage: "4GB / 128GB", basePrice: 5150 },
      { storage: "6GB / 128GB", basePrice: 5640 },
      { storage: "8GB / 128GB", basePrice: 6100 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "T1 5G",
    slug: "vivo-t1-5g",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-t1-5g.jpg",
    variants: [
      { storage: "4GB / 128GB", basePrice: 6660 },
      { storage: "6GB / 128GB", basePrice: 7420 },
      { storage: "8GB / 128GB", basePrice: 7650 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "T1 Pro 5G",
    slug: "vivo-t1-pro-5g",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-t1-5g-778g.jpg",
    variants: [
      { storage: "6GB / 128GB", basePrice: 8500 },
      { storage: "8GB / 128GB", basePrice: 8910 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "T1x",
    slug: "vivo-t1x",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-t1x.jpg",
    variants: [
      { storage: "4GB / 64GB", basePrice: 4450 },
      { storage: "4GB / 128GB", basePrice: 4840 },
      { storage: "6GB / 128GB", basePrice: 5110 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "T2 5G",
    slug: "vivo-t2-5g",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-t2.jpg",
    variants: [
      { storage: "6GB / 128GB", basePrice: 10430 },
      { storage: "8GB / 128GB", basePrice: 11030 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "T2 Pro 5G",
    slug: "vivo-t2-pro-5g",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-t2-pro.jpg",
    variants: [
      { storage: "128GB", basePrice: 14860 },
      { storage: "256GB", basePrice: 15520 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "T2x 5G",
    slug: "vivo-t2x-5g",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-t2x.jpg",
    variants: [
      { storage: "4GB / 128GB", basePrice: 8750 },
      { storage: "6GB / 128GB", basePrice: 9550 },
      { storage: "8GB / 128GB", basePrice: 10210 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "T3 5G",
    slug: "vivo-t3-5g",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-t3.jpg",
    variants: [
      { storage: "128GB", basePrice: 11260 },
      { storage: "256GB", basePrice: 11740 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "T3 Lite 5G",
    slug: "vivo-t3-lite-5g",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-t3-lite.jpg",
    variants: [
      { storage: "4 GB/128 GB", basePrice: 6160 },
      { storage: "6 GB/128 GB", basePrice: 6820 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "T3 Pro 5G",
    slug: "vivo-t3-pro-5g",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-t3-pro.jpg",
    variants: [
      { storage: "8 GB/128 GB", basePrice: 14380 },
      { storage: "8 GB/256 GB", basePrice: 16050 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "T3 Ultra",
    slug: "vivo-t3-ultra",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-t3-ultra.jpg",
    variants: [
      { storage: "8 GB/128 GB", basePrice: 16910 },
      { storage: "8 GB/256 GB", basePrice: 18600 },
      { storage: "12 GB/256 GB", basePrice: 19300 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "T3x 5G",
    slug: "vivo-t3x-5g",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-t3x.jpg",
    variants: [
      { storage: "4GB / 128GB", basePrice: 8620 },
      { storage: "6GB / 128GB", basePrice: 9960 },
      { storage: "8GB / 128GB", basePrice: 10350 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "T4 5G",
    slug: "vivo-t4-5g",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-t4.jpg",
    variants: [
      { storage: "8 GB/128 GB", basePrice: 15660 },
      { storage: "8 GB/256 GB", basePrice: 16400 },
      { storage: "12 GB/256 GB", basePrice: 17360 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "T4 Lite 5G",
    slug: "vivo-t4-lite-5g",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-t4-lite.jpg",
    variants: [
      { storage: "4 GB/64 GB", basePrice: 5890 },
      { storage: "4 GB/128 GB", basePrice: 7040 },
      { storage: "6 GB/128 GB", basePrice: 7800 },
      { storage: "8 GB/256 GB", basePrice: 8930 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "T4 Pro 5G",
    slug: "vivo-t4-pro-5g",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-t4-pro.jpg",
    variants: [
      { storage: "8 GB/128 GB", basePrice: 18000 },
      { storage: "8 GB/256 GB", basePrice: 19500 },
      { storage: "12 GB/256 GB", basePrice: 20300 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "T4 Ultra 5G",
    slug: "vivo-t4-ultra-5g",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-t-4-ultra.jpg",
    variants: [
      { storage: "8 GB/256 GB", basePrice: 23650 },
      { storage: "12 GB/256 GB", basePrice: 24870 },
      { storage: "12 GB/512 GB", basePrice: 26190 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "T4R 5G",
    slug: "vivo-t4r-5g",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-v50e.jpg",
    variants: [
      { storage: "8 GB/128 GB", basePrice: 13900 },
      { storage: "8 GB/256 GB", basePrice: 14890 },
      { storage: "12 GB/256 GB", basePrice: 16240 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "T4x 5G",
    slug: "vivo-t4x-5g",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-t4x-5g.jpg",
    variants: [
      { storage: "6 GB/128 GB", basePrice: 9710 },
      { storage: "8 GB/128 GB", basePrice: 10200 },
      { storage: "8 GB/256 GB", basePrice: 11400 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "T5x 5G",
    slug: "vivo-t5x-5g",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-t5x-5g.jpg",
    variants: [
      { storage: "6 GB/128 GB", basePrice: 14500 },
      { storage: "8 GB/128 GB", basePrice: 15350 },
      { storage: "8 GB/256 GB", basePrice: 16500 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "U10",
    slug: "vivo-u10",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-u10-.jpg",
    variants: [
      { storage: "3GB / 32GB", basePrice: 2820 },
      { storage: "3GB / 64GB", basePrice: 3040 },
      { storage: "4GB / 64GB", basePrice: 3260 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "U20",
    slug: "vivo-u20",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-u20.jpg",
    variants: [
      { storage: "4GB / 64GB", basePrice: 3470 },
      { storage: "6GB / 64GB", basePrice: 3560 },
      { storage: "8GB / 128GB", basePrice: 3820 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "V11",
    slug: "vivo-v11",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-v11i-.jpg",
    variants: [
      { storage: "6GB / 64GB", basePrice: 3170 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "V11 Pro",
    slug: "vivo-v11-pro",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-v11-pro-.jpg",
    variants: [
      { storage: "6GB / 64GB", basePrice: 3540 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "V15",
    slug: "vivo-v15",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-v15.jpg",
    variants: [
      { storage: "6GB / 64GB", basePrice: 4300 },
      { storage: "6GB / 128GB", basePrice: 4460 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "V15 Pro",
    slug: "vivo-v15-pro",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-v15-pro.jpg",
    variants: [
      { storage: "6GB / 128GB", basePrice: 4570 },
      { storage: "8GB / 128GB", basePrice: 4800 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "V17",
    slug: "vivo-v17",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-v17.jpg",
    variants: [
      { storage: "8GB / 128GB", basePrice: 5380 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "V17 Pro",
    slug: "vivo-v17-pro",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-v17-pro-r.jpg",
    variants: [
      { storage: "8GB / 128GB", basePrice: 5650 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "V19",
    slug: "vivo-v19",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-v19.jpg",
    variants: [
      { storage: "128GB", basePrice: 5500 },
      { storage: "256GB", basePrice: 6070 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "V20",
    slug: "vivo-v20",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-v20.jpg",
    variants: [
      { storage: "128GB", basePrice: 5960 },
      { storage: "256GB", basePrice: 6230 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "V20 2021",
    slug: "vivo-v20-2021",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-v20-new.jpg",
    variants: [
      { storage: "8GB / 128GB", basePrice: 5340 },
      { storage: "8GB / 256GB", basePrice: 5690 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "V20 Pro",
    slug: "vivo-v20-pro",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-v20-pro.jpg",
    variants: [
      { storage: "8GB / 128GB", basePrice: 7760 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "V20 SE",
    slug: "vivo-v20-se",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-v20se.jpg",
    variants: [
      { storage: "8GB / 128GB", basePrice: 5640 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "V21 5G",
    slug: "vivo-v21-5g",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-v21-5g.jpg",
    variants: [
      { storage: "128GB", basePrice: 7950 },
      { storage: "256GB", basePrice: 8720 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "V21e 5G",
    slug: "vivo-v21e-5g",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-v21e-5g.jpg",
    variants: [
      { storage: "128GB", basePrice: 7300 },
      { storage: "256GB", basePrice: 7570 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "V23 5G",
    slug: "vivo-v23-5g",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-v23-5g.jpg",
    variants: [
      { storage: "8GB / 128GB", basePrice: 9300 },
      { storage: "12GB / 256GB", basePrice: 10440 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "V23 Pro",
    slug: "vivo-v23-pro",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-v23-pro.jpg",
    variants: [
      { storage: "8GB / 128GB", basePrice: 10320 },
      { storage: "12GB / 256GB", basePrice: 11570 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "V23e 5G",
    slug: "vivo-v23e-5g",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-v23e.jpg",
    variants: [
      { storage: "8GB / 128GB", basePrice: 8340 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "V25 5G",
    slug: "vivo-v25-5g",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-v25.jpg",
    variants: [
      { storage: "8GB / 128GB", basePrice: 9600 },
      { storage: "12GB / 256GB", basePrice: 10420 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "V25 Pro 5G",
    slug: "vivo-v25-pro-5g",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-v25-pro.jpg",
    variants: [
      { storage: "8GB / 128GB", basePrice: 11230 },
      { storage: "12GB / 256GB", basePrice: 12040 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "V27",
    slug: "vivo-v27",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-v27.jpg",
    variants: [
      { storage: "8GB / 128GB", basePrice: 15810 },
      { storage: "12GB / 256GB", basePrice: 17660 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "V27 Pro",
    slug: "vivo-v27-pro",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-v27-pro.jpg",
    variants: [
      { storage: "8GB / 128GB", basePrice: 17740 },
      { storage: "8GB / 256GB", basePrice: 18380 },
      { storage: "12GB / 256GB", basePrice: 18910 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "V29",
    slug: "vivo-v29",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-s17-pro.jpg",
    variants: [
      { storage: "8GB / 128GB", basePrice: 17350 },
      { storage: "12GB / 256GB", basePrice: 18710 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "V29 Pro",
    slug: "vivo-v29-pro",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-v29-pro.jpg",
    variants: [
      { storage: "8GB / 256GB", basePrice: 18870 },
      { storage: "12GB / 256GB", basePrice: 19790 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "V29e",
    slug: "vivo-v29e",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-v29e.jpg",
    variants: [
      { storage: "128GB", basePrice: 15260 },
      { storage: "256GB", basePrice: 16460 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "V30",
    slug: "vivo-v30",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-s18.jpg",
    variants: [
      { storage: "8GB / 128GB", basePrice: 18550 },
      { storage: "8GB / 256GB", basePrice: 19160 },
      { storage: "12GB / 256GB", basePrice: 20080 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "V30 Pro",
    slug: "vivo-v30-pro",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-v30-pro.jpg",
    variants: [
      { storage: "8GB / 256GB", basePrice: 20780 },
      { storage: "12GB / 256GB", basePrice: 22490 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "V30e",
    slug: "vivo-v30e",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-v30e.jpg",
    variants: [
      { storage: "128GB", basePrice: 17150 },
      { storage: "256GB", basePrice: 17350 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "V40",
    slug: "vivo-v40",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-v40.jpg",
    variants: [
      { storage: "8 GB/128 GB", basePrice: 19930 },
      { storage: "8 GB/256 GB", basePrice: 21050 },
      { storage: "12 GB/512 GB", basePrice: 21690 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "V40 Pro",
    slug: "vivo-v40-pro",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-v40-pro.jpg",
    variants: [
      { storage: "8 GB/256 GB", basePrice: 25610 },
      { storage: "12 GB/512 GB", basePrice: 27160 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "V40e",
    slug: "vivo-v40e",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-v40e.jpg",
    variants: [
      { storage: "8 GB/128 GB", basePrice: 17900 },
      { storage: "8 GB/256 GB", basePrice: 18670 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "V5",
    slug: "vivo-v5",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-v5.jpg",
    variants: [
      { storage: "4GB / 32GB", basePrice: 1480 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "V5 Plus",
    slug: "vivo-v5-plus",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-v5-plus.jpg",
    variants: [
      { storage: "4GB / 32GB", basePrice: 1930 },
      { storage: "4GB / 64GB", basePrice: 2170 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "V50",
    slug: "vivo-v50",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-v50.jpg",
    variants: [
      { storage: "8 GB/128 GB", basePrice: 20860 },
      { storage: "8 GB/256 GB", basePrice: 22300 },
      { storage: "12 GB/512 GB", basePrice: 22960 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "V50e",
    slug: "vivo-v50e",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-v50e.jpg",
    variants: [
      { storage: "8 GB/128 GB", basePrice: 18570 },
      { storage: "8 GB/256 GB", basePrice: 19040 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "V60",
    slug: "vivo-v60",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-v60.jpg",
    variants: [
      { storage: "8 GB/128 GB", basePrice: 23330 },
      { storage: "8 GB/256 GB", basePrice: 23860 },
      { storage: "12 GB/256 GB", basePrice: 25400 },
      { storage: "16 GB/512 GB", basePrice: 28120 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "V60e",
    slug: "vivo-v60e",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-v60e.jpg",
    variants: [
      { storage: "8 GB/128 GB", basePrice: 20160 },
      { storage: "8 GB/256 GB", basePrice: 20760 },
      { storage: "12 GB/256 GB", basePrice: 22710 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "V7",
    slug: "vivo-v7",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-v7.jpg",
    variants: [
      { storage: "4GB / 32GB", basePrice: 2080 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "V7 Plus",
    slug: "vivo-v7-plus",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-v7-plus.jpg",
    variants: [
      { storage: "4GB / 64GB", basePrice: 2150 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "V70",
    slug: "vivo-v70",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-v70.jpg",
    variants: [
      { storage: "8 GB/256 GB", basePrice: 32650 },
      { storage: "12 GB/256 GB", basePrice: 34000 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "V70 Elite",
    slug: "vivo-v70-elite",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-v70-elite.jpg",
    variants: [
      { storage: "8 GB/256 GB", basePrice: 35020 },
      { storage: "12 GB/256 GB", basePrice: 38500 },
      { storage: "12 GB/512 GB", basePrice: 40500 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "V70 FE",
    slug: "vivo-v70-fe",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-v70-fe.jpg",
    variants: [
      { storage: "8 GB/128 GB", basePrice: 24400 },
      { storage: "8 GB/256 GB", basePrice: 26800 },
      { storage: "12 GB/256 GB", basePrice: 28900 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "V71i",
    slug: "vivo-v71i",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-y71-.jpg",
    variants: [
      { storage: "2GB / 16GB", basePrice: 1340 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "V9",
    slug: "vivo-v9",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-v9-.jpg",
    variants: [
      { storage: "4GB / 64GB", basePrice: 2640 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "V9 Pro",
    slug: "vivo-v9-pro",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-v9-.jpg",
    variants: [
      { storage: "4GB / 64GB", basePrice: 2970 },
      { storage: "6GB / 64GB", basePrice: 3120 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "V9 Youth",
    slug: "vivo-v9-youth",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-v9-.jpg",
    variants: [
      { storage: "4GB / 32GB", basePrice: 2150 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "X Fold 3 Pro",
    slug: "vivo-x-fold-3-pro",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-x-fold3-pro.jpg",
    variants: [
      { storage: "16 GB/512 GB", basePrice: 60070 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "X Fold 5",
    slug: "vivo-x-fold-5",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-x-fold5-new.jpg",
    variants: [
      { storage: "16 GB/512 GB", basePrice: 79800 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "X100",
    slug: "vivo-x100",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-x100.jpg",
    variants: [
      { storage: "12GB / 256GB", basePrice: 27150 },
      { storage: "16GB / 512GB", basePrice: 27930 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "X100 Pro",
    slug: "vivo-x100-pro",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-x100-pro.jpg",
    variants: [
      { storage: "16GB / 512GB", basePrice: 32830 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "X200",
    slug: "vivo-x200",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-x200.jpg",
    variants: [
      { storage: "12 GB/256 GB", basePrice: 33000 },
      { storage: "16 GB/512 GB", basePrice: 35500 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "X200 FE",
    slug: "vivo-x200-fe",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-x200-fe.jpg",
    variants: [
      { storage: "12 GB/256 GB", basePrice: 34000 },
      { storage: "16 GB/512 GB", basePrice: 35600 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "X200 Pro",
    slug: "vivo-x200-pro",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-x200-pro.jpg",
    variants: [
      { storage: "16 GB/512 GB", basePrice: 48500 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "X200T",
    slug: "vivo-x200t",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-x200t-.jpg",
    variants: [
      { storage: "12 GB/256 GB", basePrice: 38000 },
      { storage: "12 GB/512 GB", basePrice: 41700 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "X21",
    slug: "vivo-x21",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-x21.jpg",
    variants: [
      { storage: "6GB / 128GB", basePrice: 3640 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "X300",
    slug: "vivo-x300",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-x300.jpg",
    variants: [
      { storage: "12 GB/256 GB", basePrice: 45000 },
      { storage: "12 GB/512 GB", basePrice: 46500 },
      { storage: "16 GB/512 GB", basePrice: 49000 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "X300 FE",
    slug: "vivo-x300-fe",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-x300-fe.jpg",
    variants: [
      { storage: "12 GB/256 GB", basePrice: 50000 },
      { storage: "12 GB/512 GB", basePrice: 54400 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "X300 Pro",
    slug: "vivo-x300-pro",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-x300-pro.jpg",
    variants: [
      { storage: "16 GB/512 GB", basePrice: 62500 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "X300 Ultra",
    slug: "vivo-x300-ultra",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-x300-ultra.jpg",
    variants: [
      { storage: "16 GB/512 GB", basePrice: 80000 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "X50",
    slug: "vivo-x50",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-x50.jpg",
    variants: [
      { storage: "128GB", basePrice: 5920 },
      { storage: "256GB", basePrice: 6190 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "X60",
    slug: "vivo-x60",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-x60.jpg",
    variants: [
      { storage: "8GB / 128GB", basePrice: 9510 },
      { storage: "12GB / 256GB", basePrice: 10190 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "X60 Pro",
    slug: "vivo-x60-pro",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-x60-pro.jpg",
    variants: [
      { storage: "12GB / 256GB", basePrice: 11810 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "X60 Pro Plus",
    slug: "vivo-x60-pro-plus",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-x60-pro-plus.jpg",
    variants: [
      { storage: "12GB / 256GB", basePrice: 13190 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "X70 Pro",
    slug: "vivo-x70-pro",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-x70-pro-r.jpg",
    variants: [
      { storage: "8GB / 128GB", basePrice: 14160 },
      { storage: "8GB / 256GB", basePrice: 14880 },
      { storage: "12GB / 256GB", basePrice: 15900 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "X70 Pro Plus",
    slug: "vivo-x70-pro-plus",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-x70-pro-plus.jpg",
    variants: [
      { storage: "12GB / 256GB", basePrice: 17650 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "X80",
    slug: "vivo-x80",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-x80.jpg",
    variants: [
      { storage: "8GB / 128GB", basePrice: 15220 },
      { storage: "12GB / 256GB", basePrice: 16890 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "X80 Pro",
    slug: "vivo-x80-pro",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-x80-pro.jpg",
    variants: [
      { storage: "12GB / 256GB", basePrice: 19860 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "X9",
    slug: "vivo-x9",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-x9-.jpg",
    variants: [
      { storage: "64GB", basePrice: 2250 },
      { storage: "128GB", basePrice: 2400 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "X90",
    slug: "vivo-x90",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-x90.jpg",
    variants: [
      { storage: "8GB / 256GB", basePrice: 23660 },
      { storage: "12GB / 256GB", basePrice: 24440 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "X90 Pro",
    slug: "vivo-x90-pro",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-x90-pro.jpg",
    variants: [
      { storage: "12GB / 256GB", basePrice: 28520 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "X9s",
    slug: "vivo-x9s",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-x9s-plus-r.jpg",
    variants: [
      { storage: "4GB / 64GB", basePrice: 2330 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "X9s Plus",
    slug: "vivo-x9s-plus",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-x9-plus.jpg",
    variants: [
      { storage: "4GB / 64GB", basePrice: 2550 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "Y01",
    slug: "vivo-y01",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-y01.jpg",
    variants: [
      { storage: "2GB / 32GB", basePrice: 2650 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "Y01a",
    slug: "vivo-y01a",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-y01.jpg",
    variants: [
      { storage: "2GB / 32GB", basePrice: 2540 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "Y02",
    slug: "vivo-y02",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/viv0-y02.jpg",
    variants: [
      { storage: "3GB / 32GB", basePrice: 2920 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "Y02T",
    slug: "vivo-y02t",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-y02t.jpg",
    variants: [
      { storage: "4GB / 64GB", basePrice: 4580 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "Y100 5G",
    slug: "vivo-y100-5g",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-y100.jpg",
    variants: [
      { storage: "8GB / 128GB", basePrice: 10210 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "Y100A 5G",
    slug: "vivo-y100a-5g",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-y100-5g-indonesia.jpg",
    variants: [
      { storage: "128GB", basePrice: 10430 },
      { storage: "256GB", basePrice: 10830 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "Y11 2019",
    slug: "vivo-y11-2019",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-y11-2019.jpg",
    variants: [
      { storage: "3GB / 32GB", basePrice: 2800 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "Y11 5G",
    slug: "vivo-y11-5g",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-y11.jpg",
    variants: [
      { storage: "4 GB/64 GB", basePrice: 9650 },
      { storage: "4 GB/128 GB", basePrice: 10670 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "Y12",
    slug: "vivo-y12",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-y12.jpg",
    variants: [
      { storage: "3GB / 64GB", basePrice: 3410 },
      { storage: "4GB / 32GB", basePrice: 3650 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "Y12G",
    slug: "vivo-y12g",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-y12s.jpg",
    variants: [
      { storage: "3GB / 32GB", basePrice: 3260 },
      { storage: "3GB / 64GB", basePrice: 3540 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "Y12s",
    slug: "vivo-y12s",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-y12s.jpg",
    variants: [
      { storage: "3GB / 32GB", basePrice: 3730 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "Y15 2019",
    slug: "vivo-y15-2019",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-y15-new.jpg",
    variants: [
      { storage: "4GB / 64GB", basePrice: 3610 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "Y15s 2021",
    slug: "vivo-y15s-2021",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-y15s-new.jpg",
    variants: [
      { storage: "3GB / 32GB", basePrice: 3010 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "Y16",
    slug: "vivo-y16",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-y16.jpg",
    variants: [
      { storage: "3GB / 32GB", basePrice: 3540 },
      { storage: "3GB / 64GB", basePrice: 3860 },
      { storage: "4GB / 64GB", basePrice: 4110 },
      { storage: "4GB / 128GB", basePrice: 4420 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "Y17",
    slug: "vivo-y17",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-y17.jpg",
    variants: [
      { storage: "4GB / 128GB", basePrice: 4500 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "Y17s",
    slug: "vivo-y17s",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-y17s.jpg",
    variants: [
      { storage: "4GB / 64GB", basePrice: 5410 },
      { storage: "4GB / 128GB", basePrice: 6060 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "Y18",
    slug: "vivo-y18",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-y18.jpg",
    variants: [
      { storage: "64GB", basePrice: 4870 },
      { storage: "128GB", basePrice: 5320 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "Y18T",
    slug: "vivo-y18t",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-y03.jpg",
    variants: [
      { storage: "4 GB/128 GB", basePrice: 5180 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "Y18e",
    slug: "vivo-y18e",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-y18e.jpg",
    variants: [
      { storage: "4GB / 64GB", basePrice: 4870 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "Y18i",
    slug: "vivo-y18i",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-y03.jpg",
    variants: [
      { storage: "4 GB/64 GB", basePrice: 4870 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "Y19",
    slug: "vivo-y19",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-y19.jpg",
    variants: [
      { storage: "4GB / 128GB", basePrice: 4150 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "Y19 5G",
    slug: "vivo-y19-5g",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-y19.jpg",
    variants: [
      { storage: "4 GB/64 GB", basePrice: 6760 },
      { storage: "4 GB/128 GB", basePrice: 7620 },
      { storage: "6 GB/128 GB", basePrice: 8000 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "Y19e",
    slug: "vivo-y19e",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-y04.jpg",
    variants: [
      { storage: "4 GB/64 GB", basePrice: 5130 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "Y19s 5G",
    slug: "vivo-y19s-5g",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-y19s.jpg",
    variants: [
      { storage: "4 GB/64 GB", basePrice: 7410 },
      { storage: "4 GB/128 GB", basePrice: 8320 },
      { storage: "6 GB/128 GB", basePrice: 9150 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "Y1s",
    slug: "vivo-y1s",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-y1s.jpg",
    variants: [
      { storage: "2GB / 32GB", basePrice: 2390 },
      { storage: "3GB / 32GB", basePrice: 2540 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "Y20",
    slug: "vivo-y20",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-y20.jpg",
    variants: [
      { storage: "4GB / 64GB", basePrice: 4150 },
      { storage: "6GB / 64GB", basePrice: 4500 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "Y200 5G",
    slug: "vivo-y200-5g",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-y200-.jpg",
    variants: [
      { storage: "8GB / 128GB", basePrice: 11930 },
      { storage: "8GB / 256GB", basePrice: 12510 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "Y200 Pro 5G",
    slug: "vivo-y200-pro-5g",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-y100-china-1.jpg",
    variants: [
      { storage: "8 GB/128 GB", basePrice: 13720 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "Y200e 5G",
    slug: "vivo-y200e-5g",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-y200e-5g.jpg",
    variants: [
      { storage: "6GB / 128GB", basePrice: 11120 },
      { storage: "8GB / 128GB", basePrice: 11760 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "Y20A",
    slug: "vivo-y20a",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-y200-5g-gl.jpg",
    variants: [
      { storage: "3GB / 64GB", basePrice: 3860 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "Y20G",
    slug: "vivo-y20g",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-y20g.jpg",
    variants: [
      { storage: "4GB / 64GB", basePrice: 4390 },
      { storage: "6GB / 128GB", basePrice: 4880 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "Y20T",
    slug: "vivo-y20t",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-y20s.jpg",
    variants: [
      { storage: "6GB / 64GB", basePrice: 4840 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "Y20i",
    slug: "vivo-y20i",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-y20.jpg",
    variants: [
      { storage: "3GB / 64GB", basePrice: 3650 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "Y21 2021",
    slug: "vivo-y21-2021",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-y21-.jpg",
    variants: [
      { storage: "64GB", basePrice: 4500 },
      { storage: "128GB", basePrice: 4880 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "Y21 5G",
    slug: "vivo-y21-5g",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-y21-.jpg",
    variants: [
      { storage: "4 GB/128 GB", basePrice: 12760 },
      { storage: "6 GB/128 GB", basePrice: 13750 },
      { storage: "8 GB/128 GB", basePrice: 14900 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "Y21G",
    slug: "vivo-y21g",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-y21-.jpg",
    variants: [
      { storage: "4GB / 64GB", basePrice: 4150 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "Y21T",
    slug: "vivo-y21t",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-y21s.jpg",
    variants: [
      { storage: "4GB / 128GB", basePrice: 4700 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "Y21a",
    slug: "vivo-y21a",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-y21-.jpg",
    variants: [
      { storage: "4GB / 64GB", basePrice: 4090 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "Y21e",
    slug: "vivo-y21e",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-y21-.jpg",
    variants: [
      { storage: "3GB / 64GB", basePrice: 3900 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "Y22 2022",
    slug: "vivo-y22-2022",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-y22-2022.jpg",
    variants: [
      { storage: "4GB / 64GB", basePrice: 4500 },
      { storage: "4GB / 128GB", basePrice: 4840 },
      { storage: "6GB / 128GB", basePrice: 5300 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "Y27",
    slug: "vivo-y27",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-y27.jpg",
    variants: [
      { storage: "6GB / 128GB", basePrice: 6950 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "Y28 5G",
    slug: "vivo-y28-5g",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-y28-5g-.jpg",
    variants: [
      { storage: "4GB / 128GB", basePrice: 8570 },
      { storage: "6GB / 128GB", basePrice: 9380 },
      { storage: "8GB / 128GB", basePrice: 9890 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "Y28e 5G",
    slug: "vivo-y28e-5g",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-y37-2024.jpg",
    variants: [
      { storage: "4 GB/64 GB", basePrice: 7270 },
      { storage: "4 GB/128 GB", basePrice: 8110 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "Y28s 5G",
    slug: "vivo-y28s-5g",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-y28s.jpg",
    variants: [
      { storage: "4 GB/128 GB", basePrice: 8870 },
      { storage: "6 GB/128 GB", basePrice: 9410 },
      { storage: "8 GB/128 GB", basePrice: 9800 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "Y29 5G",
    slug: "vivo-y29-5g",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-y19s.jpg",
    variants: [
      { storage: "8 GB/256 GB", basePrice: 12100 },
      { storage: "4 GB/128 GB", basePrice: 9950 },
      { storage: "6 GB/128 GB", basePrice: 10660 },
      { storage: "8 GB/128 GB", basePrice: 11550 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "Y30",
    slug: "vivo-y30",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-y30.jpg",
    variants: [
      { storage: "4GB / 128GB", basePrice: 4500 },
      { storage: "6GB / 128GB", basePrice: 4730 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "Y300 5G",
    slug: "vivo-y300-5g",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-y300-5g.jpg",
    variants: [
      { storage: "8 GB/128 GB", basePrice: 14510 },
      { storage: "8 GB/256 GB", basePrice: 14750 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "Y300 Plus 5G",
    slug: "vivo-y300-plus-5g",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-y300-plus-5g-.jpg",
    variants: [
      { storage: "8 GB/128 GB", basePrice: 15650 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "Y31 2021",
    slug: "vivo-y31-2021",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-y31-2021.jpg",
    variants: [
      { storage: "6GB / 128GB", basePrice: 4770 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "Y31 5G",
    slug: "vivo-y31-5g",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-y31-5g.jpg",
    variants: [
      { storage: "4 GB/128 GB", basePrice: 11210 },
      { storage: "6 GB/128 GB", basePrice: 12500 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "Y31 Pro 5G",
    slug: "vivo-y31-pro-5g",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-y31-pro.jpg",
    variants: [
      { storage: "8 GB/128 GB", basePrice: 13850 },
      { storage: "8 GB/256 GB", basePrice: 14850 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "Y33T",
    slug: "vivo-y33t",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-y33t.jpg",
    variants: [
      { storage: "8GB / 128GB", basePrice: 5430 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "Y33s",
    slug: "vivo-y33s",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-y33s.jpg",
    variants: [
      { storage: "8GB / 128GB", basePrice: 5540 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "Y35",
    slug: "vivo-y35",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-y35.jpg",
    variants: [
      { storage: "8GB / 128GB", basePrice: 5250 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "Y36",
    slug: "vivo-y36",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-y36.jpg",
    variants: [
      { storage: "8GB / 128GB", basePrice: 7920 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "Y39 5G",
    slug: "vivo-y39-5g",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-y39-5g.jpg",
    variants: [
      { storage: "8 GB/128 GB", basePrice: 12180 },
      { storage: "8 GB/256 GB", basePrice: 13460 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "Y3s 2021",
    slug: "vivo-y3s-2021",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-y3s-2021.jpg",
    variants: [
      { storage: "2GB / 32GB", basePrice: 2740 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "Y400 5G",
    slug: "vivo-y400-5g",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-y400-5g.jpg",
    variants: [
      { storage: "8 GB/128 GB", basePrice: 16750 },
      { storage: "8 GB/256 GB", basePrice: 18250 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "Y400 Pro 5G",
    slug: "vivo-y400-pro-5g",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-y400-pro.jpg",
    variants: [
      { storage: "8 GB/128 GB", basePrice: 17100 },
      { storage: "8 GB/256 GB", basePrice: 17950 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "Y50",
    slug: "vivo-y50",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-y50.jpg",
    variants: [
      { storage: "8GB / 128GB", basePrice: 5170 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "Y51 2020",
    slug: "vivo-y51-2020",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-y51-2020.jpg",
    variants: [
      { storage: "8GB / 128GB", basePrice: 5340 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "Y51 Pro 5G",
    slug: "vivo-y51-pro-5g",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-y51-pro.jpg",
    variants: [
      { storage: "8 GB/128 GB", basePrice: 17700 },
      { storage: "8 GB/256 GB", basePrice: 19700 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "Y51A",
    slug: "vivo-y51a",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-y51-2020-dec.jpg",
    variants: [
      { storage: "6GB / 128GB", basePrice: 4570 },
      { storage: "8GB / 128GB", basePrice: 4890 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "Y53i",
    slug: "vivo-y53i",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-y53i-.jpg",
    variants: [
      { storage: "2GB / 16GB", basePrice: 970 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "Y53s",
    slug: "vivo-y53s",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-y53s.jpg",
    variants: [
      { storage: "8GB / 128GB", basePrice: 5300 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "Y55s",
    slug: "vivo-y55s",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-y55s.jpg",
    variants: [
      { storage: "3GB / 16GB", basePrice: 1050 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "Y58 5G",
    slug: "vivo-y58-5g",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-u38.jpg",
    variants: [
      { storage: "8 GB/128 GB", basePrice: 10780 },
      { storage: "4GB / 128GB", basePrice: 8780 },
      { storage: "8GB / 128GB", basePrice: 9940 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "Y66",
    slug: "vivo-y66",
    imageUrl: "https://www.mobigyaan.com/wp-content/uploads/2017/03/Vivo-Y66.jpg",
    variants: [
      { storage: "3GB / 32GB", basePrice: 1490 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "Y69",
    slug: "vivo-y69",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-y69.jpg",
    variants: [
      { storage: "3GB / 32GB", basePrice: 1530 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "Y71",
    slug: "vivo-y71",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-y71-.jpg",
    variants: [
      { storage: "3GB / 16GB", basePrice: 1380 },
      { storage: "3GB / 32GB", basePrice: 1490 },
      { storage: "4GB / 32GB", basePrice: 1720 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "Y72 5G",
    slug: "vivo-y72-5g",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-y72-5g-.jpg",
    variants: [
      { storage: "8GB / 128GB", basePrice: 7060 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "Y73",
    slug: "vivo-y73",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-v21e.jpg",
    variants: [
      { storage: "8GB / 128GB", basePrice: 5920 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "Y75",
    slug: "vivo-y75",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-y75.jpg",
    variants: [
      { storage: "8GB / 128GB", basePrice: 5840 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "Y75 5G",
    slug: "vivo-y75-5g",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-y75.jpg",
    variants: [
      { storage: "8GB / 128GB", basePrice: 7670 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "Y81",
    slug: "vivo-y81",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-y81.jpg",
    variants: [
      { storage: "3GB / 32GB", basePrice: 1830 },
      { storage: "4GB / 32GB", basePrice: 2140 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "Y81i",
    slug: "vivo-y81i",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-y81i.jpg",
    variants: [
      { storage: "2GB / 16GB", basePrice: 1340 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "Y83",
    slug: "vivo-y83",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-y83.jpg",
    variants: [
      { storage: "4GB / 32GB", basePrice: 2260 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "Y83 Pro",
    slug: "vivo-y83-pro",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-y83-pro.jpg",
    variants: [
      { storage: "4GB / 64GB", basePrice: 2650 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "Y90",
    slug: "vivo-y90",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-y90.jpg",
    variants: [
      { storage: "2GB / 16GB", basePrice: 1980 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "Y91",
    slug: "vivo-y91",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-y91.jpg",
    variants: [
      { storage: "2GB / 32GB", basePrice: 2050 },
      { storage: "3GB / 32GB", basePrice: 2270 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "Y91i",
    slug: "vivo-y91i",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-y91i-.jpg",
    variants: [
      { storage: "2GB / 16GB", basePrice: 1570 },
      { storage: "2GB / 32GB", basePrice: 1750 },
      { storage: "3GB / 32GB", basePrice: 1900 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "Y93",
    slug: "vivo-y93",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-y93.jpg",
    variants: [
      { storage: "3GB / 64GB", basePrice: 2500 },
      { storage: "4GB / 32GB", basePrice: 2420 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "Y95",
    slug: "vivo-y95",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-y95-.jpg",
    variants: [
      { storage: "4GB / 64GB", basePrice: 2960 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "Z1 Pro",
    slug: "vivo-z1-pro",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-iqoo-z10-turbo-pro.jpg",
    variants: [
      { storage: "4GB / 64GB", basePrice: 3390 },
      { storage: "6GB / 64GB", basePrice: 3450 },
      { storage: "6GB / 128GB", basePrice: 3600 },
      { storage: "8GB / 128GB", basePrice: 3940 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "Z10",
    slug: "vivo-z10",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-iqoo-z10.jpg",
    variants: [
      { storage: "4GB / 32GB", basePrice: 2500 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "Z1x",
    slug: "vivo-z1x",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-z1x.jpg",
    variants: [
      { storage: "4GB / 128GB", basePrice: 3750 },
      { storage: "6GB / 64GB", basePrice: 4010 },
      { storage: "6GB / 128GB", basePrice: 4090 },
      { storage: "8GB / 128GB", basePrice: 4320 }
    ]
  },
  {
    category: "mobile",
    brand: "Vivo",
    modelName: "x50 Pro",
    slug: "vivo-x50-pro",
    imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/vivo-x50-pro-.jpg",
    variants: [
      { storage: "8GB / 256GB", basePrice: 9150 }
    ]
  }
];

// ─── SEED FUNCTION ────────────────────────────────────────────────────────────

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");
    await Device.deleteMany({ category: "mobile", brand: "Vivo" });
    console.log("Cleared existing Vivo mobile devices");
    await Device.insertMany(devices);
    console.log(`✅ Seeded ${devices.length} mobile devices successfully`);
    process.exit(0);
  } catch (err) {
    console.error("❌ Seed failed:", err);
    process.exit(1);
  }
}

seed();