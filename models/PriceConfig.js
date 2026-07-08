import mongoose from 'mongoose';

const priceConfigSchema = new mongoose.Schema({
  deviceSlug: {
    type: String,
    required: true,
    unique: true,
  },
  variants: [{
    storage: String,
    basePrice: Number,
  }],
  conditionMultipliers: {
    likenew: Number,
    good: Number,
    fair: Number,
    poor: Number,
  },
  screenMultipliers: {
    // Mobile
    noScratch: Number,
    minorScratch: Number,
    crackedWorks: Number,
    crackedBroken: Number,
    // Laptop
    noIssue: Number,
    deadPixels: Number,
  },
  ageMultipliers: {
    lessThan1: Number,
    oneToTwo: Number,
    twoToThree: Number,
    threeToFour: Number,
    fourToFive: Number,
    moreThan5: Number,
  },
  functionalDeductions: {
    // Mobile
    batteryLow: Number,
    cameraIssue: Number,
    speakerIssue: Number,
    faceIdIssue: Number,
    chargingIssue: Number,
    // Laptop
    battery: Number,
    keyboard: Number,
    trackpad: Number,
    speakers: Number,
    webcam: Number,
    ports: Number,
    hinge: Number,
    overheat: Number,
    gpu: Number,
  },
  accessoriesBonus: {
    // Mobile
    fullKit: Number,
    boxOnly: Number,
    // Laptop
    withBoxAndCharger: Number,
    originalCharger: Number,
    thirdPartyCharger: Number,
    // Shared
    none: Number,
  },
  lastUpdatedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

const PriceConfig = mongoose.model('PriceConfig', priceConfigSchema);
export default PriceConfig;
