import { prisma } from '../prisma/client';
import { Prisma } from '../prisma/generated-client';
export class ExportRepository {
    static async createExportJob(data) {
        return prisma.reportExportJob.create({
            data: {
                tenantId: data.tenantId,
                requestedByUserId: data.requestedByUserId || null,
                reportType: data.reportType,
                status: 'PROCESSING',
                parameters: data.parameters ? data.parameters : Prisma.JsonNull,
                fileUrl: `https://storage.digiflexsalon.internal/exports/${data.reportType.toLowerCase()}_${Date.now()}.csv`,
                completedAt: new Date(),
            },
        });
    }
    static async getExportJob(id, tenantId) {
        const where = { id };
        if (tenantId)
            where.tenantId = tenantId;
        return prisma.reportExportJob.findFirst({ where });
    }
    static async listExportJobs(tenantId, limit = 20) {
        return prisma.reportExportJob.findMany({
            where: { tenantId },
            orderBy: { createdAt: 'desc' },
            take: limit,
        });
    }
}
