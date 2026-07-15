import Conversation from '../models/Conversation.js';
import ChatMessage from '../models/ChatMessage.js';
import User from '../models/User.js';

const getIo = (req) => req.app.get('io');

export const getOrCreateMyConversation = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('name phone').lean();
    if (!user) return res.status(404).json({ message: 'User not found' });

    let conversation = await Conversation.findOne({ userId: req.user.id });
    if (!conversation) {
      conversation = await Conversation.create({
        userId: req.user.id,
        userName: user.name || 'User',
        userPhone: user.phone || '',
        status: 'open',
      });
    } else {
      // keep snapshot fresh
      conversation.userName = user.name || conversation.userName;
      conversation.userPhone = user.phone || conversation.userPhone;
      await conversation.save();
    }

    res.json(conversation);
  } catch (error) {
    next(error);
  }
};

export const getMyMessages = async (req, res, next) => {
  try {
    const conversation = await Conversation.findOne({ userId: req.user.id });
    if (!conversation) return res.json({ conversation: null, messages: [] });

    const messages = await ChatMessage.find({ conversationId: conversation._id })
      .sort({ createdAt: 1 })
      .limit(200)
      .lean();

    // Mark admin messages as read for user
    if (conversation.unreadByUser > 0) {
      conversation.unreadByUser = 0;
      await conversation.save();
    }

    res.json({ conversation, messages });
  } catch (error) {
    next(error);
  }
};

export const sendUserMessage = async (req, res, next) => {
  try {
    const text = String(req.body.text || '').trim();
    if (!text) return res.status(400).json({ message: 'Message text is required' });

    const user = await User.findById(req.user.id).select('name phone').lean();
    if (!user) return res.status(404).json({ message: 'User not found' });

    let conversation = await Conversation.findOne({ userId: req.user.id });
    if (!conversation) {
      conversation = await Conversation.create({
        userId: req.user.id,
        userName: user.name || 'User',
        userPhone: user.phone || '',
      });
    }

    conversation.userName = user.name || conversation.userName;
    conversation.userPhone = user.phone || conversation.userPhone;
    conversation.lastMessage = text.slice(0, 180);
    conversation.lastSenderType = 'user';
    conversation.lastMessageAt = new Date();
    conversation.unreadByAdmin = (conversation.unreadByAdmin || 0) + 1;
    conversation.status = 'open';
    await conversation.save();

    const message = await ChatMessage.create({
      conversationId: conversation._id,
      senderType: 'user',
      senderId: String(req.user.id),
      text,
    });

    const payload = {
      conversation: conversation.toObject(),
      message: message.toObject(),
    };

    const io = getIo(req);
    if (io) {
      io.to('admins').emit('chat:message', payload);
      io.to(`conversation:${conversation._id}`).emit('chat:message', payload);
      io.to('admins').emit('chat:conversation', conversation.toObject());
    }

    res.status(201).json(payload);
  } catch (error) {
    next(error);
  }
};

export const adminListConversations = async (req, res, next) => {
  try {
    const { search, status } = req.query;
    const query = {};
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { userName: new RegExp(search, 'i') },
        { userPhone: new RegExp(search, 'i') },
        { lastMessage: new RegExp(search, 'i') },
      ];
    }

    const conversations = await Conversation.find(query)
      .sort({ lastMessageAt: -1 })
      .limit(100)
      .lean();

    res.json({ conversations });
  } catch (error) {
    next(error);
  }
};

export const adminGetMessages = async (req, res, next) => {
  try {
    const conversation = await Conversation.findById(req.params.id).lean();
    if (!conversation) return res.status(404).json({ message: 'Conversation not found' });

    const messages = await ChatMessage.find({ conversationId: conversation._id })
      .sort({ createdAt: 1 })
      .limit(300)
      .lean();

    await Conversation.findByIdAndUpdate(conversation._id, { unreadByAdmin: 0 });

    res.json({ conversation: { ...conversation, unreadByAdmin: 0 }, messages });
  } catch (error) {
    next(error);
  }
};

export const adminSendMessage = async (req, res, next) => {
  try {
    const text = String(req.body.text || '').trim();
    if (!text) return res.status(400).json({ message: 'Message text is required' });

    const conversation = await Conversation.findById(req.params.id);
    if (!conversation) return res.status(404).json({ message: 'Conversation not found' });

    conversation.lastMessage = text.slice(0, 180);
    conversation.lastSenderType = 'admin';
    conversation.lastMessageAt = new Date();
    conversation.unreadByUser = (conversation.unreadByUser || 0) + 1;
    conversation.status = 'open';
    await conversation.save();

    const message = await ChatMessage.create({
      conversationId: conversation._id,
      senderType: 'admin',
      senderId: req.admin?.email || 'admin',
      text,
    });

    const payload = {
      conversation: conversation.toObject(),
      message: message.toObject(),
    };

    const io = getIo(req);
    if (io) {
      io.to(`user:${conversation.userId}`).emit('chat:message', payload);
      io.to(`conversation:${conversation._id}`).emit('chat:message', payload);
      io.to('admins').emit('chat:conversation', conversation.toObject());
    }

    res.status(201).json(payload);
  } catch (error) {
    next(error);
  }
};

export const adminCloseConversation = async (req, res, next) => {
  try {
    const conversation = await Conversation.findByIdAndUpdate(
      req.params.id,
      { status: 'closed' },
      { new: true },
    );
    if (!conversation) return res.status(404).json({ message: 'Conversation not found' });

    const io = getIo(req);
    if (io) {
      io.to('admins').emit('chat:conversation', conversation.toObject());
      io.to(`user:${conversation.userId}`).emit('chat:conversation', conversation.toObject());
    }

    res.json(conversation);
  } catch (error) {
    next(error);
  }
};
