import { JournalRepository } from '../../infrastructure/repositories/journal.repository';
import { AccountRepository } from '../../infrastructure/repositories/account.repository';
import { FinanceReadStore } from '../../infrastructure/redis/finance-read.store';
export declare class JournalService {
    private journalRepo;
    private accountRepo;
    private cache;
    constructor(journalRepo?: JournalRepository, accountRepo?: AccountRepository, cache?: FinanceReadStore);
    listJournals(tenantId: string, filter?: any): Promise<{
        items: ({
            lines: ({
                account: {
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
                };
            } & {
                tenantId: string;
                id: string;
                description: string | null;
                journalEntryId: string;
                accountId: string;
                debit: import("../../infrastructure/prisma/generated-client/runtime/library").Decimal;
                credit: import("../../infrastructure/prisma/generated-client/runtime/library").Decimal;
            })[];
        } & {
            correlationId: string | null;
            tenantId: string;
            status: import("../../infrastructure/prisma/generated-client").$Enums.JournalStatus;
            id: string;
            description: string | null;
            createdAt: Date;
            branchId: string | null;
            journalNumber: string;
            entryDate: Date;
            sourceType: string;
            sourceId: string | null;
            postedAt: Date | null;
        })[];
        total: number;
    }>;
    getJournalById(tenantId: string, id: string): Promise<{
        lines: ({
            account: {
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
            };
        } & {
            tenantId: string;
            id: string;
            description: string | null;
            journalEntryId: string;
            accountId: string;
            debit: import("../../infrastructure/prisma/generated-client/runtime/library").Decimal;
            credit: import("../../infrastructure/prisma/generated-client/runtime/library").Decimal;
        })[];
    } & {
        correlationId: string | null;
        tenantId: string;
        status: import("../../infrastructure/prisma/generated-client").$Enums.JournalStatus;
        id: string;
        description: string | null;
        createdAt: Date;
        branchId: string | null;
        journalNumber: string;
        entryDate: Date;
        sourceType: string;
        sourceId: string | null;
        postedAt: Date | null;
    }>;
    postJournal(tenantId: string, data: {
        branchId?: string;
        entryDate?: Date;
        sourceType: string;
        sourceId?: string;
        description?: string;
        correlationId?: string;
        lines: Array<{
            accountId: string;
            debit?: number;
            credit?: number;
            description?: string;
        }>;
    }): Promise<{
        lines: ({
            account: {
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
            };
        } & {
            tenantId: string;
            id: string;
            description: string | null;
            journalEntryId: string;
            accountId: string;
            debit: import("../../infrastructure/prisma/generated-client/runtime/library").Decimal;
            credit: import("../../infrastructure/prisma/generated-client/runtime/library").Decimal;
        })[];
    } & {
        correlationId: string | null;
        tenantId: string;
        status: import("../../infrastructure/prisma/generated-client").$Enums.JournalStatus;
        id: string;
        description: string | null;
        createdAt: Date;
        branchId: string | null;
        journalNumber: string;
        entryDate: Date;
        sourceType: string;
        sourceId: string | null;
        postedAt: Date | null;
    }>;
    reverseJournal(tenantId: string, originalJournalId: string, reason?: string): Promise<{
        lines: ({
            account: {
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
            };
        } & {
            tenantId: string;
            id: string;
            description: string | null;
            journalEntryId: string;
            accountId: string;
            debit: import("../../infrastructure/prisma/generated-client/runtime/library").Decimal;
            credit: import("../../infrastructure/prisma/generated-client/runtime/library").Decimal;
        })[];
    } & {
        correlationId: string | null;
        tenantId: string;
        status: import("../../infrastructure/prisma/generated-client").$Enums.JournalStatus;
        id: string;
        description: string | null;
        createdAt: Date;
        branchId: string | null;
        journalNumber: string;
        entryDate: Date;
        sourceType: string;
        sourceId: string | null;
        postedAt: Date | null;
    }>;
}
//# sourceMappingURL=journal.service.d.ts.map