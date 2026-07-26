import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    userName: {
      type: String,
      default: 'User',
    },
    userPhone: {
      type: String,
      default: '',
      index: true,
    },
    lastMessage: {
      type: String,
      default: '',
    },
    lastSenderType: {
      type: String,
      enum: ['user', 'admin', ''],
      default: '',
    },
    lastMessageAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    unreadByAdmin: {
      type: Number,
      default: 0,
    },
    unreadByUser: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['open', 'closed'],
      default: 'open',
      index: true,
    },
  },
  { timestamps: true },
);

conversationSchema.index({ userId: 1, status: 1, lastMessageAt: -1 });
conversationSchema.index({ lastMessageAt: -1 });

const Conversation = mongoose.model('Conversation', conversationSchema);
export default Conversation;
