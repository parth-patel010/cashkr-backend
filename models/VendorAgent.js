import mongoose from 'mongoose';

const vendorAgentSchema = new mongoose.Schema(
  {
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vendor',
      required: true,
      index: true,
    },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, default: '', trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, default: '', trim: true },
    aadhaar: { type: String, default: '' },
    aadhaarVerified: { type: Boolean, default: false },
    photoUrl: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

vendorAgentSchema.index({ vendorId: 1, phone: 1 }, { unique: true });

export default mongoose.model('VendorAgent', vendorAgentSchema);
