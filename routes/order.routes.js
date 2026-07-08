import { Router } from 'express';
import { body } from 'express-validator';
import { createOrder, getUserOrders, getOrderById, cancelOrder, rescheduleOrder, updateOrderPaymentMethod } from '../controllers/order.controller.js';
import auth from '../middleware/auth.js';

const router = Router();

router.use(auth);

router.post('/', [
  body('device').isObject().withMessage('Device info is required'),
  body('priceBreakdown').isObject().withMessage('Price breakdown is required'),
  body('pickup').isObject().withMessage('Pickup details are required'),
  body('pickup.name').trim().notEmpty().withMessage('Name is required'),
  body('pickup.phone').trim().notEmpty().withMessage('Phone is required'),
  body('pickup.address').trim().notEmpty().withMessage('Address is required'),
  body('pickup.pincode').trim().notEmpty().withMessage('Pincode is required'),
  body('pickup.date').trim().notEmpty().withMessage('Pickup date is required'),
  body('pickup.timeSlot').trim().notEmpty().withMessage('Time slot is required'),
  body('pickup.paymentMethod').trim().notEmpty().withMessage('Payment method is required'),
], createOrder);

router.get('/', getUserOrders);
router.get('/:orderId', getOrderById);
router.patch('/:orderId/cancel', cancelOrder);
router.patch('/:orderId/reschedule', rescheduleOrder);
router.patch('/:orderId/payment', updateOrderPaymentMethod);

export default router;
