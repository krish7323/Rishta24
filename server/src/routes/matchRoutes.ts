import { Router } from 'express';
import { MatchController } from '../controllers/matchController';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.get('/', authenticate, MatchController.getMatches);
router.get('/daily', authenticate, MatchController.getDailyMatches);
router.get('/categories', authenticate, MatchController.getCategories);

export default router;

