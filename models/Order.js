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
    isGpuWorking: Boolean,
    hasTouchscreen: Boolean,
    screenSize: String,
    powerStatus: String,
    ram: String,
    storageType: String,
    yearOfPurchase: String,
    yearBracket: String,
    screenCondition: String,
    bodyIssues: [String],
    // Category quizzes (smartwatch / gaming / earbuds)
    quizAnswers: mongoose.Schema.Types.Mixed,
    answerSummary: [mongoose.Schema.Types.Mixed],
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
    quotedFinalPrice: { type: Number, default: null },
    priceSource: { type: String, default: '' },
    agentStatus: { type: String, default: '' },
    cashifyEstimate: { type: Number, default: null },
    quizHash: { type: String, default: '' },
    valuationRecordId: { type: String, default: '' },
    internalPrice: { type: Number, default: null },
    vendorAdjustment: { type: Number, default: 0 },
    laterAdjustment: { type: Number, default: 0 },
    laterAdjustmentNote: { type: String, default: '' },
    laterAdjustedAt: { type: Date, default: null },
    laterAdjustedBy: { type: String, default: '' },
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
  cancelReason: {
    type: String,
    default: '',
  },
  cancelledAt: {
    type: Date,
    default: null,
  },
  cancelledBy: {
    type: String,
    enum: ['customer', 'vendor', 'admin', ''],
    default: '',
  },
  rescheduleReason: {
    type: String,
    default: '',
  },
  rescheduledAt: {
    type: Date,
    default: null,
  },
  rescheduledBy: {
    type: String,
    enum: ['customer', 'vendor', 'admin', ''],
    default: '',
  },
  vendorIncentive: {
    type: Number,
    default: 0,
  },
  /** Credits deducted from vendor when they accepted this lead (legacy). */
  vendorCreditCharged: {
    type: Number,
    default: 0,
  },
  /** Wallet ₹ commission deducted when vendor accepted this lead. */
  vendorCommissionCharged: {
    type: Number,
    default: 0,
  },
  vendorCommissionPercent: {
    type: Number,
    default: 0,
  },
  customerIdProof: {
    type: {
      idType: { type: String, default: '' },
      frontUrl: { type: String, default: '' },
      backUrl: { type: String, default: '' },
      uploadedAt: { type: Date, default: null },
    },
    default: () => ({}),
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
  completedAt: { type: Date, default: null },
}, {
  timestamps: true,
});

orderSchema.index({ userId: 1, createdAt: -1 });
orderSchema.index({ vendorId: 1, status: 1, createdAt: -1 });
orderSchema.index({ 'pickup.pincode': 1, status: 1 });

const Order = mongoose.model('Order', orderSchema);
export default Order;
