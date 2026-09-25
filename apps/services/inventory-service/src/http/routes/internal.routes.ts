import { Router, Request, Response, NextFunction } from 'express';
import { ConsumptionService } from '../../application/services/consumption.service';

const router: Router = Router();
const consumptionService = new ConsumptionService();

router.post('/consume/service', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await consumptionService.handleServiceCompleted(req.body);
    res.json({ success: true, message: 'Service consumption processed' });
  } catch (err) {
    next(err);
  }
});

router.post('/consume/sale', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await consumptionService.handleSaleCompleted(req.body);
    res.json({ success: true, message: 'Sale consumption processed' });
  } catch (err) {
    next(err);
  }
});

export { router as internalRoutes };
