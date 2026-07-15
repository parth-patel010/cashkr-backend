import mongoose from 'mongoose';

export const BRAND_CATEGORIES = [
  'mobile',
  'laptop',
  'tablet',
  'earbuds',
  'tv',
  'smartwatch',
  'speakers',
  'mac',
  'camera',
  'gaming',
  'other',
];

export const BRAND_OFFERS = ['sell', 'buy', 'repair'];

const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Brand name is required'],
      trim: true,
      maxlength: 80,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    logoUrl: {
      type: String,
      default: '',
    },
    color: {
      type: String,
      default: '#2F6BFF',
    },
    categories: {
      type: [
        {
          type: String,
          enum: BRAND_CATEGORIES,
        },
      ],
      default: [],
      validate: {
        validator(value) {
          return Array.isArray(value) && value.length > 0;
        },
        message: 'Select at least one category',
      },
    },
    offers: {
      type: [
        {
          type: String,
          enum: BRAND_OFFERS,
        },
      ],
      default: ['sell'],
      validate: {
        validator(value) {
          return Array.isArray(value) && value.length > 0;
        },
        message: 'Select at least one offer type (sell, buy, repair)',
      },
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  { timestamps: true },
);

brandSchema.index({ categories: 1, isActive: 1, sortOrder: 1 });
brandSchema.index({ offers: 1, isActive: 1 });
brandSchema.index({ name: 1 });

const Brand = mongoose.model('Brand', brandSchema);
export default Brand;
