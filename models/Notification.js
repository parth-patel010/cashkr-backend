import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    body: { type: String, required: true, trim: true, maxlength: 2000 },
    imageUrl: { type: String, default: '' },
    target: {
      type: String,
      enum: ['all', 'pincode', 'user'],
      default: 'all',
    },
    pincode: { type: String, default: '' },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    sentCount: { type: Number, default: 0 },
    failedCount: { type: Number, default: 0 },
    meta: { type: mongoose.Schema.Types.Mixed, default: null },
  },
  { timestamps: true },
);

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
