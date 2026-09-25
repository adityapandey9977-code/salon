import { apiClient, tokenStorage } from './client';
import type { ApiResponse } from './types';

export interface ListCustomersParams {
  search?: string;
  mobilePhone?: string;
  email?: string;
  status?: string;
  branchId?: string;
  franchiseId?: string;
  hasFranchise?: boolean;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CreateCustomerPayload {
  firstName: string;
  lastName?: string;
  displayName?: string;
  mobilePhone: string;
  email?: string;
  avatarUrl?: string | null;
  gender?: 'MALE' | 'FEMALE' | 'OTHER' | 'UNSPECIFIED' | string;
  dateOfBirth?: string | null;
  segment?: string | null;
  preferredBranchId?: string;
  franchiseId?: string | null;
  status?: 'ACTIVE' | 'INACTIVE' | 'DORMANT' | 'BLOCKED' | 'ARCHIVED' | string;
  source?: 'WALK_IN' | 'ONLINE' | 'CALL_CENTER' | 'REFERRAL' | 'SOCIAL' | 'CAMPAIGN' | 'OTHER' | string;
  notes?: string;
  address?: {
    type?: string;
    addressLine1?: string;
    addressLine2?: string | null;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
}

export interface ApiCustomerSummary {
  id: string;
  tenantId: string;
  customerCode: string;
  firstName: string;
  lastName?: string | null;
  displayName: string;
  mobilePhone: string;
  email?: string | null;
  avatarUrl?: string | null;
  gender: string;
  dateOfBirth?: string | null;
  segment?: string | null;
  status: string;
  preferredBranchId?: string | null;
  franchiseId?: string | null;
  totalVisits: number;
  totalSpent: number;
  lastVisitAt?: string | null;
  firstVisitAt?: string | null;
  createdAt: string;
  notes?: string | null;
}

export const customersApi = {
  /**
   * List / search customers for the active tenant
   */
  async list(params?: ListCustomersParams): Promise<ApiCustomerSummary[]> {
    const tid = tokenStorage.getTenantId() || undefined;
    const fid = tokenStorage.getFranchiseId() || undefined;
    const bid = tokenStorage.getBranchId() || undefined;
    const headers: Record<string, string> = {};
    if (tid) headers['x-tenant-id'] = tid;
    if (fid) headers['x-franchise-id'] = fid;
    if (bid) headers['x-branch-id'] = bid;

    const response = await apiClient.get<ApiResponse<ApiCustomerSummary[]>>('/api/v1/customers', {
      params: {
        ...(tid ? { tenantId: tid } : {}),
        ...(fid && !params?.franchiseId ? { franchiseId: fid } : {}),
        ...(bid && !params?.branchId ? { branchId: bid } : {}),
        ...params,
      },
      headers: Object.keys(headers).length ? headers : undefined,
    });
    return response.data.data;
  },

  /**
   * Get single customer detail by UUID
   */
  async getById(id: string): Promise<any> {
    const tid = tokenStorage.getTenantId() || undefined;
    const fid = tokenStorage.getFranchiseId() || undefined;
    const headers: Record<string, string> = {};
    if (tid) headers['x-tenant-id'] = tid;
    if (fid) headers['x-franchise-id'] = fid;

    const response = await apiClient.get<ApiResponse<any>>(`/api/v1/customers/${id}`, {
      headers: Object.keys(headers).length ? headers : undefined,
    });
    return response.data.data;
  },

  /**
   * Create a new customer record
   */
  async create(payload: CreateCustomerPayload): Promise<ApiCustomerSummary> {
    const tid = tokenStorage.getTenantId() || undefined;
    const fid = tokenStorage.getFranchiseId() || undefined;
    const bid = tokenStorage.getBranchId() || undefined;
    const headers: Record<string, string> = {};
    if (tid) headers['x-tenant-id'] = tid;
    if (fid) headers['x-franchise-id'] = fid;
    if (bid) headers['x-branch-id'] = bid;

    const cleanPayload: CreateCustomerPayload = {
      ...payload,
      firstName: payload.firstName.trim(),
      lastName: payload.lastName?.trim() ? payload.lastName.trim() : undefined,
      displayName: payload.displayName?.trim() || `${payload.firstName.trim()} ${payload.lastName?.trim() || ''}`.trim(),
      mobilePhone: payload.mobilePhone.trim(),
      email: payload.email?.trim() ? payload.email.trim() : undefined,
      avatarUrl: payload.avatarUrl || undefined,
      gender: payload.gender ? (payload.gender.toUpperCase() as any) : undefined,
      dateOfBirth: payload.dateOfBirth !== undefined ? payload.dateOfBirth : undefined,
      segment: payload.segment || 'New Client',
      preferredBranchId: payload.preferredBranchId?.trim()
        ? payload.preferredBranchId.trim()
        : (bid || undefined),
      franchiseId: payload.franchiseId ? payload.franchiseId.trim() : fid || null,
    };
    const response = await apiClient.post<ApiResponse<ApiCustomerSummary>>('/api/v1/customers', cleanPayload, {
      headers: Object.keys(headers).length ? headers : undefined,
    });
    return response.data.data;
  },

  /**
   * Update an existing customer
   */
  async update(id: string, payload: Partial<CreateCustomerPayload>): Promise<ApiCustomerSummary> {
    const tid = tokenStorage.getTenantId() || undefined;
    const fid = tokenStorage.getFranchiseId() || undefined;
    const headers: Record<string, string> = {};
    if (tid) headers['x-tenant-id'] = tid;
    if (fid) headers['x-franchise-id'] = fid;

    const sanitizedPayload: any = { ...payload };
    if (sanitizedPayload.firstName) sanitizedPayload.firstName = sanitizedPayload.firstName.trim();
    if (sanitizedPayload.lastName !== undefined) sanitizedPayload.lastName = sanitizedPayload.lastName?.trim() || null;
    if (sanitizedPayload.displayName) sanitizedPayload.displayName = sanitizedPayload.displayName.trim();
    if (sanitizedPayload.mobilePhone) sanitizedPayload.mobilePhone = sanitizedPayload.mobilePhone.trim();
    if (sanitizedPayload.email !== undefined) sanitizedPayload.email = sanitizedPayload.email?.trim() || null;
    if (sanitizedPayload.gender) sanitizedPayload.gender = sanitizedPayload.gender.toUpperCase();
    if (sanitizedPayload.segment !== undefined) sanitizedPayload.segment = sanitizedPayload.segment;
    if (sanitizedPayload.dateOfBirth !== undefined) sanitizedPayload.dateOfBirth = sanitizedPayload.dateOfBirth || null;

    const response = await apiClient.patch<ApiResponse<ApiCustomerSummary>>(`/api/v1/customers/${id}`, sanitizedPayload, {
      headers: Object.keys(headers).length ? headers : undefined,
    });
    return response.data.data;
  },

  /**
   * Record visit and update lifetime spend for customer
   */
  async recordVisit(id: string, amount: number, visitDate?: string): Promise<ApiCustomerSummary> {
    const tid = tokenStorage.getTenantId() || undefined;
    const headers: Record<string, string> = {};
    if (tid) headers['x-tenant-id'] = tid;

    const response = await apiClient.post<ApiResponse<ApiCustomerSummary>>(
      `/api/v1/customers/${id}/record-visit`,
      {
        amount,
        visitDate: visitDate || new Date().toISOString(),
      },
      {
        headers: Object.keys(headers).length ? headers : undefined,
      },
    );
    return response.data.data;
  },

  /**
   * Soft-delete / archive customer
   */
  async delete(id: string, reason?: string): Promise<void> {
    const tid = tokenStorage.getTenantId() || undefined;
    const headers: Record<string, string> = {};
    if (tid) headers['x-tenant-id'] = tid;

    await apiClient.delete(`/api/v1/customers/${id}`, {
      data: { reason },
      headers: Object.keys(headers).length ? headers : undefined,
    });
  },
};
