import { Router } from 'express';
import { PremiumController } from '../controllers/premiumController';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.get('/plans', authenticate, PremiumController.getPlans);
router.get('/my-subscription', authenticate, PremiumController.getMySubscription);
router.post('/create-order', authenticate, PremiumController.createOrder);
router.post('/verify-payment', authenticate, PremiumController.verifyPayment);

export default router;
