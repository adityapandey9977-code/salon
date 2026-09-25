import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth.middleware';
import { requirePermission } from '../../middleware/permission.middleware';
import { packageController } from '../controllers/package.controller';

const router: Router = Router();

router.use(authMiddleware);

router.get(
  '/',
  requirePermission('package.read'),
  packageController.listPackages.bind(packageController),
);
router.post(
  '/',
  requirePermission('package.manage'),
  packageController.createPackage.bind(packageController),
);
router.get(
  '/usage',
  requirePermission('package.read'),
  packageController.listPackageUsage.bind(packageController),
);
router.post(
  '/usage/redeem',
  requirePermission('package.manage'),
  packageController.createPackageRedemption.bind(packageController),
);
router.get(
  '/analytics',
  requirePermission('package.read'),
  packageController.getPackagesAnalytics.bind(packageController),
);
router.get(
  '/:id',
  requirePermission('package.read'),
  packageController.getPackageById.bind(packageController),
);
router.put(
  '/:id',
  requirePermission('package.manage'),
  packageController.updatePackage.bind(packageController),
);

export const packageRoutes: Router = router;


