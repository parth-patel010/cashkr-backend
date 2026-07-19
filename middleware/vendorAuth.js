import { verifyAccessToken } from '../config/jwt.js';
import Vendor from '../models/Vendor.js';

const vendorAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyAccessToken(token);
    if (decoded.role !== 'vendor') {
      return res.status(403).json({ message: 'Vendor access required' });
    }

    const vendor = await Vendor.findById(decoded.id).lean();
    if (!vendor || !vendor.isActive) {
      return res.status(401).json({ message: 'Vendor account inactive or not found', code: 'VENDOR_INACTIVE' });
    }

    req.vendor = { id: String(vendor._id), ...vendor };
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Session expired. Please login again.', code: 'TOKEN_EXPIRED' });
    }
    return res.status(401).json({ message: 'Invalid token' });
  }
};

export default vendorAuth;
