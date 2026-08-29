import { Router } from 'express';
import auth from '../middleware/auth.js';
import clientGate from '../middleware/clientGate.js';
import {
  submitLaptopValuation,
  submitMobileValuation,
  getLaptopValuationStatus,
  getMobileValuationStatus,
  getLaptopValuationAgentStatus,
  getMobileValuationAgentStatus,
} from '../controllers/laptopValuation.controller.js';

const router = Router();

router.use(clientGate);
router.use(auth);

router.get('/laptop/agent-status', getLaptopValuationAgentStatus);
router.post('/laptop/quote', submitLaptopValuation);
router.get('/laptop/status/:recordId', getLaptopValuationStatus);

router.get('/mobile/agent-status', getMobileValuationAgentStatus);
router.post('/mobile/quote', submitMobileValuation);
router.get('/mobile/status/:recordId', getMobileValuationStatus);

export default router;
