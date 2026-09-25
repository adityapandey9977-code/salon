import type { WalletTopupRequest } from '@salon-spa-saas/contracts';
export declare class WalletService {
    getBalance(tenantId: string, customerId: string): Promise<number>;
    topup(tenantId: string, input: WalletTopupRequest, userId?: string | null, correlationId?: string): Promise<{
        wallet: {
            tenantId: string;
            id: string;
            currency: string;
            updatedAt: Date;
            customerId: string;
            currentBalance: import("../../infrastructure/prisma/generated-client/runtime/library").Decimal;
        };
        transaction: {
            tenantId: string;
            type: import("../../infrastructure/prisma/generated-client").$Enums.WalletTransactionType;
            id: string;
            createdAt: Date;
            referenceType: string | null;
            referenceId: string | null;
            amount: import("../../infrastructure/prisma/generated-client/runtime/library").Decimal;
            balanceAfter: import("../../infrastructure/prisma/generated-client/runtime/library").Decimal;
            walletId: string;
        };
        balanceAfter: number;
    }>;
}
export declare const walletService: WalletService;
//# sourceMappingURL=wallet.service.d.ts.map