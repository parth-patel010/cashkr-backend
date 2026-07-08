import { Router } from 'express';
import { body } from 'express-validator';
import { refresh, logout, sendOtp, verifyOtp } from '../controllers/auth.controller.js';
import auth from '../middleware/auth.js';

const router = Router();

router.post('/send-otp', [
  body('phone').trim().notEmpty().withMessage('Phone is required'),
], sendOtp);

router.post('/verify-otp', [
  body('phone').trim().notEmpty().withMessage('Phone is required'),
  body('otp').trim().notEmpty().withMessage('OTP is required'),
  body('sessionId').trim().notEmpty().withMessage('Session ID is required'),
], verifyOtp);

router.post('/refresh', refresh);
router.post('/logout', auth, logout);

export default router;
