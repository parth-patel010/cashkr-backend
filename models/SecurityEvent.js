import mongoose from 'mongoose';

const securityEventSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    ip: { type: String, default: '' },
    path: { type: String, default: '' },
    meta: { type: mongoose.Schema.Types.Mixed, default: null },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  },
);

securityEventSchema.index({ createdAt: -1 });

const SecurityEvent = mongoose.model('SecurityEvent', securityEventSchema);
export default SecurityEvent;
