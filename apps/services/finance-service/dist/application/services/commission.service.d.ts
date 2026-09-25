import { CommissionRepository } from '../../infrastructure/repositories/commission.repository';
import { FinanceReadStore } from '../../infrastructure/redis/finance-read.store';
import { CommissionStatus } from '../../infrastructure/prisma/generated-client';
export declare class CommissionService {
    private commRepo;
    private cache;
    constructor(commRepo?: CommissionRepository, cache?: FinanceReadStore);
    listRules(tenantId: string): Promise<any>;
    upsertRule(data: any): Promise<{
        tenantId: string;
        id: string;
        name: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        ruleType: string;
        appliesToBranchId: string | null;
        appliesToEmployeeId: string | null;
        appliesToServiceId: string | null;
        appliesToCategoryId: string | null;
        calculationType: import("../../infrastructure/prisma/generated-client").$Enums.CalculationType;
        percentage: import("../../infrastructure/prisma/generated-client/runtime/library").Decimal | null;
        fixedAmount: import("../../infrastructure/prisma/generated-client/runtime/library").Decimal | null;
        thresholdJson: import("../../infrastructure/prisma/generated-client/runtime/library").JsonValue | null;
        effectiveFrom: Date;
        effectiveTo: Date | null;
        priority: number;
        version: number;
    }>;
    calculateAndRecordCommission(tenantId: string, data: {
        branchId: string;
        employeeId: string;
        saleId: string;
        invoiceId: string;
        invoiceItemId?: string;
        itemType: 'SERVICE' | 'PRODUCT';
        serviceId?: string;
        categoryId?: string;
        amount: number;
    }): Promise<{
        rule: {
            tenantId: string;
            id: string;
            name: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            ruleType: string;
            appliesToBranchId: string | null;
            appliesToEmployeeId: string | null;
            appliesToServiceId: string | null;
            appliesToCategoryId: string | null;
            calculationType: import("../../infrastructure/prisma/generated-client").$Enums.CalculationType;
            percentage: import("../../infrastructure/prisma/generated-client/runtime/library").Decimal | null;
            fixedAmount: import("../../infrastructure/prisma/generated-client/runtime/library").Decimal | null;
            thresholdJson: import("../../infrastructure/prisma/generated-client/runtime/library").JsonValue | null;
            effectiveFrom: Date;
            effectiveTo: Date | null;
            priority: number;
            version: number;
        } | null;
    } & {
        tenantId: string;
        status: import("../../infrastructure/prisma/generated-client").$Enums.CommissionStatus;
        id: string;
        createdAt: Date;
        branchId: string;
        employeeId: string;
        saleId: string;
        invoiceId: string;
        invoiceItemId: string | null;
        ruleId: string | null;
        ruleVersion: number;
        eligibleAmount: import("../../infrastructure/prisma/generated-client/runtime/library").Decimal;
        commissionAmount: import("../../infrastructure/prisma/generated-client/runtime/library").Decimal;
        earnedAt: Date;
    }>;
    listStaffCommissions(tenantId: string, filter?: {
        employeeId?: string;
        branchId?: string;
        status?: CommissionStatus;
    }): Promise<({
        rule: {
            tenantId: string;
            id: string;
            name: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            ruleType: string;
            appliesToBranchId: string | null;
            appliesToEmployeeId: string | null;
            appliesToServiceId: string | null;
            appliesToCategoryId: string | null;
            calculationType: import("../../infrastructure/prisma/generated-client").$Enums.CalculationType;
            percentage: import("../../infrastructure/prisma/generated-client/runtime/library").Decimal | null;
            fixedAmount: import("../../infrastructure/prisma/generated-client/runtime/library").Decimal | null;
            thresholdJson: import("../../infrastructure/prisma/generated-client/runtime/library").JsonValue | null;
            effectiveFrom: Date;
            effectiveTo: Date | null;
            priority: number;
            version: number;
        } | null;
    } & {
        tenantId: string;
        status: import("../../infrastructure/prisma/generated-client").$Enums.CommissionStatus;
        id: string;
        createdAt: Date;
        branchId: string;
        employeeId: string;
        saleId: string;
        invoiceId: string;
        invoiceItemId: string | null;
        ruleId: string | null;
        ruleVersion: number;
        eligibleAmount: import("../../infrastructure/prisma/generated-client/runtime/library").Decimal;
        commissionAmount: import("../../infrastructure/prisma/generated-client/runtime/library").Decimal;
        earnedAt: Date;
    })[]>;
    recordTips(tenantId: string, data: {
        branchId: string;
        invoiceId: string;
        totalTip: number;
        allocations: Array<{
            employeeId: string;
            amount: number;
        }>;
    }): Promise<{
        allocations: {
            tenantId: string;
            id: string;
            createdAt: Date;
            employeeId: string;
            tipTransactionId: string;
            amount: import("../../infrastructure/prisma/generated-client/runtime/library").Decimal;
        }[];
    } & {
        tenantId: string;
        id: string;
        createdAt: Date;
        branchId: string;
        invoiceId: string;
        totalTip: import("../../infrastructure/prisma/generated-client/runtime/library").Decimal;
    }>;
}
//# sourceMappingURL=commission.service.d.ts.map