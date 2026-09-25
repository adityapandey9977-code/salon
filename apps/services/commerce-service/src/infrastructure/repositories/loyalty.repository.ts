import { ConflictError } from '@salon-spa-saas/common-types';
import { prisma } from '../prisma/client';
import type { LoyaltyTransactionType } from '../prisma/generated-client';

export class LoyaltyRepository {
  public async getOrCreateLoyalty(tenantId: string, customerId: string) {
    return prisma.customerLoyalty.upsert({
      where: { customerId },
      update: {},
      create: {
        tenantId,
        customerId,
        pointsBalanceProjection: 0,
        tier: 'SILVER',
      },
    });
  }

  public async getPoints(tenantId: string, customerId: string): Promise<{ points: number; tier: string }> {
    const record = await prisma.customerLoyalty.findFirst({
      where: { tenantId, customerId },
    });
    return {
      points: record ? record.pointsBalanceProjection : 0,
      tier: record ? record.tier : 'SILVER',
    };
  }

  public async postTransaction(data: {
    tenantId: string;
    customerId: string;
    type: LoyaltyTransactionType;
    points: number;
    referenceType?: string | null;
    referenceId?: string | null;
  }) {
    return prisma.$transaction(async (tx) => {
      const loyalty = await tx.customerLoyalty.upsert({
        where: { customerId: data.customerId },
        update: {},
        create: {
          tenantId: data.tenantId,
          customerId: data.customerId,
          pointsBalanceProjection: 0,
          tier: 'SILVER',
        },
      });

      let current = loyalty.pointsBalanceProjection;
      if (data.type === 'EARN' || data.type === 'REVERSE') {
        current += data.points;
      } else if (data.type === 'REDEEM' || data.type === 'EXPIRE') {
        if (current < data.points) {
          throw new ConflictError('Insufficient loyalty points');
        }
        current -= data.points;
      } else if (data.type === 'ADJUST') {
        current = data.points;
      }

      // Tier derivation
      let tier = 'SILVER';
      if (current >= 5000) tier = 'PLATINUM';
      else if (current >= 2000) tier = 'GOLD';

      const txRecord = await tx.loyaltyTransaction.create({
        data: {
          tenantId: data.tenantId,
          loyaltyId: loyalty.id,
          type: data.type,
          points: data.points,
          referenceType: data.referenceType,
          referenceId: data.referenceId,
        },
      });

      await tx.customerLoyalty.update({
        where: { id: loyalty.id },
        data: {
          pointsBalanceProjection: current,
          tier,
        },
      });

      return { loyalty, transaction: txRecord, pointsAfter: current, tier };
    });
  }
}

export const loyaltyRepository = new LoyaltyRepository();
