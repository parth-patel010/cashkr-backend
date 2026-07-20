import express from 'express';
import http from 'http';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import dotenv from 'dotenv';
dotenv.config();

import connectDB from './config/db.js';
import { getAllowedOrigins, isAllowedOrigin } from './config/origins.js';
import errorHandler from './middleware/errorHandler.js';
import { initChatSocket } from './socket/chatSocket.js';

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
import chatRoutes from './routes/chat.routes.js';
import vendorRoutes from './routes/vendor.routes.js';
import appSettingsRoutes from './routes/appSettings.routes.js';

const app = express();
const server = http.createServer(app);

connectDB();
initChatSocket(server, app);

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
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());

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
app.use('/api/chat', chatRoutes);
app.use('/api/vendor', vendorRoutes);
app.use('/api/app-settings', appSettingsRoutes);

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
