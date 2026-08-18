import { Router } from 'express';
import { ReferralController } from '../controllers/referralController';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.get('/stats', authenticate, ReferralController.getReferralStats);

export default router;
