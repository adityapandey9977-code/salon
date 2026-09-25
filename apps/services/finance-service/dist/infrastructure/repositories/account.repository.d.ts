import { AccountType, AccountingPeriodStatus } from '../prisma/generated-client';
export declare class AccountRepository {
    listAccounts(tenantId: string, type?: AccountType): Promise<{
        tenantId: string;
        code: string;
        type: import("../prisma/generated-client").$Enums.AccountType;
        id: string;
        name: string;
        parentAccountId: string | null;
        description: string | null;
        isSystem: boolean;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findByCode(tenantId: string, code: string): Promise<{
        tenantId: string;
        code: string;
        type: import("../prisma/generated-client").$Enums.AccountType;
        id: string;
        name: string;
        parentAccountId: string | null;
        description: string | null;
        isSystem: boolean;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    findById(tenantId: string, id: string): Promise<{
        tenantId: string;
        code: string;
        type: import("../prisma/generated-client").$Enums.AccountType;
        id: string;
        name: string;
        parentAccountId: string | null;
        description: string | null;
        isSystem: boolean;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    createAccount(tenantId: string, data: {
        code: string;
        name: string;
        type: AccountType;
        parentAccountId?: string;
        description?: string;
        isSystem?: boolean;
    }): Promise<{
        tenantId: string;
        code: string;
        type: import("../prisma/generated-client").$Enums.AccountType;
        id: string;
        name: string;
        parentAccountId: string | null;
        description: string | null;
        isSystem: boolean;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    listPeriods(tenantId: string): Promise<{
        tenantId: string;
        status: import("../prisma/generated-client").$Enums.AccountingPeriodStatus;
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        startDate: Date;
        endDate: Date;
    }[]>;
    findActivePeriod(tenantId: string, date?: Date): Promise<{
        tenantId: string;
        status: import("../prisma/generated-client").$Enums.AccountingPeriodStatus;
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        startDate: Date;
        endDate: Date;
    } | null>;
    createPeriod(tenantId: string, data: {
        name: string;
        startDate: Date;
        endDate: Date;
        status?: AccountingPeriodStatus;
    }): Promise<{
        tenantId: string;
        status: import("../prisma/generated-client").$Enums.AccountingPeriodStatus;
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        startDate: Date;
        endDate: Date;
    }>;
    updatePeriodStatus(tenantId: string, id: string, status: AccountingPeriodStatus): Promise<{
        tenantId: string;
        status: import("../prisma/generated-client").$Enums.AccountingPeriodStatus;
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        startDate: Date;
        endDate: Date;
    }>;
}
//# sourceMappingURL=account.repository.d.ts.map