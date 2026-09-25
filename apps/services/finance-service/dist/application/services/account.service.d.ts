import { AccountRepository } from '../../infrastructure/repositories/account.repository';
import { AccountType } from '../../infrastructure/prisma/generated-client';
export declare class AccountService {
    private accountRepo;
    constructor(accountRepo?: AccountRepository);
    listAccounts(tenantId: string, type?: AccountType): Promise<{
        tenantId: string;
        code: string;
        type: import("../../infrastructure/prisma/generated-client").$Enums.AccountType;
        id: string;
        name: string;
        parentAccountId: string | null;
        description: string | null;
        isSystem: boolean;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    getAccountById(tenantId: string, id: string): Promise<{
        tenantId: string;
        code: string;
        type: import("../../infrastructure/prisma/generated-client").$Enums.AccountType;
        id: string;
        name: string;
        parentAccountId: string | null;
        description: string | null;
        isSystem: boolean;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    createAccount(tenantId: string, data: {
        code: string;
        name: string;
        type: AccountType;
        parentAccountId?: string;
        description?: string;
    }): Promise<{
        tenantId: string;
        code: string;
        type: import("../../infrastructure/prisma/generated-client").$Enums.AccountType;
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
        status: import("../../infrastructure/prisma/generated-client").$Enums.AccountingPeriodStatus;
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        startDate: Date;
        endDate: Date;
    }[]>;
    createPeriod(tenantId: string, data: {
        name: string;
        startDate: Date;
        endDate: Date;
    }): Promise<{
        tenantId: string;
        status: import("../../infrastructure/prisma/generated-client").$Enums.AccountingPeriodStatus;
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        startDate: Date;
        endDate: Date;
    }>;
    lockPeriod(tenantId: string, id: string): Promise<{
        tenantId: string;
        status: import("../../infrastructure/prisma/generated-client").$Enums.AccountingPeriodStatus;
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        startDate: Date;
        endDate: Date;
    }>;
}
//# sourceMappingURL=account.service.d.ts.map