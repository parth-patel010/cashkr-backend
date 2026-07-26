import { Router } from 'express';
import {
  listBuyProductsPublic,
  getBuyProductBySlug,
  searchBuyProductsPublic,
  createBuyOrder,
  listMyBuyOrders,
  getBuyOrderById,
} from '../controllers/buy.controller.js';
import auth from '../middleware/auth.js';
import clientGate from '../middleware/clientGate.js';
import { orderCreateLimiter } from '../middleware/rateLimits.js';

const router = Router();

router.use(clientGate);

router.get('/products/search', searchBuyProductsPublic);
router.get('/products', listBuyProductsPublic);
router.get('/products/:slug', getBuyProductBySlug);

router.get('/orders', auth, listMyBuyOrders);
router.post('/orders', auth, orderCreateLimiter, createBuyOrder);
router.get('/orders/:orderId', auth, getBuyOrderById);

export default router;
