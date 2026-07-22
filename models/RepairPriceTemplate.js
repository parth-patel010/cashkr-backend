import mongoose from 'mongoose';

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

const repairPriceTemplateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: ['mobile', 'tablet', 'laptop', 'smartwatch', 'earbuds', 'other'],
      default: 'mobile',
      index: true,
    },
    description: {
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
        message: 'Template needs at least one issue price',
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

repairPriceTemplateSchema.index({ name: 1, category: 1 });

const RepairPriceTemplate = mongoose.model('RepairPriceTemplate', repairPriceTemplateSchema);
export default RepairPriceTemplate;
