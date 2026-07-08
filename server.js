import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import errorHandler from './middleware/errorHandler.js';

import authRoutes from './routes/auth.routes.js';
import deviceRoutes from './routes/device.routes.js';
import orderRoutes from './routes/order.routes.js';
import userRoutes from './routes/user.routes.js';
import adminRoutes from './routes/admin.routes.js';
import partnerRoutes from './routes/partner.routes.js';
import pincodeRoutes from './routes/pincode.routes.js';

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://cash-kr.vercel.app",
  "https://cashkr-frontends.vercel.app",
  "https://www.devicekart.in",
  "https://devicekart.in",
  "http://www.devicekart.in",
  "http://devicekart.in",
];

if (process.env.CLIENT_URL) {
  allowedOrigins.push(process.env.CLIENT_URL);
}

const isAllowedOrigin = (origin) => {
  if (!origin) return true;
  if (allowedOrigins.includes(origin)) return true;
  // Allow VPS IP access during setup (http://x.x.x.x)
  if (/^https?:\/\/\d{1,3}(\.\d{1,3}){3}(:\d+)?$/.test(origin)) return true;
  return false;
};

app.use(cors({
  origin: function (origin, callback) {
    if (isAllowedOrigin(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/devices', deviceRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/partners', partnerRoutes);
app.use('/api/pincodes', pincodeRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
