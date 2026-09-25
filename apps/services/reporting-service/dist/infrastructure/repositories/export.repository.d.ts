import { Prisma } from '../prisma/generated-client';
export declare class ExportRepository {
    static createExportJob(data: {
        tenantId: string;
        requestedByUserId?: string;
        reportType: string;
        parameters?: Record<string, unknown>;
    }): Promise<{
        tenantId: string;
        status: import("../prisma/generated-client").$Enums.JobStatus;
        id: string;
        requestedByUserId: string | null;
        reportType: string;
        fileUrl: string | null;
        parameters: Prisma.JsonValue | null;
        errorReason: string | null;
        expiresAt: Date | null;
        createdAt: Date;
        completedAt: Date | null;
    }>;
    static getExportJob(id: string, tenantId?: string): Promise<{
        tenantId: string;
        status: import("../prisma/generated-client").$Enums.JobStatus;
        id: string;
        requestedByUserId: string | null;
        reportType: string;
        fileUrl: string | null;
        parameters: Prisma.JsonValue | null;
        errorReason: string | null;
        expiresAt: Date | null;
        createdAt: Date;
        completedAt: Date | null;
    } | null>;
    static listExportJobs(tenantId: string, limit?: number): Promise<{
        tenantId: string;
        status: import("../prisma/generated-client").$Enums.JobStatus;
        id: string;
        requestedByUserId: string | null;
        reportType: string;
        fileUrl: string | null;
        parameters: Prisma.JsonValue | null;
        errorReason: string | null;
        expiresAt: Date | null;
        createdAt: Date;
        completedAt: Date | null;
    }[]>;
}
//# sourceMappingURL=export.repository.d.ts.map