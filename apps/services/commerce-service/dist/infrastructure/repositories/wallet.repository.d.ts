import { Prisma, type WalletTransactionType } from '../prisma/generated-client';
export declare class WalletRepository {
    getOrCreateWallet(tenantId: string, customerId: string): Promise<{
        tenantId: string;
        id: string;
        currency: string;
        updatedAt: Date;
        customerId: string;
        currentBalance: Prisma.Decimal;
    }>;
    getBalance(tenantId: string, customerId: string): Promise<number>;
    postTransaction(data: {
        tenantId: string;
        customerId: string;
        type: WalletTransactionType;
        amount: number;
        referenceType?: string | null;
        referenceId?: string | null;
    }): Promise<{
        wallet: {
            tenantId: string;
            id: string;
            currency: string;
            updatedAt: Date;
            customerId: string;
            currentBalance: Prisma.Decimal;
        };
        transaction: {
            tenantId: string;
            type: import("../prisma/generated-client").$Enums.WalletTransactionType;
            id: string;
            createdAt: Date;
            referenceType: string | null;
            referenceId: string | null;
            amount: Prisma.Decimal;
            balanceAfter: Prisma.Decimal;
            walletId: string;
        };
        balanceAfter: number;
    }>;
}
export declare const walletRepository: WalletRepository;
//# sourceMappingURL=wallet.repository.d.ts.map