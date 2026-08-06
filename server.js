import express from 'express';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import dotenv from 'dotenv';
dotenv.config();

import connectDB from './config/db.js';
import { getAllowedOrigins, isAllowedOrigin } from './config/origins.js';
import errorHandler from './middleware/errorHandler.js';
import { initChatSocket } from './socket/chatSocket.js';
import { globalLimiter, orderCreateLimiter } from './middleware/rateLimits.js';
import { logSecurityEvent } from './utils/logSecurityEvent.js';
import { uploadLeadImage } from './middleware/upload.js';
import { uploadLeadPhoto as handleLeadPhotoUpload } from './controllers/lead.controller.js';

import authRoutes from './routes/auth.routes.js';
import deviceRoutes from './routes/device.routes.js';
import orderRoutes from './routes/order.routes.js';
import userRoutes from './routes/user.routes.js';
import adminRoutes from './routes/admin.routes.js';
import partnerRoutes from './routes/partner.routes.js';
import pincodeRoutes from './routes/pincode.routes.js';
import eventRoutes from './routes/event.routes.js';
import offerRoutes from './routes/offer.routes.js';
import buyRoutes from './routes/buy.routes.js';
import repairRoutes from './routes/repair.routes.js';
import leadRoutes from './routes/lead.routes.js';
import chatRoutes from './routes/chat.routes.js';
import vendorRoutes from './routes/vendor.routes.js';
import appSettingsRoutes from './routes/appSettings.routes.js';
import categoryQuizRoutes from './routes/categoryQuiz.routes.js';
import { razorpayWebhook } from './controllers/razorpayWebhook.controller.js';

const app = express();
const server = http.createServer(app);

connectDB();
initChatSocket(server, app);

app.set('trust proxy', 1);

app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

app.use(cors({
  origin(origin, callback) {
    // Mobile apps and server-to-server often omit Origin
    if (!origin) {
      callback(null, true);
      return;
    }
    if (isAllowedOrigin(origin)) {
      callback(null, true);
      return;
    }
    logSecurityEvent({
      type: 'cors_blocked',
      ip: '',
      path: '',
      meta: { origin },
    }).catch(() => {});
    callback(null, false);
  },
  credentials: true,
}));

app.use(globalLimiter);

// Razorpay webhook needs the raw body for signature verification
app.post(
  '/api/webhooks/razorpay',
  express.raw({ type: 'application/json' }),
  razorpayWebhook,
);

app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());

// Public lead photo upload (works even if /api/leads isn't wired on an older deploy)
app.post(
  '/api/uploads/lead-photo',
  orderCreateLimiter,
  uploadLeadImage.single('photo'),
  handleLeadPhotoUpload,
);

// Local uploaded media (images/videos) — upload routes keep their own multer limits
app.use('/api/uploads', express.static(path.join(path.dirname(fileURLToPath(import.meta.url)), 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/devices', deviceRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/partners', partnerRoutes);
app.use('/api/pincodes', pincodeRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/offers', offerRoutes);
app.use('/api/buy', buyRoutes);
app.use('/api/repair', repairRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/vendor', vendorRoutes);
app.use('/api/app-settings', appSettingsRoutes);
app.use('/api/category-quizzes', categoryQuizRoutes);

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    allowedOrigins: getAllowedOrigins().length,
  });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
