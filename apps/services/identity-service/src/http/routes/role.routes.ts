import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth.middleware';
import { requirePermission } from '../../middleware/permission.middleware';
import { roleController } from '../controllers/role.controller';

const router: Router = Router();

router.use(authMiddleware);

router.get('/', requirePermission('role.read'), (req, res, next) =>
  roleController.listRoles(req, res, next),
);
router.post('/', requirePermission('role.manage'), (req, res, next) =>
  roleController.createRole(req, res, next),
);
router.get('/:id', requirePermission('role.read'), (req, res, next) =>
  roleController.getRoleById(req, res, next),
);
router.patch('/:id', requirePermission('role.manage'), (req, res, next) =>
  roleController.updateRole(req, res, next),
);
router.delete('/:id', requirePermission('role.manage'), (req, res, next) =>
  roleController.deleteRole(req, res, next),
);
router.put('/:id/permissions', requirePermission('role.manage'), (req, res, next) =>
  roleController.assignPermissions(req, res, next),
);

export { router as roleRoutes };
