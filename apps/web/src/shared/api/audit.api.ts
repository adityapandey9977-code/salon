import { apiClient } from './client';
import type { ApiResponse } from './types';

export interface BackendAuditEvent {
  id: string;
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
  beforeJson?: Record<string, any> | null;
  afterJson?: Record<string, any> | null;
  metadataJson?: Record<string, any> | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  occurredAt: string;
  ingestedAt: string;
}

export interface AuditFilter {
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
}

export interface CreateAuditPayload {
  action: string;
  entityType: string;
  entityId?: string;
  actorUserId?: string;
  actorName?: string;
  tenantId?: string;
  branchId?: string;
  franchiseId?: string;
  principalType?: string;
  category?: 'Tenant' | 'Billing' | 'Security' | 'User' | string;
  beforeJson?: Record<string, any>;
  afterJson?: Record<string, any>;
  metadataJson?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  occurredAt?: string;
}

export interface AuditExportResult {
  exportUrl: string;
  recordsCount: number;
  totalCount: number;
  exportedAt: string;
  csvData?: string;
  items?: BackendAuditEvent[];
}

export const auditApi = {
  /**
   * Query Super Admin Audit Logs
   */
  async list(filter?: AuditFilter): Promise<{ items: BackendAuditEvent[]; total: number }> {
    const params = new URLSearchParams();
    if (filter) {
      if (filter.tenantId) params.append('tenantId', filter.tenantId);
      if (filter.branchId) params.append('branchId', filter.branchId);
      if (filter.entityType) params.append('entityType', filter.entityType);
      if (filter.entityId) params.append('entityId', filter.entityId);
      if (filter.actorUserId) params.append('actorUserId', filter.actorUserId);
      if (filter.action) params.append('action', filter.action);
      if (filter.category && filter.category !== 'All') params.append('category', filter.category);
      if (filter.search) params.append('search', filter.search);
      if (filter.startDate) params.append('startDate', filter.startDate);
      if (filter.endDate) params.append('endDate', filter.endDate);
      if (filter.limit !== undefined) params.append('limit', String(filter.limit));
      if (filter.offset !== undefined) params.append('offset', String(filter.offset));
    }

    const qs = params.toString() ? `?${params.toString()}` : '';
    const response = await apiClient.get<ApiResponse<{ items: BackendAuditEvent[]; total: number }>>(
      `/api/v1/super-admin/audit${qs}`,
    );
    return response.data.data;
  },

  /**
   * Log an audit event
   */
  async create(payload: CreateAuditPayload): Promise<BackendAuditEvent> {
    const response = await apiClient.post<ApiResponse<BackendAuditEvent>>(
      '/api/v1/super-admin/audit',
      payload,
    );
    return response.data.data;
  },

  /**
   * Export audit logs
   */
  async export(filter?: AuditFilter): Promise<AuditExportResult> {
    const response = await apiClient.post<ApiResponse<AuditExportResult>>(
      '/api/v1/super-admin/audit/export',
      filter || {},
    );
    return response.data.data;
  },
};
