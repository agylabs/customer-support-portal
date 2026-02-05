import { Router } from 'express';
import {
    getTickets,
    getTicket,
    createTicket,
    updateTicket,
    deleteTicket,
    assignTicket,
} from '../controllers/ticket.controller';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/authorize';

const router = Router();

// All ticket routes require authentication
router.use(authenticate);

router.get('/', getTickets);
router.post('/', createTicket);
router.get('/:id', getTicket);
router.patch('/:id', updateTicket);
router.delete('/:id', deleteTicket);
router.post('/:id/assign', authorize('ADMIN', 'AGENT'), assignTicket);

export default router;
