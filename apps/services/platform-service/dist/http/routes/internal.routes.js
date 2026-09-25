import { Router } from 'express';
import { InternalController } from '../controllers/internal.controller';
const router = Router();
router.get('/tenants/:tenantId/effective-entitlements', InternalController.getEffectiveEntitlements);
router.get('/tenants/:tenantId/subscription', InternalController.getSubscription);
router.get('/domains/:hostname/resolve', InternalController.resolveDomain);
export { router as internalRoutes };
