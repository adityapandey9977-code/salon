import { DOMAIN_EVENTS } from '@salon-spa-saas/events';
import { commerceEventPublisher } from '../../infrastructure/messaging/publisher';
import { loyaltyRepository } from '../../infrastructure/repositories/loyalty.repository';
export class LoyaltyService {
    async getPoints(tenantId, customerId) {
        return loyaltyRepository.getPoints(tenantId, customerId);
    }
    async redeemPoints(tenantId, input, userId = null, correlationId) {
        const result = await loyaltyRepository.postTransaction({
            tenantId,
            customerId: input.customerId,
            type: 'REDEEM',
            points: input.pointsToRedeem,
            referenceType: 'INVOICE',
            referenceId: input.invoiceId,
        });
        await commerceEventPublisher.publish({
            eventType: DOMAIN_EVENTS.LOYALTY_POINTS_REDEEMED,
            aggregateType: 'Loyalty',
            aggregateId: result.loyalty.id,
            tenantId,
            userId,
            correlationId,
            payload: {
                tenantId,
                customerId: input.customerId,
                pointsRedeemed: input.pointsToRedeem,
                remainingPoints: result.pointsAfter,
                invoiceId: input.invoiceId,
            },
        });
        return result;
    }
}
export const loyaltyService = new LoyaltyService();
