import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import Device from '../models/Device.js';

const commonFunctionalDeductions = {
  keyboard: 7,
  cdDrive: 7,
  trackpad: 18,
  battery: 6,
  speakers: 3,
  wifi: 5,
  ports: 8,
  webcam: 6,
  charging: 8,
  hardDisk: 10,
  motherboard: 35,
  bluetooth: 6,
};

const commonScreenDeductions = {
  screenCracked: 18,
  lineDiscolour: 18,
};

const commonBodyDeductions = {
  minorDentTop: 8,
  minorDentBase: 8,
  majorDentTop: 35,
  majorDentBase: 40,
  minorScratch: 5,
  majorScratch: 8,
};

const ageMultipliers = {
  lessThan3: 1.0, threeToEleven: 0.88, aboveEleven: 0.75,
  lessThan1: 0.92, oneToTwo: 0.78, twoToThree: 0.62,
  threeToFour: 0.48, fourToFive: 0.36, moreThan5: 0.22,
};

const screenMultipliers = {
  noIssue: 1.0, minorScratch: 0.96, deadPixels: 0.82,
  crackedWorks: 0.68, crackedBroken: 0.45,
};

const conditionMultipliers = { likenew: 1.0, good: 0.88, fair: 0.72, poor: 0.50 };

const accessoriesBonus = { bill: 300, box: 500, charger: 800, withBoxAndCharger: 800, originalCharger: 500, thirdPartyCharger: 200, none: 0 };

function mkDevice({ brand, modelName, slug, processorFamily, generation, tier, variants, gpuType, isGaming, imageUrl }) {
  return {
    category: 'laptop',
    brand,
    modelName,
    slug,
    imageUrl: imageUrl || '',
    processorFamily: processorFamily || '',
    generation: generation || '',
    gpuType: gpuType || '',
    isGamingLaptop: !!isGaming,
    tier: tier || 'Mid-range',
    variants: variants.map(v => ({
      processor: v.processor || processorFamily || '',
      generation: v.generation || generation || '',
      ram: v.ram || '',
      storage: v.storage || 'Standard',
      storageType: v.storage?.includes('HDD') ? 'HDD' : 'SSD',
      basePrice: v.basePrice,
    })),
    conditionMultipliers,
    ageMultipliers,
    screenMultipliers,
    functionalDeductions: commonFunctionalDeductions,
    screenDeductions: commonScreenDeductions,
    bodyDeductions: commonBodyDeductions,
    accessoriesBonus,
    isActive: true,
  };
}

