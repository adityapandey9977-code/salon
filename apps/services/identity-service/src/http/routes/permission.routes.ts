import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth.middleware';
import { requirePermission } from '../../middleware/permission.middleware';
import { roleController } from '../controllers/role.controller';

const router: Router = Router();

router.use(authMiddleware);

router.get('/', requirePermission('role.read'), (req, res, next) =>
  roleController.listPermissions(req, res, next),
);

export { router as permissionRoutes };
