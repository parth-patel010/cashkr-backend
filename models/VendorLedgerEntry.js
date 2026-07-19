import mongoose from 'mongoose';

const vendorLedgerEntrySchema = new mongoose.Schema(
  {
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vendor',
      required: true,
      index: true,
    },
    entryType: {
      type: String,
      enum: ['transaction', 'payment', 'adjustment', 'order'],
      default: 'transaction',
    },
    accountType: {
      type: String,
      enum: ['wallet', 'commission', 'credit'],
      default: 'wallet',
    },
    title: { type: String, default: '' },
    amount: { type: Number, required: true },
    credits: { type: Number, default: 0 },
    status: { type: String, default: 'Completed' },
    serviceNumber: { type: String, default: '' },
    paymentMode: { type: String, default: '' },
    paymentId: { type: String, default: '' },
    meta: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true },
);

vendorLedgerEntrySchema.index({ vendorId: 1, createdAt: -1 });

export default mongoose.model('VendorLedgerEntry', vendorLedgerEntrySchema);
