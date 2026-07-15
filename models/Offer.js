import mongoose from 'mongoose';

const offerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 120,
  },
  description: {
    type: String,
    default: '',
    maxlength: 1000,
  },
  code: {
    type: String,
    trim: true,
    uppercase: true,
    default: null,
  },
  discountType: {
    type: String,
    enum: ['flat', 'percent', 'bonus'],
    default: 'bonus',
  },
  discountValue: {
    type: Number,
    default: 0,
  },
  imageUrl: {
    type: String,
    default: '',
  },
  startsAt: {
    type: Date,
    default: Date.now,
  },
  endsAt: {
    type: Date,
    default: null,
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true,
  },
}, {
  timestamps: true,
});

const Offer = mongoose.model('Offer', offerSchema);
export default Offer;
