import { Router } from 'express';
import { body } from 'express-validator';
import {
  getMe,
  updateMe,
  deleteMe,
  getReferrals,
  getEarnings,
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  getPaymentMethods,
  addPaymentMethod,
  updatePaymentMethod,
  deletePaymentMethod,
} from '../controllers/user.controller.js';
import auth from '../middleware/auth.js';
import clientGate from '../middleware/clientGate.js';

const router = Router();

router.use(clientGate);
router.use(auth);

router.get('/me', getMe);
router.patch('/me', updateMe);
router.delete('/me', deleteMe);
router.get('/referrals', getReferrals);
router.get('/me/earnings', getEarnings);

router.get('/me/addresses', getAddresses);
router.post(
  '/me/addresses',
  [
    body('pincode').trim().notEmpty().withMessage('Pincode is required'),
    body('address').trim().notEmpty().withMessage('Address is required'),
    body('city').trim().notEmpty().withMessage('City is required'),
  ],
  addAddress,
);
router.patch('/me/addresses/:id', updateAddress);
router.delete('/me/addresses/:id', deleteAddress);

router.get('/me/payments', getPaymentMethods);
router.post(
  '/me/payments',
  [
    body('type').isIn(['bank', 'upi']).withMessage('type must be bank or upi'),
    body('upiId').if(body('type').equals('upi')).trim().notEmpty().withMessage('UPI ID is required'),
    body('accountNumber')
      .if(body('type').equals('bank'))
      .trim()
      .notEmpty()
      .withMessage('Account number is required'),
    body('ifscCode')
      .if(body('type').equals('bank'))
      .trim()
      .notEmpty()
      .withMessage('IFSC is required'),
    body('accountName')
      .if(body('type').equals('bank'))
      .trim()
      .notEmpty()
      .withMessage('Account name is required'),
  ],
  addPaymentMethod,
);
router.patch('/me/payments/:id', updatePaymentMethod);
router.delete('/me/payments/:id', deletePaymentMethod);

export default router;
