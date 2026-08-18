import { Router } from 'express';
import { ShortlistController } from '../controllers/shortlistController';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.post('/toggle', authenticate, ShortlistController.toggleShortlist);
router.get('/', authenticate, ShortlistController.getShortlists);

export default router;
