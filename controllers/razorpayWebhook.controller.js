import { verifyWebhookSignature } from '../utils/razorpay.js';
import { creditVendorTopup } from '../utils/vendorTopup.js';

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

    if (event === 'payment.captured' && paymentEntity) {
      razorpayOrderId = paymentEntity.order_id;
      razorpayPaymentId = paymentEntity.id;
      amountPaise = paymentEntity.amount;
    } else if (event === 'order.paid' && orderEntity) {
      razorpayOrderId = orderEntity.id;
      amountPaise = orderEntity.amount;
    }

    const result = await creditVendorTopup({
      razorpayOrderId,
      razorpayPaymentId,
      amountPaise,
    });

    if (!result.ok && result.message === 'Top-up order not found') {
      return res.json({ received: true, ignored: true });
    }

    if (!result.ok) {
      return res.status(400).json({ message: result.message });
    }

    res.json({ received: true, credited: !result.alreadyCredited });
  } catch (error) {
    console.error('Razorpay webhook error:', error.message);
    res.status(500).json({ message: 'Webhook handler failed' });
  }
};
