import { CommissionStatus, CalculationType, Prisma } from '../prisma/generated-client';
export declare class CommissionRepository {
    listRules(tenantId: string): Promise<{
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
        calculationType: import("../prisma/generated-client").$Enums.CalculationType;
        percentage: Prisma.Decimal | null;
        fixedAmount: Prisma.Decimal | null;
        thresholdJson: Prisma.JsonValue | null;
        effectiveFrom: Date;
        effectiveTo: Date | null;
        priority: number;
        version: number;
    }[]>;
    findMatchingRule(tenantId: string, params: {
        branchId?: string;
        employeeId?: string;
        serviceId?: string;
        categoryId?: string;
    }): Promise<{
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
        calculationType: import("../prisma/generated-client").$Enums.CalculationType;
        percentage: Prisma.Decimal | null;
        fixedAmount: Prisma.Decimal | null;
        thresholdJson: Prisma.JsonValue | null;
        effectiveFrom: Date;
        effectiveTo: Date | null;
        priority: number;
        version: number;
    } | null>;
    upsertRule(data: {
        id?: string;
        tenantId: string;
        name: string;
        ruleType?: string;
        appliesToBranchId?: string;
        appliesToEmployeeId?: string;
        appliesToServiceId?: string;
        appliesToCategoryId?: string;
        calculationType?: CalculationType;
        percentage?: number;
        fixedAmount?: number;
        thresholdJson?: any;
        priority?: number;
    }): Promise<{
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
        calculationType: import("../prisma/generated-client").$Enums.CalculationType;
        percentage: Prisma.Decimal | null;
        fixedAmount: Prisma.Decimal | null;
        thresholdJson: Prisma.JsonValue | null;
        effectiveFrom: Date;
        effectiveTo: Date | null;
        priority: number;
        version: number;
    }>;
    recordTransaction(data: {
        tenantId: string;
        branchId: string;
        employeeId: string;
        saleId: string;
        invoiceId: string;
        invoiceItemId?: string;
        ruleId?: string;
        ruleVersion?: number;
        eligibleAmount: number;
        commissionAmount: number;
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
            calculationType: import("../prisma/generated-client").$Enums.CalculationType;
            percentage: Prisma.Decimal | null;
            fixedAmount: Prisma.Decimal | null;
            thresholdJson: Prisma.JsonValue | null;
            effectiveFrom: Date;
            effectiveTo: Date | null;
            priority: number;
            version: number;
        } | null;
    } & {
        tenantId: string;
        status: import("../prisma/generated-client").$Enums.CommissionStatus;
        id: string;
        createdAt: Date;
        branchId: string;
        employeeId: string;
        saleId: string;
        invoiceId: string;
        invoiceItemId: string | null;
        ruleId: string | null;
        ruleVersion: number;
        eligibleAmount: Prisma.Decimal;
        commissionAmount: Prisma.Decimal;
        earnedAt: Date;
    }>;
    listTransactions(tenantId: string, filter?: {
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
            calculationType: import("../prisma/generated-client").$Enums.CalculationType;
            percentage: Prisma.Decimal | null;
            fixedAmount: Prisma.Decimal | null;
            thresholdJson: Prisma.JsonValue | null;
            effectiveFrom: Date;
            effectiveTo: Date | null;
            priority: number;
            version: number;
        } | null;
    } & {
        tenantId: string;
        status: import("../prisma/generated-client").$Enums.CommissionStatus;
        id: string;
        createdAt: Date;
        branchId: string;
        employeeId: string;
        saleId: string;
        invoiceId: string;
        invoiceItemId: string | null;
        ruleId: string | null;
        ruleVersion: number;
        eligibleAmount: Prisma.Decimal;
        commissionAmount: Prisma.Decimal;
        earnedAt: Date;
    })[]>;
    recordTip(tenantId: string, data: {
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
            amount: Prisma.Decimal;
        }[];
    } & {
        tenantId: string;
        id: string;
        createdAt: Date;
        branchId: string;
        invoiceId: string;
        totalTip: Prisma.Decimal;
    }>;
}
//# sourceMappingURL=commission.repository.d.ts.map