import Conversation from '../models/Conversation.js';
import ChatMessage from '../models/ChatMessage.js';
import User from '../models/User.js';

const getIo = (req) => req.app.get('io');

const roomIds = (conversation) => {
  const conversationId = String(conversation?._id || '');
  const userId = conversation?.userId != null ? String(conversation.userId) : '';
  return { conversationId, userId };
};

const emitChatMessage = (io, conversation, message) => {
  if (!io || !conversation) return;
  const { conversationId, userId } = roomIds(conversation);
  const payload = {
    conversation:
      typeof conversation.toObject === 'function' ? conversation.toObject() : conversation,
    message: typeof message.toObject === 'function' ? message.toObject() : message,
  };
  if (conversationId) {
    io.to(`conversation:${conversationId}`).emit('chat:message', payload);
  }
  if (userId) {
    io.to(`user:${userId}`).emit('chat:message', payload);
  }
  io.to('admins').emit('chat:message', payload);
  io.to('admins').emit('chat:conversation', payload.conversation);
};

const findActiveConversation = async (userId) => {
  let conversation = await Conversation.findOne({ userId, status: 'open' }).sort({
    lastMessageAt: -1,
  });
  if (!conversation) {
    conversation = await Conversation.findOne({ userId }).sort({ lastMessageAt: -1 });
  }
  return conversation;
};

export const getOrCreateMyConversation = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('name phone').lean();
    if (!user) return res.status(404).json({ message: 'User not found' });

    let conversation = await Conversation.findOne({ userId: req.user.id, status: 'open' }).sort({
      lastMessageAt: -1,
    });
    if (!conversation) {
      conversation = await Conversation.create({
        userId: req.user.id,
        userName: user.name || 'User',
        userPhone: user.phone || '',
        status: 'open',
      });
    } else {
      conversation.userName = user.name || conversation.userName;
      conversation.userPhone = user.phone || conversation.userPhone;
      await conversation.save();
    }

    res.json(conversation);
  } catch (error) {
    next(error);
  }
};

export const startNewConversation = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('name phone').lean();
    if (!user) return res.status(404).json({ message: 'User not found' });

    await Conversation.updateMany(
      { userId: req.user.id, status: 'open' },
      { $set: { status: 'closed' } },
    );

    const conversation = await Conversation.create({
      userId: req.user.id,
      userName: user.name || 'User',
      userPhone: user.phone || '',
      status: 'open',
      lastMessage: '',
      lastSenderType: '',
      lastMessageAt: new Date(),
      unreadByAdmin: 0,
      unreadByUser: 0,
    });

    const io = getIo(req);
    if (io) {
      io.to('admins').emit('chat:conversation', conversation.toObject());
      io.to(`user:${req.user.id}`).emit('chat:conversation', conversation.toObject());
    }

    res.status(201).json(conversation);
  } catch (error) {
    next(error);
  }
};

export const getMyMessages = async (req, res, next) => {
  try {
    const conversation = await findActiveConversation(req.user.id);
    if (!conversation) return res.json({ conversation: null, messages: [] });

    const messages = await ChatMessage.find({ conversationId: conversation._id })
      .sort({ createdAt: 1 })
      .limit(200)
      .lean();

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

    let conversation = await findActiveConversation(req.user.id);
    if (!conversation || conversation.status === 'closed') {
      conversation = await Conversation.create({
        userId: req.user.id,
        userName: user.name || 'User',
        userPhone: user.phone || '',
        status: 'open',
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

    emitChatMessage(getIo(req), conversation, message);

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

    emitChatMessage(getIo(req), conversation, message);

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
