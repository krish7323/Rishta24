import { Router } from 'express';
import { VerificationController } from '../controllers/verificationController';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.post('/submit', authenticate, VerificationController.submitVerification);
router.get('/status', authenticate, VerificationController.getStatus);

export default router;
