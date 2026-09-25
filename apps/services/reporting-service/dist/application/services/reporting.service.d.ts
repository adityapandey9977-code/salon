import type { AuditLogQuery, DashboardStatsQuery } from '@salon-spa-saas/contracts';
export declare class ReportingService {
    getDashboardStats(tenantId?: string | null, query?: DashboardStatsQuery): Promise<{
        totalRevenue: number;
        totalAppointments: number;
        averageTicketSize: number;
        dailyTrend: {
            tenantId: string;
            branchId: string;
            id: string;
            metricDate: Date;
            appointmentsBooked: number;
            appointmentsCompleted: number;
            appointmentsCancelled: number;
            noShows: number;
            grossSales: import("../../infrastructure/prisma/generated-client/runtime/library").Decimal;
            netSales: import("../../infrastructure/prisma/generated-client/runtime/library").Decimal;
            taxCollected: import("../../infrastructure/prisma/generated-client/runtime/library").Decimal;
            serviceRevenue: import("../../infrastructure/prisma/generated-client/runtime/library").Decimal;
            retailRevenue: import("../../infrastructure/prisma/generated-client/runtime/library").Decimal;
            customerCount: number;
            newCustomers: number;
            averageTicketValue: import("../../infrastructure/prisma/generated-client/runtime/library").Decimal;
            updatedAt: Date;
        }[];
    }>;
    getAuditLogs(tenantId?: string | null, query?: AuditLogQuery): Promise<{
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
    }[]>;
    appendAuditLog(entry: {
        tenantId?: string | null;
        branchId?: string | null;
        actorUserId?: string | null;
        action: string;
        entityType: string;
        entityId: string;
        correlationId?: string;
        beforePayload?: unknown;
        afterPayload?: unknown;
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
}
//# sourceMappingURL=reporting.service.d.ts.map