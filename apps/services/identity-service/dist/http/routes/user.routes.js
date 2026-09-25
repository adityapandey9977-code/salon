import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth.middleware';
import { requirePermission } from '../../middleware/permission.middleware';
import { userController } from '../controllers/user.controller';
const router = Router();
router.use(authMiddleware);
// User CRUD
router.get('/', requirePermission('user.read'), (req, res, next) => userController.listUsers(req, res, next));
router.post('/', requirePermission('user.create'), (req, res, next) => userController.createUser(req, res, next));
router.get('/:id', requirePermission('user.read'), (req, res, next) => userController.getUserById(req, res, next));
router.patch('/:id', requirePermission('user.update'), (req, res, next) => userController.updateUser(req, res, next));
router.post('/:id/suspend', requirePermission('user.suspend'), (req, res, next) => userController.suspendUser(req, res, next));
router.post('/:id/activate', requirePermission('user.update'), (req, res, next) => userController.activateUser(req, res, next));
// User Roles
router.post('/:id/roles', requirePermission('role.manage'), (req, res, next) => userController.assignRoles(req, res, next));
router.delete('/:id/roles/:roleId', requirePermission('role.manage'), (req, res, next) => userController.removeRole(req, res, next));
// Effective Access
router.get('/:id/effective-access', requirePermission('user.read'), (req, res, next) => userController.getEffectiveAccess(req, res, next));
// User Scopes
router.get('/:id/scopes', requirePermission('user.read'), (req, res, next) => userController.getScopes(req, res, next));
router.post('/:id/scopes', requirePermission('user.update'), (req, res, next) => userController.createScope(req, res, next));
router.delete('/:id/scopes/:scopeId', requirePermission('user.update'), (req, res, next) => userController.deleteScope(req, res, next));
export { router as userRoutes };
