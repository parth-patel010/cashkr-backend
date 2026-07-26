import Notification from '../models/Notification.js';
import User from '../models/User.js';
import { sendExpoPush } from '../utils/pushNotifications.js';
import mongoose from 'mongoose';

export const adminListNotifications = async (req, res, next) => {
  try {
    const limit = Math.min(parseInt(req.query.limit, 10) || 50, 200);
    const notifications = await Notification.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
    res.json(notifications);
  } catch (error) {
    next(error);
  }
};

export const adminSendNotification = async (req, res, next) => {
  try {
    const title = typeof req.body.title === 'string' ? req.body.title.trim() : '';
    const body = typeof req.body.body === 'string' ? req.body.body.trim() : '';
    const imageUrl = typeof req.body.imageUrl === 'string' ? req.body.imageUrl.trim() : '';
    const target = ['all', 'pincode', 'user'].includes(req.body.target)
      ? req.body.target
      : 'all';
    const pincode = typeof req.body.pincode === 'string' ? req.body.pincode.trim() : '';
    const userId = req.body.userId;

    if (!title || !body) {
      return res.status(400).json({ message: 'Title and body are required' });
    }

    if (target === 'pincode' && !pincode) {
      return res.status(400).json({ message: 'Pincode is required for pincode target' });
    }

    if (target === 'user' && !userId) {
      return res.status(400).json({ message: 'userId is required for user target' });
    }

    let users = [];
    if (target === 'all') {
      users = await User.find({ pushTokens: { $exists: true, $ne: [] } })
        .select('pushTokens')
        .lean();
    } else if (target === 'pincode') {
      users = await User.find({
        pushTokens: { $exists: true, $ne: [] },
        'addresses.pincode': pincode,
      })
        .select('pushTokens')
        .lean();
    } else if (target === 'user') {
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: 'Invalid userId' });
      }
      const user = await User.findById(userId).select('pushTokens').lean();
      if (!user) return res.status(404).json({ message: 'User not found' });
      users = [user];
    }

    const tokens = [
      ...new Set(
        users.flatMap((u) =>
          Array.isArray(u.pushTokens)
            ? u.pushTokens.filter((t) => typeof t === 'string' && t.trim())
            : [],
        ),
      ),
    ];

    const messages = tokens.map((to) => ({
      to,
      sound: 'default',
      title,
      body,
      data: { type: 'admin_broadcast', target },
      ...(imageUrl ? { richContent: { image: imageUrl } } : {}),
    }));

    const result = await sendExpoPush(messages);

    const record = await Notification.create({
      title,
      body,
      imageUrl,
      target,
      pincode: target === 'pincode' ? pincode : '',
      userId: target === 'user' ? userId : null,
      sentCount: result.sent,
      failedCount: result.failed,
      meta: { tokenCount: tokens.length },
    });

    res.status(201).json({
      notification: record,
      sent: result.sent,
      failed: result.failed,
      tokenCount: tokens.length,
    });
  } catch (error) {
    next(error);
  }
};
