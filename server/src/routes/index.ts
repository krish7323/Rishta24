import { Router } from 'express';
import authRoutes from './authRoutes';
import profileRoutes from './profileRoutes';
import searchRoutes from './searchRoutes';
import interestRoutes from './interestRoutes';
import matchRoutes from './matchRoutes';
import shortlistRoutes from './shortlistRoutes';
import visitorRoutes from './visitorRoutes';
import chatRoutes from './chatRoutes';
import notificationRoutes from './notificationRoutes';
import premiumRoutes from './premiumRoutes';
import verificationRoutes from './verificationRoutes';
import reportRoutes from './reportRoutes';
import supportRoutes from './supportRoutes';
import referralRoutes from './referralRoutes';
import adminRoutes from './adminRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/profiles', profileRoutes);
router.use('/search', searchRoutes);
router.use('/interests', interestRoutes);
router.use('/matches', matchRoutes);
router.use('/shortlists', shortlistRoutes);
router.use('/visitors', visitorRoutes);
router.use('/chats', chatRoutes);
router.use('/notifications', notificationRoutes);
router.use('/premium', premiumRoutes);
router.use('/verification', verificationRoutes);
router.use('/reports', reportRoutes);
router.use('/support', supportRoutes);
router.use('/referrals', referralRoutes);
router.use('/admin', adminRoutes);

export default router;
