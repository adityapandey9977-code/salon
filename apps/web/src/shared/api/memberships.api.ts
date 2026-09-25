import { apiClient } from './client';
import type { ApiResponse } from './types';

export interface MembershipDto {
  id: string;
  tenantId: string;
  name: string;
  description?: string;
  price: number;
  billingPeriod: string;
  discountPercentage: number;
  benefitsJson?: any;
  isActive: boolean;
  pointsMultiplier?: number | null;
  membersCount: number;
  perksText?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMembershipRequest {
  name: string;
  description?: string;
  price: number;
  billingPeriod?: string;
  discountPercentage?: number;
  benefitsJson?: any;
  isActive?: boolean;
  pointsMultiplier?: number | null;
  membersCount?: number;
  perksText?: string | null;
}

export const membershipsApi = {
  listMemberships: async (): Promise<MembershipDto[]> => {
    const res = await apiClient.get<ApiResponse<MembershipDto[]>>('/api/v1/memberships');
    return res.data.data;
  },
  
  getMembershipById: async (id: string): Promise<MembershipDto> => {
    const res = await apiClient.get<ApiResponse<MembershipDto>>(`/api/v1/memberships/${id}`);
    return res.data.data;
  },

  createMembership: async (data: CreateMembershipRequest): Promise<MembershipDto> => {
    const res = await apiClient.post<ApiResponse<MembershipDto>>('/api/v1/memberships', data);
    return res.data.data;
  },

  updateMembership: async (id: string, data: Partial<CreateMembershipRequest>): Promise<MembershipDto> => {
    const res = await apiClient.put<ApiResponse<MembershipDto>>(`/api/v1/memberships/${id}`, data);
    return res.data.data;
  },

  listBenefits: async (): Promise<any[]> => {
    const res = await apiClient.get<ApiResponse<any[]>>('/api/v1/memberships/benefits');
    return res.data.data;
  },

  createBenefit: async (data: {
    membershipPlanId?: string;
    perkName: string;
    category?: string;
    discountValue: string;
    applicableScope?: string;
    usageLimit?: string;
    status?: string;
  }): Promise<any> => {
    const res = await apiClient.post<ApiResponse<any>>('/api/v1/memberships/benefits', data);
    return res.data.data;
  },

  listRenewals: async (): Promise<any[]> => {
    const res = await apiClient.get<ApiResponse<any[]>>('/api/v1/memberships/renewals');
    return res.data.data;
  },

  renewMembership: async (id: string, data?: { renewalMonths?: number }): Promise<any> => {
    const res = await apiClient.post<ApiResponse<any>>(`/api/v1/memberships/renewals/${id}/renew`, data || {});
    return res.data.data;
  },
};

