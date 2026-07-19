import mongoose from 'mongoose';

const vendorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, unique: true, trim: true, index: true },
    photoUrl: { type: String, default: '' },
    city: { type: String, default: '', trim: true },
    servicePincodes: { type: [String], default: [] },
    isActive: { type: Boolean, default: true, index: true },
    walletBalance: { type: Number, default: 0 },
    credits: { type: Number, default: 0 },
    virtualAccount: {
      number: { type: String, default: '' },
      ifsc: { type: String, default: '' },
      bankName: { type: String, default: '' },
      type: { type: String, default: 'Commission Account' },
    },
    upi: {
      linked: { type: Boolean, default: false },
      vpa: { type: String, default: '' },
    },
    managerPhone: { type: String, default: '' },
    orderCreditCost: { type: Number, default: 0 },
    vendorCode: {
      type: String,
      unique: true,
      sparse: true,
    },
  },
  { timestamps: true },
);

vendorSchema.pre('save', function assignCode(next) {
  if (!this.vendorCode) {
    this.vendorCode = String(5000 + Math.floor(Math.random() * 9000));
  }
  next();
});

const Vendor = mongoose.model('Vendor', vendorSchema);
export default Vendor;
