import { Router } from 'express';
import { getActiveOffers } from '../controllers/offer.controller.js';
import clientGate from '../middleware/clientGate.js';

const router = Router();

router.get('/', clientGate, getActiveOffers);

export default router;
