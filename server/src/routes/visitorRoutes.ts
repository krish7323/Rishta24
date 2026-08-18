import { Router } from 'express';
import { VisitorController } from '../controllers/visitorController';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.get('/', authenticate, VisitorController.getVisitors);

export default router;
