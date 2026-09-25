import { prisma } from '../prisma/client';
import { Prisma } from '../prisma/generated-client';

const SENSITIVE_KEYS = new Set([
  'password',
  'passwordhash',
  'password_hash',
  'token',
  'accesstoken',
  'access_token',
  'refreshtoken',
  'refresh_token',
  'secret',
  'mfasecret',
  'mfa_secret',
  'cvv',
  'cardnumber',
  'card_number',
  'pan',
  'accountnumber',
  'account_number',
]);

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function safeUuid(val?: string | null): string | null {
  if (!val) return null;
  return UUID_REGEX.test(val.trim()) ? val.trim() : null;
}

export function sanitizePayload(data: unknown): unknown {
  if (!data || typeof data !== 'object') return data;
  if (Array.isArray(data)) {
    return data.map((item) => sanitizePayload(item));
  }

  const sanitized: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
    const lower = key.toLowerCase();
    if (SENSITIVE_KEYS.has(lower)) {
      sanitized[key] = '[REDACTED]';
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizePayload(value);
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
}

export class AuditRepository {
  public static async createAuditEvent(data: {
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
  }) {
    const safeTenantId = safeUuid(data.tenantId);
    const safeBranchId = safeUuid(data.branchId);
    const safeFranchiseId = safeUuid(data.franchiseId);
    const safeActorUserId = safeUuid(data.actorUserId);

    let finalMeta: Record<string, unknown> = {};
    if (data.metadataJson && typeof data.metadataJson === 'object') {
      finalMeta = { ...(data.metadataJson as Record<string, unknown>) };
    }
    if (!safeTenantId && data.tenantId) finalMeta.rawTenantId = data.tenantId;
    if (!safeBranchId && data.branchId) finalMeta.rawBranchId = data.branchId;
    if (!safeActorUserId && data.actorUserId) finalMeta.rawActorUserId = data.actorUserId;

    // Audit log is append-only
    return prisma.auditEvent.upsert({
      where: { eventId: data.eventId },
      create: {
        eventId: data.eventId,
        tenantId: safeTenantId,
        branchId: safeBranchId,
        franchiseId: safeFranchiseId,
        principalType: data.principalType || null,
        actorUserId: safeActorUserId,
        action: data.action,
        entityType: data.entityType,
        entityId: data.entityId,
        correlationId: data.correlationId,
        beforeJson: data.beforeJson ? (sanitizePayload(data.beforeJson) as Prisma.InputJsonValue) : Prisma.JsonNull,
        afterJson: data.afterJson ? (sanitizePayload(data.afterJson) as Prisma.InputJsonValue) : Prisma.JsonNull,
        metadataJson: Object.keys(finalMeta).length > 0 ? (sanitizePayload(finalMeta) as Prisma.InputJsonValue) : Prisma.JsonNull,
        ipAddress: data.ipAddress || null,
        userAgent: data.userAgent || null,
        occurredAt: data.occurredAt,
      },
      update: {}, // No updates permitted on audit records
    });
  }

  public static async queryAuditLogs(filter: {
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
  }) {
    const where: Prisma.AuditEventWhereInput = {};
    const safeTenantId = safeUuid(filter.tenantId);
    if (safeTenantId) where.tenantId = safeTenantId;

    const safeBranchId = safeUuid(filter.branchId);
    if (safeBranchId) where.branchId = safeBranchId;

    if (filter.entityType) where.entityType = filter.entityType;
    if (filter.entityId) where.entityId = filter.entityId;

    const safeActorUserId = safeUuid(filter.actorUserId);
    if (safeActorUserId) where.actorUserId = safeActorUserId;

    if (filter.action) {
      where.action = { contains: filter.action, mode: 'insensitive' };
    }

    if (filter.startDate || filter.endDate) {
      where.occurredAt = {};
      if (filter.startDate) where.occurredAt.gte = filter.startDate;
      if (filter.endDate) where.occurredAt.lte = filter.endDate;
    }

    if (filter.search && filter.search.trim()) {
      const s = filter.search.trim();
      where.OR = [
        { action: { contains: s, mode: 'insensitive' } },
        { entityType: { contains: s, mode: 'insensitive' } },
        { entityId: { contains: s, mode: 'insensitive' } },
        { correlationId: { contains: s, mode: 'insensitive' } },
        { principalType: { contains: s, mode: 'insensitive' } },
      ];
    }

    if (filter.category && filter.category !== 'All') {
      const cat = filter.category.toLowerCase();
      const categoryConditions: Prisma.AuditEventWhereInput[] = [];
      if (cat === 'tenant') {
        categoryConditions.push(
          { entityType: { contains: 'Tenant', mode: 'insensitive' } },
          { action: { contains: 'TENANT', mode: 'insensitive' } },
        );
      } else if (cat === 'billing') {
        categoryConditions.push(
          { entityType: { in: ['Subscription', 'Plan', 'Invoice', 'Payment', 'Billing'] } },
          { action: { contains: 'PLAN', mode: 'insensitive' } },
          { action: { contains: 'SUBSCRIPTION', mode: 'insensitive' } },
          { action: { contains: 'INVOICE', mode: 'insensitive' } },
          { action: { contains: 'BILLING', mode: 'insensitive' } },
          { action: { contains: 'PAYMENT', mode: 'insensitive' } },
        );
      } else if (cat === 'security') {
        categoryConditions.push(
          { entityType: { in: ['ApiKey', 'Auth', 'Security', 'Session'] } },
          { action: { contains: 'API_KEY', mode: 'insensitive' } },
          { action: { contains: 'AUTH', mode: 'insensitive' } },
          { action: { contains: 'LOGIN', mode: 'insensitive' } },
          { action: { contains: 'MFA', mode: 'insensitive' } },
          { action: { contains: 'KEY', mode: 'insensitive' } },
        );
      } else if (cat === 'user') {
        categoryConditions.push(
          { entityType: { in: ['User', 'Role', 'Permission', 'Staff', 'Employee'] } },
          { action: { contains: 'USER', mode: 'insensitive' } },
          { action: { contains: 'ROLE', mode: 'insensitive' } },
          { action: { contains: 'PERMISSION', mode: 'insensitive' } },
        );
      }

      if (categoryConditions.length > 0) {
        if (where.OR) {
          where.AND = [{ OR: where.OR }, { OR: categoryConditions }];
          delete where.OR;
        } else {
          where.OR = categoryConditions;
        }
      }
    }

    const [items, total] = await Promise.all([
      prisma.auditEvent.findMany({
        where,
        orderBy: { occurredAt: 'desc' },
        take: filter.limit || 50,
        skip: filter.offset || 0,
      }),
      prisma.auditEvent.count({ where }),
    ]);

    return { items, total };
  }
}
