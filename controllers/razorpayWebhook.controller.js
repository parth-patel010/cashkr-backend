import { verifyWebhookSignature } from '../utils/razorpay.js';
import { creditVendorTopup } from '../utils/vendorTopup.js';
import { markBuyOrderPaid } from '../utils/buyPayment.js';

export { creditVendorTopup };

export const razorpayWebhook = async (req, res) => {
  try {
    const signature = req.headers['x-razorpay-signature'];
    const rawBody = req.body; // Buffer from express.raw
    if (!Buffer.isBuffer(rawBody)) {
      return res.status(400).json({ message: 'Invalid webhook body' });
    }
    if (!verifyWebhookSignature(rawBody, signature)) {
      return res.status(400).json({ message: 'Invalid webhook signature' });
    }

    const payload = JSON.parse(rawBody.toString('utf8'));
    const event = payload?.event;
    const paymentEntity = payload?.payload?.payment?.entity;
    const orderEntity = payload?.payload?.order?.entity;

    if (!['payment.captured', 'order.paid'].includes(event)) {
      return res.json({ received: true, ignored: true });
    }

    let razorpayOrderId = null;
    let razorpayPaymentId = null;
    let amountPaise;
    let notes = {};

    if (event === 'payment.captured' && paymentEntity) {
      razorpayOrderId = paymentEntity.order_id;
      razorpayPaymentId = paymentEntity.id;
      amountPaise = paymentEntity.amount;
      notes = paymentEntity.notes || {};
    } else if (event === 'order.paid' && orderEntity) {
      razorpayOrderId = orderEntity.id;
      amountPaise = orderEntity.amount;
      notes = orderEntity.notes || {};
    }

    // Buy order payments (notes.type === 'buy' or receipt BUY-*)
    const isBuy =
      notes?.type === 'buy' ||
      Boolean(notes?.buyOrderId) ||
      String(orderEntity?.receipt || '').startsWith('BUY-');

    if (isBuy || notes?.buyOrderId) {
      const buyResult = await markBuyOrderPaid({
        razorpayOrderId,
        razorpayPaymentId,
        amountPaise,
        buyOrderId: notes?.buyOrderId,
      });
      if (!buyResult.ok && buyResult.message === 'Buy order not found') {
        // Fall through to vendor top-up in case notes were wrong
      } else if (!buyResult.ok) {
        return res.status(400).json({ message: buyResult.message });
      } else {
        return res.json({
          received: true,
          type: 'buy',
          paid: !buyResult.alreadyPaid,
        });
      }
    }

    const result = await creditVendorTopup({
      razorpayOrderId,
      razorpayPaymentId,
      amountPaise,
    });

    if (!result.ok && result.message === 'Top-up order not found') {
      // Try buy order lookup by razorpay order id as fallback
      const buyFallback = await markBuyOrderPaid({
        razorpayOrderId,
        razorpayPaymentId,
        amountPaise,
      });
      if (buyFallback.ok) {
        return res.json({
          received: true,
          type: 'buy',
          paid: !buyFallback.alreadyPaid,
        });
      }
      return res.json({ received: true, ignored: true });
    }

    if (!result.ok) {
      return res.status(400).json({ message: result.message });
    }

    res.json({ received: true, type: 'vendor_topup', credited: !result.alreadyCredited });
  } catch (error) {
    console.error('Razorpay webhook error:', error.message);
    res.status(500).json({ message: 'Webhook handler failed' });
  }
};
