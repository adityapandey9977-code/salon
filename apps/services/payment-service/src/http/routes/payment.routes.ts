import { Router } from 'express';
import { PaymentController } from '../controllers/payment.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { requirePermission } from '../middleware/permission.middleware';

const router: Router = Router();

router.use(authMiddleware);

router.post(
  '/intents',
  requirePermission('payment.create'),
  PaymentController.createIntent,
);

router.get(
  '/intents/:id',
  requirePermission('payment.read'),
  PaymentController.getIntentById,
);

router.post(
  '/verify-token',
  requirePermission('payment.create'),
  PaymentController.verifyToken,
);

router.post(
  '/payment-link',
  requirePermission('payment.create'),
  PaymentController.createPaymentLink,
);

router.post(
  '/reconcile',
  requirePermission('payment.reconcile'),
  PaymentController.reconcile,
);

router.post(
  '/:id/refund',
  requirePermission('payment.refund'),
  PaymentController.refund,
);

router.get(
  '/:id',
  requirePermission('payment.read'),
  PaymentController.getById,
);

export const paymentRouter: Router = router;
