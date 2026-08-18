import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth';
import { Verification } from '../models/Verification';
import { Profile } from '../models/Profile';
import { sendSuccess, sendError } from '../utils/response';
import { Types } from 'mongoose';
import { VERIFICATION_STATUS } from '../config/constants';

export class VerificationController {
  /**
   * Submit ID document & live selfie for profile verification
   */
  static async submitVerification(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;
      const { documentType, documentNumberMasked, documentFrontUrl, documentBackUrl, selfieUrl } = req.body;

      const verification = await Verification.findOneAndUpdate(
        { user: new Types.ObjectId(userId) },
        {
          documentType,
          documentNumberMasked,
          documentFrontUrl,
          documentBackUrl,
          selfieUrl,
          status: VERIFICATION_STATUS.PENDING,
          rejectionReason: undefined,
        },
        { upsert: true, new: true }
      );

      await Profile.findOneAndUpdate(
        { user: new Types.ObjectId(userId) },
        { verificationStatus: VERIFICATION_STATUS.PENDING }
      );

      sendSuccess(res, verification, 'Verification documents submitted for review', 201);
    } catch (err: any) {
      sendError(res, err.message, 500);
    }
  }

  /**
   * Get verification status
   */
  static async getStatus(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;
      const verification = await Verification.findOne({ user: new Types.ObjectId(userId) });
      sendSuccess(res, verification, 'Verification status fetched');
    } catch (err: any) {
      sendError(res, err.message, 500);
    }
  }
}
