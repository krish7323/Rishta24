import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth';
import { Profile } from '../models/Profile';
import { User } from '../models/User';
import { Visitor } from '../models/Visitor';
import { Block } from '../models/Block';
import { calculateCompatibilityScore } from '../services/matchingAlgorithm';
import { sendSuccess, sendError } from '../utils/response';
import { Types } from 'mongoose';
import { ACCOUNT_STATUS } from '../config/constants';

export class ProfileController {
  /**
   * Update authenticated user's profile
   */
  static async updateProfile(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;
      const updates = req.body;

      let profile = await Profile.findOne({ user: new Types.ObjectId(userId) });
      if (!profile) {
        sendError(res, 'Profile not found', 404, 'PROFILE_NOT_FOUND');
        return;
      }

      // Update fields
      Object.assign(profile, updates);

      // Re-calculate completion percentage
      profile.profileCompletion = profile.calculateCompletion();
      await profile.save();

      sendSuccess(res, profile, 'Profile updated successfully');
    } catch (err: any) {
      sendError(res, err.message, 500);
    }
  }

  /**
   * Get single profile by ID with visitor tracking & compatibility calculation
   */
  static async getProfileById(req: AuthRequest, res: Response): Promise<void> {
    try {
      const targetUserId = req.params.id;
      const callerUserId = req.user?.userId;

      // Check if blocked
      if (callerUserId) {
        const isBlocked = await Block.findOne({
          $or: [
            { blocker: new Types.ObjectId(callerUserId), blockedUser: new Types.ObjectId(targetUserId) },
            { blocker: new Types.ObjectId(targetUserId), blockedUser: new Types.ObjectId(callerUserId) },
          ],
        });

        if (isBlocked) {
          sendError(res, 'Profile unavailable', 404, 'PROFILE_NOT_FOUND');
          return;
        }
      }

      const targetProfile = await Profile.findOne({ user: new Types.ObjectId(targetUserId) }).populate('user', 'status isPhoneVerified isEmailVerified createdAt');
      if (!targetProfile) {
        sendError(res, 'Profile not found', 404, 'PROFILE_NOT_FOUND');
        return;
      }

      // Increment view count & log visitor if caller is distinct user
      let compatibility = null;
      if (callerUserId && callerUserId !== targetUserId) {
        // Record visitor
        await Visitor.findOneAndUpdate(
          {
            profileOwner: new Types.ObjectId(targetUserId),
            viewer: new Types.ObjectId(callerUserId),
          },
          {
            $inc: { viewCount: 1 },
            lastViewedAt: new Date(),
          },
          { upsert: true }
        );

        targetProfile.viewCount = (targetProfile.viewCount || 0) + 1;
        await targetProfile.save();

        // Calculate compatibility score against caller
        const callerProfile = await Profile.findOne({ user: new Types.ObjectId(callerUserId) });
        if (callerProfile) {
          compatibility = calculateCompatibilityScore(callerProfile, targetProfile);
        }
      }

      sendSuccess(
        res,
        {
          profile: targetProfile,
          compatibility,
        },
        'Profile details fetched successfully'
      );
    } catch (err: any) {
      sendError(res, err.message, 500);
    }
  }

  /**
   * Upload / Add Photo to Profile Gallery
   */
  static async addPhoto(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;
      const file = req.file;

      if (!file) {
        // Allow URL passed in body for testing/simulation
        const { photoUrl } = req.body;
        if (!photoUrl) {
          sendError(res, 'No photo file or URL provided', 400, 'FILE_REQUIRED');
          return;
        }

        const profile = await Profile.findOne({ user: new Types.ObjectId(userId) });
        if (!profile) {
          sendError(res, 'Profile not found', 404);
          return;
        }

        profile.photos.push({
          url: photoUrl,
          isPrimary: profile.photos.length === 0,
          privacy: 'PUBLIC',
          isApproved: true,
          uploadedAt: new Date(),
        });

        if (profile.photos.length === 1) {
          profile.avatar = photoUrl;
        }

        profile.profileCompletion = profile.calculateCompletion();
        await profile.save();

        sendSuccess(res, profile.photos, 'Photo uploaded successfully');
        return;
      }

      const photoUrl = `/uploads/${file.filename}`;
      const profile = await Profile.findOne({ user: new Types.ObjectId(userId) });
      if (!profile) {
        sendError(res, 'Profile not found', 404);
        return;
      }

      profile.photos.push({
        url: photoUrl,
        isPrimary: profile.photos.length === 0,
        privacy: 'PUBLIC',
        isApproved: true,
        uploadedAt: new Date(),
      });

      if (profile.photos.length === 1) {
        profile.avatar = photoUrl;
      }

      profile.profileCompletion = profile.calculateCompletion();
      await profile.save();

      sendSuccess(res, profile.photos, 'Photo uploaded successfully');
    } catch (err: any) {
      sendError(res, err.message, 500);
    }
  }

  /**
   * Delete Photo
   */
  static async deletePhoto(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;
      const { photoId } = req.params;

      const profile = await Profile.findOne({ user: new Types.ObjectId(userId) });
      if (!profile) {
        sendError(res, 'Profile not found', 404);
        return;
      }

      profile.photos = profile.photos.filter((p) => p._id?.toString() !== photoId);
      if (profile.photos.length > 0 && !profile.photos.some((p) => p.isPrimary)) {
        profile.photos[0].isPrimary = true;
        profile.avatar = profile.photos[0].url;
      }

      profile.profileCompletion = profile.calculateCompletion();
      await profile.save();

      sendSuccess(res, profile.photos, 'Photo deleted successfully');
    } catch (err: any) {
      sendError(res, err.message, 500);
    }
  }

  /**
   * Delete / Deactivate Account
   */
  static async deleteAccount(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;
      const { reason } = req.body;

      // Soft delete & anonymize user data
      await User.findByIdAndUpdate(userId, {
        status: ACCOUNT_STATUS.DELETED,
        email: `deleted_${Date.now()}_${userId}@rishta24.anonymized`,
        phone: `0000000000_${Date.now()}`,
        refreshTokens: [],
      });

      await Profile.findOneAndUpdate(
        { user: new Types.ObjectId(userId) },
        {
          firstName: 'Rishta24',
          lastName: 'Member',
          about: 'This account has been closed.',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
          photos: [],
          isOnline: false,
        }
      );

      sendSuccess(res, null, 'Account deleted successfully');
    } catch (err: any) {
      sendError(res, err.message, 500);
    }
  }
}
