import { Router } from 'express';
import { SearchController } from '../controllers/searchController';
import { authenticate } from '../middlewares/auth';
import { searchLimiter } from '../middlewares/rateLimiter';

const router = Router();

router.get('/', authenticate, searchLimiter, SearchController.searchProfiles);
router.get('/recommended', authenticate, SearchController.getRecommended);

export default router;
