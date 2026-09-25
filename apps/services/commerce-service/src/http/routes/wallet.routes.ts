import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth.middleware';
import { requirePermission } from '../../middleware/permission.middleware';
import { walletController } from '../controllers/wallet.controller';

const router: Router = Router();

router.use(authMiddleware);

router.get(
  '/',
  requirePermission('pos.use'),
  walletController.getBalance.bind(walletController),
);
router.post(
  '/topup',
  requirePermission('pos.use'),
  walletController.topup.bind(walletController),
);

export const walletRoutes: Router = router;
