import { webhookService } from '../../application/services/webhook.service';
export class WebhookController {
    static async handleRazorpay(req, res, next) {
        try {
            const signature = req.headers['x-razorpay-signature'];
            const result = await webhookService.handleWebhook('RAZORPAY', JSON.stringify(req.body), signature);
            res.status(200).json({ success: true, data: result });
        }
        catch (err) {
            next(err);
        }
    }
    static async handleStripe(req, res, next) {
        try {
            const signature = req.headers['stripe-signature'];
            const result = await webhookService.handleWebhook('STRIPE', JSON.stringify(req.body), signature);
            res.status(200).json({ success: true, data: result });
        }
        catch (err) {
            next(err);
        }
    }
    static async handleMock(req, res, next) {
        try {
            const signature = req.headers['x-mock-signature'] || 'valid_signature';
            const result = await webhookService.handleWebhook('MOCK', JSON.stringify(req.body), signature);
            res.status(200).json({ success: true, data: result });
        }
        catch (err) {
            next(err);
        }
    }
}
