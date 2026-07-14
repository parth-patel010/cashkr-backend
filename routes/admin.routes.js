import { Router } from 'express';
import adminAuth from '../middleware/adminAuth.js';
import {
  adminLogin,
  getDashboardStats,
  getAllUsers,
  getUserById,
  getAllDevices,
  getDeviceById,
  createDevice,
  updateDevice,
  deleteDevice,
  getAllPartners,
  getAllOrders,
  exportOrders,
  updateOrderStatus,
  getAllPincodes,
  createPincode,
  updatePincode,
  deletePincode,
  getAnalytics,
  upsertMetaSpend,
} from '../controllers/admin.controller.js';

const router = Router();

// Public admin login
router.post('/login', adminLogin);

// All routes below require admin auth
router.use(adminAuth);

// Dashboard
router.get('/stats', getDashboardStats);

// Users
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);

// Devices
router.get('/devices', getAllDevices);
router.get('/devices/:id', getDeviceById);
router.post('/devices', createDevice);
router.put('/devices/:id', updateDevice);
router.delete('/devices/:id', deleteDevice);

// Partners
router.get('/partners', getAllPartners);

// Orders
router.get('/orders/export', exportOrders);
router.get('/orders', getAllOrders);
router.patch('/orders/:id/status', updateOrderStatus);

// Pincodes
router.get('/pincodes', getAllPincodes);
router.post('/pincodes', createPincode);
router.put('/pincodes/:id', updatePincode);
router.delete('/pincodes/:id', deletePincode);

// Analytics
router.get('/analytics', getAnalytics);
router.put('/analytics/meta-spend', upsertMetaSpend);

export default router;
