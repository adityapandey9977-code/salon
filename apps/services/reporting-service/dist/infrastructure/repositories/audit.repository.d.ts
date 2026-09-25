import { Prisma } from '../prisma/generated-client';
export declare function sanitizePayload(data: unknown): unknown;
export declare class AuditRepository {
    static createAuditEvent(data: {
        eventId: string;
        tenantId?: string | null;
        branchId?: string | null;
        franchiseId?: string | null;
        principalType?: string | null;
        actorUserId?: string | null;
        action: string;
        entityType: string;
        entityId: string;
        correlationId: string;
        beforeJson?: unknown;
        afterJson?: unknown;
        metadataJson?: unknown;
        ipAddress?: string | null;
        userAgent?: string | null;
        occurredAt: Date;
    }): Promise<{
        correlationId: string;
        tenantId: string | null;
        franchiseId: string | null;
        branchId: string | null;
        entityType: string;
        id: string;
        eventId: string;
        principalType: string | null;
        actorUserId: string | null;
        action: string;
        entityId: string;
        beforeJson: Prisma.JsonValue | null;
        afterJson: Prisma.JsonValue | null;
        metadataJson: Prisma.JsonValue | null;
        ipAddress: string | null;
        userAgent: string | null;
        occurredAt: Date;
        ingestedAt: Date;
    }>;
    static queryAuditLogs(filter: {
        tenantId?: string;
        branchId?: string;
        entityType?: string;
        entityId?: string;
        actorUserId?: string;
        action?: string;
        category?: string;
        search?: string;
        startDate?: Date;
        endDate?: Date;
        limit?: number;
        offset?: number;
    }): Promise<{
        items: {
            correlationId: string;
            tenantId: string | null;
            franchiseId: string | null;
            branchId: string | null;
            entityType: string;
            id: string;
            eventId: string;
            principalType: string | null;
            actorUserId: string | null;
            action: string;
            entityId: string;
            beforeJson: Prisma.JsonValue | null;
            afterJson: Prisma.JsonValue | null;
            metadataJson: Prisma.JsonValue | null;
            ipAddress: string | null;
            userAgent: string | null;
            occurredAt: Date;
            ingestedAt: Date;
        }[];
        total: number;
    }>;
}
//# sourceMappingURL=audit.repository.d.ts.map