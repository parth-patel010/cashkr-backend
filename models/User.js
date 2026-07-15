import mongoose from 'mongoose';
import crypto from 'crypto';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    maxlength: 100,
    default: 'User',
  },
  email: {
    type: String,
    unique: true,
    sparse: true,
    lowercase: true,
    trim: true,
  },
  phone: {
    type: String,
    required: [true, 'Phone is required'],
    trim: true,
  },
  passwordHash: {
    type: String,
  },
  refreshToken: {
    type: String,
    default: null,
  },
  referralCode: {
    type: String,
    unique: true,
    default: () => crypto.randomBytes(4).toString('hex').toUpperCase(),
  },
  referredBy: {
    type: String,
    default: null,
  },
  addresses: [{
    label: { type: String, default: 'Home' }, // Home, Office, etc.
    name: String,
    phone: String,
    alternatePhone: String, // optional contact for pickup
    pincode: String,
    address: String,
    landmark: String,
    city: String,
    state: String,
    isDefault: { type: Boolean, default: false },
  }],
  paymentMethods: [{
    type: { type: String, enum: ['bank', 'upi'] },
    accountName: String,
    accountNumber: String,
    ifscCode: String,
    bankName: String,
    upiId: String,
    isDefault: { type: Boolean, default: false },
  }],
  lastQuizDevice: {
    category: { type: String, default: '' },
    brand: { type: String, default: '' },
    modelName: { type: String, default: '' },
    slug: { type: String, default: '' },
    storage: { type: String, default: '' },
    quizPath: { type: String, default: '' },
    loggedInAt: { type: Date },
  },
}, {
  timestamps: true,
});


const User = mongoose.model('User', userSchema);
export default User;
