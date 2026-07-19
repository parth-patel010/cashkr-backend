import mongoose from 'mongoose';

const vendorGrievanceSchema = new mongoose.Schema(
  {
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vendor',
      required: true,
      index: true,
    },
    reason: { type: String, required: true },
    comment: { type: String, default: '' },
    images: { type: [String], default: [] },
    status: {
      type: String,
      enum: ['open', 'in_progress', 'resolved', 'closed'],
      default: 'open',
    },
  },
  { timestamps: true },
);

export default mongoose.model('VendorGrievance', vendorGrievanceSchema);
