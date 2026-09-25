import crypto from 'crypto';
export class MockPaymentProvider {
    providerName = 'MOCK';
    async createPaymentIntent(params) {
        const id = `mock_intent_${crypto.randomUUID().slice(0, 8)}`;
        return {
            providerIntentId: id,
            providerOrderId: `mock_order_${crypto.randomUUID().slice(0, 8)}`,
            clientSecret: `mock_sec_${crypto.randomUUID().slice(0, 16)}`,
            status: 'PENDING',
        };
    }
    async verifyPayment(_params) {
        return true;
    }
    async capturePayment(_providerTransactionId, _amount) {
        return true;
    }
    async refundPayment(_params) {
        return {
            providerRefundId: `mock_rfnd_${crypto.randomUUID().slice(0, 8)}`,
            status: 'COMPLETED',
        };
    }
    async createPaymentLink(params) {
        const id = crypto.randomUUID().slice(0, 8);
        return {
            providerLinkId: `mock_plink_${id}`,
            url: `https://pay.digiflexsalon.com/mock/${id}`,
            shortUrl: `https://dgfx.link/${id}`,
        };
    }
    async verifyWebhook(rawBody, signature) {
        if (!signature || signature === 'invalid_signature') {
            return { isValid: false, error: 'Invalid webhook signature' };
        }
        try {
            const payload = typeof rawBody === 'string' ? JSON.parse(rawBody) : JSON.parse(rawBody.toString());
            return {
                isValid: true,
                eventId: payload.event_id || `evt_${crypto.randomUUID().slice(0, 8)}`,
                eventType: payload.event || 'payment.captured',
                paymentIntentId: payload.paymentIntentId,
                providerTransactionId: payload.transaction_id || `txn_${crypto.randomUUID().slice(0, 8)}`,
                amount: payload.amount,
                status: 'SUCCESS',
            };
        }
        catch {
            return { isValid: false, error: 'Malformed webhook payload' };
        }
    }
}
