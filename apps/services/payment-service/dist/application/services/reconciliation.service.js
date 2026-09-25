import { DOMAIN_EVENTS } from '@salon-spa-saas/events';
import { paymentEventPublisher } from '../../infrastructure/messaging/publisher';
import { reconciliationRepository } from '../../infrastructure/repositories/reconciliation.repository';
export class ReconciliationService {
    async reconcile(tenantId, data, userId) {
        const record = await reconciliationRepository.create({
            tenantId,
            provider: data.provider,
            settlementDate: data.settlementDate,
            totalAmount: data.totalAmount,
            feeAmount: data.feeAmount,
            taxAmount: data.taxAmount,
            netAmount: data.netAmount,
        });
        await paymentEventPublisher.publish({
            eventType: DOMAIN_EVENTS.PAYMENT_RECONCILED,
            aggregateType: 'SettlementReconciliation',
            aggregateId: record.id,
            tenantId,
            userId,
            payload: {
                settlementId: record.id,
                provider: record.provider,
                settlementDate: record.settlementDate,
                totalAmount: record.totalAmount,
                netAmount: record.netAmount,
            },
        });
        return record;
    }
    async listSettlements(tenantId) {
        return reconciliationRepository.list(tenantId);
    }
}
export const reconciliationService = new ReconciliationService();
