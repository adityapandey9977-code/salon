import type { LoyaltyRedeemRequest } from '@salon-spa-saas/contracts';
import { DOMAIN_EVENTS } from '@salon-spa-saas/events';
import { commerceEventPublisher } from '../../infrastructure/messaging/publisher';
import { loyaltyRepository } from '../../infrastructure/repositories/loyalty.repository';

export class LoyaltyService {
  public async getPoints(
    tenantId: string,
    customerId: string,
  ): Promise<{ points: number; tier: string }> {
    return loyaltyRepository.getPoints(tenantId, customerId);
  }

  public async redeemPoints(
    tenantId: string,
    input: LoyaltyRedeemRequest,
    userId: string | null = null,
    correlationId?: string,
  ) {
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
