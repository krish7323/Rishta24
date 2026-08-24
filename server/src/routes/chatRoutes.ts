import { Router } from 'express';
import { ChatController } from '../controllers/chatController';
import { authenticate } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import { upload } from '../middlewares/upload';
import { sendMessageSchema } from '../validators/chatValidator';

const router = Router();

router.get('/conversations', authenticate, ChatController.getConversations);
router.get('/conversations/:conversationId/messages', authenticate, ChatController.getMessages);
router.get('/starters', authenticate, ChatController.getStarters);
router.post('/messages', authenticate, validate(sendMessageSchema), ChatController.sendMessage);
router.post('/attachment', authenticate, upload.single('attachment'), ChatController.uploadAttachment);

export default router;

