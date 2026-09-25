import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth.middleware';
import { requirePermission } from '../../middleware/permission.middleware';
import { leadController } from '../controllers/lead.controller';

const router: Router = Router();

router.use(authMiddleware);

router.get(
  '/',
  requirePermission('lead.read'),
  leadController.listLeads.bind(leadController),
);
router.post(
  '/',
  requirePermission('lead.create'),
  leadController.createLead.bind(leadController),
);
router.get(
  '/:id',
  requirePermission('lead.read'),
  leadController.getLeadById.bind(leadController),
);
router.patch(
  '/:id/status',
  requirePermission('lead.update'),
  leadController.updateStatus.bind(leadController),
);
router.post(
  '/:id/convert',
  requirePermission('lead.convert'),
  leadController.convertLead.bind(leadController),
);

export const leadRoutes = router;
