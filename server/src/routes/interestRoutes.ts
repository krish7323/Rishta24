import { Router } from 'express';
import { InterestController } from '../controllers/interestController';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.post('/send', authenticate, InterestController.sendInterest);
router.post('/respond', authenticate, InterestController.respondInterest);
router.get('/received', authenticate, InterestController.getReceivedInterests);
router.get('/sent', authenticate, InterestController.getSentInterests);

export default router;
