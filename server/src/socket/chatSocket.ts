import { Server, Socket } from 'socket.io';
import { verifyAccessToken } from '../utils/jwt';
import { Conversation } from '../models/Conversation';
import { Message } from '../models/Message';
import { Profile } from '../models/Profile';
import { Block } from '../models/Block';
import { Types } from 'mongoose';
import { logger } from '../utils/logger';

interface AuthenticatedSocket extends Socket {
  userId?: string;
}

export const setupChatSocket = (io: Server) => {
  const onlineUsers = new Map<string, string>(); // userId -> socketId

  // Middleware: verify JWT token on connection
  io.use((socket: AuthenticatedSocket, next) => {
    const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.split(' ')[1];
    if (!token) {
      return next(new Error('Authentication token required'));
    }

    try {
      const decoded = verifyAccessToken(token);
      socket.userId = decoded.userId;
      next();
    } catch (err) {
      next(new Error('Invalid socket token'));
    }
  });

  io.on('connection', async (socket: AuthenticatedSocket) => {
    const userId = socket.userId;
    if (!userId) return;

    onlineUsers.set(userId, socket.id);
    socket.join(`user_${userId}`);

    // Update online status in database
    await Profile.findOneAndUpdate(
      { user: new Types.ObjectId(userId) },
      { isOnline: true, lastActiveAt: new Date() }
    );

    // Broadcast user online status
    socket.broadcast.emit('user_presence_changed', { userId, isOnline: true, lastSeen: new Date() });
    logger.info(`Socket connected: User ${userId} (Socket: ${socket.id})`);

    // Join Conversation Room
    socket.on('join_conversation', (conversationId: string) => {
      socket.join(`conversation_${conversationId}`);
    });

    // Leave Conversation Room
    socket.on('leave_conversation', (conversationId: string) => {
      socket.leave(`conversation_${conversationId}`);
    });

    // Handle Send Message
    socket.on('send_message', async (data: {
      receiverId: string;
      text?: string;
      mediaUrl?: string;
      messageType?: 'TEXT' | 'IMAGE';
    }) => {
      try {
        const { receiverId, text, mediaUrl, messageType = 'TEXT' } = data;

        // Check if either user is blocked
        const isBlocked = await Block.findOne({
          $or: [
            { blocker: new Types.ObjectId(userId), blockedUser: new Types.ObjectId(receiverId) },
            { blocker: new Types.ObjectId(receiverId), blockedUser: new Types.ObjectId(userId) },
          ],
        });

        if (isBlocked) {
          socket.emit('message_error', { message: 'Cannot message this user' });
          return;
        }

        // Find or create conversation
        let conversation = await Conversation.findOne({
          participants: { $all: [new Types.ObjectId(userId), new Types.ObjectId(receiverId)] },
        });

        if (!conversation) {
          conversation = await Conversation.create({
            participants: [new Types.ObjectId(userId), new Types.ObjectId(receiverId)],
            lastMessage: text || (mediaUrl ? 'Photo' : ''),
            lastMessageType: messageType,
            lastMessageSender: new Types.ObjectId(userId),
            lastMessageAt: new Date(),
          });
        } else {
          conversation.lastMessage = text || (mediaUrl ? 'Photo' : '');
          conversation.lastMessageType = messageType;
          conversation.lastMessageSender = new Types.ObjectId(userId);
          conversation.lastMessageAt = new Date();
          await conversation.save();
        }

        // Create message in DB
        const message = await Message.create({
          conversationId: conversation._id,
          sender: new Types.ObjectId(userId),
          receiver: new Types.ObjectId(receiverId),
          messageType,
          text,
          mediaUrl,
          status: 'SENT',
        });

        // Emit to sender
        socket.emit('message_sent', { message, conversationId: conversation._id });

        // Emit to recipient's room
        io.to(`user_${receiverId}`).emit('new_message', {
          message,
          conversationId: conversation._id,
        });

        // Emit to conversation room if active
        io.to(`conversation_${conversation._id}`).emit('message_received', message);
      } catch (err: any) {
        logger.error(`Error sending message via socket: ${err.message}`);
        socket.emit('message_error', { message: 'Failed to deliver message' });
      }
    });

    // Typing Indicators
    socket.on('typing_start', ({ conversationId, receiverId }) => {
      io.to(`user_${receiverId}`).emit('user_typing_start', { conversationId, userId });
    });

    socket.on('typing_stop', ({ conversationId, receiverId }) => {
      io.to(`user_${receiverId}`).emit('user_typing_stop', { conversationId, userId });
    });

    // Message Read Receipts
    socket.on('mark_messages_read', async ({ conversationId, senderId }) => {
      try {
        await Message.updateMany(
          {
            conversationId: new Types.ObjectId(conversationId),
            sender: new Types.ObjectId(senderId),
            status: { $ne: 'READ' },
          },
          { status: 'READ', readAt: new Date() }
        );

        io.to(`user_${senderId}`).emit('messages_read', { conversationId, readBy: userId });
      } catch (err) {
        // ignore
      }
    });

    // Disconnect
    socket.on('disconnect', async () => {
      onlineUsers.delete(userId);
      await Profile.findOneAndUpdate(
        { user: new Types.ObjectId(userId) },
        { isOnline: false, lastActiveAt: new Date() }
      );
      socket.broadcast.emit('user_presence_changed', { userId, isOnline: false, lastSeen: new Date() });
      logger.info(`Socket disconnected: User ${userId}`);
    });
  });
};
