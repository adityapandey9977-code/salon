import { AuditRepository } from '../../infrastructure/repositories/audit.repository';

export class AuditService {
  public static async queryAuditLogs(filter: {
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
  }) {
    return AuditRepository.queryAuditLogs({
      tenantId: filter.tenantId,
      branchId: filter.branchId,
      entityType: filter.entityType,
      entityId: filter.entityId,
      actorUserId: filter.actorUserId,
      action: filter.action,
      category: filter.category,
      search: filter.search,
      startDate: filter.startDate ? new Date(filter.startDate) : undefined,
      endDate: filter.endDate ? new Date(filter.endDate) : undefined,
      limit: filter.limit,
      offset: filter.offset,
    });
  }

  public static async createAuditLog(data: {
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
  }) {
    const eventId = `evt-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const correlationId = `cor-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

    const metadata: Record<string, unknown> = {
      ...(typeof data.metadataJson === 'object' && data.metadataJson !== null
        ? (data.metadataJson as Record<string, unknown>)
        : {}),
    };
    if (data.actorName) metadata.actorName = data.actorName;
    if (data.category) metadata.category = data.category;

    return AuditRepository.createAuditEvent({
      eventId,
      action: data.action,
      entityType: data.entityType || 'Platform',
      entityId: data.entityId || `ent-${Date.now()}`,
      tenantId: data.tenantId,
      branchId: data.branchId,
      franchiseId: data.franchiseId,
      principalType: data.principalType || 'SUPER_ADMIN',
      actorUserId: data.actorUserId,
      correlationId,
      beforeJson: data.beforeJson,
      afterJson: data.afterJson,
      metadataJson: metadata,
      ipAddress: data.ipAddress,
      userAgent: data.userAgent,
      occurredAt: data.occurredAt ? new Date(data.occurredAt) : new Date(),
    });
  }

  public static async exportAuditLogs(filter: {
    tenantId?: string;
    category?: string;
    search?: string;
    startDate?: string;
    endDate?: string;
  }) {
    const { items, total } = await this.queryAuditLogs({
      ...filter,
      limit: 5000,
    });

    const csvRows = [
      ['Trace ID', 'Timestamp', 'Event Action', 'Entity Type', 'Target Resource / Entity ID', 'Actor / Operator', 'IP Address'],
      ...items.map((it) => {
        const meta = (it.metadataJson && typeof it.metadataJson === 'object' ? it.metadataJson : {}) as Record<string, any>;
        const actor = meta.actorName || it.actorUserId || it.principalType || 'system_root';
        const target = meta.targetName || it.entityId || 'Platform';
        return [
          it.id,
          it.occurredAt.toISOString(),
          it.action,
          it.entityType,
          `"${target}"`,
          `"${actor}"`,
          it.ipAddress || '127.0.0.1',
        ];
      }),
    ];

    const csvContent = csvRows.map((r) => r.join(',')).join('\n');

    return {
      exportUrl: `https://storage.digiflexsalon.internal/audit_exports/audit_export_${Date.now()}.csv`,
      recordsCount: items.length,
      totalCount: total,
      exportedAt: new Date().toISOString(),
      csvData: csvContent,
      items,
    };
  }
}

