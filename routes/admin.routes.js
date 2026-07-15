import { Router } from 'express';
import { body } from 'express-validator';
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
  getAllBuyOrders,
  updateBuyOrderStatus,
  getAllRepairOrders,
  updateRepairOrderStatus,
  getAllPincodes,
  createPincode,
  updatePincode,
  deletePincode,
  getAnalytics,
  upsertMetaSpend,
} from '../controllers/admin.controller.js';
import {
  adminListOffers,
  adminCreateOffer,
  adminUpdateOffer,
  adminDeleteOffer,
} from '../controllers/offer.controller.js';
import {
  listBrands,
  listBrandLogos,
  getBrandById,
  createBrand,
  updateBrand,
  deleteBrand,
  uploadBrandLogo,
  uploadMediaVideo,
} from '../controllers/brand.controller.js';
import {
  adminListBuyProducts,
  adminCreateBuyProduct,
  adminUpdateBuyProduct,
  adminDeleteBuyProduct,
  uploadBuyVideo,
} from '../controllers/buy.controller.js';
import {
  adminListRepairServices,
  adminCreateRepairService,
  adminUpdateRepairService,
  adminDeleteRepairService,
} from '../controllers/repair.controller.js';
import { upload, uploadVideo } from '../middleware/upload.js';

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
router.get('/buy-orders', getAllBuyOrders);
router.patch('/buy-orders/:id/status', updateBuyOrderStatus);
router.get('/repair-orders', getAllRepairOrders);
router.patch('/repair-orders/:id/status', updateRepairOrderStatus);

// Pincodes
router.get('/pincodes', getAllPincodes);
router.post('/pincodes', createPincode);
router.put('/pincodes/:id', updatePincode);
router.delete('/pincodes/:id', deletePincode);

// Analytics
router.get('/analytics', getAnalytics);
router.put('/analytics/meta-spend', upsertMetaSpend);

// Offers
router.get('/offers', adminListOffers);
router.post(
  '/offers',
  [body('title').trim().notEmpty().withMessage('Title is required')],
  adminCreateOffer,
);
router.put('/offers/:id', adminUpdateOffer);
router.delete('/offers/:id', adminDeleteOffer);

// Brands
router.get('/brands', listBrands);
router.get('/brands/logos', listBrandLogos);
router.get('/brands/:id', getBrandById);
router.post('/brands', createBrand);
router.put('/brands/:id', updateBrand);
router.delete('/brands/:id', deleteBrand);
router.post('/brands/upload-logo', upload.single('logo'), uploadBrandLogo);
router.post('/media/upload-video', uploadVideo.single('video'), uploadMediaVideo);

// Buy inventory (refurbished sell-to-customer)
router.get('/buy-products', adminListBuyProducts);
router.post('/buy-products', adminCreateBuyProduct);
router.put('/buy-products/:id', adminUpdateBuyProduct);
router.delete('/buy-products/:id', adminDeleteBuyProduct);
router.post('/buy-products/upload-video', uploadVideo.single('video'), uploadBuyVideo);

// Repair services
router.get('/repair-services', adminListRepairServices);
router.post('/repair-services', adminCreateRepairService);
router.put('/repair-services/:id', adminUpdateRepairService);
router.delete('/repair-services/:id', adminDeleteRepairService);

export default router;