const devices = [
  // ══════════════════════════════════════════════════════
  //  LENOVO — All Series
  // ══════════════════════════════════════════════════════
  mkDevice({
    brand: 'Lenovo', modelName: 'IdeaPad 5 Series', slug: 'lenovo-ideapad-5-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Budget',
    imageUrl:"https://p1-ofp.static.pub/medias/bWFzdGVyfHJvb3R8MjUwNzU5fGltYWdlL3BuZ3xoNDEvaGE3LzE0MTkxNTM2MzQxMDIyLnBuZ3xjMmYzOGI0OTY5YTI1NjgwNzFiODAzMGU1OTY0OGZmZmM0YWM0NjQ5ZWY2ZDZhNmVkYzgyNDkzNzY2ZjEwZjAw/lenovo-laptops-ideapad-5-15-amd-hero.png?width=584&height=584",
    variants: [{ basePrice: 12500 }],
  }),
  mkDevice({
    brand: 'Lenovo', modelName: 'Yoga Slim 7 Series', slug: 'lenovo-yoga-slim-7-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Mid-range',
    imageUrl:"https://p4-ofp.static.pub/fes/cms/2022/12/13/04b3yhkiiyzb6c7r9ytmeapk2gab7k473844.png?width=584&height=584",
    variants: [{ basePrice: 26500 }],
  }),
  mkDevice({
    brand: 'Lenovo', modelName: 'Lenovo LOQ Series', slug: 'lenovo-lenovo-loq-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Gaming',
    gpuType: 'NVIDIA GTX 1650', isGaming: true,
    imageUrl:"https://p4-ofp.static.pub//fes/cms/2025/04/17/en7nidvno2nflsqys5ihvosme1xpyf766335.png?width=584&height=584",
    variants: [{ basePrice: 27570 }],
  }),
  mkDevice({
    brand: 'Lenovo', modelName: 'Legion 5i Series', slug: 'lenovo-legion-5i-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Gaming',
    gpuType: 'NVIDIA GTX 1650', isGaming: true,
    imageUrl:"https://p3-ofp.static.pub//fes/cms/2025/04/14/86ba6wyzf50x49nryinkfaw1cutbl4987419.png?width=584&height=584",
    variants: [{ basePrice: 35000 }],
  }),
  mkDevice({
    brand: 'Lenovo', modelName: 'Legion Slim 5 Series', slug: 'lenovo-legion-slim-5-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Gaming',
    gpuType: 'NVIDIA GTX 1650', isGaming: true,
    imageUrl:"https://store.lenovo.com/media/catalog/product/cache/74c1057f7991b4edb2bc7bdaa94de933/8/2/82Y9008MIN-0.webp",
    variants: [{ basePrice: 29000 }],
  }),
  mkDevice({
    brand: 'Lenovo', modelName: 'Legion Slim 5i Series', slug: 'lenovo-legion-slim-5i-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Gaming',
    gpuType: 'NVIDIA RTX 3050', isGaming: true,
    imageUrl:"https://store.lenovo.com/media/catalog/product/cache/74c1057f7991b4edb2bc7bdaa94de933/8/2/82YA00DXIN-0_1.webp",
    variants: [{ basePrice: 38000 }],
  }),
  mkDevice({
    brand: 'Lenovo', modelName: 'Legion 5i Pro Series', slug: 'lenovo-legion-5i-pro-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Gaming',
    gpuType: 'NVIDIA RTX 3050', isGaming: true,
    imageUrl:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSScVmg07xqMkJ7MoOMkZrEk7_5TGU_XbQLoqvdpVORUlyBeE1Pe4PJ&usqp=CAE&s",
    variants: [{ basePrice: 43000 }],
  }),
  mkDevice({
    brand: 'Lenovo', modelName: 'Legion Pro 5 Series', slug: 'lenovo-legion-pro-5-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Gaming',
    gpuType: 'NVIDIA RTX 3050', isGaming: true,
    imageUrl:"https://m.media-amazon.com/images/I/41vtBjJ4iLL._SX300_SY300_QL70_FMwebp_.jpg",
    variants: [{ basePrice: 40000 }],
  }),
  mkDevice({
    brand: 'Lenovo', modelName: 'Legion Pro 5i Series', slug: 'lenovo-legion-pro-5i-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Gaming',
    gpuType: 'NVIDIA RTX 3050', isGaming: true,
    imageUrl:"https://m.media-amazon.com/images/I/41NLrLJCDfL._SX450_.jpg",
    variants: [{ basePrice: 39000 }],
  }),
  mkDevice({
    brand: 'Lenovo', modelName: 'Legion Pro 7i Series', slug: 'lenovo-legion-pro-7i-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Gaming',
    gpuType: 'NVIDIA RTX 3050', isGaming: true,
    imageUrl:"https://ea-unboxed-assets.croma.com/cromaunboxed-as/2025/06/Lenovo-Legion.jpg",
    variants: [{ basePrice: 50000 }],
  }),
  mkDevice({
    brand: 'Lenovo', modelName: 'IdeaPad 300 Series', slug: 'lenovo-ideapad-300-series',
    processorFamily: 'Intel Core i3', generation: '10th Gen', tier: 'Budget',
    imageUrl:"https://m.media-amazon.com/images/I/41etlllgxWL._SX300_SY300_QL70_FMwebp_.jpg",
    variants: [{ basePrice: 11480 }],
  }),
  mkDevice({
    brand: 'Lenovo', modelName: 'IdeaPad 500 Series', slug: 'lenovo-ideapad-500-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Budget',
    imageUrl:"https://m.media-amazon.com/images/I/41g8fpzs7SL._SY300_SX300_QL70_FMwebp_.jpg",
    variants: [{ basePrice: 6310 }],
  }),
  mkDevice({
    brand: 'Lenovo', modelName: 'Thinkpad T Series', slug: 'lenovo-thinkpad-t-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Budget',
    imageUrl:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRVWbVSPGjaqGfVYS81JX4bYfUZK08n2MLdL4wiU_W8-t2C_DQ-xWMf&usqp=CAE&s=10",
    variants: [{ basePrice: 6050 }],
  }),
  mkDevice({
    brand: 'Lenovo', modelName: 'IdeaPad 100 Series', slug: 'lenovo-ideapad-100-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Budget',
    imageUrl:"https://m.media-amazon.com/images/I/41tYtRKoxdL._SX300_SY300_QL70_FMwebp_.jpg",
    variants: [{ basePrice: 4970 }],
  }),
  mkDevice({
    brand: 'Lenovo', modelName: 'IdeaPad S Series', slug: 'lenovo-ideapad-s-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Budget',
    imageUrl:"https://s3bg.cashify.in/gpro/uploads/2022/02/02163041/lenovo-ideapad-s145-81n30063in-amd-dual-core-a6-4-gb-1-tb-windows-10-front.jpg",
    variants: [{ basePrice: 5540 }],
  }),
  mkDevice({
    brand: 'Lenovo', modelName: 'Yoga 500 Series', slug: 'lenovo-yoga-500-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Budget',
    imageUrl:"https://m.media-amazon.com/images/I/41C5nJOuCNL._SY300_SX300_QL70_FMwebp_.jpg",
    variants: [{ basePrice: 10020 }],
  }),
  mkDevice({
    brand: 'Lenovo', modelName: 'Thinkpad L Series', slug: 'lenovo-thinkpad-l-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Budget',
    imageUrl:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTS8yeh83vE6bMFUZhXwXo1s30KU8YBGvjgtCn9KDeTm3_ZUtRhdn-J&usqp=CAE&s",
    variants: [{ basePrice: 8690 }],
  }),
  mkDevice({
    brand: 'Lenovo', modelName: 'Lenovo Y Series', slug: 'lenovo-lenovo-y-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Budget',
    imageUrl:"https://sell.gameloot.in/wp-content/uploads/sites/4/2023/06/Legion-Y-Series.jpg",
    variants: [{ basePrice: 18780 }],
  }),
  mkDevice({
    brand: 'Lenovo', modelName: 'IdeaPad Flex Series', slug: 'lenovo-ideapad-flex-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Budget',
    imageUrl:"https://m.media-amazon.com/images/I/411NQZh2-WL._SX300_SY300_QL70_FMwebp_.jpg",
    variants: [{ basePrice: 6700 }],
  }),
  mkDevice({
    brand: 'Lenovo', modelName: 'Thinkpad E Series', slug: 'lenovo-thinkpad-e-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Budget',
    imageUrl:"https://p1-ofp.static.pub/fes/cms/2022/06/13/j441bogmj1kgvzityaj2l0fbj9j3w2877901.png",
    variants: [{ basePrice: 11880 }],
  }),
  mkDevice({
    brand: 'Lenovo', modelName: 'IdeaPad Slim 3i Series', slug: 'lenovo-ideapad-slim-3i-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Budget',
    imageUrl:"https://p2-ofp.static.pub//fes/cms/2023/07/17/cb33s6cv4scvgl4k2mxwpjhnmqfjgg628756.png?width=584&height=584",
    variants: [{ basePrice: 17330 }],
  }),
  mkDevice({
    brand: 'Lenovo', modelName: 'Lenovo V Series', slug: 'lenovo-lenovo-v-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Budget',
    imageUrl:"https://p3-ofp.static.pub/fes/cms/2022/04/27/ymk2fxg7phtdyurukrv0ve5g7ki9zf976248.png",
    variants: [{ basePrice: 6380 }],
  }),
  mkDevice({
    brand: 'Lenovo', modelName: 'Thinkpad X Series', slug: 'lenovo-thinkpad-x-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Budget',
    imageUrl:"https://p2-ofp.static.pub//fes/cms/2025/03/10/kgr82s60h3y67rc4xirhwivdalq4vd087219.png?width=584&height=584",
    variants: [{ basePrice: 7330 }],
  }),
  mkDevice({
    brand: 'Lenovo', modelName: 'Thinkpad Edge Series', slug: 'lenovo-thinkpad-edge-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Gaming',
    gpuType: 'NVIDIA GTX 1650', isGaming: true,
    imageUrl:"https://m.media-amazon.com/images/I/31pRSJSIfRL._QL70_FMwebp_.jpg",
    variants: [{ basePrice: 5110 }],
  }),
  mkDevice({
    brand: 'Lenovo', modelName: 'Lenovo 300e Series', slug: 'lenovo-lenovo-300e-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Budget',
    imageUrl:"https://m.media-amazon.com/images/I/51XCSzmTWxL._SX450_.jpg",
    variants: [{ basePrice: 5690 }],
  }),
  mkDevice({
    brand: 'Lenovo', modelName: 'Legion Series', slug: 'lenovo-legion-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Gaming',
    gpuType: 'NVIDIA GTX 1650', isGaming: true,
    imageUrl:"https://p4-ofp.static.pub/fes/cms/2021/07/08/pj875ufawa6ucz6w8r86rw8vxfdfpi966149.png",
    variants: [{ basePrice: 16870 }],
  }),
  mkDevice({
    brand: 'Lenovo', modelName: 'Lenovo N Series', slug: 'lenovo-lenovo-n-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Budget',
    imageUrl:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-8BHIFzwLXePrrMivVdIOEj5KEfzkq_uetKtkdWExZ6zrOiNA1uL2&usqp=CAE&s=10",
    variants: [{ basePrice: 4490 }],
  }),
  mkDevice({
    brand: 'Lenovo', modelName: 'Lenovo 500e Series', slug: 'lenovo-lenovo-500e-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Budget',
    imageUrl:"https://m.media-amazon.com/images/I/41ihfPa19oL._SY300_SX300_QL70_FMwebp_.jpg",
    variants: [{ basePrice: 3980 }],
  }),
  mkDevice({
    brand: 'Lenovo', modelName: 'Yoga 700 Series', slug: 'lenovo-yoga-700-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Budget',
    imageUrl:"https://m.media-amazon.com/images/I/31ImAh5oxbL._SX300_SY300_QL70_FMwebp_.jpg",
    variants: [{ basePrice: 10340 }],
  }),
  mkDevice({
    brand: 'Lenovo', modelName: 'IdeaPad Gaming Series', slug: 'lenovo-ideapad-gaming-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Gaming',
    gpuType: 'NVIDIA GTX 1650', isGaming: true,
    imageUrl:"https://p3-ofp.static.pub/fes/cms/2022/08/09/7qvsigpnl8y23o9w8vdxoiuvvpamnl408276.png",
    variants: [{ basePrice: 20110 }],
  }),
  mkDevice({
    brand: 'Lenovo', modelName: 'Thinkpad A Series', slug: 'lenovo-thinkpad-a-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Budget',
    imageUrl:"https://p3-ofp.static.pub/ShareResource/na/brands/thinkpad/cards/lenovo-build-your-own-laptop-desktop.png",
    variants: [{ basePrice: 5490 }],
  }),
  mkDevice({
    brand: 'Lenovo', modelName: 'Yoga 900 Series', slug: 'lenovo-yoga-900-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Budget',
    imageUrl:"https://m.media-amazon.com/images/I/41ZQIElrlhL._SY450_.jpg",
    variants: [{ basePrice: 10340 }],
  }),
  mkDevice({
    brand: 'Lenovo', modelName: 'IdeaPad D Series', slug: 'lenovo-ideapad-d-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Budget',
    imageUrl:"https://p2-ofp.static.pub/fes/cms/2022/04/27/1rrgf97bmkue4l0wwj869lmgdlilit373371.png",
    variants: [{ basePrice: 5950 }],
  }),
  mkDevice({
    brand: 'Lenovo', modelName: 'Thinkpad Twist Series', slug: 'lenovo-thinkpad-twist-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Budget',
    imageUrl:"https://m.media-amazon.com/images/I/41-ve5MKs-L._SX300_SY300_QL70_FMwebp_.jpg",
    variants: [{ basePrice: 6460 }],
  }),
  mkDevice({
    brand: 'Lenovo', modelName: 'IdeaPad 700 Series', slug: 'lenovo-ideapad-700-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Budget',
    imageUrl:"https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcQF_V5vMUJ6TfFajYnge8iFRbA5KPrB1SkRFIWjL4YWt5h43M2wAQ-VKZXcPHcegPiwdW1cEaCDQlqwZ7sOl50F2lJ9q1XIMITnw44bY2joWIwHf2kBow0849o",
    variants: [{ basePrice: 6980 }],
  }),
  mkDevice({
    brand: 'Lenovo', modelName: 'Yoga C Series', slug: 'lenovo-yoga-c-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Budget',
    imageUrl:"https://store.lenovo.com/media/catalog/product/cache/74c1057f7991b4edb2bc7bdaa94de933/8/1/81UE0085IN-0.webp",
    variants: [{ basePrice: 4680 }],
  }),
  mkDevice({
    brand: 'Lenovo', modelName: 'Thinkpad 11e Series', slug: 'lenovo-thinkpad-11e-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Budget',
    imageUrl:"https://m.media-amazon.com/images/I/51Sj+jFvynL._SY450_.jpg",
    variants: [{ basePrice: 5590 }],
  }),
  mkDevice({
    brand: 'Lenovo', modelName: 'Legion 5 Series', slug: 'lenovo-legion-5-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Gaming',
    gpuType: 'NVIDIA GTX 1650', isGaming: true,
    imageUrl:"https://p3-ofp.static.pub/fes/cms/2022/04/27/o6f4g2evxrt9cji1pra9fae1952aa9541355.png",
    variants: [{ basePrice: 21860 }],
  }),
  mkDevice({
    brand: 'Lenovo', modelName: 'IdeaPad Slim 5i Series', slug: 'lenovo-ideapad-slim-5i-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Budget',
    imageUrl:"https://p1-ofp.static.pub//fes/cms/2024/11/19/8ab5hkph8g71yii4aeigbvjaydhgj6544957.png?width=584&height=584",
    variants: [{ basePrice: 22250 }],
  }),
  mkDevice({
    brand: 'Lenovo', modelName: 'ThinkBook Series', slug: 'lenovo-thinkbook-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Budget',
    imageUrl:"https://p4-ofp.static.pub//fes/cms/2025/02/07/9ghwwe9a4ne13xlz8hjoos3huovcus197477.png",
    variants: [{ basePrice: 5850 }],
  }),
  mkDevice({
    brand: 'Lenovo', modelName: 'Thinkpad P Series', slug: 'lenovo-thinkpad-p-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Budget',
    imageUrl:"https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcQCOQ31bbBn3icZ7pbB2VuMYoAZBfSjE_y7UnxY0w3SoGKIqzT25GyyIhU5Gzky-lGOAb0wOyUDTfT-gJ_h0K2-oAXnE-a3iQ",
    variants: [{ basePrice: 7620 }],
  }),
  mkDevice({
    brand: 'Lenovo', modelName: 'Lenovo 100e Series', slug: 'lenovo-lenovo-100e-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Budget',
    imageUrl:"https://m.media-amazon.com/images/I/41-WIyeKVqL._SY300_SX300_QL70_FMwebp_.jpg",
    variants: [{ basePrice: 3980 }],
  }),
  mkDevice({
    brand: 'Lenovo', modelName: 'Lenovo 11e Series', slug: 'lenovo-lenovo-11e-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Budget',
    imageUrl:"https://m.media-amazon.com/images/I/415ZyO0ZT4L._SX300_SY300_QL70_FMwebp_.jpg",
    variants: [{ basePrice: 2880 }],
  }),
  mkDevice({
    brand: 'Lenovo', modelName: 'Thinkpad Helix Series', slug: 'lenovo-thinkpad-helix-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Budget',
    imageUrl:"https://m.media-amazon.com/images/I/41BOQCyQKsL._SY300_SX300_QL70_FMwebp_.jpg",
    variants: [{ basePrice: 6080 }],
  }),
  mkDevice({
    brand: 'Lenovo', modelName: 'IdeaPad 900 Series', slug: 'lenovo-ideapad-900-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Budget',
    imageUrl:"https://s3ng.cashify.in/cashify/product/img/xxhdpi/fea02341-b36e.jpg",
    variants: [{ basePrice: 10520 }],
  }),
  mkDevice({
    brand: 'Lenovo', modelName: 'Legion 7 Series', slug: 'lenovo-legion-7-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Gaming',
    gpuType: 'NVIDIA GTX 1650', isGaming: true,
    imageUrl:"https://p1-ofp.static.pub/fes/cms/2022/08/04/m17ckukv02qkh6zql6qvi9uxzvgm7e864922.png",
    variants: [{ basePrice: 32850 }],
  }),
  mkDevice({
    brand: 'Lenovo', modelName: 'Student Chromebooks', slug: 'lenovo-student-chromebooks',
    processorFamily: 'Intel Core i3', generation: '10th Gen', tier: 'Budget',
    imageUrl:"https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcQVrRyzjkDX6G4VruDTj-1HRT2Ven16ukMKUjufL4T2E6qVBhtwbRi8PPBBkbdvGn3VMF5It_JngNxK0oAzdcu2A1LB1_9qAUPoQwPdZFepfMUDuCoIJgf4",
    variants: [{ basePrice: 1320 }],
  }),
  mkDevice({
    brand: 'Lenovo', modelName: 'Other Lenovo Series', slug: 'lenovo-other-lenovo-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Budget',
    imageUrl:"https://p3-ofp.static.pub//fes/cms/2025/12/16/wmwv5thm8yo741eqcpx17u5yzz98sq877928.png?width=584&height=584",
    variants: [{ basePrice: 4410 }],
  }),
  mkDevice({
    brand: 'Lenovo', modelName: 'Legion 9i Series', slug: 'lenovo-legion-9i-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Gaming',
    gpuType: 'NVIDIA RTX 4060', isGaming: true,
    imageUrl:"https://p3-ofp.static.pub//fes/cms/2026/06/05/dx5oymmnw26rq50qk1j3tjxmzrcfgn505196.png?width=1200&height=1200",
    variants: [{ basePrice: 60000 }],
  }),
  mkDevice({
    brand: 'Lenovo', modelName: 'Yoga 6 Series', slug: 'lenovo-yoga-6-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Mid-range',
    imageUrl:"https://p1-ofp.static.pub/medias/bWFzdGVyfHJvb3R8NTQ0NjE4fGltYWdlL3BuZ3xoN2EvaGJkLzEzMjM0NzM2ODU3MTE4LnBuZ3xkNmNlNmNmZTNiNTU4MjJkZDhmZGYxNDA2ZGExMWIxNDJmY2JhMTA4ZmIzMmRmMmFiMjE2MDBiZGUyYmRmMDVj/lenovo-laptops-yoga-6-gen-7-13-amd-hero.png",
    variants: [{ basePrice: 25000 }],
  }),
  mkDevice({
    brand: 'Lenovo', modelName: 'Yoga Slim 6i Series', slug: 'lenovo-yoga-slim-6i-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Mid-range',
    imageUrl:"https://p2-ofp.static.pub/fes/cms/2023/04/28/nh649mz48m373olk9ep0q06xob0t01480398.png",
    variants: [{ basePrice: 30000 }],
  }),
  mkDevice({
    brand: 'Lenovo', modelName: 'Yoga 7 Series', slug: 'lenovo-yoga-7-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Mid-range',
    imageUrl:"https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRofI6pBDW2Hqbr595bzzlpxFcjCH5SbkeIJtBsMJpD1TN_CMeh_boUYq_GkvWAtQeJWH09nidUrWVbMJJgE3IYEdCK55Z7yu-PiCZRQShN892rEP2t6GvlnOs",
    variants: [{ basePrice: 26000 }],
  }),
  mkDevice({
    brand: 'Lenovo', modelName: 'Yoga 7i Series', slug: 'lenovo-yoga-7i-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Mid-range',
    imageUrl:"https://p2-ofp.static.pub/fes/cms/2025/04/03/ocokuaha01uxuu174rylwkkngccgnv383641.jpg",
    variants: [{ basePrice: 35000 }],
  }),
  mkDevice({
    brand: 'Lenovo', modelName: 'Yoga Pro 7i Series', slug: 'lenovo-yoga-pro-7i-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Mid-range',
    imageUrl:"https://p4-ofp.static.pub/ShareResource/optimized/pdp/yoga/yoga-pro-series/len101y0058/yoga-pro-7i-gen-10-aura-edition-14-intel.6814d92792b00e5d.png?width=584&height=584",
    variants: [{ basePrice: 40000 }],
  }),
  mkDevice({
    brand: 'Lenovo', modelName: 'Yoga Slim 7i Series', slug: 'lenovo-yoga-slim-7i-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Mid-range',
    imageUrl:"https://p2-ofp.static.pub/fes/cms/2025/04/03/ocokuaha01uxuu174rylwkkngccgnv383641.jpg",
    variants: [{ basePrice: 38000 }],
  }),
  mkDevice({
    brand: 'Lenovo', modelName: 'Yoga 9i Series', slug: 'lenovo-yoga-9i-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Mid-range',
    imageUrl:"https://s3ng.cashify.in/cashify/product/img/xxhdpi/aaf06396-fd7a.jpg",
    variants: [{ basePrice: 50000 }],
  }),
  mkDevice({
    brand: 'Lenovo', modelName: 'Yoga Book 9i Series', slug: 'lenovo-yoga-book-9i-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Mid-range',
    imageUrl:"https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcRfrMUzrps_yMKGj5Iy72ovflsPKYuYyzXnhdHYTLxUgNx9O1Ok6r-6FKaSEn8-xkfM2JtzD0PYDw9gWcNqULWnuu-pIhfwNw",
    variants: [{ basePrice: 55000 }],
  }),
  mkDevice({
    brand: 'Lenovo', modelName: 'Thinkpad X1 Series', slug: 'lenovo-thinkpad-x1-series',
    processorFamily: 'Intel Core i7', generation: '11th Gen', tier: 'Mid-range',
    imageUrl:"https://p4-ofp.static.pub//fes/cms/2025/02/21/nve0lcn16t4g80h4i0z3kk36teytcd686357.png?width=584&height=584",
    variants: [{ basePrice: 30000 }],
  }),
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    await Device.deleteMany({ category: 'laptop', brand: 'Lenovo' });
    console.log('Cleared existing Lenovo laptop devices');
    await Device.insertMany(devices);
    console.log(`✅ Seeded ${devices.length} Lenovo laptop devices successfully`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  }
}

seed();