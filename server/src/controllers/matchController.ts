import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth';
import { Match } from '../models/Match';
import { Profile } from '../models/Profile';
import { sendSuccess, sendError } from '../utils/response';
import { Types } from 'mongoose';

import { RecommendationService } from '../services/recommendationService';

export class MatchController {
  /**
   * Get Mutual Matches for authenticated user
   */
  static async getMatches(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;

      const matches = await Match.find({
        $or: [{ user1: new Types.ObjectId(userId) }, { user2: new Types.ObjectId(userId) }],
        status: 'ACTIVE',
      }).sort({ matchedAt: -1 });

      const partnerUserIds = matches.map((m) =>
        m.user1.toString() === userId ? m.user2 : m.user1
      );

      const profiles = await Profile.find({ user: { $in: partnerUserIds } });
      const profileMap = new Map(profiles.map((p) => [p.user.toString(), p]));

      const result = matches.map((match) => {
        const partnerId = match.user1.toString() === userId ? match.user2.toString() : match.user1.toString();
        return {
          matchId: match._id,
          matchScore: match.matchScore,
          matchedAt: match.matchedAt,
          partnerProfile: profileMap.get(partnerId),
        };
      });

      sendSuccess(res, result, 'Mutual matches fetched');
    } catch (err: any) {
      sendError(res, err.message, 500);
    }
  }

  /**
   * Get Curated Daily Matches
   */
  static async getDailyMatches(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;
      const userProfile = await Profile.findOne({ user: userId });
      if (!userProfile) {
        sendError(res, 'Profile not found', 44);
        return;
      }
      const dailyMatches = await RecommendationService.getDailyMatches(userProfile);
      sendSuccess(res, dailyMatches, 'Daily matches fetched');
    } catch (err: any) {
      sendError(res, err.message, 500);
    }
  }

  /**
   * Get Categorized Recommendations
   */
  static async getCategories(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;
      const userProfile = await Profile.findOne({ user: userId });
      if (!userProfile) {
        sendError(res, 'Profile not found', 404);
        return;
      }
      const categories = await RecommendationService.getCategorizedRecommendations(userProfile);
      sendSuccess(res, categories, 'Categories fetched');
    } catch (err: any) {
      sendError(res, err.message, 500);
    }
  }
}

