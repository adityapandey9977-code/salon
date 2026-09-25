import { Router } from 'express';
import { healthController } from '../controllers/health.controller';

const router: Router = Router();

router.get('/health', healthController.health.bind(healthController));
router.get('/ready', healthController.ready.bind(healthController));
router.get('/metrics', healthController.metrics.bind(healthController));

export const healthRoutes: Router = router;
