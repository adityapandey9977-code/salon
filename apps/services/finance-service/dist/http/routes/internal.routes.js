import { Router } from 'express';
import { FinanceEventService } from '../../application/services/finance-event.service';
const router = Router();
const financeEventService = new FinanceEventService();
router.post('/events/sale-completed', async (req, res, next) => {
    try {
        await financeEventService.handleSaleCompleted(req.body);
        res.json({ success: true, message: 'Sale completed financial projection updated' });
    }
    catch (err) {
        next(err);
    }
});
router.post('/events/payment-completed', async (req, res, next) => {
    try {
        await financeEventService.handlePaymentCompleted(req.body);
        res.json({ success: true, message: 'Payment completed journal posted' });
    }
    catch (err) {
        next(err);
    }
});
router.post('/events/refund-completed', async (req, res, next) => {
    try {
        await financeEventService.handleRefundCompleted(req.body);
        res.json({ success: true, message: 'Refund completed reversal journal posted' });
    }
    catch (err) {
        next(err);
    }
});
router.post('/events/goods-received', async (req, res, next) => {
    try {
        await financeEventService.handleGoodsReceived(req.body);
        res.json({ success: true, message: 'Goods received AP journal posted' });
    }
    catch (err) {
        next(err);
    }
});
export { router as internalRoutes };
