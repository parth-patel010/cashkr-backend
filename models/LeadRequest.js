import mongoose from 'mongoose';

const photoSchema = new mongoose.Schema(
  {
    front: { type: String, default: '' },
    left: { type: String, default: '' },
    right: { type: String, default: '' },
    back: { type: String, default: '' },
  },
  { _id: false },
);

const leadRequestSchema = new mongoose.Schema(
  {
    leadId: { type: String, unique: true, index: true },
    type: {
      type: String,
      enum: ['sell_tv', 'sell_refrigerator', 'repair'],
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['new', 'contacted', 'closed'],
      default: 'new',
      index: true,
    },
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    address: { type: String, default: '', trim: true },
    pincode: { type: String, default: '', trim: true },
    city: { type: String, default: '', trim: true },
    brand: { type: String, default: '', trim: true },
    modelName: { type: String, default: '', trim: true },
    screenSize: { type: String, default: '', trim: true },
    applianceType: { type: String, default: '', trim: true },
    ageBand: { type: String, default: '', trim: true },
    condition: { type: String, default: '', trim: true },
    note: { type: String, default: '', trim: true },
    photos: { type: photoSchema, default: () => ({}) },
    // repair-only
    deviceCategory: { type: String, default: '', trim: true },
    issues: [{ type: String }],
    preferredSlot: { type: String, default: '', trim: true },
    preferredDate: { type: String, default: '', trim: true },
    source: { type: String, default: 'website' },
  },
  { timestamps: true },
);

leadRequestSchema.pre('validate', function assignLeadId(next) {
  if (!this.leadId) {
    const prefix =
      this.type === 'repair' ? 'REP-LEAD' : this.type === 'sell_tv' ? 'TV' : 'FRIDGE';
    this.leadId = `${prefix}-${Date.now().toString(36).toUpperCase()}`;
  }
  next();
});

export default mongoose.model('LeadRequest', leadRequestSchema);
