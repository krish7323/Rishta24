import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth';
import { Conversation } from '../models/Conversation';
import { Message } from '../models/Message';
import { Profile } from '../models/Profile';
import { sendSuccess, sendError } from '../utils/response';
import { Types } from 'mongoose';

export class ChatController {
  /**
   * Get all active conversations for authenticated user
   */
  static async getConversations(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;

      const conversations = await Conversation.find({
        participants: new Types.ObjectId(userId),
      }).sort({ lastMessageAt: -1 });

      const otherUserIds: Types.ObjectId[] = [];
      conversations.forEach((c) => {
        const otherId = c.participants.find((p) => p.toString() !== userId);
        if (otherId) otherUserIds.push(otherId);
      });

      const profiles = await Profile.find({ user: { $in: otherUserIds } });
      const profileMap = new Map(profiles.map((p) => [p.user.toString(), p]));

      const result = conversations.map((conv) => {
        const otherId = conv.participants.find((p) => p.toString() !== userId)?.toString() || '';
        return {
          _id: conv._id,
          lastMessage: conv.lastMessage,
          lastMessageType: conv.lastMessageType,
          lastMessageSender: conv.lastMessageSender,
          lastMessageAt: conv.lastMessageAt,
          isBlocked: conv.isBlocked,
          unreadCount: conv.unreadCounts.get(userId) || 0,
          partnerProfile: profileMap.get(otherId),
        };
      });

      sendSuccess(res, result, 'Conversations fetched successfully');
    } catch (err: any) {
      sendError(res, err.message, 500);
    }
  }

  /**
   * Get messages for a specific conversation
   */
  static async getMessages(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;
      const { conversationId } = req.params;
      const { page = 1, limit = 50 } = req.query as any;

      const conversation = await Conversation.findOne({
        _id: new Types.ObjectId(conversationId),
        participants: new Types.ObjectId(userId),
      });

      if (!conversation) {
        sendError(res, 'Conversation not found', 404);
        return;
      }

      const skip = (Number(page) - 1) * Number(limit);
      const total = await Message.countDocuments({
        conversationId: new Types.ObjectId(conversationId),
        deletedFor: { $ne: new Types.ObjectId(userId) },
      });

      const messages = await Message.find({
        conversationId: new Types.ObjectId(conversationId),
        deletedFor: { $ne: new Types.ObjectId(userId) },
      })
        .sort({ createdAt: 1 })
        .skip(skip)
        .limit(Number(limit));

      // Mark unread messages as read
      await Message.updateMany(
        {
          conversationId: new Types.ObjectId(conversationId),
          receiver: new Types.ObjectId(userId),
          status: { $ne: 'READ' },
        },
        { status: 'READ', readAt: new Date() }
      );

      sendSuccess(res, messages, 'Messages fetched', 200, {
        page: Number(page),
        limit: Number(limit),
        total,
      });
    } catch (err: any) {
      sendError(res, err.message, 500);
    }
  }

  /**
   * Send text / photo message via REST (fallback for socket)
   */
  static async sendMessage(req: AuthRequest, res: Response): Promise<void> {
    try {
      const senderId = req.user!.userId;
      const { receiverId, text, mediaUrl, messageType = 'TEXT' } = req.body;

      let conversation = await Conversation.findOne({
        participants: { $all: [new Types.ObjectId(senderId), new Types.ObjectId(receiverId)] },
      });

      if (!conversation) {
        conversation = await Conversation.create({
          participants: [new Types.ObjectId(senderId), new Types.ObjectId(receiverId)],
          lastMessage: text || (mediaUrl ? 'Photo' : ''),
          lastMessageType: messageType,
          lastMessageSender: new Types.ObjectId(senderId),
          lastMessageAt: new Date(),
        });
      } else {
        conversation.lastMessage = text || (mediaUrl ? 'Photo' : '');
        conversation.lastMessageType = messageType;
        conversation.lastMessageSender = new Types.ObjectId(senderId);
        conversation.lastMessageAt = new Date();
        await conversation.save();
      }

      const message = await Message.create({
        conversationId: conversation._id,
        sender: new Types.ObjectId(senderId),
        receiver: new Types.ObjectId(receiverId),
        messageType,
        text,
        mediaUrl,
        status: 'SENT',
      });

      sendSuccess(res, { message, conversationId: conversation._id }, 'Message sent', 201);
    } catch (err: any) {
      sendError(res, err.message, 500);
    }
  }

  /**
   * Get Suggested Conversation Starters
   */
  static async getStarters(req: AuthRequest, res: Response): Promise<void> {
    try {
      const starters = [
        'Hi! I really liked your profile. How has your week been?',
        'What is your favourite pastime or weekend activity?',
        'Tell me a little about your current work and career goals.',
        'Which places do you love visiting the most when traveling?',
      ];
      sendSuccess(res, { starters }, 'Conversation starters fetched');
    } catch (err: any) {
      sendError(res, err.message, 500);
    }
  }
}

