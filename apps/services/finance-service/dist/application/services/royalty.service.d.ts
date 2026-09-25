import { RoyaltyRepository } from '../../infrastructure/repositories/royalty.repository';
import { FinanceReadStore } from '../../infrastructure/redis/finance-read.store';
export declare class RoyaltyService {
    private royaltyRepo;
    private cache;
    constructor(royaltyRepo?: RoyaltyRepository, cache?: FinanceReadStore);
    listRules(tenantId: string, franchiseId?: string): Promise<({
        overrides: {
            tenantId: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            branchId: string;
            calculationType: import("../../infrastructure/prisma/generated-client").$Enums.CalculationType;
            percentage: import("../../infrastructure/prisma/generated-client/runtime/library").Decimal | null;
            fixedAmount: import("../../infrastructure/prisma/generated-client/runtime/library").Decimal | null;
            effectiveFrom: Date;
            effectiveTo: Date | null;
            priority: number;
            royaltyRuleId: string | null;
        }[];
    } & {
        tenantId: string;
        franchiseId: string | null;
        id: string;
        name: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        calculationType: import("../../infrastructure/prisma/generated-client").$Enums.CalculationType;
        percentage: import("../../infrastructure/prisma/generated-client/runtime/library").Decimal | null;
        fixedAmount: import("../../infrastructure/prisma/generated-client/runtime/library").Decimal | null;
        effectiveFrom: Date;
        effectiveTo: Date | null;
        priority: number;
        version: number;
        revenueBasis: import("../../infrastructure/prisma/generated-client").$Enums.RoyaltyRevenueBasis;
    })[]>;
    createRule(data: any): Promise<{
        tenantId: string;
        franchiseId: string | null;
        id: string;
        name: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        calculationType: import("../../infrastructure/prisma/generated-client").$Enums.CalculationType;
        percentage: import("../../infrastructure/prisma/generated-client/runtime/library").Decimal | null;
        fixedAmount: import("../../infrastructure/prisma/generated-client/runtime/library").Decimal | null;
        effectiveFrom: Date;
        effectiveTo: Date | null;
        priority: number;
        version: number;
        revenueBasis: import("../../infrastructure/prisma/generated-client").$Enums.RoyaltyRevenueBasis;
    }>;
    setBranchOverride(data: any): Promise<{
        tenantId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        branchId: string;
        calculationType: import("../../infrastructure/prisma/generated-client").$Enums.CalculationType;
        percentage: import("../../infrastructure/prisma/generated-client/runtime/library").Decimal | null;
        fixedAmount: import("../../infrastructure/prisma/generated-client/runtime/library").Decimal | null;
        effectiveFrom: Date;
        effectiveTo: Date | null;
        priority: number;
        royaltyRuleId: string | null;
    }>;
    /**
     * Resolve royalty for a completed sale in a franchise branch.
     * 3-tier resolution order:
     * 1. Branch Override
     * 2. Franchise Rule
     * 3. Tenant / Brand Default Rule
     */
    calculateAndRecordRoyalty(data: {
        tenantId: string;
        branchId: string;
        franchiseId: string;
        invoiceId: string;
        saleId: string;
        grossSales: number;
        netSales: number;
        serviceRevenue: number;
    }): Promise<{
        tenantId: string;
        franchiseId: string;
        status: string;
        id: string;
        createdAt: Date;
        branchId: string;
        saleId: string;
        invoiceId: string;
        ruleId: string | null;
        ruleVersion: number | null;
        eligibleRevenue: import("../../infrastructure/prisma/generated-client/runtime/library").Decimal;
        royaltyAmount: import("../../infrastructure/prisma/generated-client/runtime/library").Decimal;
        occurredAt: Date;
    }>;
    listSettlements(tenantId: string, franchiseId?: string): Promise<{
        tenantId: string;
        franchiseId: string;
        status: import("../../infrastructure/prisma/generated-client").$Enums.SettlementStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        periodStart: Date;
        periodEnd: Date;
        royaltyAmount: import("../../infrastructure/prisma/generated-client/runtime/library").Decimal;
        grossEligibleRevenue: import("../../infrastructure/prisma/generated-client/runtime/library").Decimal;
        adjustmentAmount: import("../../infrastructure/prisma/generated-client/runtime/library").Decimal;
        totalPayable: import("../../infrastructure/prisma/generated-client/runtime/library").Decimal;
        dueAt: Date | null;
        paidAt: Date | null;
        paymentReferenceId: string | null;
    }[]>;
    generateSettlement(tenantId: string, data: {
        franchiseId: string;
        periodStart: Date;
        periodEnd: Date;
        adjustmentAmount?: number;
        dueAt?: Date;
    }): Promise<{
        tenantId: string;
        franchiseId: string;
        status: import("../../infrastructure/prisma/generated-client").$Enums.SettlementStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        periodStart: Date;
        periodEnd: Date;
        royaltyAmount: import("../../infrastructure/prisma/generated-client/runtime/library").Decimal;
        grossEligibleRevenue: import("../../infrastructure/prisma/generated-client/runtime/library").Decimal;
        adjustmentAmount: import("../../infrastructure/prisma/generated-client/runtime/library").Decimal;
        totalPayable: import("../../infrastructure/prisma/generated-client/runtime/library").Decimal;
        dueAt: Date | null;
        paidAt: Date | null;
        paymentReferenceId: string | null;
    }>;
    markSettlementPaid(tenantId: string, id: string, paymentReferenceId?: string): Promise<{
        tenantId: string;
        franchiseId: string;
        status: import("../../infrastructure/prisma/generated-client").$Enums.SettlementStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        periodStart: Date;
        periodEnd: Date;
        royaltyAmount: import("../../infrastructure/prisma/generated-client/runtime/library").Decimal;
        grossEligibleRevenue: import("../../infrastructure/prisma/generated-client/runtime/library").Decimal;
        adjustmentAmount: import("../../infrastructure/prisma/generated-client/runtime/library").Decimal;
        totalPayable: import("../../infrastructure/prisma/generated-client/runtime/library").Decimal;
        dueAt: Date | null;
        paidAt: Date | null;
        paymentReferenceId: string | null;
    }>;
}
//# sourceMappingURL=royalty.service.d.ts.map