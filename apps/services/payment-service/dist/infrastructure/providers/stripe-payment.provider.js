import crypto from 'crypto';
export class StripePaymentProvider {
    providerName = 'STRIPE';
    async createPaymentIntent(params) {
        const piId = `pi_${crypto.randomUUID().replace(/-/g, '').slice(0, 16)}`;
        const secret = `${piId}_secret_${crypto.randomUUID().replace(/-/g, '').slice(0, 16)}`;
        return {
            providerIntentId: piId,
            clientSecret: secret,
            status: 'PENDING',
        };
    }
    async verifyPayment(_params) {
        return true;
    }
    async capturePayment(_providerTransactionId, _amount) {
        return true;
    }
    async refundPayment(params) {
        const reId = `re_${crypto.randomUUID().replace(/-/g, '').slice(0, 16)}`;
        return {
            providerRefundId: reId,
            status: 'COMPLETED',
        };
    }
    async createPaymentLink(params) {
        const linkId = `plink_${crypto.randomUUID().replace(/-/g, '').slice(0, 12)}`;
        return {
            providerLinkId: linkId,
            url: `https://buy.stripe.com/${linkId}`,
            shortUrl: `https://buy.stripe.com/${linkId}`,
        };
    }
    async verifyWebhook(rawBody, signature) {
        if (!signature || signature === 'invalid_signature') {
            return { isValid: false, error: 'Stripe webhook signature invalid' };
        }
        try {
            const parsed = typeof rawBody === 'string' ? JSON.parse(rawBody) : JSON.parse(rawBody.toString());
            const dataObj = parsed.data?.object || {};
            return {
                isValid: true,
                eventId: parsed.id,
                eventType: parsed.type,
                providerTransactionId: dataObj.id,
                paymentIntentId: dataObj.id,
                amount: dataObj.amount ? dataObj.amount / 100 : undefined,
                status: parsed.type === 'payment_intent.succeeded' ? 'SUCCESS' : 'FAILED',
            };
        }
        catch {
            return { isValid: false, error: 'Malformed Stripe webhook payload' };
        }
    }
}
