import { Router } from 'express';
import auth from '../middleware/auth.js';
import clientGate from '../middleware/clientGate.js';
import {
  submitLaptopValuation,
  getLaptopValuationStatus,
  getLaptopValuationAgentStatus,
} from '../controllers/laptopValuation.controller.js';

const router = Router();

router.use(clientGate);
router.use(auth);

router.get('/laptop/agent-status', getLaptopValuationAgentStatus);
router.post('/laptop/quote', submitLaptopValuation);
router.get('/laptop/status/:recordId', getLaptopValuationStatus);

export default router;
