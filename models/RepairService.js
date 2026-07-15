import mongoose from 'mongoose';

export const DEFAULT_REPAIR_ISSUES = [
  { key: 'screen', label: 'Screen Damage', price: 0, description: 'Cracked, dead pixels, or touch issues' },
  { key: 'battery', label: 'Battery Replacement', price: 0, description: 'Low health, swelling, or fast drain' },
  { key: 'camera', label: 'Camera Repair', price: 0, description: 'Blurry lens, focus fail, or dead camera' },
  { key: 'mic', label: 'Mic / Speaker', price: 0, description: 'No sound, muffled audio, or mic fail' },
  { key: 'charging', label: 'Charging Port', price: 0, description: 'Loose port or not charging' },
  { key: 'soft_damage', label: 'Software Issues', price: 0, description: 'Boot loop, update fail, lag' },
  { key: 'back_panel', label: 'Back Panel', price: 0, description: 'Cracked or scratched rear glass' },
  { key: 'other', label: 'Other', price: 0, description: 'Describe the issue while booking' },
];

const issueSchema = new mongoose.Schema(
  {
    key: { type: String, required: true },
    label: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    description: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
  },
  { _id: false },
);

const repairServiceSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      enum: ['mobile', 'tablet', 'laptop', 'smartwatch', 'earbuds', 'other'],
      default: 'mobile',
      index: true,
    },
    brand: {
      type: String,
      required: true,
      index: true,
    },
    title: {
      type: String,
      default: '',
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      default: 'Doorstep repair by trained technicians with quality check.',
    },
    imageUrl: {
      type: String,
      default: '',
    },
    issues: {
      type: [issueSchema],
      default: [],
      validate: {
        validator(value) {
          return Array.isArray(value) && value.length > 0;
        },
        message: 'Add at least one repair issue',
      },
    },
    turnaroundHours: {
      type: Number,
      default: 24,
    },
    warrantyDays: {
      type: Number,
      default: 90,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

repairServiceSchema.index({ category: 1, brand: 1, isActive: 1 });

const RepairService = mongoose.model('RepairService', repairServiceSchema);
export default RepairService;
