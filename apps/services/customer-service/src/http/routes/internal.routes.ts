import { Router } from 'express';
import { internalAuthMiddleware } from '../../middleware/internal-auth.middleware';
import { internalController } from '../controllers/internal.controller';

const router: Router = Router();

router.use(internalAuthMiddleware);

router.get('/customers/lookup', internalController.lookupByMobile.bind(internalController));
router.get('/customers/:id/summary', internalController.getCustomerSummary.bind(internalController));
router.post('/customers/:id/record-visit', internalController.recordVisit.bind(internalController));

export const internalRoutes = router;
