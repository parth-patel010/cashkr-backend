import mongoose from 'mongoose';

const vendorTrainingItemSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ['video', 'document'], required: true },
    title: { type: String, required: true },
    thumbnailUrl: { type: String, default: '' },
    mediaUrl: { type: String, default: '' },
    sortOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export default mongoose.model('VendorTrainingItem', vendorTrainingItemSchema);
