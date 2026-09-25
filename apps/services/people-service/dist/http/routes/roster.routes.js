import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth.middleware';
import { requirePermission } from '../../middleware/permission.middleware';
import { rosterController } from '../controllers/roster.controller';
const router = Router();
router.use(authMiddleware);
router.get('/', requirePermission('staff.roster.read', 'staff.roster.manage', 'staff.read'), (req, res, next) => {
    rosterController.getRoster(req, res).catch(next);
});
router.post('/', requirePermission('staff.roster.manage'), (req, res, next) => {
    rosterController.createRoster(req, res).catch(next);
});
router.patch('/:id', requirePermission('staff.roster.manage'), (req, res, next) => {
    rosterController.updateRoster(req, res).catch(next);
});
router.delete('/:id', requirePermission('staff.roster.manage'), (req, res, next) => {
    rosterController.deleteRoster(req, res).catch(next);
});
export { router as rosterRoutes };
