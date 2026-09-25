import { Router, Request, Response, NextFunction } from 'express';
import { CommunicationEventService } from '../../application/services/communication-event.service';
import { TelephonyService } from '../../application/services/telephony.service';

const router: Router = Router();
const commEventService = new CommunicationEventService();
const telephonyService = new TelephonyService();

router.post('/events/appointment-created', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await commEventService.handleAppointmentCreated(req.body);
    res.json({ success: true, message: 'Appointment notification dispatched' });
  } catch (err) {
    next(err);
  }
});

router.post('/events/payment-completed', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await commEventService.handlePaymentCompleted(req.body);
    res.json({ success: true, message: 'Payment notification dispatched' });
  } catch (err) {
    next(err);
  }
});

router.post('/events/stock-low', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await commEventService.handleStockLow(req.body);
    res.json({ success: true, message: 'Low stock notification dispatched' });
  } catch (err) {
    next(err);
  }
});

router.post('/telephony/inbound-call', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await telephonyService.recordInboundCall(req.body);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
});

export { router as internalRoutes };
