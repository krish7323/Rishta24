import { Router } from 'express';
import { ReportController } from '../controllers/reportController';
import { authenticate } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import { reportUserSchema, blockUserSchema } from '../validators/chatValidator';

const router = Router();

router.post('/', authenticate, validate(reportUserSchema), ReportController.reportUser);
router.post('/block', authenticate, validate(blockUserSchema), ReportController.blockUser);
router.delete('/block/:blockedUserId', authenticate, ReportController.unblockUser);
router.get('/blocks', authenticate, ReportController.getBlockedUsers);

export default router;
