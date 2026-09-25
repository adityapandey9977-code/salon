import { prisma } from '../prisma/client';
import { Prisma } from '../prisma/generated-client';

export class ExportRepository {
  public static async createExportJob(data: {
    tenantId: string;
    requestedByUserId?: string;
    reportType: string;
    parameters?: Record<string, unknown>;
  }) {
    return prisma.reportExportJob.create({
      data: {
        tenantId: data.tenantId,
        requestedByUserId: data.requestedByUserId || null,
        reportType: data.reportType,
        status: 'PROCESSING',
        parameters: data.parameters ? (data.parameters as Prisma.InputJsonValue) : Prisma.JsonNull,
        fileUrl: `https://storage.digiflexsalon.internal/exports/${data.reportType.toLowerCase()}_${Date.now()}.csv`,
        completedAt: new Date(),
      },
    });
  }

  public static async getExportJob(id: string, tenantId?: string) {
    const where: Prisma.ReportExportJobWhereInput = { id };
    if (tenantId) where.tenantId = tenantId;
    return prisma.reportExportJob.findFirst({ where });
  }

  public static async listExportJobs(tenantId: string, limit = 20) {
    return prisma.reportExportJob.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }
}
