import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth';
import { Shortlist } from '../models/Shortlist';
import { Profile } from '../models/Profile';
import { sendSuccess, sendError } from '../utils/response';
import { Types } from 'mongoose';

export class ShortlistController {
  /**
   * Toggle profile in user's shortlist
   */
  static async toggleShortlist(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;
      const { targetUserId, notes } = req.body;

      if (userId === targetUserId) {
        sendError(res, 'Cannot shortlist yourself', 400);
        return;
      }

      const existing = await Shortlist.findOne({
        user: new Types.ObjectId(userId),
        targetUser: new Types.ObjectId(targetUserId),
      });

      if (existing) {
        await Shortlist.findByIdAndDelete(existing._id);
        await Profile.findOneAndUpdate(
          { user: new Types.ObjectId(targetUserId) },
          { $inc: { shortlistCount: -1 } }
        );
        sendSuccess(res, { isShortlisted: false }, 'Profile removed from shortlist');
      } else {
        await Shortlist.create({
          user: new Types.ObjectId(userId),
          targetUser: new Types.ObjectId(targetUserId),
          notes,
        });
        await Profile.findOneAndUpdate(
          { user: new Types.ObjectId(targetUserId) },
          { $inc: { shortlistCount: 1 } }
        );
        sendSuccess(res, { isShortlisted: true }, 'Profile added to shortlist', 201);
      }
    } catch (err: any) {
      sendError(res, err.message, 500);
    }
  }

  /**
   * Get all shortlisted profiles
   */
  static async getShortlists(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;
      const shortlists = await Shortlist.find({ user: new Types.ObjectId(userId) }).sort({ createdAt: -1 });

      const targetIds = shortlists.map((s) => s.targetUser);
      const profiles = await Profile.find({ user: { $in: targetIds } });
      const profileMap = new Map(profiles.map((p) => [p.user.toString(), p]));

      const result = shortlists.map((item) => ({
        shortlistId: item._id,
        shortlistedAt: item.createdAt,
        notes: item.notes,
        profile: profileMap.get(item.targetUser.toString()),
      }));

      sendSuccess(res, result, 'Shortlisted profiles fetched');
    } catch (err: any) {
      sendError(res, err.message, 500);
    }
  }
}
