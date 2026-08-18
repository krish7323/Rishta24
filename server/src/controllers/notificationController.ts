import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth';
import { Notification } from '../models/Notification';
import { sendSuccess, sendError } from '../utils/response';
import { Types } from 'mongoose';

export class NotificationController {
  /**
   * Get all in-app notifications
   */
  static async getNotifications(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;
      const notifications = await Notification.find({ recipient: new Types.ObjectId(userId) })
        .sort({ createdAt: -1 })
        .limit(40);

      const unreadCount = await Notification.countDocuments({
        recipient: new Types.ObjectId(userId),
        isRead: false,
      });

      sendSuccess(res, { notifications, unreadCount }, 'Notifications fetched');
    } catch (err: any) {
      sendError(res, err.message, 500);
    }
  }

  /**
   * Mark all as read
   */
  static async markAllRead(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;
      await Notification.updateMany(
        { recipient: new Types.ObjectId(userId), isRead: false },
        { isRead: true, readAt: new Date() }
      );
      sendSuccess(res, null, 'All notifications marked as read');
    } catch (err: any) {
      sendError(res, err.message, 500);
    }
  }
}
