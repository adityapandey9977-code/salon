import { Router } from 'express';
import { internalAuthMiddleware } from '../../middleware/internal-auth.middleware';
import { internalController } from '../controllers/internal.controller';
const router = Router();
router.use(internalAuthMiddleware);
router.get('/services/:id/booking-context', internalController.getServiceBookingContext.bind(internalController));
router.get('/branches/:branchId/services/:serviceId/price', internalController.getBranchServicePrice.bind(internalController));
export const internalRoutes = router;
