import Notification from '../models/Notification.js';
import User from '../models/User.js';
import { sendExpoPush } from '../utils/pushNotifications.js';
import { absolutizeMediaUrl } from '../utils/mediaUrl.js';
import { createInboxNotifications } from '../utils/userInbox.js';
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
    const imageUrlRaw = typeof req.body.imageUrl === 'string' ? req.body.imageUrl.trim() : '';
    const imageUrl = absolutizeMediaUrl(imageUrlRaw);
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
      users = await User.find({}).select('_id pushTokens').lean();
    } else if (target === 'pincode') {
      users = await User.find({ 'addresses.pincode': pincode }).select('_id pushTokens').lean();
    } else if (target === 'user') {
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: 'Invalid userId' });
      }
      const user = await User.findById(userId).select('_id pushTokens').lean();
      if (!user) return res.status(404).json({ message: 'User not found' });
      users = [user];
    }

    const data = { type: 'admin_broadcast', target, ...(imageUrl ? { imageUrl } : {}) };

    await createInboxNotifications(
      users.map((u) => u._id),
      { title, body, imageUrl, data },
    );

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
      data,
      priority: 'high',
      channelId: 'general-notifications',
      ttl: 3600,
      _contentAvailable: true,
      ...(imageUrl ? { richContent: { image: imageUrl }, mutableContent: true } : {}),
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
      meta: {
        tokenCount: tokens.length,
        inboxUsers: users.length,
        errors: result.errors || [],
      },
    });

    res.status(201).json({
      notification: record,
      sent: result.sent,
      failed: result.failed,
      tokenCount: tokens.length,
      inboxUsers: users.length,
      errors: result.errors || [],
    });
  } catch (error) {
    next(error);
  }
};
