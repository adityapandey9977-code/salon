import { Router } from 'express';
import { internalAuthMiddleware } from '../../middleware/internal-auth.middleware';
import { internalController } from '../controllers/internal.controller';

const router: Router = Router();

// Internal service-to-service endpoints protected by internal secret
router.use(internalAuthMiddleware);

router.get('/staff/:id/availability-context', (req, res, next) => {
  internalController.getStaffAvailabilityContext(req, res).catch(next);
});

router.get('/branches/:branchId/bookable-staff', (req, res, next) => {
  internalController.getBookableStaffForBranch(req, res).catch(next);
});

export { router as internalRoutes };
