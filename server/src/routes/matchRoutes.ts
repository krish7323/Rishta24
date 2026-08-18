import { Router } from 'express';
import { MatchController } from '../controllers/matchController';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.get('/', authenticate, MatchController.getMatches);

export default router;
