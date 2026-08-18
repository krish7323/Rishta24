import { Router } from 'express';
import { SupportController } from '../controllers/supportController';
import { authenticate } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import { createSupportTicketSchema } from '../validators/chatValidator';

const router = Router();

router.post('/', authenticate, validate(createSupportTicketSchema), SupportController.createTicket);
router.get('/my-tickets', authenticate, SupportController.getMyTickets);
router.post('/:ticketId/reply', authenticate, SupportController.addMessage);

export default router;
