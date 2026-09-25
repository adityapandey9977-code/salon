import { Router } from 'express';
import { customerRoutes } from './customer.routes';
import { healthRoutes } from './health.routes';
import { internalRoutes } from './internal.routes';
import { leadRoutes } from './lead.routes';
import { segmentRoutes } from './segment.routes';

const router: Router = Router();

router.use('/', healthRoutes);
router.use('/internal/v1', internalRoutes);
router.use('/api/v1/customers/leads', leadRoutes);
router.use('/api/v1/customers/segments', segmentRoutes);
router.use('/api/v1/customers', customerRoutes);

export const apiRoutes = router;
