import { Router } from 'express';
import { healthController } from '../controllers/health.controller';

const router: Router = Router();

router.get('/health', (req, res) => healthController.getHealth(req, res));
router.get('/ready', (req, res) => healthController.getReady(req, res));
router.get('/metrics', (req, res) => healthController.getMetrics(req, res));

export { router as healthRoutes };
