import { Router } from 'express';
import { body } from 'express-validator';
import { refresh, logout, sendOtp, verifyOtp } from '../controllers/auth.controller.js';
import auth from '../middleware/auth.js';
import clientGate from '../middleware/clientGate.js';
import { otpSendLimiter, otpVerifyLimiter } from '../middleware/otpLimiter.js';

const router = Router();

router.use(clientGate);

router.post('/send-otp', otpSendLimiter, [
  body('phone').trim().notEmpty().withMessage('Phone is required'),
], sendOtp);

router.post('/verify-otp', otpVerifyLimiter, [
  body('phone').trim().notEmpty().withMessage('Phone is required'),
  body('otp').trim().notEmpty().withMessage('OTP is required'),
  body('sessionId').trim().notEmpty().withMessage('Session ID is required'),
], verifyOtp);

router.post('/refresh', refresh);
router.post('/logout', auth, logout);

export default router;
