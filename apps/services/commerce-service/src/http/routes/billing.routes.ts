import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth.middleware';
import { requirePermission } from '../../middleware/permission.middleware';
import { billingController } from '../controllers/billing.controller';

const router: Router = Router();

router.use(authMiddleware);

router.post(
  '/calculate-tax',
  requirePermission('pos.use'),
  billingController.calculateTax.bind(billingController),
);
router.post(
  '/checkout',
  requirePermission('pos.use'),
  billingController.checkout.bind(billingController),
);
router.get(
  '/invoices',
  requirePermission('invoice.read'),
  billingController.listInvoices.bind(billingController),
);
router.get(
  '/invoices/:id',
  requirePermission('invoice.read'),
  billingController.getInvoiceById.bind(billingController),
);
router.post(
  '/refunds',
  requirePermission('refund.request'),
  billingController.requestRefund.bind(billingController),
);

export const billingRoutes: Router = router;
