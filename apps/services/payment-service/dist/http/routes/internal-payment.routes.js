import { Router } from 'express';
import { InternalPaymentController } from '../controllers/internal-payment.controller';
import { internalAuthMiddleware } from '../middleware/internal-auth.middleware';
const router = Router();
router.use(internalAuthMiddleware);
router.post('/booking-deposit', InternalPaymentController.bookingDeposit);
export const internalPaymentRouter = router;
