import { BadRequestError, NotFoundError } from '@salon-spa-saas/common-types';
import { DOMAIN_EVENTS } from '@salon-spa-saas/events';
import { PaymentProviderFactory } from '../../infrastructure/providers/provider.factory';
import { paymentEventPublisher } from '../../infrastructure/messaging/publisher';
import { paymentRepository } from '../../infrastructure/repositories/payment.repository';
import { idempotencyStore } from '../../infrastructure/redis/idempotency.store';
export class PaymentService {
    async createIntent(tenantId, data, actor) {
        // 1. Check Redis Idempotency Cache
        const cached = await idempotencyStore.getResult(tenantId, data.idempotencyKey);
        if (cached)
            return cached;
        // 2. Check Database for existing idempotency key
        const existing = await paymentRepository.findIntentByIdempotencyKey(tenantId, data.idempotencyKey);
        if (existing) {
            await idempotencyStore.saveResult(tenantId, data.idempotencyKey, existing);
            return existing;
        }
        // 3. Invoke Provider Adapter
        const provider = PaymentProviderFactory.getProvider(data.provider);
        const providerResult = await provider.createPaymentIntent({
            amount: data.amount,
            currency: data.currency || 'INR',
            receiptId: data.idempotencyKey,
            metadata: {
                tenantId,
                referenceType: data.referenceType,
                referenceId: data.referenceId,
            },
        });
        // 4. Save to Database
        const intent = await paymentRepository.createIntent({
            tenantId,
            purpose: data.purpose,
            referenceType: data.referenceType,
            referenceId: data.referenceId,
            customerId: data.customerId,
            amount: data.amount,
            currency: data.currency,
            provider: provider.providerName,
            providerIntentId: providerResult.providerIntentId,
            idempotencyKey: data.idempotencyKey,
        });
        // 5. Store in Redis Idempotency Cache
        await idempotencyStore.saveResult(tenantId, data.idempotencyKey, intent);
        // 6. Publish Event
        await paymentEventPublisher.publish({
            eventType: DOMAIN_EVENTS.PAYMENT_INTENT_CREATED,
            aggregateType: 'PaymentIntent',
            aggregateId: intent.id,
            tenantId,
            userId: actor.userId,
            payload: {
                paymentIntentId: intent.id,
                amount: intent.amount,
                currency: intent.currency,
                purpose: intent.purpose,
                referenceType: intent.referenceType,
                referenceId: intent.referenceId,
                provider: intent.provider,
                idempotencyKey: intent.idempotencyKey,
            },
        });
        return intent;
    }
    async getIntentById(tenantId, id) {
        const intent = await paymentRepository.findIntentById(tenantId, id);
        if (!intent)
            throw new NotFoundError('Payment intent not found');
        return intent;
    }
    async recordTransaction(tenantId, data, actor) {
        const intent = await this.getIntentById(tenantId, data.paymentIntentId);
        const providerName = data.provider || intent.provider || 'MOCK';
        const provider = PaymentProviderFactory.getProvider(providerName);
        // Verify cryptographic signature if present
        if (data.providerSignature && data.providerTransactionId) {
            const isValid = await provider.verifyPayment({
                providerTransactionId: data.providerTransactionId,
                providerOrderId: data.providerOrderId,
                providerSignature: data.providerSignature,
            });
            if (!isValid) {
                throw new BadRequestError('Invalid payment gateway cryptographic signature');
            }
        }
        const transaction = await paymentRepository.recordTransaction({
            tenantId,
            paymentIntentId: data.paymentIntentId,
            method: data.method,
            amount: data.amount,
            currency: data.currency || intent.currency,
            status: data.status || 'CAPTURED',
            provider: providerName,
            providerTransactionId: data.providerTransactionId,
            providerOrderId: data.providerOrderId,
        });
        // Publish matching event
        const isSuccess = transaction.status === 'CAPTURED' || transaction.status === 'AUTHORIZED';
        const eventType = isSuccess ? DOMAIN_EVENTS.PAYMENT_COMPLETED : DOMAIN_EVENTS.PAYMENT_FAILED;
        await paymentEventPublisher.publish({
            eventType,
            aggregateType: 'Payment',
            aggregateId: transaction.id,
            tenantId,
            userId: actor.userId,
            payload: {
                paymentId: transaction.id,
                invoiceId: intent.referenceType === 'INVOICE' ? intent.referenceId : undefined,
                appointmentId: intent.referenceType === 'APPOINTMENT' ? intent.referenceId : undefined,
                amount: transaction.amount,
                currency: transaction.currency,
                method: transaction.method,
                gatewayTransactionId: transaction.providerTransactionId || undefined,
                paidAt: transaction.paidAt || new Date().toISOString(),
            },
        });
        return transaction;
    }
    async refund(tenantId, data, actor) {
        const provider = PaymentProviderFactory.getProvider('MOCK');
        const providerRefund = await provider.refundPayment({
            providerTransactionId: data.paymentTransactionId,
            amount: data.amount,
            currency: 'INR',
            reason: data.reason,
        });
        const refund = await paymentRepository.createRefund({
            tenantId,
            paymentTransactionId: data.paymentTransactionId,
            amount: data.amount,
            reason: data.reason,
            providerRefundId: providerRefund.providerRefundId,
            requestedByPrincipalType: actor.principalType,
            requestedByUserId: actor.userId,
        });
        await paymentEventPublisher.publish({
            eventType: DOMAIN_EVENTS.REFUND_COMPLETED,
            aggregateType: 'Refund',
            aggregateId: refund.id,
            tenantId,
            userId: actor.userId,
            payload: {
                refundId: refund.id,
                paymentId: refund.paymentTransactionId,
                amount: refund.amount,
                reason: refund.reason,
            },
        });
        return refund;
    }
    async createPaymentLink(tenantId, data) {
        const provider = PaymentProviderFactory.getProvider('MOCK');
        const linkResult = await provider.createPaymentLink({
            amount: data.amount,
            currency: data.currency || 'INR',
            description: data.description || '  Salon Payment',
        });
        return paymentRepository.createPaymentLink({
            tenantId,
            paymentIntentId: data.paymentIntentId,
            url: linkResult.url,
            shortUrl: linkResult.shortUrl,
        });
    }
}
export const paymentService = new PaymentService();
