import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth.middleware';
import { requirePermission } from '../../middleware/permission.middleware';
import { attendanceController } from '../controllers/attendance.controller';

const router: Router = Router();

router.use(authMiddleware);

// Clock in / out directly under /api/v1/staff
router.post(
  '/clock-in',
  requirePermission('attendance.self', 'attendance.manage', 'staff.read'),
  (req, res, next) => {
    attendanceController.clockIn(req, res).catch(next);
  },
);

router.post(
  '/clock-out',
  requirePermission('attendance.self', 'attendance.manage', 'staff.read'),
  (req, res, next) => {
    attendanceController.clockOut(req, res).catch(next);
  },
);

// Attendance logs and management under /attendance
router.get(
  '/attendance',
  requirePermission('attendance.read', 'attendance.manage', 'staff.read'),
  (req, res, next) => {
    attendanceController.queryAttendanceLog(req, res).catch(next);
  },
);

router.post(
  '/attendance/punch',
  requirePermission('attendance.self', 'attendance.manage', 'staff.read'),
  (req, res, next) => {
    attendanceController.punchAttendance(req, res).catch(next);
  },
);

router.post(
  '/attendance/manual',
  requirePermission('attendance.manage'),
  (req, res, next) => {
    attendanceController.recordManualAttendance(req, res).catch(next);
  },
);

router.get(
  '/attendance/log',
  requirePermission('attendance.read', 'attendance.manage', 'staff.read'),
  (req, res, next) => {
    attendanceController.queryAttendanceLog(req, res).catch(next);
  },
);

router.get(
  '/attendance/:employeeId',
  requirePermission('attendance.read', 'attendance.manage', 'staff.read'),
  (req, res, next) => {
    attendanceController.getEmployeeAttendance(req, res).catch(next);
  },
);

export { router as attendanceRoutes };
