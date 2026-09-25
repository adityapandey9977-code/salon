import { Router } from 'express';
import { AppointmentController } from '../controllers/appointment.controller';
import { AvailabilityController } from '../controllers/availability.controller';
import { WalkinController } from '../controllers/walkin.controller';
import { WaitlistController } from '../controllers/waitlist.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { requirePermission } from '../middleware/permission.middleware';

const router: Router = Router();

// Apply authentication to all booking endpoints
router.use(authMiddleware);

// Specific Named Routes FIRST (before :id parameter routes)
router.get(
  '/calendar',
  requirePermission('appointment.read'),
  AppointmentController.getCalendar,
);

router.get(
  '/availability',
  requirePermission('appointment.read'),
  AvailabilityController.getAvailability,
);

router.get(
  '/today-queue',
  requirePermission('appointment.read'),
  AppointmentController.getTodayQueue,
);

router.get(
  '/walkins',
  requirePermission('walkin.read'),
  WalkinController.list,
);

router.post(
  '/walkins',
  requirePermission('walkin.manage'),
  WalkinController.create,
);

router.patch(
  '/walkins/:id/seat',
  requirePermission('walkin.manage'),
  WalkinController.seat,
);

router.get(
  '/stylist-schedule',
  requirePermission('schedule.read'),
  AppointmentController.getStylistSchedule,
);

router.get(
  '/my-bookings',
  AppointmentController.getMyBookings,
);

router.post(
  '/online-book',
  AppointmentController.create,
);

router.post(
  '/tele-book',
  requirePermission('appointment.create'),
  AppointmentController.create,
);

router.get(
  '/cross-branch',
  requirePermission('appointment.read'),
  AppointmentController.getCrossBranch,
);

router.get(
  '/pending-confirmations',
  requirePermission('appointment.read'),
  AppointmentController.getPendingConfirmations,
);

// Waitlist routes
router.get(
  '/waitlist',
  requirePermission('appointment.read'),
  WaitlistController.list,
);

router.post(
  '/waitlist',
  requirePermission('appointment.create'),
  WaitlistController.create,
);

router.patch(
  '/waitlist/:id/status',
  requirePermission('appointment.update'),
  WaitlistController.updateStatus,
);

// Generic Base Collection Routes
router.get(
  '/',
  requirePermission('appointment.read'),
  AppointmentController.list,
);

router.post(
  '/',
  requirePermission('appointment.create'),
  AppointmentController.create,
);

// Specific Parameterized Mutation Routes
router.patch(
  '/:id/status',
  requirePermission('appointment.update'),
  AppointmentController.updateStatus,
);

router.patch(
  '/:id/reassign',
  requirePermission('appointment.reassign'),
  AppointmentController.reassign,
);

router.patch(
  '/:id/start-service',
  requirePermission('appointment.update'),
  AppointmentController.startService,
);

router.patch(
  '/:id/complete',
  requirePermission('appointment.complete'),
  AppointmentController.complete,
);

router.patch(
  '/:id/cancel',
  requirePermission('appointment.cancel'),
  AppointmentController.cancel,
);

router.patch(
  '/:id/confirm',
  requirePermission('appointment.confirm'),
  AppointmentController.confirm,
);

// Single Item Detail Route
router.get(
  '/:id',
  requirePermission('appointment.read'),
  AppointmentController.getById,
);

export const appointmentRouter: Router = router;
