import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth.middleware';
import { requirePermission } from '../../middleware/permission.middleware';
import { shiftController } from '../controllers/shift.controller';

const router: Router = Router();

router.use(authMiddleware);

router.get(
  '/',
  requirePermission('staff.roster.read', 'staff.roster.manage', 'staff.read'),
  (req, res, next) => {
    shiftController.getShifts(req, res).catch(next);
  },
);

router.post('/', requirePermission('staff.roster.manage'), (req, res, next) => {
  shiftController.createShift(req, res).catch(next);
});

router.patch('/:id', requirePermission('staff.roster.manage'), (req, res, next) => {
  shiftController.updateShift(req, res).catch(next);
});

router.delete('/:id', requirePermission('staff.roster.manage'), (req, res, next) => {
  shiftController.deleteShift(req, res).catch(next);
});

export { router as shiftRoutes };
