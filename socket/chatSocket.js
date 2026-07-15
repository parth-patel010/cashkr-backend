import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import { verifyAccessToken } from '../config/jwt.js';
import { isAllowedOrigin } from '../config/origins.js';

/**
 * Attach Socket.io to the HTTP server for live chat.
 * Clients send auth: { token, role: 'user' | 'admin' }
 */
export function initChatSocket(httpServer, app) {
  const io = new Server(httpServer, {
    cors: {
      origin(origin, callback) {
        if (!origin || isAllowedOrigin(origin)) {
          callback(null, true);
          return;
        }
        callback(new Error('Not allowed by CORS'));
      },
      credentials: true,
    },
    path: '/socket.io',
  });

  app.set('io', io);

  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token || socket.handshake.query?.token;
      const role = socket.handshake.auth?.role || socket.handshake.query?.role || 'user';

      if (!token) {
        return next(new Error('Unauthorized'));
      }

      if (role === 'admin') {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded.isAdmin) return next(new Error('Forbidden'));
        socket.data.role = 'admin';
        socket.data.adminEmail = decoded.email;
        return next();
      }

      const decoded = verifyAccessToken(token);
      socket.data.role = 'user';
      socket.data.userId = decoded.id;
      return next();
    } catch {
      return next(new Error('Unauthorized'));
    }
  });

  io.on('connection', (socket) => {
    if (socket.data.role === 'admin') {
      socket.join('admins');
    } else if (socket.data.userId) {
      socket.join(`user:${socket.data.userId}`);
    }

    socket.on('chat:join', (conversationId) => {
      if (!conversationId) return;
      socket.join(`conversation:${conversationId}`);
    });

    socket.on('chat:leave', (conversationId) => {
      if (!conversationId) return;
      socket.leave(`conversation:${conversationId}`);
    });
  });

  return io;
}
