import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth.middleware';
import { requirePermission } from '../../middleware/permission.middleware';
import { branchAssignmentController } from '../controllers/branch-assignment.controller';
import { leaveController } from '../controllers/leave.controller';
import { skillController } from '../controllers/skill.controller';
import { staffController } from '../controllers/staff.controller';

const router: Router = Router();

// Apply authMiddleware to all staff routes
router.use(authMiddleware);

// Current Authenticated Staff Profile
router.get('/me', (req, res, next) => {
  staffController.getStaffMe(req, res).catch(next);
});

// Branch Team
router.get('/branch-team', requirePermission('staff.read'), (req, res, next) => {
  staffController.getBranchTeam(req, res).catch(next);
});

// Branch Assignments Sub-resource
router.get(
  '/:id/branches',
  requirePermission('staff.read', 'staff.branch.manage'),
  (req, res, next) => {
    branchAssignmentController.getStaffBranches(req, res).catch(next);
  },
);

router.post('/:id/branches', requirePermission('staff.branch.manage'), (req, res, next) => {
  branchAssignmentController.assignBranch(req, res).catch(next);
});

router.patch(
  '/:id/branches/:assignmentId',
  requirePermission('staff.branch.manage'),
  (req, res, next) => {
    branchAssignmentController.updateAssignment(req, res).catch(next);
  },
);

router.delete(
  '/:id/branches/:assignmentId',
  requirePermission('staff.branch.manage'),
  (req, res, next) => {
    branchAssignmentController.removeAssignment(req, res).catch(next);
  },
);

// Skills Sub-resource
router.get(
  '/:id/skills',
  requirePermission('staff.skill.read', 'staff.skill.manage', 'staff.read'),
  (req, res, next) => {
    skillController.getStaffSkills(req, res).catch(next);
  },
);

router.post('/:id/skills', requirePermission('staff.skill.manage'), (req, res, next) => {
  skillController.addSkill(req, res).catch(next);
});

router.patch('/:id/skills/:skillId', requirePermission('staff.skill.manage'), (req, res, next) => {
  skillController.updateSkill(req, res).catch(next);
});

router.delete('/:id/skills/:skillId', requirePermission('staff.skill.manage'), (req, res, next) => {
  skillController.removeSkill(req, res).catch(next);
});

// Leave Balances Sub-resource
router.get(
  '/:id/leave-balances',
  requirePermission('leave.read', 'leave.manage', 'staff.read'),
  (req, res, next) => {
    leaveController.getLeaveBalances(req, res).catch(next);
  },
);

router.post(
  '/:id/leave-balances/adjust',
  requirePermission('leave.manage'),
  (req, res, next) => {
    leaveController.adjustLeaveBalance(req, res).catch(next);
  },
);

// Staff Core CRUD
router.get('/', requirePermission('staff.read'), (req, res, next) => {
  staffController.listStaff(req, res).catch(next);
});

router.post('/', requirePermission('staff.create'), (req, res, next) => {
  staffController.createStaff(req, res).catch(next);
});

router.get('/:id', requirePermission('staff.read'), (req, res, next) => {
  staffController.getStaffById(req, res).catch(next);
});

router.patch('/:id', requirePermission('staff.update'), (req, res, next) => {
  staffController.updateStaff(req, res).catch(next);
});

router.delete('/:id', requirePermission('staff.delete'), (req, res, next) => {
  staffController.deleteStaff(req, res).catch(next);
});

export { router as staffRoutes };
