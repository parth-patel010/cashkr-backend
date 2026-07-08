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
  //  ACER — All Series
  // ══════════════════════════════════════════════════════
  mkDevice({
    brand: 'Acer', modelName: 'TravelMate P4 Series', slug: 'acer-travelmate-p4-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Budget',
    imageUrl:"https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcRClC_0Bh0jI2-VaO42DaXs49muExgjVIprJdHj23mWuufu3WEVUm7CMu9xD848cMlMzadaGb0n96Df--9STpev4cijK92h7-hietecBrqsdJU0G7riff0a",
    variants: [{ basePrice: 17000 }],
  }),
  mkDevice({
    brand: 'Acer', modelName: 'TravelMate P2 Series', slug: 'acer-travelmate-p2-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Budget',
    imageUrl:"https://m.media-amazon.com/images/I/41uH26r-zML._SX300_SY300_QL70_FMwebp_.jpg",
    variants: [{ basePrice: 15000 }],
  }),
  mkDevice({
    brand: 'Acer', modelName: 'TravelMate P6 Series', slug: 'acer-travelmate-p6-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Budget',
    imageUrl:"https://m.media-amazon.com/images/I/71y2OudJ4QL._SX450_.jpg",
    variants: [{ basePrice: 19000 }],
  }),
  mkDevice({
    brand: 'Acer', modelName: 'Aspire Series', slug: 'acer-aspire-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Budget',
    imageUrl:"https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcQtATE35b03HbhpA4AMH2CQEMToMe4h9le3crThwYHd7iPy0YwolWMsWhc74Lo1JNy098NnI10rtsuJBhD8VhwedYsqfIyZrM5NHh1rBbSCPziwoWzvicVFBw",
    variants: [{ basePrice: 7670 }],
  }),
  mkDevice({
    brand: 'Acer', modelName: 'Aspire One Series', slug: 'acer-aspire-one-series',
    processorFamily: 'Intel Core i3', generation: '10th Gen', tier: 'Budget',
    imageUrl:"https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcSd4GwKPzuLQlv2rFZagyAqkjUDLXCS6rwyn_LnGh0vA_jV40nzIWjl5Fjmt9bYm3nrEGLX9Fvd94CEg3KH_wtoRk_P-30uBEBnhHYxzxpUgtzj-R3jHwk6",
    variants: [{ basePrice: 3570 }],
  }),
  mkDevice({
    brand: 'Acer', modelName: 'Aspire E Series', slug: 'acer-aspire-e-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Budget',
    imageUrl:"https://m.media-amazon.com/images/I/61Yeir0uhIL._SX450_.jpg",
    variants: [{ basePrice: 9240 }],
  }),
  mkDevice({
    brand: 'Acer', modelName: 'Aspire 5 Series', slug: 'acer-aspire-5-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Budget',
    imageUrl:"https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcQtATE35b03HbhpA4AMH2CQEMToMe4h9le3crThwYHd7iPy0YwolWMsWhc74Lo1JNy098NnI10rtsuJBhD8VhwedYsqfIyZrM5NHh1rBbSCPziwoWzvicVFBw",
    variants: [{ basePrice: 13740 }],
  }),
  mkDevice({
    brand: 'Acer', modelName: 'Aspire 3 Series', slug: 'acer-aspire-3-series',
    processorFamily: 'Intel Core i3', generation: '10th Gen', tier: 'Budget',
    imageUrl:"https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcTvlL7_wY2SM5UlEzeTBuBz741cOiXn9M6wOMaLE9J4UMD2eOH8wEuKUsfG3ggiWk0FwzapQaCHLkc42YQr5bSqNvjoEff_i1kgbw9P0og5",
    variants: [{ basePrice: 8320 }],
  }),
  mkDevice({
    brand: 'Acer', modelName: 'Predator Series', slug: 'acer-predator-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Gaming',
    gpuType: 'NVIDIA GTX 1650', isGaming: true,
    imageUrl:"https://rukmini1.flixcart.com/image/1500/1500/xif0q/computer/t/y/4/-original-imahg5fxfzumjkgw.jpeg?q=70",
    variants: [{ basePrice: 13980 }],
  }),
  mkDevice({
    brand: 'Acer', modelName: 'Switch Series', slug: 'acer-switch-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Budget',
    imageUrl:"https://m.media-amazon.com/images/I/81TlsM5G-WL._SX450_.jpg",
    variants: [{ basePrice: 11070 }],
  }),
  mkDevice({
    brand: 'Acer', modelName: 'Nitro Spin Series', slug: 'acer-nitro-spin-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Gaming',
    gpuType: 'NVIDIA GTX 1650', isGaming: true,
    imageUrl:"https://m.media-amazon.com/images/I/51IHlIuwUdL._SX450_.jpg",
    variants: [{ basePrice: 13320 }],
  }),
  mkDevice({
    brand: 'Acer', modelName: 'Spin Series', slug: 'acer-spin-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Budget',
    imageUrl:"https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcQilSTRf7WMDXJLrwQHW_Bd69iVXDvI1vAQynkwUWjEmVfjGOBVjmIuMX_ouxaoGLScWPFrSKvNfhvqoxYkEJRjDXNkUglxg6xbEB5g0QwBuARgh9WZz0QM",
    variants: [{ basePrice: 11070 }],
  }),
  mkDevice({
    brand: 'Acer', modelName: 'Acer Chromebook Series', slug: 'acer-acer-chromebook-series',
    processorFamily: 'Intel Core i3', generation: '10th Gen', tier: 'Budget',
    imageUrl:"https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcSuor8upVZ0oaLLB6OjxO8Ei9xc-W-2cvwW55qFKwbj8O0Gn_1JRt5VaLuau0FDciSjf1KAvfUeTrHhoDOv98VE4U2KTR8veFG2qcgyqaixYoaiTEMp6Q86pmI",
    variants: [{ basePrice: 3860 }],
  }),
  mkDevice({
    brand: 'Acer', modelName: 'Swift Series', slug: 'acer-swift-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Budget',
    imageUrl:"https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcS14Lpoc25AWa1d1tCs165YX-hK9qh8aZa2busf-WJRK5ZQzGzCJRke230eRNIHxOIVlRAltK6XuIk0ncCWopx2DA3hDw-2qY_rtmZkv-Bt1ZKxrZuOsK7OIA",
    variants: [{ basePrice: 11640 }],
  }),
  mkDevice({
    brand: 'Acer', modelName: 'Nitro 5 Series', slug: 'acer-nitro-5-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Gaming',
    gpuType: 'NVIDIA GTX 1650', isGaming: true,
    imageUrl:"https://rukmini1.flixcart.com/image/1500/1500/xif0q/computer/r/n/z/-original-imahg53uepphapgp.jpeg?q=70",
    variants: [{ basePrice: 15390 }],
  }),
  mkDevice({
    brand: 'Acer', modelName: 'Aspire 7 Series', slug: 'acer-aspire-7-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Budget',
    imageUrl:"https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRL5fjoKzW3LA5dlLeYMoeFgmXEQj-LtkPUCXhwQ6hU5kq93PO9Ta1dbwQEt3l6Car8vuR5CQDBK6LsHgwUDO3YmceXtvlUvRkCOeqfug4",
    variants: [{ basePrice: 17140 }],
  }),
  mkDevice({
    brand: 'Acer', modelName: 'Predator Helios 300 Series', slug: 'acer-predator-helios-300-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Gaming',
    gpuType: 'NVIDIA GTX 1650', isGaming: true,
    imageUrl:"https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcT9r7grCnaXxTKWHf8l7AhTJKoG4VPGXww4U4K8UcfMlz6vB3TXjPz6npFjQxF5QkJKmVtWr-4mdpX8wD8_hh2Jpq9wgVTqJWAlbBsZx8JkMbvr0Lnm_Zp-yQ",
    variants: [{ basePrice: 20930 }],
  }),
  mkDevice({
    brand: 'Acer', modelName: 'Swift 5 Series', slug: 'acer-swift-5-series',
    processorFamily: 'Intel Core i7', generation: '11th Gen', tier: 'Budget',
    imageUrl:"https://sell.gameloot.in/wp-content/uploads/sites/4/2023/05/Acer-Swift.jpg",
    variants: [{ basePrice: 19610 }],
  }),
  mkDevice({
    brand: 'Acer', modelName: 'Extensa Series', slug: 'acer-extensa-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Budget',
    imageUrl:"https://m.media-amazon.com/images/I/71IfO70KcRL._SY450_.jpg",
    variants: [{ basePrice: 5000 }],
  }),
  mkDevice({
    brand: 'Acer', modelName: 'Swift 3 Series', slug: 'acer-swift-3-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Budget',
    imageUrl:"https://rukminim2.flixcart.com/image/1500/1500/k33c4nk0pkrrdj/computer/y/h/k/acer-na-thin-and-light-laptop-original-imafhnvjheyngmvq.jpeg",
    variants: [{ basePrice: 9170 }],
  }),
  mkDevice({
    brand: 'Acer', modelName: 'Nitro 5 Spin Series', slug: 'acer-nitro-5-spin-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Gaming',
    gpuType: 'NVIDIA GTX 1650', isGaming: true,
    imageUrl:"https://rukminim2.flixcart.com/image/767/767/j8j32q80/computer/p/u/g/acer-na-laptop-original-imaeygxsxvayw4dv.jpeg?q=90",
    variants: [{ basePrice: 15100 }],
  }),
  mkDevice({
    brand: 'Acer', modelName: 'Spin 1 Series', slug: 'acer-spin-1-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Budget',
    imageUrl:"https://rukminim2.flixcart.com/image/767/767/jcatwnk0/computer/r/y/c/acer-na-2-in-1-laptop-original-imaffggfw3awgshr.jpeg?q=90",
    variants: [{ basePrice: 4240 }],
  }),
  mkDevice({
    brand: 'Acer', modelName: 'Spin 5 Series', slug: 'acer-spin-5-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Budget',
    imageUrl:"https://m.media-amazon.com/images/I/71SRGiilaeL.jpg",
    variants: [{ basePrice: 9840 }],
  }),
  mkDevice({
    brand: 'Acer', modelName: 'Switch 5 Series', slug: 'acer-switch-5-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Budget',
    imageUrl:"https://m.media-amazon.com/images/I/71+1xeyzpOL._SX450_.jpg",
    variants: [{ basePrice: 11620 }],
  }),
  mkDevice({
    brand: 'Acer', modelName: 'Spin 3 Series', slug: 'acer-spin-3-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Budget',
    imageUrl:"https://m.media-amazon.com/images/I/51Naqxb6QdL.jpg",
    variants: [{ basePrice: 8320 }],
  }),
  mkDevice({
    brand: 'Acer', modelName: 'Predator 15 Series', slug: 'acer-predator-15-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Gaming',
    gpuType: 'NVIDIA GTX 1650', isGaming: true,
    imageUrl:"https://m.media-amazon.com/images/I/61LRL0g2YCL._SL1186_.jpg",
    variants: [{ basePrice: 16860 }],
  }),
  mkDevice({
    brand: 'Acer', modelName: 'Nitro 7 Series', slug: 'acer-nitro-7-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Gaming',
    gpuType: 'NVIDIA GTX 1650', isGaming: true,
    imageUrl:"https://m.media-amazon.com/images/I/7103xmi76tL._SX450_.jpg",
    variants: [{ basePrice: 15910 }],
  }),
  mkDevice({
    brand: 'Acer', modelName: 'Spin 7 Series', slug: 'acer-spin-7-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Budget',
    imageUrl:"https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcQilSTRf7WMDXJLrwQHW_Bd69iVXDvI1vAQynkwUWjEmVfjGOBVjmIuMX_ouxaoGLScWPFrSKvNfhvqoxYkEJRjDXNkUglxg6xbEB5g0QwBuARgh9WZz0QM",
    variants: [{ basePrice: 17240 }],
  }),
  mkDevice({
    brand: 'Acer', modelName: 'Swift 7 Series', slug: 'acer-swift-7-series',
    processorFamily: 'Intel Core i7', generation: '11th Gen', tier: 'Budget',
    imageUrl:"https://m.media-amazon.com/images/I/71cWS3cKOlL._SX450_.jpg",
    variants: [{ basePrice: 18920 }],
  }),
  mkDevice({
    brand: 'Acer', modelName: 'Swift X Series', slug: 'acer-swift-x-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Budget',
    imageUrl:"https://rukminim2.flixcart.com/image/1500/1500/xif0q/computer/w/8/t/-original-imahg53xmasfkp5p.jpeg",
    variants: [{ basePrice: 18190 }],
  }),
  mkDevice({
    brand: 'Acer', modelName: 'Swift 3x Series', slug: 'acer-swift-3x-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Budget',
    imageUrl:"https://m.media-amazon.com/images/I/71dHK36oISL._SX450_.jpg",
    variants: [{ basePrice: 21510 }],
  }),
  mkDevice({
    brand: 'Acer', modelName: 'ConceptD 3 Series', slug: 'acer-conceptd-3-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Mid-range',
    imageUrl:"https://m.media-amazon.com/images/I/61aXEf+PtZL._SX450_.jpg",
    variants: [{ basePrice: 26730 }],
  }),
  mkDevice({
    brand: 'Acer', modelName: 'ConceptD 5 Series', slug: 'acer-conceptd-5-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Mid-range',
    imageUrl:"https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcTYlhNj61Lr7VhxeYuikHzhqJXozE9m9c7Rn5Fi4LELSynQO0XtWQBbPaN-K__zK6yI2BJQADUa0DARtKvct8R7fWU25e0OHScSItYrFzVf",
    variants: [{ basePrice: 28290 }],
  }),
  mkDevice({
    brand: 'Acer', modelName: 'ConceptD 7 Series', slug: 'acer-conceptd-7-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Mid-range',
    imageUrl:"https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcTYlhNj61Lr7VhxeYuikHzhqJXozE9m9c7Rn5Fi4LELSynQO0XtWQBbPaN-K__zK6yI2BJQADUa0DARtKvct8R7fWU25e0OHScSItYrFzVf",
    variants: [{ basePrice: 30670 }],
  }),
  mkDevice({
    brand: 'Acer', modelName: 'ConceptD 9 Series', slug: 'acer-conceptd-9-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Mid-range',
    imageUrl:"https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcTYlhNj61Lr7VhxeYuikHzhqJXozE9m9c7Rn5Fi4LELSynQO0XtWQBbPaN-K__zK6yI2BJQADUa0DARtKvct8R7fWU25e0OHScSItYrFzVf",
    variants: [{ basePrice: 31780 }],
  }),
  mkDevice({
    brand: 'Acer', modelName: 'Predator Triton 300 Series', slug: 'acer-predator-triton-300-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Gaming',
    gpuType: 'NVIDIA GTX 1650', isGaming: true,
    imageUrl:"https://m.media-amazon.com/images/I/71f2UjwHudL._SY450_.jpg",
    variants: [{ basePrice: 18760 }],
  }),
  mkDevice({
    brand: 'Acer', modelName: 'Predator Triton 500 Series', slug: 'acer-predator-triton-500-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Gaming',
    gpuType: 'NVIDIA GTX 1650', isGaming: true,
    imageUrl:"https://m.media-amazon.com/images/I/81AMg8-9ccL.jpg",
    variants: [{ basePrice: 21130 }],
  }),
  mkDevice({
    brand: 'Acer', modelName: 'Predator Triton 700 Series', slug: 'acer-predator-triton-700-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Gaming',
    gpuType: 'NVIDIA GTX 1650', isGaming: true,
    imageUrl:"https://m.media-amazon.com/images/I/71rPBk98hhL._SX450_.jpg",
    variants: [{ basePrice: 21500 }],
  }),
  mkDevice({
    brand: 'Acer', modelName: 'Predator Triton 900 Series', slug: 'acer-predator-triton-900-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Gaming',
    gpuType: 'NVIDIA GTX 1650', isGaming: true,
    imageUrl:"https://m.media-amazon.com/images/I/71rPBk98hhL._SX450_.jpg",
    variants: [{ basePrice: 24230 }],
  }),
  mkDevice({
    brand: 'Acer', modelName: 'Predator Helios 500 Series', slug: 'acer-predator-helios-500-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Gaming',
    gpuType: 'NVIDIA GTX 1650', isGaming: true,
    imageUrl:"https://m.media-amazon.com/images/I/61fcP8nA9AL._SX450_.jpg",
    variants: [{ basePrice: 23730 }],
  }),
  mkDevice({
    brand: 'Acer', modelName: 'Predator Helios 700 Series', slug: 'acer-predator-helios-700-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Gaming',
    gpuType: 'NVIDIA GTX 1650', isGaming: true,
    imageUrl:"https://m.media-amazon.com/images/I/81LmTELYhIL._SX450_.jpg",
    variants: [{ basePrice: 28100 }],
  }),
  mkDevice({
    brand: 'Acer', modelName: 'Predator 17 Series', slug: 'acer-predator-17-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Gaming',
    gpuType: 'NVIDIA GTX 1650', isGaming: true,
    imageUrl:"https://rukminim2.flixcart.com/image/767/767/jiqb8nk0/computer/j/w/c/acer-na-gaming-laptop-original-imaf6gghtgtf6ezf.jpeg?q=90",
    variants: [{ basePrice: 17710 }],
  }),
  mkDevice({
    brand: 'Acer', modelName: 'Predator 21x Series', slug: 'acer-predator-21x-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Gaming',
    gpuType: 'NVIDIA GTX 1650', isGaming: true,
    imageUrl:"https://rukminim2.flixcart.com/image/767/767/j8ndea80/computer/v/v/8/acer-na-laptop-original-imaeymnpftbp3zac.jpeg?q=90",
    variants: [{ basePrice: 18660 }],
  }),
  mkDevice({
    brand: 'Acer', modelName: 'Other Acer Series', slug: 'acer-other-acer-series',
    processorFamily: 'Intel Core i5', generation: '10th Gen', tier: 'Budget',
    imageUrl:"https://m.media-amazon.com/images/I/71iUXY2S9jL._AC_UL480_FMwebp_QL65_.jpg",
    variants: [{ basePrice: 4240 }],
  }),
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    await Device.deleteMany({ category: 'laptop', brand: 'Acer' });
    console.log('Cleared existing Acer laptop devices');
    await Device.insertMany(devices);
    console.log(`✅ Seeded ${devices.length} Acer laptop devices successfully`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  }
}

seed();