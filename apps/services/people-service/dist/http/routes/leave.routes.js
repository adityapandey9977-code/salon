import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth.middleware';
import { requirePermission } from '../../middleware/permission.middleware';
import { leaveController } from '../controllers/leave.controller';
const router = Router();
router.use(authMiddleware);
router.get('/', requirePermission('leave.read', 'leave.manage', 'staff.read'), (req, res, next) => {
    leaveController.queryLeave(req, res).catch(next);
});
router.get('/requests', requirePermission('leave.read', 'leave.manage', 'staff.read'), (req, res, next) => {
    leaveController.queryLeave(req, res).catch(next);
});
router.post('/', requirePermission('leave.self', 'leave.manage', 'staff.read'), (req, res, next) => {
    leaveController.createLeaveRequest(req, res).catch(next);
});
router.get('/:id', requirePermission('leave.read', 'leave.manage', 'staff.read'), (req, res, next) => {
    leaveController.getLeaveById(req, res).catch(next);
});
router.patch('/:id', requirePermission('leave.self', 'leave.manage'), (req, res, next) => {
    leaveController.updateLeaveRequest(req, res).catch(next);
});
router.post('/:id/approve', requirePermission('leave.approve', 'leave.manage'), (req, res, next) => {
    leaveController.approveLeave(req, res).catch(next);
});
router.post('/:id/reject', requirePermission('leave.approve', 'leave.manage'), (req, res, next) => {
    leaveController.rejectLeave(req, res).catch(next);
});
router.post('/:id/cancel', requirePermission('leave.self', 'leave.manage'), (req, res, next) => {
    leaveController.cancelLeave(req, res).catch(next);
});
export { router as leaveRoutes };
