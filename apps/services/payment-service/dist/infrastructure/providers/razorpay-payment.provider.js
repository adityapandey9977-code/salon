import crypto from 'crypto';
import { config } from '../../config';
export class RazorpayPaymentProvider {
    providerName = 'RAZORPAY';
    async createPaymentIntent(params) {
        // In production this invokes Razorpay Orders API: POST /v1/orders
        const orderId = `order_${crypto.randomUUID().replace(/-/g, '').slice(0, 14)}`;
        return {
            providerIntentId: orderId,
            providerOrderId: orderId,
            status: 'PENDING',
        };
    }
    async verifyPayment(params) {
        if (!params.providerOrderId || !params.providerSignature) {
            return false;
        }
        const expectedSignature = crypto
            .createHmac('sha256', config.RAZORPAY_KEY_SECRET)
            .update(`${params.providerOrderId}|${params.providerTransactionId}`)
            .digest('hex');
        return expectedSignature === params.providerSignature;
    }
    async capturePayment(_providerTransactionId, _amount) {
        return true;
    }
    async refundPayment(params) {
        const refundId = `rfnd_${crypto.randomUUID().replace(/-/g, '').slice(0, 14)}`;
        return {
            providerRefundId: refundId,
            status: 'COMPLETED',
        };
    }
    async createPaymentLink(params) {
        const linkId = `plink_${crypto.randomUUID().replace(/-/g, '').slice(0, 10)}`;
        return {
            providerLinkId: linkId,
            url: `https://rzp.io/i/${linkId}`,
            shortUrl: `https://rzp.io/i/${linkId}`,
        };
    }
    async verifyWebhook(rawBody, signature) {
        const bodyStr = typeof rawBody === 'string' ? rawBody : rawBody.toString();
        const expectedSignature = crypto
            .createHmac('sha256', config.RAZORPAY_WEBHOOK_SECRET)
            .update(bodyStr)
            .digest('hex');
        if (expectedSignature !== signature) {
            return { isValid: false, error: 'Razorpay webhook signature verification failed' };
        }
        try {
            const parsed = JSON.parse(bodyStr);
            const entity = parsed.payload?.payment?.entity || {};
            return {
                isValid: true,
                eventId: parsed.event_id || parsed.id,
                eventType: parsed.event,
                providerTransactionId: entity.id,
                paymentIntentId: entity.order_id,
                amount: entity.amount ? entity.amount / 100 : undefined,
                status: entity.status === 'captured' ? 'SUCCESS' : 'FAILED',
            };
        }
        catch {
            return { isValid: false, error: 'Malformed Razorpay webhook body' };
        }
    }
}
