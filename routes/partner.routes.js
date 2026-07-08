import { Router } from 'express';
import { submitPartnerApplication } from '../controllers/partner.controller.js';

const router = Router();

router.post('/', submitPartnerApplication);

export default router;
