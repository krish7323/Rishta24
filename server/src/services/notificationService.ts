import { Types } from 'mongoose';
import { Notification } from '../models/Notification';
import { NOTIFICATION_TYPES } from '../config/constants';
import { logger } from '../utils/logger';

export class NotificationService {
  /**
   * Create and send in-app notification
   */
  static async sendNotification(params: {
    recipientId: string;
    senderId?: string;
    type: keyof typeof NOTIFICATION_TYPES;
    title: string;
    body: string;
    data?: Record<string, any>;
  }) {
    try {
      const notification = await Notification.create({
        recipient: new Types.ObjectId(params.recipientId),
        sender: params.senderId ? new Types.ObjectId(params.senderId) : undefined,
        type: params.type,
        title: params.title,
        body: params.body,
        data: params.data,
      });

      logger.info(`Notification sent to ${params.recipientId}: ${params.title}`);
      return notification;
    } catch (err: any) {
      logger.error(`Error sending notification: ${err.message}`);
    }
  }
}
