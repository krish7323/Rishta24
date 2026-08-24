import { Router } from 'express';
import { PremiumController } from '../controllers/premiumController';
import { authenticate } from '../middlewares/auth';
import { paymentLimiter } from '../middlewares/rateLimiter';

const router = Router();

router.get('/plans', authenticate, PremiumController.getPlans);
router.get('/my-subscription', authenticate, PremiumController.getMySubscription);
router.post('/create-order', authenticate, paymentLimiter, PremiumController.createOrder);
router.post('/verify-payment', authenticate, paymentLimiter, PremiumController.verifyPayment);

export default router;
