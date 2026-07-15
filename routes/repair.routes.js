import { Router } from 'express';
import {
  listRepairServicesPublic,
  getRepairServiceBySlug,
  listRepairIssueCatalog,
  createRepairOrder,
  listMyRepairOrders,
  getRepairOrderById,
} from '../controllers/repair.controller.js';
import auth from '../middleware/auth.js';
import clientGate from '../middleware/clientGate.js';

const router = Router();

router.use(clientGate);

router.get('/issues-catalog', listRepairIssueCatalog);
router.get('/services', listRepairServicesPublic);
router.get('/services/:slug', getRepairServiceBySlug);

router.get('/orders', auth, listMyRepairOrders);
router.post('/orders', auth, createRepairOrder);
router.get('/orders/:orderId', auth, getRepairOrderById);

export default router;
