import { Router } from 'express';
import { body } from 'express-validator';
import adminAuth from '../middleware/adminAuth.js';
import { adminLoginLimiter } from '../middleware/rateLimits.js';
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
  exportUsers,
  updateOrderStatus,
  adminLaterAdjustOrder,
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
  uploadMediaImage,
} from '../controllers/brand.controller.js';
import {
  adminListBuyProducts,
  adminCreateBuyProduct,
  adminUpdateBuyProduct,
  adminDeleteBuyProduct,
  uploadBuyVideo,
} from '../controllers/buy.controller.js';
import {
  adminListVendors,
  adminGetVendor,
  adminCreateVendor,
  adminUpdateVendor,
  adminAdjustWallet,
  adminApprovePartnerAsVendor,
  adminListTraining,
  adminUpsertTraining,
  adminDeleteTraining,
  adminAssignOrderVendor,
} from '../controllers/adminVendor.controller.js';
import {
  adminGetAppSettings,
  adminUpdateAppSettings,
} from '../controllers/appSettings.controller.js';
import {
  adminListCategoryQuizzes,
  adminGetCategoryQuiz,
  adminCreateCategoryQuiz,
  adminUpdateCategoryQuiz,
  adminDeleteCategoryQuiz,
} from '../controllers/categoryQuiz.controller.js';
import {
  getValuationTestModels,
  getValuationTestDevices,
  cashifyStatus,
  cashifyVerifySession,
  cashifyRequestOtp,
  cashifyVerifyOtp,
  cashifyLogout,
  runValuationTestQuote,
  getLastAgentRun,
  downloadLastAgentRun,
} from '../controllers/valuationTest.controller.js';
import {
  adminListNotifications,
  adminSendNotification,
} from '../controllers/notification.controller.js';
import {
  getPricingAgentStats,
  getPricingAgentRecords,
  syncPricingAgent,
  runAllPricingAgent,
  exportPricingAgent,
} from '../controllers/pricingAgent.controller.js';
import { adminSecurityAudit } from '../controllers/security.controller.js';

import {
  adminListRepairServices,
  adminCreateRepairService,
  adminUpdateRepairService,
  adminDeleteRepairService,
  adminListRepairTemplates,
  adminCreateRepairTemplate,
  adminUpdateRepairTemplate,
  adminDeleteRepairTemplate,
  adminApplyRepairTemplate,
} from '../controllers/repair.controller.js';
import {
  adminListConversations,
  adminGetMessages,
  adminSendMessage,
  adminCloseConversation,
} from '../controllers/chat.controller.js';
import { upload, uploadBrandImage, uploadVideo, uploadBuyVideoMulter } from '../middleware/upload.js';
import { getAllLeads, updateLeadStatus } from '../controllers/lead.controller.js';

const router = Router();

// Public admin login
router.post('/login', adminLoginLimiter, adminLogin);

// All routes below require admin auth
router.use(adminAuth);

// Dashboard
router.get('/stats', getDashboardStats);

// Users
router.get('/users', getAllUsers);
router.get('/users/export', exportUsers);
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
router.patch('/orders/:id/later-adjustment', adminLaterAdjustOrder);
router.get('/buy-orders', getAllBuyOrders);
router.patch('/buy-orders/:id/status', updateBuyOrderStatus);
router.get('/repair-orders', getAllRepairOrders);
router.patch('/repair-orders/:id/status', updateRepairOrderStatus);

// Leads (TV / Fridge / Repair request forms)
router.get('/leads', getAllLeads);
router.patch('/leads/:id/status', updateLeadStatus);

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
router.post('/brands/upload-logo', uploadBrandImage.single('logo'), uploadBrandLogo);
router.post('/media/upload-video', uploadVideo.single('video'), uploadMediaVideo);
router.post('/media/upload-image', upload.single('image'), uploadMediaImage);

// Buy inventory (refurbished sell-to-customer)
router.get('/buy-products', adminListBuyProducts);
router.post('/buy-products', adminCreateBuyProduct);
router.put('/buy-products/:id', adminUpdateBuyProduct);
router.delete('/buy-products/:id', adminDeleteBuyProduct);
router.post('/buy-products/upload-video', uploadBuyVideoMulter.single('video'), uploadBuyVideo);

// Repair services
router.get('/repair-services', adminListRepairServices);
router.post('/repair-services', adminCreateRepairService);
router.put('/repair-services/:id', adminUpdateRepairService);
router.delete('/repair-services/:id', adminDeleteRepairService);

router.get('/repair-templates', adminListRepairTemplates);
router.post('/repair-templates', adminCreateRepairTemplate);
router.put('/repair-templates/:id', adminUpdateRepairTemplate);
router.delete('/repair-templates/:id', adminDeleteRepairTemplate);
router.post('/repair-templates/:id/apply', adminApplyRepairTemplate);

// Live chat
router.get('/chat/conversations', adminListConversations);
router.get('/chat/conversations/:id/messages', adminGetMessages);
router.post('/chat/conversations/:id/messages', adminSendMessage);
router.patch('/chat/conversations/:id/close', adminCloseConversation);

// Vendors (field partners)
router.get('/vendors', adminListVendors);
router.get('/vendors/:id', adminGetVendor);
router.post('/vendors', adminCreateVendor);
router.put('/vendors/:id', adminUpdateVendor);
router.post('/vendors/:id/adjust-wallet', adminAdjustWallet);
router.post('/partners/:id/approve-vendor', adminApprovePartnerAsVendor);
router.patch('/orders/:orderId/assign-vendor', adminAssignOrderVendor);

router.get('/vendor-training', adminListTraining);
router.post('/vendor-training', adminUpsertTraining);
router.put('/vendor-training/:id', adminUpsertTraining);
router.delete('/vendor-training/:id', adminDeleteTraining);

router.get('/app-settings', adminGetAppSettings);
router.put('/app-settings', adminUpdateAppSettings);

// Category quizzes
router.get('/category-quizzes', adminListCategoryQuizzes);
router.get('/category-quizzes/:id', adminGetCategoryQuiz);
router.post(
  '/category-quizzes',
  [body('category').trim().notEmpty().withMessage('Category is required')],
  adminCreateCategoryQuiz,
);
router.put('/category-quizzes/:id', adminUpdateCategoryQuiz);
router.delete('/category-quizzes/:id', adminDeleteCategoryQuiz);

// Notifications
router.get('/notifications', adminListNotifications);
router.post('/notifications/send', adminSendNotification);

// Security audit
router.get('/security-audit', adminSecurityAudit);

// Valuation test (Cashify agent sandbox)
router.get('/valuation-test/models', getValuationTestModels);
router.get('/valuation-test/devices', getValuationTestDevices);
router.get('/valuation-test/cashify/status', cashifyStatus);
router.post('/valuation-test/cashify/verify-session', cashifyVerifySession);
router.post('/valuation-test/cashify/request-otp', cashifyRequestOtp);
router.post('/valuation-test/cashify/verify-otp', cashifyVerifyOtp);
router.post('/valuation-test/cashify/logout', cashifyLogout);
router.post('/valuation-test/quote', runValuationTestQuote);
router.get('/valuation-test/last-run', getLastAgentRun);
router.get('/valuation-test/last-run/download', downloadLastAgentRun);

// Pricing agent (Cashify batch worker)
router.get('/pricing-agent/stats', getPricingAgentStats);
router.get('/pricing-agent/records', getPricingAgentRecords);
router.post('/pricing-agent/sync', syncPricingAgent);
router.post('/pricing-agent/run-all', runAllPricingAgent);
router.get('/pricing-agent/export', exportPricingAgent);

export default router;
