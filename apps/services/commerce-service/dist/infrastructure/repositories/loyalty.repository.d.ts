import type { LoyaltyTransactionType } from '../prisma/generated-client';
export declare class LoyaltyRepository {
    getOrCreateLoyalty(tenantId: string, customerId: string): Promise<{
        tenantId: string;
        id: string;
        updatedAt: Date;
        customerId: string;
        pointsBalanceProjection: number;
        tier: string;
    }>;
    getPoints(tenantId: string, customerId: string): Promise<{
        points: number;
        tier: string;
    }>;
    postTransaction(data: {
        tenantId: string;
        customerId: string;
        type: LoyaltyTransactionType;
        points: number;
        referenceType?: string | null;
        referenceId?: string | null;
    }): Promise<{
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
            type: import("../prisma/generated-client").$Enums.LoyaltyTransactionType;
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
export declare const loyaltyRepository: LoyaltyRepository;
//# sourceMappingURL=loyalty.repository.d.ts.map