import { Router } from 'express';
import { SearchController } from '../controllers/searchController';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.get('/', authenticate, SearchController.searchProfiles);
router.get('/recommended', authenticate, SearchController.getRecommended);

export default router;
