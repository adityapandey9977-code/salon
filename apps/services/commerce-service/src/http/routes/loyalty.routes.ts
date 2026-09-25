import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth.middleware';
import { requirePermission } from '../../middleware/permission.middleware';
import { loyaltyController } from '../controllers/loyalty.controller';

const router: Router = Router();

router.use(authMiddleware);

router.get(
  '/rewards',
  requirePermission('pos.use'),
  loyaltyController.getRewards.bind(loyaltyController),
);
router.post(
  '/redeem',
  requirePermission('pos.use'),
  loyaltyController.redeem.bind(loyaltyController),
);

export const loyaltyRoutes: Router = router;
