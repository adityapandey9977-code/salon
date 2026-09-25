import { JournalStatus, Prisma } from '../prisma/generated-client';
export declare class JournalRepository {
    listJournals(tenantId: string, filter?: {
        branchId?: string;
        sourceType?: string;
        sourceId?: string;
        status?: JournalStatus;
        from?: Date;
        to?: Date;
        skip?: number;
        take?: number;
    }): Promise<{
        items: ({
            lines: ({
                account: {
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
                };
            } & {
                tenantId: string;
                id: string;
                description: string | null;
                journalEntryId: string;
                accountId: string;
                debit: Prisma.Decimal;
                credit: Prisma.Decimal;
            })[];
        } & {
            correlationId: string | null;
            tenantId: string;
            status: import("../prisma/generated-client").$Enums.JournalStatus;
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
    findById(tenantId: string, id: string): Promise<({
        lines: ({
            account: {
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
            };
        } & {
            tenantId: string;
            id: string;
            description: string | null;
            journalEntryId: string;
            accountId: string;
            debit: Prisma.Decimal;
            credit: Prisma.Decimal;
        })[];
    } & {
        correlationId: string | null;
        tenantId: string;
        status: import("../prisma/generated-client").$Enums.JournalStatus;
        id: string;
        description: string | null;
        createdAt: Date;
        branchId: string | null;
        journalNumber: string;
        entryDate: Date;
        sourceType: string;
        sourceId: string | null;
        postedAt: Date | null;
    }) | null>;
    createAndPostJournal(tenantId: string, data: {
        branchId?: string;
        journalNumber: string;
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
                type: import("../prisma/generated-client").$Enums.AccountType;
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
            debit: Prisma.Decimal;
            credit: Prisma.Decimal;
        })[];
    } & {
        correlationId: string | null;
        tenantId: string;
        status: import("../prisma/generated-client").$Enums.JournalStatus;
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
    createReversalJournal(tenantId: string, originalJournalId: string, reversalNumber: string, reason?: string): Promise<{
        lines: ({
            account: {
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
            };
        } & {
            tenantId: string;
            id: string;
            description: string | null;
            journalEntryId: string;
            accountId: string;
            debit: Prisma.Decimal;
            credit: Prisma.Decimal;
        })[];
    } & {
        correlationId: string | null;
        tenantId: string;
        status: import("../prisma/generated-client").$Enums.JournalStatus;
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
//# sourceMappingURL=journal.repository.d.ts.map