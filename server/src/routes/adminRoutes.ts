import { Router } from 'express';
import { AdminController } from '../controllers/adminController';
import { authenticate } from '../middlewares/auth';
import { authorizeRoles } from '../middlewares/role';
import { logAdminAction } from '../middlewares/auditLogger';
import { USER_ROLES } from '../config/constants';

const router = Router();

// Protect all admin routes with authentication and role check
router.use(
  authenticate,
  authorizeRoles(
    USER_ROLES.SUPER_ADMIN,
    USER_ROLES.ADMIN,
    USER_ROLES.MODERATOR,
    USER_ROLES.SUPPORT,
    USER_ROLES.FINANCE
  )
);

// Overview Metrics
router.get('/dashboard', AdminController.getDashboardMetrics);

// Users Management
router.get('/users', AdminController.listUsers);
router.get('/users/:id', AdminController.getUserDetails);
router.put(
  '/users/:id/status',
  authorizeRoles(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
  logAdminAction('UPDATE_USER_STATUS', 'USER'),
  AdminController.updateUserStatus
);

// Verification Queue
router.get('/verifications', AdminController.listVerifications);
router.put(
  '/verifications/:verificationId/review',
  logAdminAction('REVIEW_VERIFICATION', 'VERIFICATION'),
  AdminController.reviewVerification
);

// Reports Moderation Queue
router.get('/reports', AdminController.listReports);
router.put(
  '/reports/:reportId/resolve',
  logAdminAction('RESOLVE_REPORT', 'REPORT'),
  AdminController.resolveReport
);

// Payments & Subscriptions
router.get('/payments', authorizeRoles(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN, USER_ROLES.FINANCE), AdminController.listPayments);

// Support Desk
router.get('/support-tickets', AdminController.listSupportTickets);
router.put('/support-tickets/:ticketId/reply', AdminController.replySupportTicket);

// System Audit Logs
router.get('/audit-logs', authorizeRoles(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN), AdminController.getAuditLogs);

export default router;
