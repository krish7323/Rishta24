import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth';
import { SupportTicket } from '../models/SupportTicket';
import { sendSuccess, sendError } from '../utils/response';
import { Types } from 'mongoose';

export class SupportController {
  /**
   * Create a new support ticket
   */
  static async createTicket(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;
      const { subject, category, message, priority = 'MEDIUM' } = req.body;

      const ticketNumber = `TKT-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

      const ticket = await SupportTicket.create({
        ticketNumber,
        user: new Types.ObjectId(userId),
        subject,
        category,
        priority,
        status: 'OPEN',
        messages: [
          {
            sender: new Types.ObjectId(userId),
            senderRole: 'USER',
            message,
            sentAt: new Date(),
          },
        ],
      });

      sendSuccess(res, ticket, 'Support ticket created successfully', 201);
    } catch (err: any) {
      sendError(res, err.message, 500);
    }
  }

  /**
   * Get my tickets
   */
  static async getMyTickets(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;
      const tickets = await SupportTicket.find({ user: new Types.ObjectId(userId) }).sort({ createdAt: -1 });
      sendSuccess(res, tickets, 'Support tickets fetched');
    } catch (err: any) {
      sendError(res, err.message, 500);
    }
  }

  /**
   * Add message to existing ticket
   */
  static async addMessage(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;
      const { ticketId } = req.params;
      const { message } = req.body;

      const ticket = await SupportTicket.findOne({
        _id: new Types.ObjectId(ticketId),
        user: new Types.ObjectId(userId),
      });

      if (!ticket) {
        sendError(res, 'Ticket not found', 404);
        return;
      }

      ticket.messages.push({
        sender: new Types.ObjectId(userId),
        senderRole: 'USER',
        message,
        sentAt: new Date(),
      });

      if (ticket.status === 'RESOLVED' || ticket.status === 'CLOSED') {
        ticket.status = 'IN_PROGRESS';
      }

      await ticket.save();
      sendSuccess(res, ticket, 'Message added to ticket');
    } catch (err: any) {
      sendError(res, err.message, 500);
    }
  }
}
