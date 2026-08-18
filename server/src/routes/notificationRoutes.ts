import { Router } from 'express';
import { NotificationController } from '../controllers/notificationController';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.get('/', authenticate, NotificationController.getNotifications);
router.post('/read-all', authenticate, NotificationController.markAllRead);

export default router;
