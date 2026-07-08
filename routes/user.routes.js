import { Router } from 'express';
import { 
  getMe, 
  updateMe, 
  getReferrals,
  addAddress,
  deleteAddress,
  addPaymentMethod,
  deletePaymentMethod
} from '../controllers/user.controller.js';
import auth from '../middleware/auth.js';

const router = Router();
router.use(auth);
router.get('/me', getMe);
router.patch('/me', updateMe);
router.get('/referrals', getReferrals);

// Address routes
router.post('/me/addresses', addAddress);
router.delete('/me/addresses/:id', deleteAddress);

// Payment method routes
router.post('/me/payments', addPaymentMethod);
router.delete('/me/payments/:id', deletePaymentMethod);

export default router;
