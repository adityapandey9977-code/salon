import { Router } from 'express';
import { SupportController } from '../controllers/support.controller';

const router: Router = Router();

// List all tickets (filtered by tenantId, status, priority, category via query params)
router.get('/tickets', SupportController.listTickets);

// Get single ticket
router.get('/tickets/:id', SupportController.getTicket);

// Create new ticket
router.post('/tickets', SupportController.createTicket);

// Update ticket status
router.patch('/tickets/:id/status', SupportController.updateTicketStatus);

// Delete ticket
router.delete('/tickets/:id', SupportController.deleteTicket);

export { router as supportRoutes };
