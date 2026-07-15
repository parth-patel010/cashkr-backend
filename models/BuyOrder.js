import mongoose from 'mongoose';
import crypto from 'crypto';

const buyOrderSchema = new mongoose.Schema(
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
      default: () => 'BUY-' + crypto.randomBytes(3).toString('hex').toUpperCase(),
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BuyProduct',
      required: true,
    },
    productSnapshot: {
      brand: String,
      modelName: String,
      title: String,
      imageUrl: String,
      conditionKey: String,
      conditionLabel: String,
      price: Number,
    },
    shipping: {
      name: String,
      phone: String,
      address: String,
      pincode: String,
      city: String,
      state: String,
    },
    status: {
      type: String,
      enum: ['placed', 'confirmed', 'shipped', 'delivered', 'cancelled'],
      default: 'placed',
      index: true,
    },
  },
  { timestamps: true },
);

const BuyOrder = mongoose.model('BuyOrder', buyOrderSchema);
export default BuyOrder;
