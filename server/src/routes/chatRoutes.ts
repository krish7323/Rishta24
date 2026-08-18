import { Router } from 'express';
import { ChatController } from '../controllers/chatController';
import { authenticate } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import { sendMessageSchema } from '../validators/chatValidator';

const router = Router();

router.get('/conversations', authenticate, ChatController.getConversations);
router.get('/conversations/:conversationId/messages', authenticate, ChatController.getMessages);
router.post('/messages', authenticate, validate(sendMessageSchema), ChatController.sendMessage);

export default router;
