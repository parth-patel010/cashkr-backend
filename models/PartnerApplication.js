import mongoose from 'mongoose';

const partnerApplicationSchema = new mongoose.Schema({
  businessName: {
    type: String,
    required: [true, 'Business name is required'],
    trim: true,
  },
  contactPerson: {
    type: String,
    required: [true, 'Contact person is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true,
  },
  mobile: {
    type: String,
    required: [true, 'Mobile number is required'],
    trim: true,
  },
  city: {
    type: String,
    required: [true, 'City is required'],
    trim: true,
  },
  shopType: {
    type: String,
    required: [true, 'Shop type is required'],
    enum: ['repair', 'retailer', 'refurb', 'collector', 'mobile_retailer'],
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
}, {
  timestamps: true,
});

const PartnerApplication = mongoose.model('PartnerApplication', partnerApplicationSchema);
export default PartnerApplication;
