import { apiClient, tokenStorage } from './client';
import type {
  ApiResponse,
  CreateBranchRequest,
  CreateTenantRequest,
  TenantResponse,
} from './types';

export const tenantsApi = {
  /**
   * List all tenants (for platform Super Admin)
   */
  async list(): Promise<TenantResponse[]> {
    const response = await apiClient.get<ApiResponse<TenantResponse[]>>(
      '/api/v1/tenants',
    );
    return response.data.data;
  },

  /**
   * Get single tenant details by tenant ID
   */
  async getById(id: string): Promise<TenantResponse> {
    const response = await apiClient.get<ApiResponse<TenantResponse>>(
      `/api/v1/tenants/${id}`,
    );
    return response.data.data;
  },

  /**
   * Create a new tenant (SaaS onboarding)
   */
  async create(payload: CreateTenantRequest): Promise<TenantResponse> {
    const response = await apiClient.post<ApiResponse<TenantResponse>>(
      '/api/v1/tenants',
      payload,
    );
    return response.data.data;
  },

  /**
   * Update an existing tenant
   */
  async update(id: string, payload: Partial<CreateTenantRequest>): Promise<TenantResponse> {
    const response = await apiClient.patch<ApiResponse<TenantResponse>>(
      `/api/v1/tenants/${id}`,
      payload,
    );
    return response.data.data;
  },

  /**
   * Auto-fetch dynamic public server IP and CNAME target for DNS routing
   */
  async getDnsInfo(): Promise<{ serverIp: string; cnameTarget: string }> {
    try {
      const response = await apiClient.get<ApiResponse<{ serverIp: string; cnameTarget: string }>>(
        '/api/v1/tenants/dns-info',
      );
      if (response?.data?.data?.serverIp) {
        return response.data.data;
      }
    } catch {
      // Fallback
    }

    const host = typeof window !== 'undefined' ? window.location.hostname : '';
    const isIp = /^(\d{1,3}\.){3}\d{1,3}$/.test(host);
    return {
      serverIp: isIp ? host : '76.76.21.21',
      cnameTarget: 'cname.digiflexsalon.com',
    };
  },

  /**
   * Delete a tenant
   */
  async delete(id: string): Promise<void> {
    await apiClient.delete<ApiResponse<{ message: string }>>(
      `/api/v1/tenants/${id}`,
    );
  },

  /**
   * List branches for current tenant or franchise
   */
  async listBranches(tenantId?: string, franchiseId?: string): Promise<any[]> {
    const tid = tenantId || tokenStorage.getTenantId() || undefined;
    const params = new URLSearchParams();
    if (tid) params.append('tenantId', tid);
    if (franchiseId) params.append('franchiseId', franchiseId);

    const queryString = params.toString();
    const url = queryString ? `/api/v1/branches?${queryString}` : '/api/v1/branches';
    const headers: Record<string, string> = {};
    if (tid) headers['x-tenant-id'] = tid;
    if (franchiseId) headers['x-franchise-id'] = franchiseId;

    const response = await apiClient.get<ApiResponse<any[]>>(url, {
      headers: Object.keys(headers).length > 0 ? headers : undefined,
    });
    return response.data.data;
  },

  /**
   * Get all branches assigned to a franchise partner
   */
  async getFranchiseBranches(franchiseId: string): Promise<any[]> {
    try {
      const response = await apiClient.get<ApiResponse<any[]>>(`/api/v1/franchises/${franchiseId}/branches`);
      return response.data.data;
    } catch {
      // Fallback to query param on /api/v1/branches
      const response = await apiClient.get<ApiResponse<any[]>>(`/api/v1/branches?franchiseId=${franchiseId}`);
      return response.data.data;
    }
  },

  /**
   * Get branch by ID
   */
  async getBranchById(id: string): Promise<any> {
    const response = await apiClient.get<ApiResponse<any>>(`/api/v1/branches/${id}`);
    return response.data.data;
  },

  /**
   * Create a new branch location
   */
  async createBranch(payload: any): Promise<any> {
    const tid = payload?.tenantId || tokenStorage.getTenantId() || undefined;
    const headers = tid ? { 'x-tenant-id': tid } : undefined;
    const response = await apiClient.post<ApiResponse<any>>(
      '/api/v1/branches',
      payload,
      { headers },
    );
    return response.data.data;
  },

  /**
   * Update an existing branch location
   */
  async updateBranch(id: string, payload: any): Promise<any> {
    const response = await apiClient.patch<ApiResponse<any>>(
      `/api/v1/branches/${id}`,
      payload,
    );
    return response.data.data;
  },

  /**
   * Delete a branch location
   */
  async deleteBranch(id: string): Promise<void> {
    await apiClient.delete<ApiResponse<any>>(`/api/v1/branches/${id}`);
  },

  /**
   * Get operating hours for branch
   */
  async getOperatingHours(branchId: string): Promise<any[]> {
    const response = await apiClient.get<ApiResponse<any[]>>(
      `/api/v1/branches/${branchId}/operating-hours`,
    );
    return response.data.data;
  },

  /**
   * Update operating hours for branch
   */
  async updateOperatingHours(branchId: string, schedules: any[]): Promise<any> {
    const response = await apiClient.put<ApiResponse<any>>(
      `/api/v1/branches/${branchId}/operating-hours`,
      { schedules },
    );
    return response.data.data;
  },

  /**
   * Get holidays for tenant / branch
   */
  async getHolidays(branchId?: string): Promise<any[]> {
    const url = branchId ? `/api/v1/holidays?branchId=${branchId}` : '/api/v1/holidays';
    const response = await apiClient.get<ApiResponse<any[]>>(url);
    return response.data.data;
  },

  /**
   * Create a holiday
   */
  async createHoliday(branchId: string, payload: { date: string; description: string }): Promise<any> {
    const response = await apiClient.post<ApiResponse<any>>(
      `/api/v1/branches/${branchId}/holidays`,
      payload,
    );
    return response.data.data;
  },

  /**
   * Delete a holiday
   */
  async deleteHoliday(holidayId: string, branchId?: string): Promise<void> {
    const url = branchId
      ? `/api/v1/branches/${branchId}/holidays/${holidayId}`
      : `/api/v1/holidays/${holidayId}`;
    await apiClient.delete<ApiResponse<any>>(url);
  },

  /**
   * List franchise partners
   */
  async listFranchises(all = false, tenantId?: string): Promise<any[]> {
    const tid = tenantId || tokenStorage.getTenantId() || undefined;
    const params = new URLSearchParams();
    if (all) {
      params.append('all', 'true');
    } else if (tid) {
      params.append('tenantId', tid);
    }
    const queryString = params.toString();
    const url = queryString ? `/api/v1/franchises?${queryString}` : '/api/v1/franchises';
    const headers: Record<string, string> = {};
    if (!all && tid) {
      headers['x-tenant-id'] = tid;
    }
    const response = await apiClient.get<ApiResponse<any[]>>(url, {
      headers: Object.keys(headers).length > 0 ? headers : undefined,
    });
    return response.data.data;
  },

  /**
   * Create franchise partner
   */
  async createFranchise(payload: any): Promise<any> {
    const response = await apiClient.post<ApiResponse<any>>('/api/v1/franchises', payload);
    return response.data.data;
  },

  /**
   * Get franchise partner by ID
   */
  async getFranchise(franchiseId: string): Promise<any> {
    const response = await apiClient.get<ApiResponse<any>>(`/api/v1/franchises/${franchiseId}`);
    return response.data.data;
  },

  /**
   * Update franchise partner
   */
  async updateFranchise(franchiseId: string, payload: any): Promise<any> {
    const response = await apiClient.patch<ApiResponse<any>>(`/api/v1/franchises/${franchiseId}`, payload);
    return response.data.data;
  },

  /**
   * List compliance requirement standards (baseline 8 default + custom DB standards)
   */
  async listComplianceRequirements(tenantId?: string): Promise<any[]> {
    const url = tenantId ? `/api/v1/compliance/requirements?tenantId=${tenantId}` : '/api/v1/compliance/requirements';
    const response = await apiClient.get<ApiResponse<any[]>>(url);
    return response.data.data;
  },

  /**
   * Create a new custom compliance requirement standard (persisted to PostgreSQL)
   */
  async createComplianceRequirement(payload: any): Promise<any> {
    const response = await apiClient.post<ApiResponse<any>>('/api/v1/compliance/requirements', payload);
    return response.data.data;
  },

  /**
   * Delete custom compliance requirement standard
   */
  async deleteComplianceRequirement(id: string): Promise<void> {
    await apiClient.delete<ApiResponse<any>>(`/api/v1/compliance/requirements/${id}`);
  },
};
