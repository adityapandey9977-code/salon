export interface AuditLogEntity {
  id: string;
  tenantId: string | null;
  branchId: string | null;
  actorUserId: string | null;
  action: string;
  entityType: string;
  entityId: string;
  correlationId: string;
  beforePayload: Record<string, unknown> | null;
  afterPayload: Record<string, unknown> | null;
  createdAt: Date;
}
