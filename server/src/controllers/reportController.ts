import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth';
import { Report } from '../models/Report';
import { Block } from '../models/Block';
import { Profile } from '../models/Profile';
import { sendSuccess, sendError } from '../utils/response';
import { Types } from 'mongoose';

export class ReportController {
  /**
   * Report a profile or abusive behavior
   */
  static async reportUser(req: AuthRequest, res: Response): Promise<void> {
    try {
      const reporterId = req.user!.userId;
      const { reportedUserId, reason, description, evidenceUrls } = req.body;

      if (reporterId === reportedUserId) {
        sendError(res, 'Cannot report yourself', 400);
        return;
      }

      const report = await Report.create({
        reporter: new Types.ObjectId(reporterId),
        reportedUser: new Types.ObjectId(reportedUserId),
        reason,
        description,
        evidenceUrls,
        status: 'PENDING',
      });

      sendSuccess(res, report, 'Report submitted. Our safety team will review it within 24 hours.', 201);
    } catch (err: any) {
      sendError(res, err.message, 500);
    }
  }

  /**
   * Block a user
   */
  static async blockUser(req: AuthRequest, res: Response): Promise<void> {
    try {
      const blockerId = req.user!.userId;
      const { blockedUserId, reason } = req.body;

      if (blockerId === blockedUserId) {
        sendError(res, 'Cannot block yourself', 400);
        return;
      }

      await Block.findOneAndUpdate(
        {
          blocker: new Types.ObjectId(blockerId),
          blockedUser: new Types.ObjectId(blockedUserId),
        },
        { reason },
        { upsert: true }
      );

      sendSuccess(res, null, 'User blocked successfully');
    } catch (err: any) {
      sendError(res, err.message, 500);
    }
  }

  /**
   * Unblock a user
   */
  static async unblockUser(req: AuthRequest, res: Response): Promise<void> {
    try {
      const blockerId = req.user!.userId;
      const { blockedUserId } = req.params;

      await Block.findOneAndDelete({
        blocker: new Types.ObjectId(blockerId),
        blockedUser: new Types.ObjectId(blockedUserId),
      });

      sendSuccess(res, null, 'User unblocked successfully');
    } catch (err: any) {
      sendError(res, err.message, 500);
    }
  }

  /**
   * Get all blocked users
   */
  static async getBlockedUsers(req: AuthRequest, res: Response): Promise<void> {
    try {
      const blockerId = req.user!.userId;
      const blocks = await Block.find({ blocker: new Types.ObjectId(blockerId) });

      const blockedIds = blocks.map((b) => b.blockedUser);
      const profiles = await Profile.find({ user: { $in: blockedIds } });

      sendSuccess(res, profiles, 'Blocked users fetched');
    } catch (err: any) {
      sendError(res, err.message, 500);
    }
  }
}
