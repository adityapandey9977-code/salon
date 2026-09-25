import type { LoyaltyRedeemRequest } from '@salon-spa-saas/contracts';
export declare class LoyaltyService {
    getPoints(tenantId: string, customerId: string): Promise<{
        points: number;
        tier: string;
    }>;
    redeemPoints(tenantId: string, input: LoyaltyRedeemRequest, userId?: string | null, correlationId?: string): Promise<{
        loyalty: {
            tenantId: string;
            id: string;
            updatedAt: Date;
            customerId: string;
            pointsBalanceProjection: number;
            tier: string;
        };
        transaction: {
            tenantId: string;
            type: import("../../infrastructure/prisma/generated-client").$Enums.LoyaltyTransactionType;
            id: string;
            createdAt: Date;
            referenceType: string | null;
            referenceId: string | null;
            points: number;
            loyaltyId: string;
        };
        pointsAfter: number;
        tier: string;
    }>;
}
export declare const loyaltyService: LoyaltyService;
//# sourceMappingURL=loyalty.service.d.ts.map