import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth';
import { User } from '../models/User';
import { Profile } from '../models/Profile';
import { Verification } from '../models/Verification';
import { Report } from '../models/Report';
import { Payment } from '../models/Payment';
import { Subscription } from '../models/Subscription';
import { SupportTicket } from '../models/SupportTicket';
import { AuditLog } from '../models/AuditLog';
import { Match } from '../models/Match';
import { Interest } from '../models/Interest';
import { Message } from '../models/Message';
import { NotificationService } from '../services/notificationService';
import { sendSuccess, sendError } from '../utils/response';
import { Types } from 'mongoose';
import { ACCOUNT_STATUS, VERIFICATION_STATUS, NOTIFICATION_TYPES } from '../config/constants';

export class AdminController {
  /**
   * Get Admin Dashboard Overview Metrics & Charts
   */
  static async getDashboardMetrics(req: AuthRequest, res: Response): Promise<void> {
    try {
      const [
        totalUsers,
        activeUsers,
        verifiedProfiles,
        premiumUsers,
        pendingVerifications,
        pendingReports,
        openTickets,
        totalMatches,
        totalInterests,
        totalMessages,
        payments,
      ] = await Promise.all([
        User.countDocuments({ status: { $ne: ACCOUNT_STATUS.DELETED } }),
        User.countDocuments({ status: ACCOUNT_STATUS.ACTIVE }),
        Profile.countDocuments({ verificationBadge: true }),
        Subscription.countDocuments({ status: 'ACTIVE', planId: { $ne: 'FREE' } }),
        Verification.countDocuments({ status: VERIFICATION_STATUS.PENDING }),
        Report.countDocuments({ status: 'PENDING' }),
        SupportTicket.countDocuments({ status: { $in: ['OPEN', 'IN_PROGRESS'] } }),
        Match.countDocuments({ status: 'ACTIVE' }),
        Interest.countDocuments(),
        Message.countDocuments(),
        Payment.find({ status: 'SUCCESS' }).select('amount createdAt'),
      ]);

      const totalRevenue = payments.reduce((acc, p) => acc + p.amount, 0);

      // 7-day registration trend (mock/computed)
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        return {
          date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          registrations: Math.floor(12 + Math.sin(i) * 6 + i * 2),
          revenue: Math.floor((1200 + i * 850) * 1.5),
        };
      });

