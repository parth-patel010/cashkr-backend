import { Router } from 'express';
import { sendVendorOtp, verifyVendorOtp } from '../controllers/vendorAuth.controller.js';
import {
  getMe,
  updateMe,
  getHome,
  listAvailableOrders,
  acceptOrder,
  logCall,
  listProgressOrders,
  listHistoryOrders,
  getOrderDetail,
  updateOrderStatus,
  upsertDeviceReport,
  listAgents,
  createAgent,
  deleteAgent,
  listGrievances,
  createGrievance,
  listTraining,
  getWallet,
  listLedger,
  addMoneyIntent,
  listCallLogs,
  markReached,
  verifyPickupOtp,
  uploadPickupPhotos,
  setPriceAdjustment,
  markDelivered,
  listVendorCustomPricing,
} from '../controllers/vendor.controller.js';
import vendorAuth from '../middleware/vendorAuth.js';
import clientGate from '../middleware/clientGate.js';

const router = Router();

router.use(clientGate);

router.post('/auth/send-otp', sendVendorOtp);
router.post('/auth/verify-otp', verifyVendorOtp);

router.use(vendorAuth);

router.get('/me', getMe);
router.patch('/me', updateMe);
router.get('/home', getHome);
router.get('/custom-pricing', listVendorCustomPricing);

router.get('/orders/available', listAvailableOrders);
router.get('/orders/progress', listProgressOrders);
router.get('/orders/history', listHistoryOrders);
router.get('/orders/call-logs', listCallLogs);
router.get('/orders/:orderId', getOrderDetail);
router.post('/orders/:orderId/accept', acceptOrder);
router.post('/orders/:orderId/call-log', logCall);
router.post('/orders/:orderId/reached', markReached);
router.post('/orders/:orderId/verify-pickup-otp', verifyPickupOtp);
router.post('/orders/:orderId/pickup-photos', uploadPickupPhotos);
router.patch('/orders/:orderId/price-adjustment', setPriceAdjustment);
router.post('/orders/:orderId/delivered', markDelivered);
router.patch('/orders/:orderId/status', updateOrderStatus);
router.put('/orders/:orderId/device-report', upsertDeviceReport);

router.get('/agents', listAgents);
router.post('/agents', createAgent);
router.delete('/agents/:id', deleteAgent);

router.get('/grievances', listGrievances);
router.post('/grievances', createGrievance);

router.get('/training', listTraining);

router.get('/wallet', getWallet);
router.get('/ledger', listLedger);
router.post('/wallet/add-money', addMoneyIntent);

export default router;
