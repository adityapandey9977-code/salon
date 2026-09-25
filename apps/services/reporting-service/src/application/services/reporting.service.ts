import { randomUUID } from 'node:crypto';
import type { AuditLogQuery, DashboardStatsQuery } from '@salon-spa-saas/contracts';
import { MetricsRepository } from '../../infrastructure/repositories/metrics.repository';
import { AuditRepository } from '../../infrastructure/repositories/audit.repository';

export class ReportingService {
  public async getDashboardStats(tenantId?: string | null, query?: DashboardStatsQuery) {
    const targetTenant = tenantId || 'default-tenant';
    const start = query?.startDate ? new Date(query.startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = query?.endDate ? new Date(query.endDate) : new Date();

    const branchMetrics = await MetricsRepository.getBranchMetrics(targetTenant, query?.branchId, start, end);

    const totalRevenue = branchMetrics.reduce((acc: number, s) => acc + Number(s.grossSales), 0);
    const totalAppointments = branchMetrics.reduce((acc: number, s) => acc + s.appointmentsCompleted, 0);

    return {
      totalRevenue,
      totalAppointments,
      averageTicketSize: totalAppointments > 0 ? Math.round(totalRevenue / totalAppointments) : 0,
      dailyTrend: branchMetrics,
    };
  }

  public async getAuditLogs(tenantId?: string | null, query?: AuditLogQuery) {
    const result = await AuditRepository.queryAuditLogs({
      tenantId: tenantId || undefined,
      entityType: query?.entityType,
      entityId: query?.entityId,
      actorUserId: query?.actorUserId,
    });
    return result.items;
  }

  public async appendAuditLog(entry: {
    tenantId?: string | null;
    branchId?: string | null;
    actorUserId?: string | null;
    action: string;
    entityType: string;
    entityId: string;
    correlationId?: string;
    beforePayload?: unknown;
    afterPayload?: unknown;
  }) {
    return AuditRepository.createAuditEvent({
      eventId: randomUUID(),
      tenantId: entry.tenantId,
      branchId: entry.branchId,
      actorUserId: entry.actorUserId,
      action: entry.action,
      entityType: entry.entityType,
      entityId: entry.entityId,
      correlationId: entry.correlationId || randomUUID(),
      beforeJson: entry.beforePayload,
      afterJson: entry.afterPayload,
      occurredAt: new Date(),
    });
  }
}
