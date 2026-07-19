import mongoose from 'mongoose';
import crypto from 'crypto';

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  orderId: {
    type: String,
    unique: true,
    default: () => 'ORD-' + crypto.randomBytes(3).toString('hex').toUpperCase(),
  },
  device: {
    category: String,        // 'mobile' or 'laptop'
    brand: String,
    modelName: String,
    slug: String,
    storage: String,
    // Mobile v2 fields (percentage-based model)
    deviceAge: String,
    ableToMakeCalls: Boolean,
    isTouchScreenWorking: Boolean,
    isScreenOriginal: Boolean,
    underWarranty: Boolean,
    hasGSTBill: Boolean,
    eSIMSupport: String,          // 'physical+esim' | 'esim_only_global'
    physicalIssues: [String],     // e.g. ['glass_crack', 'back_panel']
    technicalIssues: [String],    // e.g. ['wifi_issue', 'battery_service']
    // Legacy mobile fields (kept for backward compat)
    hasScreenIssue: Boolean,
    screenIssues: [String],
    hasBodyIssue: Boolean,
    bodyCondition: String,
    hasOtherIssues: Boolean,
    batteryHealth: String,
    // Laptop fields
    processor: String,
    generation: String,
    graphicsCard: String,
    hasDedicatedGpu: Boolean,
    hasTouchscreen: Boolean,
    screenSize: String,
    ram: String,
    storageType: String,
    yearOfPurchase: String,
    screenCondition: String,
    // Shared
    functionalIssues: [String],
    accessories: mongoose.Schema.Types.Mixed, // String for laptop, [String] for mobile
  },
  priceBreakdown: {
    basePrice: { type: Number, default: 0 },
    ageAdjustment: { type: Number, default: 0 },      // laptop only
    conditionAdjustment: { type: Number, default: 0 },
    screenAdjustment: { type: Number, default: 0 },
    functionalDeduction: { type: Number, default: 0 },
    batteryDeduction: { type: Number, default: 0 },    // mobile only
    accessoriesBonus: { type: Number, default: 0 },
    finalPrice: { type: Number, default: 0 },
  },
  pickup: {
    name: String,
    phone: String,
    alternatePhone: String, // optional alternate contact from address
    email: String,
    pincode: String,
    address: String,
    landmark: String,
    city: String,
    state: String,
    date: String,
    timeSlot: String,
    paymentMethod: String,
  },
  status: {
    type: String,
    enum: ['placed', 'scheduled', 'assigned', 'picked', 'verified', 'payment_initiated', 'completed', 'cancelled', 'failed'],
    default: 'placed',
  },
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
    default: null,
    index: true,
  },
  assignedAt: {
    type: Date,
    default: null,
  },
  failedReason: {
    type: String,
    default: '',
  },
  toBeFailed: {
    type: Boolean,
    default: false,
  },
  vendorIncentive: {
    type: Number,
    default: 0,
  },
  deviceReport: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
  },
  imei1: { type: String, default: '' },
  imei2: { type: String, default: '' },
  partnerName: {
    type: String,
    default: '',
  },
  partnerPhone: {
    type: String,
    default: '',
  },
  reachedAt: { type: Date, default: null },
  pickupOtpHash: { type: String, default: '' },
  pickupOtpPlain: { type: String, default: '' }, // temporary in-app OTP for customer; cleared after verify
  pickupOtpExpiresAt: { type: Date, default: null },
  pickupOtpVerifiedAt: { type: Date, default: null },
  pickupPhotos: {
    type: [
      {
        angle: { type: String },
        url: { type: String },
        uploadedAt: { type: Date },
      },
    ],
    default: [],
  },
  vendorPriceAdjustment: { type: Number, default: 0 },
}, {
  timestamps: true,
});

orderSchema.index({ userId: 1, createdAt: -1 });
orderSchema.index({ vendorId: 1, status: 1, createdAt: -1 });
orderSchema.index({ 'pickup.pincode': 1, status: 1 });

const Order = mongoose.model('Order', orderSchema);
export default Order;
