import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth';
import { Profile } from '../models/Profile';
import { Block } from '../models/Block';
import { calculateCompatibilityScore } from '../services/matchingAlgorithm';
import { sendSuccess, sendError } from '../utils/response';
import { Types } from 'mongoose';

export class SearchController {
  /**
   * Advanced Matrimonial Profile Search
   */
  static async searchProfiles(req: AuthRequest, res: Response): Promise<void> {
    try {
      const callerUserId = req.user?.userId;
      const {
        gender,
        minAge,
        maxAge,
        minHeight,
        maxHeight,
        religion,
        community,
        caste,
        motherTongue,
        city,
        state,
        maritalStatus,
        educationLevel,
        occupation,
        diet,
        minIncome,
        isVerifiedOnly,
        isPremiumOnly,
        hasPhotoOnly,
        sortBy = 'compatibility',
        page = 1,
        limit = 20,
      } = req.query as any;

      let callerProfile: any = null;
      let targetGender = gender;

      if (callerUserId) {
        callerProfile = await Profile.findOne({ user: new Types.ObjectId(callerUserId) });
        if (!targetGender && callerProfile) {
          // Default to opposite gender
          targetGender = callerProfile.gender === 'MALE' ? 'FEMALE' : 'MALE';
        }
      }

      const query: any = {};

      // Exclude caller's own profile
      if (callerUserId) {
        query.user = { $ne: new Types.ObjectId(callerUserId) };

        // Exclude blocked users
        const blockedRecords = await Block.find({
          $or: [{ blocker: new Types.ObjectId(callerUserId) }, { blockedUser: new Types.ObjectId(callerUserId) }],
        });
        const excludedUserIds = blockedRecords.map((b) =>
          b.blocker.toString() === callerUserId ? b.blockedUser : b.blocker
        );
        if (excludedUserIds.length > 0) {
          query.user = { $nin: [new Types.ObjectId(callerUserId), ...excludedUserIds] };
        }
      }

      if (targetGender) {
        query.gender = targetGender;
      }

      // Age range filter
      if (minAge || maxAge) {
        query.age = {};
        if (minAge) query.age.$gte = Number(minAge);
        if (maxAge) query.age.$lte = Number(maxAge);
      }

      // Height range filter
      if (minHeight || maxHeight) {
        query.height = {};
        if (minHeight) query.height.$gte = Number(minHeight);
        if (maxHeight) query.height.$lte = Number(maxHeight);
      }

      if (religion) query.religion = { $regex: new RegExp(`^${religion}$`, 'i') };
      if (community) query.community = { $regex: new RegExp(community, 'i') };
      if (caste) query.caste = { $regex: new RegExp(caste, 'i') };
      if (motherTongue) query.motherTongue = { $regex: new RegExp(`^${motherTongue}$`, 'i') };
      if (city) query.city = { $regex: new RegExp(city, 'i') };
      if (state) query.state = { $regex: new RegExp(state, 'i') };
      if (maritalStatus) query.maritalStatus = maritalStatus;
      if (educationLevel) query.educationLevel = { $regex: new RegExp(educationLevel, 'i') };
      if (occupation) query.occupation = { $regex: new RegExp(occupation, 'i') };
      if (diet) query.diet = diet;
      if (minIncome) query.annualIncome = { $gte: Number(minIncome) };
      if (isVerifiedOnly === 'true' || isVerifiedOnly === true) query.verificationBadge = true;
      if (isPremiumOnly === 'true' || isPremiumOnly === true) query.isPremium = true;

      const skip = (Number(page) - 1) * Number(limit);
      const total = await Profile.countDocuments(query);

      let profiles = await Profile.find(query)
        .populate('user', 'status isPhoneVerified isEmailVerified createdAt')
        .sort({ isBoosted: -1, isPremium: -1, lastActiveAt: -1 })
        .skip(skip)
        .limit(Number(limit));

      // Calculate compatibility scores
      const results = profiles.map((p) => {
        const comp = callerProfile ? calculateCompatibilityScore(callerProfile, p) : null;
        return {
          ...p.toObject(),
          compatibility: comp,
        };
      });

      // Sort by compatibility if requested
      if (sortBy === 'compatibility' && callerProfile) {
        results.sort((a, b) => (b.compatibility?.overallScore || 0) - (a.compatibility?.overallScore || 0));
      } else if (sortBy === 'age_asc') {
        results.sort((a, b) => a.age - b.age);
      } else if (sortBy === 'age_desc') {
        results.sort((a, b) => b.age - a.age);
      }

      sendSuccess(res, results, 'Search results fetched successfully', 200, {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)),
      });
    } catch (err: any) {
      sendError(res, err.message, 500);
    }
  }

  /**
   * Recommended Profiles for Home Screen
   */
  static async getRecommended(req: AuthRequest, res: Response): Promise<void> {
    try {
      const callerUserId = req.user?.userId;
      let query: any = {};
      let callerProfile: any = null;

      if (callerUserId) {
        callerProfile = await Profile.findOne({ user: new Types.ObjectId(callerUserId) });
        query.user = { $ne: new Types.ObjectId(callerUserId) };
        if (callerProfile) {
          query.gender = callerProfile.gender === 'MALE' ? 'FEMALE' : 'MALE';
        }
      }

      const profiles = await Profile.find(query)
        .populate('user', 'status isPhoneVerified')
        .sort({ isBoosted: -1, isPremium: -1, verificationBadge: -1, lastActiveAt: -1 })
        .limit(15);

      const results = profiles.map((p) => {
        const comp = callerProfile ? calculateCompatibilityScore(callerProfile, p) : null;
        return {
          ...p.toObject(),
          compatibility: comp,
        };
      });

      if (callerProfile) {
        results.sort((a, b) => (b.compatibility?.overallScore || 0) - (a.compatibility?.overallScore || 0));
      }

      sendSuccess(res, results, 'Recommended profiles fetched successfully');
    } catch (err: any) {
      sendError(res, err.message, 500);
    }
  }
}
