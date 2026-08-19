import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth';
import { Interest } from '../models/Interest';
import { Match } from '../models/Match';
import { Profile } from '../models/Profile';
import { Subscription } from '../models/Subscription';
import { NotificationService } from '../services/notificationService';
import { calculateCompatibilityScore } from '../services/matchingAlgorithm';
import { sendSuccess, sendError } from '../utils/response';
import { Types } from 'mongoose';
import { INTEREST_STATUS, NOTIFICATION_TYPES } from '../config/constants';

export class InterestController {
  /**
   * Send Interest to another profile
   */
  static async sendInterest(req: AuthRequest, res: Response): Promise<void> {
    try {
      const senderId = req.user!.userId;
      const { receiverId, message } = req.body;

      if (senderId === receiverId) {
        sendError(res, 'Cannot send interest to yourself', 400);
        return;
      }

      // Check user's subscription limits
      const subscription = await Subscription.findOne({
        user: new Types.ObjectId(senderId),
        status: 'ACTIVE',
      });

      const dailyLimit = subscription?.features?.dailyInterestLimit || 3;
      const sentToday = subscription?.interestsSentToday || 0;

      if (sentToday >= dailyLimit) {
        sendError(
          res,
          `You have reached your daily limit of ${dailyLimit} interests. Upgrade to Premium for unlimited interests!`,
          403,
          'PLAN_LIMIT_REACHED'
        );
        return;
      }

      // Check if interest already exists
      const existing = await Interest.findOne({
        sender: new Types.ObjectId(senderId),
        receiver: new Types.ObjectId(receiverId),
      });

      if (existing) {
        if (existing.status === 'PENDING') {
          sendSuccess(res, { interest: existing, alreadySent: true }, 'Interest request is already pending review');
          return;
        }
        if (existing.status === 'ACCEPTED') {
          sendSuccess(res, { interest: existing, isMutualMatch: true }, 'You are already matched with this profile');
          return;
        }
      }


      // Check if opposite interest already exists (Instant match!)
      const incomingInterest = await Interest.findOne({
        sender: new Types.ObjectId(receiverId),
        receiver: new Types.ObjectId(senderId),
        status: 'PENDING',
      });

      let isMutualMatch = false;
      let interestRecord;

      if (incomingInterest) {
        // Automatically accept incoming interest & create Match
        incomingInterest.status = 'ACCEPTED';
        await incomingInterest.save();

        const [senderProfile, receiverProfile] = await Promise.all([
          Profile.findOne({ user: new Types.ObjectId(senderId) }),
          Profile.findOne({ user: new Types.ObjectId(receiverId) }),
        ]);

        const comp = senderProfile && receiverProfile ? calculateCompatibilityScore(senderProfile, receiverProfile) : { overallScore: 88 };

        await Match.findOneAndUpdate(
          {
            $or: [
              { user1: new Types.ObjectId(senderId), user2: new Types.ObjectId(receiverId) },
              { user1: new Types.ObjectId(receiverId), user2: new Types.ObjectId(senderId) },
            ],
          },
          {
            user1: new Types.ObjectId(senderId),
            user2: new Types.ObjectId(receiverId),
            matchScore: comp.overallScore,
            status: 'ACTIVE',
            matchedAt: new Date(),
          },
          { upsert: true }
        );

        isMutualMatch = true;

        // Send notifications
        await NotificationService.sendNotification({
          recipientId: receiverId,
          senderId,
          type: NOTIFICATION_TYPES.NEW_MATCH,
          title: "It's a Match! ❤️",
          body: `${senderProfile?.firstName || 'Someone'} connected with you! Start a conversation now.`,
        });

        interestRecord = incomingInterest;
      } else {
        interestRecord = await Interest.create({
          sender: new Types.ObjectId(senderId),
          receiver: new Types.ObjectId(receiverId),
          status: 'PENDING',
          message,
        });

        const senderProfile = await Profile.findOne({ user: new Types.ObjectId(senderId) });
        await NotificationService.sendNotification({
          recipientId: receiverId,
          senderId,
          type: NOTIFICATION_TYPES.INTEREST_RECEIVED,
          title: 'New Interest Received 💕',
          body: `${senderProfile?.firstName || 'A member'} sent you an interest request.`,
        });
      }

      // Increment daily counter on subscription
      if (subscription) {
        subscription.interestsSentToday += 1;
        await subscription.save();
      }

      sendSuccess(
        res,
        {
          interest: interestRecord,
          isMutualMatch,
        },
        isMutualMatch ? "It's a Match! 🎉" : 'Interest sent successfully',
        201
      );
    } catch (err: any) {
      sendError(res, err.message, 500);
    }
  }

