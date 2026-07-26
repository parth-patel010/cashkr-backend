import mongoose from 'mongoose';

const userNotificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: { type: String, required: true, trim: true, maxlength: 200 },
    body: { type: String, required: true, trim: true, maxlength: 2000 },
    imageUrl: { type: String, default: '' },
    data: { type: mongoose.Schema.Types.Mixed, default: null },
    readAt: { type: Date, default: null, index: true },
  },
  { timestamps: true },
);

userNotificationSchema.index({ userId: 1, createdAt: -1 });
userNotificationSchema.index({ userId: 1, readAt: 1 });

const UserNotification = mongoose.model('UserNotification', userNotificationSchema);
export default UserNotification;
