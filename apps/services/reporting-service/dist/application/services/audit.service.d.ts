export declare class AuditService {
    static queryAuditLogs(filter: {
        tenantId?: string;
        branchId?: string;
        entityType?: string;
        entityId?: string;
        actorUserId?: string;
        action?: string;
        category?: string;
        search?: string;
        startDate?: string;
        endDate?: string;
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
            beforeJson: import("../../infrastructure/prisma/generated-client/runtime/library").JsonValue | null;
            afterJson: import("../../infrastructure/prisma/generated-client/runtime/library").JsonValue | null;
            metadataJson: import("../../infrastructure/prisma/generated-client/runtime/library").JsonValue | null;
            ipAddress: string | null;
            userAgent: string | null;
            occurredAt: Date;
            ingestedAt: Date;
        }[];
        total: number;
    }>;
    static createAuditLog(data: {
        action: string;
        entityType: string;
        entityId?: string;
        actorUserId?: string;
        actorName?: string;
        tenantId?: string;
        branchId?: string;
        franchiseId?: string;
        principalType?: string;
        category?: string;
        beforeJson?: unknown;
        afterJson?: unknown;
        metadataJson?: unknown;
        ipAddress?: string;
        userAgent?: string;
        occurredAt?: string | Date;
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
        beforeJson: import("../../infrastructure/prisma/generated-client/runtime/library").JsonValue | null;
        afterJson: import("../../infrastructure/prisma/generated-client/runtime/library").JsonValue | null;
        metadataJson: import("../../infrastructure/prisma/generated-client/runtime/library").JsonValue | null;
        ipAddress: string | null;
        userAgent: string | null;
        occurredAt: Date;
        ingestedAt: Date;
    }>;
    static exportAuditLogs(filter: {
        tenantId?: string;
        category?: string;
        search?: string;
        startDate?: string;
        endDate?: string;
    }): Promise<{
        exportUrl: string;
        recordsCount: number;
        totalCount: number;
        exportedAt: string;
        csvData: string;
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
            beforeJson: import("../../infrastructure/prisma/generated-client/runtime/library").JsonValue | null;
            afterJson: import("../../infrastructure/prisma/generated-client/runtime/library").JsonValue | null;
            metadataJson: import("../../infrastructure/prisma/generated-client/runtime/library").JsonValue | null;
            ipAddress: string | null;
            userAgent: string | null;
            occurredAt: Date;
            ingestedAt: Date;
        }[];
    }>;
}
//# sourceMappingURL=audit.service.d.ts.map