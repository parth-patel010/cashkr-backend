import { Router } from 'express';
import {
  listBuyProductsPublic,
  getBuyProductBySlug,
  createBuyOrder,
  listMyBuyOrders,
  getBuyOrderById,
} from '../controllers/buy.controller.js';
import auth from '../middleware/auth.js';
import clientGate from '../middleware/clientGate.js';

const router = Router();

router.use(clientGate);

router.get('/products', listBuyProductsPublic);
router.get('/products/:slug', getBuyProductBySlug);

router.get('/orders', auth, listMyBuyOrders);
router.post('/orders', auth, createBuyOrder);
router.get('/orders/:orderId', auth, getBuyOrderById);

export default router;
