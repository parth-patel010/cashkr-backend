import mongoose from 'mongoose';

export const BUY_CONDITIONS = ['best_value', 'fair', 'good', 'superb'];

export const BUY_CONDITION_LABELS = {
  best_value: 'Best Value',
  fair: 'Fair',
  good: 'Good',
  superb: 'Superb',
};

const conditionTierSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      enum: BUY_CONDITIONS,
      required: true,
    },
    label: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    mrp: { type: Number, default: 0 },
    description: { type: String, default: '' },
    stock: { type: Number, default: 0, min: 0 },
  },
  { _id: false },
);

const buyProductSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      enum: ['mobile', 'tablet', 'laptop', 'mac', 'smartwatch', 'earbuds', 'tv', 'camera', 'gaming', 'other'],
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
    title: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    imageUrl: {
      type: String,
      default: '',
    },
    descriptionImages: {
      type: [String],
      default: [],
    },
    videoUrl: {
      type: String,
      default: '',
    },
    warrantyMonths: {
      type: Number,
      default: 12,
    },
    conditions: {
      type: [conditionTierSchema],
      default: [],
      validate: {
        validator(value) {
          return Array.isArray(value) && value.length > 0;
        },
        message: 'Add at least one condition price',
      },
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

buyProductSchema.index({ category: 1, brand: 1, isActive: 1 });

const BuyProduct = mongoose.model('BuyProduct', buyProductSchema);
export default BuyProduct;
