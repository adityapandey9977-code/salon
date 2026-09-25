import { Router } from 'express';
import { NotificationController } from '../controllers/notification.controller';
const router = Router();
router.get('/logs', NotificationController.listAllLogs);
router.post('/simulate', NotificationController.simulateNotification);
export { router as superAdminRoutes };
