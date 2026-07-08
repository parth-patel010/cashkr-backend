import mongoose from 'mongoose';

const variantSchema = new mongoose.Schema({
  processor: { type: String },    // "Intel Core i5", "AMD Ryzen 5"
  generation: { type: String },   // "10th Gen", "M1"
  storage: { type: String, required: true },
  ram: { type: String },          // "8GB", "16GB"
  storageType: { type: String },  // "SSD" or "HDD"
  basePrice: { type: Number, required: true },
}, { _id: false });

const deviceSchema = new mongoose.Schema({
  category: {
    type: String,
    enum: ['mobile', 'tablet', 'laptop', 'mac'],
    required: true,
    index: true,
  },
  brand: {
    type: String,
    required: true,
    index: true,
  },
  modelName: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  imageUrl: {
    type: String,
    default: '',
  },

  // Laptop-specific fields
  processorFamily: { type: String, default: '' },    // "Intel Core i5", "Apple M3", "AMD Ryzen 7"
  generation: { type: String, default: '' },         // "12th Gen", "M3", etc.
  gpuType: { type: String, default: '' },            // "Integrated", "NVIDIA RTX 4060"
  isGamingLaptop: { type: Boolean, default: false },
  tier: { type: String, default: '' },               // "Premium", "Mid-range", "Budget", "Gaming"

  variants: [variantSchema],

  // --- Shared multipliers (mobile uses these) ---
  conditionMultipliers: {
    likenew: { type: Number, default: 1.0 },
    good: { type: Number, default: 0.95 },
    average: { type: Number, default: 0.85 },
    belowAverage: { type: Number, default: 0.70 },
    fair: { type: Number, default: 0.72 },
    poor: { type: Number, default: 0.55 },
  },
  screenMultipliers: {
    // Shared / Mobile
    noScratch: { type: Number, default: 1.0 },
    minorScratch: { type: Number, default: 0.95 },
    crackedWorks: { type: Number, default: 0.75 },
    crackedBroken: { type: Number, default: 0.50 },
    // Laptop specific keys
    noIssue: { type: Number, default: 1.0 },
    deadPixels: { type: Number, default: 0.82 },
  },

  // Mobile-specific
  batteryDeductions: {
    above80: { type: Number, default: 0 },
    above60: { type: Number, default: 1000 },
    below60: { type: Number, default: 2500 },
  },

  // --- Laptop-specific multipliers ---
  ageMultipliers: {
    lessThan3: { type: Number, default: 1.0 },
    threeToEleven: { type: Number, default: 0.88 },
    aboveEleven: { type: Number, default: 0.75 },
    // Legacy support
    lessThan1: { type: Number, default: 0.92 },
    oneToTwo: { type: Number, default: 0.78 },
    twoToThree: { type: Number, default: 0.62 },
  },

  // Functional deductions — covers both mobile and laptop issues
  functionalDeductions: {
    // Mobile
    batteryLow: { type: Number, default: 2000 },
    cameraIssue: { type: Number, default: 3000 },
    speakerIssue: { type: Number, default: 1500 },
    biometricIssue: { type: Number, default: 4000 },
    chargingIssue: { type: Number, default: 1000 },
    // Laptop
    battery: { type: Number, default: 2000 },
    keyboard: { type: Number, default: 2500 },
    trackpad: { type: Number, default: 1500 },
    speakers: { type: Number, default: 1000 },
    webcam: { type: Number, default: 800 },
    ports: { type: Number, default: 1200 },
    hinge: { type: Number, default: 2000 },
    overheat: { type: Number, default: 1500 },
    gpu: { type: Number, default: 3000 },
    // New laptop-specific keys from screenshot
    screenChanged: { type: Number, default: 3000 },
    wifi: { type: Number, default: 1200 },
    biometric: { type: Number, default: 1500 },
    charging: { type: Number, default: 1500 },
    cdDrive: { type: Number, default: 1000 },
    chargerIssue: { type: Number, default: 1200 },
    hardDisk: { type: Number, default: 3500 },
    displayIssue: { type: Number, default: 4000 },
    motherboard: { type: Number, default: 6000 },
  },

  // Percentage-based screen deductions (laptop)
  screenDeductions: {
    screenCracked: { type: Number, default: 18 },
    lineDiscolour: { type: Number, default: 18 },
  },

  // Percentage-based body deductions (laptop)
  bodyDeductions: {
    minorDentTop: { type: Number, default: 8 },
    minorDentBase: { type: Number, default: 8 },
    majorDentTop: { type: Number, default: 35 },
    majorDentBase: { type: Number, default: 40 },
    minorScratch: { type: Number, default: 5 },
    majorScratch: { type: Number, default: 8 },
  },

  screenSizeMultipliers: {
    '10-12': { type: Number, default: 0.95 },
    '13-14': { type: Number, default: 1.0 },
    '15-16': { type: Number, default: 1.05 },
    '16+': { type: Number, default: 1.1 },
  },

  dedicatedGpuBonus: {
    'GTX 1650': { type: Number, default: 2000 },
    'RTX 2050': { type: Number, default: 2500 },
    'RTX 3050': { type: Number, default: 3500 },
    'RTX 4050': { type: Number, default: 5000 },
    'RTX 4060': { type: Number, default: 7000 },
    'RTX 4070': { type: Number, default: 10000 },
    'RTX 4080': { type: Number, default: 15000 },
    'RTX 4090': { type: Number, default: 25000 },
  },

  accessoriesBonus: {
    bill: { type: Number, default: 300 },
    box: { type: Number, default: 500 },
    charger: { type: Number, default: 800 },
    // Legacy
    withBoxAndCharger: { type: Number, default: 800 },
    originalCharger: { type: Number, default: 500 },
    thirdPartyCharger: { type: Number, default: 200 },
    none: { type: Number, default: 0 },
  },

  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

deviceSchema.index({ brand: 1, category: 1 });

const Device = mongoose.model('Device', deviceSchema);
export default Device;