  /**
   * Respond to received interest (ACCEPT / REJECT)
   */
  static async respondInterest(req: AuthRequest, res: Response): Promise<void> {
    try {
      const receiverId = req.user!.userId;
      const { interestId, action } = req.body; // action: 'ACCEPT' | 'REJECT'

      const interest = await Interest.findOne({
        _id: new Types.ObjectId(interestId),
        receiver: new Types.ObjectId(receiverId),
      });

      if (!interest) {
        sendError(res, 'Interest request not found', 404);
        return;
      }

      if (action === 'ACCEPT') {
        interest.status = 'ACCEPTED';
        await interest.save();

        const [receiverProfile, senderProfile] = await Promise.all([
          Profile.findOne({ user: new Types.ObjectId(receiverId) }),
          Profile.findOne({ user: interest.sender }),
        ]);

        const comp = receiverProfile && senderProfile ? calculateCompatibilityScore(receiverProfile, senderProfile) : { overallScore: 88 };

        await Match.findOneAndUpdate(
          {
            $or: [
              { user1: interest.sender, user2: new Types.ObjectId(receiverId) },
              { user1: new Types.ObjectId(receiverId), user2: interest.sender },
            ],
          },
          {
            user1: interest.sender,
            user2: new Types.ObjectId(receiverId),
            matchScore: comp.overallScore,
            status: 'ACTIVE',
            matchedAt: new Date(),
          },
          { upsert: true }
        );

        await NotificationService.sendNotification({
          recipientId: interest.sender.toString(),
          senderId: receiverId,
          type: NOTIFICATION_TYPES.INTEREST_ACCEPTED,
          title: 'Interest Accepted! 🎉',
          body: `${receiverProfile?.firstName || 'A member'} accepted your interest request. You can now chat!`,
        });

        sendSuccess(res, { status: 'ACCEPTED', isMutualMatch: true }, 'Interest accepted! Match created.');
      } else {
        interest.status = 'REJECTED';
        await interest.save();
        sendSuccess(res, { status: 'REJECTED' }, 'Interest rejected');
      }
    } catch (err: any) {
      sendError(res, err.message, 500);
    }
  }

  /**
   * Get Received Interests
   */
  static async getReceivedInterests(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;
      const interests = await Interest.find({
        receiver: new Types.ObjectId(userId),
        status: 'PENDING',
      }).sort({ createdAt: -1 });

      const senderIds = interests.map((i) => i.sender).filter(Boolean);
      const profiles = await Profile.find({ user: { $in: senderIds } });

      const profileMap = new Map(profiles.map((p) => [p.user ? p.user.toString() : '', p]));

      const result = interests
        .filter((item) => item && item.sender)
        .map((item) => ({
          _id: item._id,
          status: item.status,
          message: item.message,
          createdAt: item.createdAt,
          senderProfile: profileMap.get(item.sender.toString()),
        }));

      sendSuccess(res, result, 'Received interests fetched');
    } catch (err: any) {
      sendError(res, err.message, 500);
    }
  }

  /**
   * Get Sent Interests
   */
  static async getSentInterests(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;
      const interests = await Interest.find({
        sender: new Types.ObjectId(userId),
      }).sort({ createdAt: -1 });

      const receiverIds = interests.map((i) => i.receiver).filter(Boolean);
      const profiles = await Profile.find({ user: { $in: receiverIds } });

      const profileMap = new Map(profiles.map((p) => [p.user ? p.user.toString() : '', p]));

      const result = interests
        .filter((item) => item && item.receiver)
        .map((item) => ({
          _id: item._id,
          status: item.status,
          message: item.message,
          createdAt: item.createdAt,
          receiverProfile: profileMap.get(item.receiver.toString()),
        }));

      sendSuccess(res, result, 'Sent interests fetched');
    } catch (err: any) {
      sendError(res, err.message, 500);
    }
  }
}

