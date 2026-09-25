import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth.middleware';
import { requirePermission } from '../../middleware/permission.middleware';
import { segmentController } from '../controllers/segment.controller';

const router: Router = Router();

router.use(authMiddleware);

router.get(
  '/',
  requirePermission('customer.segment.read'),
  segmentController.listSegments.bind(segmentController),
);
router.post(
  '/',
  requirePermission('customer.segment.manage'),
  segmentController.createSegment.bind(segmentController),
);
router.get(
  '/:id',
  requirePermission('customer.segment.read'),
  segmentController.getSegmentById.bind(segmentController),
);
router.post(
  '/:id/members',
  requirePermission('customer.segment.manage'),
  segmentController.addMember.bind(segmentController),
);
router.delete(
  '/:id/members/:customerId',
  requirePermission('customer.segment.manage'),
  segmentController.removeMember.bind(segmentController),
);

export const segmentRoutes = router;
