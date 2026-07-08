import { Router } from 'express';
import { checkPincode } from '../controllers/pincode.controller.js';

const router = Router();

router.get('/check/:code', checkPincode);

export default router;
