import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth';
import { User } from '../models/User';
import { Referral } from '../models/Referral';
import { sendSuccess, sendError } from '../utils/response';
import { Types } from 'mongoose';

export class ReferralController {
  /**
   * Get user referral link, stats & claimed rewards
   */
  static async getReferralStats(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;
      const user = await User.findById(userId);

      const referrals = await Referral.find({ referrer: new Types.ObjectId(userId) })
        .populate('referredUser', 'email phone createdAt')
        .sort({ createdAt: -1 });

      const totalReferred = referrals.length;
      const completedReferrals = referrals.filter((r) => r.status === 'COMPLETED' || r.status === 'REWARDED').length;
      const rewardsEarnedDays = completedReferrals * 7; // 7 days of free premium per referral

      sendSuccess(
        res,
        {
          referralCode: user?.referralCode,
          referralLink: `https://rishta24.in/invite/${user?.referralCode}`,
          totalReferred,
          completedReferrals,
          rewardsEarnedDays,
          referrals,
        },
        'Referral stats fetched'
      );
    } catch (err: any) {
      sendError(res, err.message, 500);
    }
  }
}
