import BuyProduct from '../models/BuyProduct.js';
import BuyOrder from '../models/BuyOrder.js';

/**
 * Idempotently mark a buy order as paid and decrement stock once.
 */
export const markBuyOrderPaid = async ({
  razorpayOrderId,
  razorpayPaymentId,
  amountPaise,
  buyOrderId,
}) => {
  let order = null;

  if (razorpayOrderId) {
    order = await BuyOrder.findOne({ razorpayOrderId });
  }
  if (!order && buyOrderId) {
    order = await BuyOrder.findOne({
      $or: [{ orderId: buyOrderId }, { _id: buyOrderId }],
    });
  }

  if (!order) {
    return { ok: false, message: 'Buy order not found' };
  }

  if (order.paymentMethod !== 'razorpay') {
    return { ok: false, message: 'Not a Razorpay buy order' };
  }

  if (order.paymentStatus === 'paid') {
    return { ok: true, alreadyPaid: true, order };
  }

  const expectedPaise = Math.round(Number(order.amount || order.productSnapshot?.price || 0) * 100);
  if (amountPaise != null && expectedPaise > 0 && Number(amountPaise) !== expectedPaise) {
    return { ok: false, message: 'Amount mismatch' };
  }

  if (!order.stockDecremented) {
    const product = await BuyProduct.findById(order.productId);
    if (!product) {
      return { ok: false, message: 'Product not found' };
    }
    const condition = product.conditions.find(
      (c) => c.key === order.productSnapshot?.conditionKey,
    );
    if (!condition) {
      return { ok: false, message: 'Condition not found' };
    }
    if (condition.stock < 1) {
      return { ok: false, message: 'Out of stock for this condition' };
    }
    condition.stock -= 1;
    await product.save();
    order.stockDecremented = true;
  }

  order.paymentStatus = 'paid';
  order.status = order.status === 'placed' ? 'confirmed' : order.status;
  if (razorpayPaymentId) order.razorpayPaymentId = razorpayPaymentId;
  if (razorpayOrderId && !order.razorpayOrderId) order.razorpayOrderId = razorpayOrderId;
  await order.save();

  return { ok: true, alreadyPaid: false, order };
};
