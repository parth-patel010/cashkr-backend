import { Router } from 'express';
import {
  listRepairServicesPublic,
  listRepairBrandsPublic,
  getRepairServiceBySlug,
  searchRepairServicesPublic,
  listRepairIssueCatalog,
  createRepairOrder,
  listMyRepairOrders,
  getRepairOrderById,
} from '../controllers/repair.controller.js';
import { createLead, uploadLeadPhoto } from '../controllers/lead.controller.js';
import auth from '../middleware/auth.js';
import clientGate from '../middleware/clientGate.js';
import { orderCreateLimiter } from '../middleware/rateLimits.js';
import { uploadLeadImage } from '../middleware/upload.js';

const router = Router();

router.use(clientGate);

router.get('/issues-catalog', listRepairIssueCatalog);
router.get('/brands', listRepairBrandsPublic);
router.get('/services/search', searchRepairServicesPublic);
router.get('/services', listRepairServicesPublic);
router.get('/services/:slug', getRepairServiceBySlug);

/** Website-parity repair lead form (no catalog pricing). */
router.post('/request', orderCreateLimiter, (req, res, next) => {
  req.body = { ...(req.body || {}), type: 'repair' };
  return createLead(req, res, next);
});

/** TV / fridge sell lead alias when /api/leads is missing on older deploys. */
router.post('/sell-lead', orderCreateLimiter, createLead);

router.post(
  '/upload-photo',
  orderCreateLimiter,
  uploadLeadImage.single('photo'),
  uploadLeadPhoto,
);

router.get('/orders', auth, listMyRepairOrders);
router.post('/orders', auth, orderCreateLimiter, createRepairOrder);
router.get('/orders/:orderId', auth, getRepairOrderById);

export default router;