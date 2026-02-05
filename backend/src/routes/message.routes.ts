import { Router } from 'express';
import { getMessages, createMessage } from '../controllers/message.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

// All message routes require authentication
router.use(authenticate);

router.get('/:ticketId/messages', getMessages);
router.post('/:ticketId/messages', createMessage);

export default router;
