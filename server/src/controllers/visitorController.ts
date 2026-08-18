import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth';
import { Visitor } from '../models/Visitor';
import { Profile } from '../models/Profile';
import { Subscription } from '../models/Subscription';
import { sendSuccess, sendError } from '../utils/response';
import { Types } from 'mongoose';

export class VisitorController {
  /**
   * Get who viewed my profile
   */
  static async getVisitors(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;

      // Check subscription
      const subscription = await Subscription.findOne({
        user: new Types.ObjectId(userId),
        status: 'ACTIVE',
      });

      const canViewAll = subscription?.features?.canViewVisitors || false;
      const limit = canViewAll ? 50 : 5; // Free users get preview of latest 5 visitors

      const visitors = await Visitor.find({ profileOwner: new Types.ObjectId(userId) })
        .sort({ lastViewedAt: -1 })
        .limit(limit);

      const viewerIds = visitors.map((v) => v.viewer);
      const profiles = await Profile.find({ user: { $in: viewerIds } });
      const profileMap = new Map(profiles.map((p) => [p.user.toString(), p]));

      const result = visitors.map((v) => ({
        visitorId: v._id,
        viewCount: v.viewCount,
        lastViewedAt: v.lastViewedAt,
        profile: profileMap.get(v.viewer.toString()),
      }));

      sendSuccess(
        res,
        {
          visitors: result,
          isPremiumUnlocked: canViewAll,
          totalVisitors: await Visitor.countDocuments({ profileOwner: new Types.ObjectId(userId) }),
        },
        'Visitor history fetched'
      );
    } catch (err: any) {
      sendError(res, err.message, 500);
    }
  }
}
