import { apiClient, tokenStorage } from './client';
import type { ApiResponse } from './types';
import type { FullStaffRecord } from '../../modules/admin/pages/staff/StaffProfilePage';
export type { FullStaffRecord };

export interface ListStaffParams {
  branchId?: string;
  franchiseId?: string;
  hasFranchise?: boolean | string;
  search?: string;
  status?: string;
  employmentType?: string;
  page?: number;
  limit?: number;
}

export const staffApi = {
  /**
   * List all staff members for the tenant / branch
   */
  async list(params?: ListStaffParams): Promise<FullStaffRecord[]> {
    const tid = tokenStorage.getTenantId() || undefined;
    const headers = tid ? { 'x-tenant-id': tid } : undefined;

    // Do NOT inject tenantId into query params if franchise-scoped or if franchiseId/hasFranchise is present
    const queryParams: Record<string, any> = { ...params };
    if (queryParams.hasFranchise || queryParams.franchiseId) {
      delete queryParams.tenantId;
    } else if (!queryParams.tenantId && tid) {
      queryParams.tenantId = tid;
    }

    const response = await apiClient.get<ApiResponse<FullStaffRecord[]>>('/api/v1/staff', {
      params: queryParams,
      headers,
    });
    return response.data.data;
  },

  /**
   * Get staff member by UUID or Employee Code
   */
  async getById(id: string): Promise<FullStaffRecord> {
    const tid = tokenStorage.getTenantId() || undefined;
    const headers = tid ? { 'x-tenant-id': tid } : undefined;
    const response = await apiClient.get<ApiResponse<FullStaffRecord>>(`/api/v1/staff/${id}`, { headers });
    return response.data.data;
  },

  /**
   * Get current authenticated staff profile
   */
  async getMe(): Promise<FullStaffRecord | null> {
    try {
      const response = await apiClient.get<ApiResponse<FullStaffRecord | null>>('/api/v1/staff/me');
      return response.data.data;
    } catch {
      return null;
    }
  },

  /**
   * Create a new staff member
   */
  async create(payload: Partial<FullStaffRecord> | any): Promise<FullStaffRecord> {
    const tid = payload?.tenantId || tokenStorage.getTenantId() || undefined;
    const headers = tid ? { 'x-tenant-id': tid } : undefined;
    const response = await apiClient.post<ApiResponse<FullStaffRecord>>('/api/v1/staff', payload, { headers });
    return response.data.data;
  },

  /**
   * Update an existing staff member
   */
  async update(id: string, payload: Partial<FullStaffRecord> | any): Promise<FullStaffRecord> {
    const tid = payload?.tenantId || tokenStorage.getTenantId() || undefined;
    const headers = tid ? { 'x-tenant-id': tid } : undefined;
    const response = await apiClient.patch<ApiResponse<FullStaffRecord>>(
      `/api/v1/staff/${id}`,
      payload,
      { headers },
    );
    return response.data.data;
  },

  /**
   * Soft delete staff member
   */
  async delete(id: string, reason?: string): Promise<void> {
    await apiClient.delete<ApiResponse<any>>(`/api/v1/staff/${id}`, {
      data: { reason },
    });
  },

  /**
   * Get staff assigned to a specific branch
   */
  async getBranchTeam(branchId: string): Promise<FullStaffRecord[]> {
    const response = await apiClient.get<ApiResponse<FullStaffRecord[]>>('/api/v1/staff/branch-team', {
      params: { branchId },
    });
    return response.data.data;
  },

  /**
   * Get shifts configured for branch
   */
  async getShifts(branchId?: string): Promise<any[]> {
    const response = await apiClient.get<ApiResponse<any[]>>('/api/v1/staff/shifts', {
      params: branchId ? { branchId } : undefined,
    });
    return response.data.data;
  },

  /**
   * Get weekly / monthly roster assignments
   */
  async getRoster(params?: { branchId?: string; startDate?: string; endDate?: string }): Promise<any[]> {
    const response = await apiClient.get<ApiResponse<any[]>>('/api/v1/staff/roster', {
      params,
    });
    return response.data.data;
  },

  /**
   * Get attendance logs
   */
  async getAttendance(params?: { branchId?: string; date?: string }): Promise<any[]> {
    const response = await apiClient.get<ApiResponse<any[]>>('/api/v1/staff/attendance', {
      params,
    });
    return response.data.data;
  },

  /**
   * Record attendance punch (check-in / check-out)
   */
  async punchAttendance(payload: { employeeId: string; type: 'CHECK_IN' | 'CHECK_OUT'; timestamp?: string }): Promise<any> {
    const response = await apiClient.post<ApiResponse<any>>('/api/v1/staff/attendance/punch', payload);
    return response.data.data;
  },

  /**
   * Get leave requests
   */
  async getLeaves(params?: { status?: string; employeeId?: string }): Promise<any[]> {
    const response = await apiClient.get<ApiResponse<any[]>>('/api/v1/staff/leave/requests', {
      params,
    });
    return response.data.data;
  },
};
