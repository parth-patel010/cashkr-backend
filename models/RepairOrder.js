import mongoose from 'mongoose';
import crypto from 'crypto';

const repairOrderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    orderId: {
      type: String,
      unique: true,
      default: () => 'REP-' + crypto.randomBytes(3).toString('hex').toUpperCase(),
    },
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'RepairService',
      required: true,
    },
    snapshot: {
      brand: String,
      title: String,
      category: String,
      imageUrl: String,
      issueKey: String,
      issueLabel: String,
      price: Number,
    },
    customerNote: {
      type: String,
      default: '',
    },
    pickup: {
      name: String,
      phone: String,
      address: String,
      pincode: String,
      city: String,
      state: String,
      preferredDate: String,
      preferredSlot: String,
    },
    status: {
      type: String,
      enum: ['booked', 'assigned', 'picked', 'repairing', 'quality_check', 'delivered', 'cancelled'],
      default: 'booked',
      index: true,
    },
  },
  { timestamps: true },
);

const RepairOrder = mongoose.model('RepairOrder', repairOrderSchema);
export default RepairOrder;