      sendSuccess(res, {
        stats: {
          totalUsers,
          activeUsers,
          verifiedProfiles,
          premiumUsers,
          totalRevenue,
          pendingVerifications,
          pendingReports,
          openTickets,
          totalMatches,
          totalInterests,
          totalMessages,
          conversionRate: totalUsers > 0 ? ((premiumUsers / totalUsers) * 100).toFixed(1) : '0',
        },
        charts: {
          registrationTrend: last7Days,
        },
      }, 'Admin dashboard metrics fetched');
    } catch (err: any) {
      sendError(res, err.message, 500);
    }
  }

  /**
   * List all users with filtering and pagination
   */
  static async listUsers(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { search, status, role, isPremium, isVerified, page = 1, limit = 20 } = req.query as any;

      const userQuery: any = {};
      if (status) userQuery.status = status;
      if (role) userQuery.role = role;
      if (search) {
        userQuery.$or = [
          { email: { $regex: search, $options: 'i' } },
          { phone: { $regex: search, $options: 'i' } },
        ];
      }

      const skip = (Number(page) - 1) * Number(limit);
      const total = await User.countDocuments(userQuery);

      const users = await User.find(userQuery)
        .select('-passwordHash -refreshTokens')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit));

      const userIds = users.map((u) => u._id);
      const profiles = await Profile.find({ user: { $in: userIds } });
      const profileMap = new Map(profiles.map((p) => [p.user.toString(), p]));

      const result = users.map((u) => ({
        user: u,
        profile: profileMap.get(u._id.toString()),
      }));

      sendSuccess(res, result, 'Users list fetched', 200, {
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
   * Get single user full details
   */
  static async getUserDetails(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const user = await User.findById(id).select('-passwordHash -refreshTokens');
      if (!user) {
        sendError(res, 'User not found', 404);
        return;
      }

      const [profile, subscription, verification, reportsAgainst] = await Promise.all([
        Profile.findOne({ user: new Types.ObjectId(id) }),
        Subscription.findOne({ user: new Types.ObjectId(id) }),
        Verification.findOne({ user: new Types.ObjectId(id) }),
        Report.find({ reportedUser: new Types.ObjectId(id) }).populate('reporter', 'email phone'),
      ]);

      sendSuccess(res, { user, profile, subscription, verification, reportsAgainst }, 'User details fetched');
    } catch (err: any) {
      sendError(res, err.message, 500);
    }
  }

  /**
   * Update User Account Status (SUSPEND, BAN, ACTIVATE)
   */
  static async updateUserStatus(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { status, reason } = req.body;

      const user = await User.findByIdAndUpdate(id, { status }, { new: true });
      if (!user) {
        sendError(res, 'User not found', 404);
        return;
      }

      // If banned or suspended, disconnect session
      if (status === ACCOUNT_STATUS.BANNED || status === ACCOUNT_STATUS.SUSPENDED) {
        user.refreshTokens = [];
        await user.save();
      }

      sendSuccess(res, user, `User status updated to ${status}`);
    } catch (err: any) {
      sendError(res, err.message, 500);
    }
  }

  /**
   * List Pending Verification Requests
   */
  static async listVerifications(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { status = VERIFICATION_STATUS.PENDING, page = 1, limit = 20 } = req.query as any;

      const skip = (Number(page) - 1) * Number(limit);
      const total = await Verification.countDocuments({ status });

      const verifications = await Verification.find({ status })
        .populate('user', 'email phone')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit));

      const userIds = verifications.map((v) => v.user?._id).filter(Boolean);
      const profiles = await Profile.find({ user: { $in: userIds } });
      const profileMap = new Map(profiles.map((p) => [p.user.toString(), p]));

      const result = verifications.map((v: any) => ({
        verification: v,
        profile: v.user ? profileMap.get(v.user._id.toString()) : null,
      }));

      sendSuccess(res, result, 'Verification requests fetched', 200, {
        page: Number(page),
        limit: Number(limit),
        total,
      });
    } catch (err: any) {
      sendError(res, err.message, 500);
    }
  }

  /**
   * Approve or Reject Verification
   */
  static async reviewVerification(req: AuthRequest, res: Response): Promise<void> {
    try {
      const adminId = req.user!.userId;
      const { verificationId } = req.params;
      const { action, rejectionReason } = req.body; // action: 'APPROVE' | 'REJECT'

      const verification = await Verification.findById(verificationId);
      if (!verification) {
        sendError(res, 'Verification record not found', 404);
        return;
      }

      if (action === 'APPROVE') {
        verification.status = VERIFICATION_STATUS.VERIFIED;
        verification.reviewedBy = new Types.ObjectId(adminId);
        verification.reviewedAt = new Date();
        await verification.save();

        await Profile.findOneAndUpdate(
          { user: verification.user },
          {
            verificationStatus: VERIFICATION_STATUS.VERIFIED,
            verificationBadge: true,
          }
        );

        await NotificationService.sendNotification({
          recipientId: verification.user.toString(),
          type: NOTIFICATION_TYPES.VERIFICATION_APPROVED,
          title: 'Profile Verified! 🛡️',
          body: 'Your identity documents have been approved. You now have the verified badge on Rishta24!',
        });

        sendSuccess(res, verification, 'Profile verified successfully');
      } else {
        verification.status = VERIFICATION_STATUS.REJECTED;
        verification.rejectionReason = rejectionReason || 'Documents did not meet criteria';
        verification.reviewedBy = new Types.ObjectId(adminId);
        verification.reviewedAt = new Date();
        await verification.save();

        await Profile.findOneAndUpdate(
          { user: verification.user },
          {
            verificationStatus: VERIFICATION_STATUS.REJECTED,
            verificationBadge: false,
          }
        );

        await NotificationService.sendNotification({
          recipientId: verification.user.toString(),
          type: NOTIFICATION_TYPES.VERIFICATION_REJECTED,
          title: 'Verification Request Update',
          body: `Verification was rejected: ${verification.rejectionReason}. Please resubmit clear documents.`,
        });

        sendSuccess(res, verification, 'Verification rejected');
      }
    } catch (err: any) {
      sendError(res, err.message, 500);
    }
  }

  /**
   * List Reports Queue
   */
  static async listReports(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { status = 'PENDING', page = 1, limit = 20 } = req.query as any;

      const skip = (Number(page) - 1) * Number(limit);
      const total = await Report.countDocuments({ status });

      const reports = await Report.find({ status })
        .populate('reporter', 'email phone')
        .populate('reportedUser', 'email phone status')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit));

      const reportedIds = reports.map((r: any) => r.reportedUser?._id).filter(Boolean);
      const profiles = await Profile.find({ user: { $in: reportedIds } });
      const profileMap = new Map(profiles.map((p) => [p.user.toString(), p]));

      const result = reports.map((r: any) => ({
        report: r,
        reportedProfile: r.reportedUser ? profileMap.get(r.reportedUser._id.toString()) : null,
      }));

      sendSuccess(res, result, 'Reports queue fetched', 200, {
        page: Number(page),
        limit: Number(limit),
        total,
      });
    } catch (err: any) {
      sendError(res, err.message, 500);
    }
  }

  /**
   * Take Action on Report
   */
  static async resolveReport(req: AuthRequest, res: Response): Promise<void> {
    try {
      const adminId = req.user!.userId;
      const { reportId } = req.params;
      const { action, adminNotes } = req.body; // action: 'BAN_USER' | 'WARN_USER' | 'DISMISS'

      const report = await Report.findById(reportId);
      if (!report) {
        sendError(res, 'Report not found', 404);
        return;
      }

      if (action === 'BAN_USER') {
        await User.findByIdAndUpdate(report.reportedUser, {
          status: ACCOUNT_STATUS.BANNED,
          refreshTokens: [],
        });
        report.status = 'ACTION_TAKEN';
        report.actionTaken = 'User account banned';
      } else if (action === 'WARN_USER') {
        await NotificationService.sendNotification({
          recipientId: report.reportedUser.toString(),
          type: NOTIFICATION_TYPES.SECURITY_ALERT,
          title: 'Warning: Community Guidelines Violation',
          body: 'We have received reports regarding your activity. Please ensure respectful communication.',
        });
        report.status = 'ACTION_TAKEN';
        report.actionTaken = 'User issued official warning';
      } else {
        report.status = 'DISMISSED';
        report.actionTaken = 'Report investigated and dismissed';
      }

      report.reviewedBy = new Types.ObjectId(adminId);
      report.reviewedAt = new Date();
      report.adminNotes = adminNotes;
      await report.save();

      sendSuccess(res, report, `Report resolved with action: ${action}`);
    } catch (err: any) {
      sendError(res, err.message, 500);
    }
  }

  /**
   * List all Subscriptions & Payments
   */
  static async listPayments(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { page = 1, limit = 20 } = req.query as any;
      const skip = (Number(page) - 1) * Number(limit);
      const total = await Payment.countDocuments();

      const payments = await Payment.find()
        .populate('user', 'email phone')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit));

      sendSuccess(res, payments, 'Payments fetched', 200, {
        page: Number(page),
        limit: Number(limit),
        total,
      });
    } catch (err: any) {
      sendError(res, err.message, 500);
    }
  }

  /**
   * List Support Tickets & Reply
   */
  static async listSupportTickets(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { status, page = 1, limit = 20 } = req.query as any;
      const query: any = status ? { status } : {};

      const skip = (Number(page) - 1) * Number(limit);
      const total = await SupportTicket.countDocuments(query);

      const tickets = await SupportTicket.find(query)
        .populate('user', 'email phone')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit));

      sendSuccess(res, tickets, 'Support tickets fetched', 200, { page: Number(page), limit: Number(limit), total });
    } catch (err: any) {
      sendError(res, err.message, 500);
    }
  }

  /**
   * Reply to Support Ticket as Admin
   */
  static async replySupportTicket(req: AuthRequest, res: Response): Promise<void> {
    try {
      const adminId = req.user!.userId;
      const { ticketId } = req.params;
      const { message, status = 'RESOLVED' } = req.body;

      const ticket = await SupportTicket.findById(ticketId);
      if (!ticket) {
        sendError(res, 'Ticket not found', 404);
        return;
      }

      ticket.messages.push({
        sender: new Types.ObjectId(adminId),
        senderRole: 'ADMIN',
        message,
        sentAt: new Date(),
      });
      ticket.status = status;
      if (status === 'RESOLVED') {
        ticket.resolvedAt = new Date();
      }
      await ticket.save();

      await NotificationService.sendNotification({
        recipientId: ticket.user.toString(),
        type: NOTIFICATION_TYPES.SECURITY_ALERT,
        title: 'Support Ticket Update',
        body: `Support team replied to ticket #${ticket.ticketNumber}: ${message.substring(0, 60)}...`,
      });

      sendSuccess(res, ticket, 'Ticket reply sent');
    } catch (err: any) {
      sendError(res, err.message, 500);
    }
  }

  /**
   * Get System Audit Logs
   */
  static async getAuditLogs(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { page = 1, limit = 30 } = req.query as any;
      const skip = (Number(page) - 1) * Number(limit);
      const total = await AuditLog.countDocuments();

      const logs = await AuditLog.find()
        .populate('admin', 'email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit));

      sendSuccess(res, logs, 'Audit logs fetched', 200, { page: Number(page), limit: Number(limit), total });
    } catch (err: any) {
      sendError(res, err.message, 500);
    }
  }
}
