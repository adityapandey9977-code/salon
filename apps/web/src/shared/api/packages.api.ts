import { apiClient } from './client';
import type { ApiResponse } from './types';

export interface PackageItemDto {
  serviceId: string;
  includedQuantity: number;
}

export interface PackageDto {
  id: string;
  tenantId: string;
  code: string;
  name: string;
  description?: string;
  price: number;
  validityDays: number;
  isShared: boolean;
  isActive: boolean;
  durationMins?: number | null;
  salesCount: number;
  imageUrl?: string | null;
  includedServicesText?: string | null;
  createdAt: string;
  updatedAt: string;
  items?: PackageItemDto[];
}

export interface CreatePackageRequest {
  code: string;
  name: string;
  description?: string;
  price: number;
  validityDays?: number;
  isShared?: boolean;
  isActive?: boolean;
  durationMins?: number | null;
  salesCount?: number;
  imageUrl?: string | null;
  includedServicesText?: string | null;
  items?: PackageItemDto[];
}

export const packagesApi = {
  listPackages: async (): Promise<PackageDto[]> => {
    const res = await apiClient.get<ApiResponse<PackageDto[]>>('/api/v1/packages');
    return res.data.data;
  },
  
  getPackageById: async (id: string): Promise<PackageDto> => {
    const res = await apiClient.get<ApiResponse<PackageDto>>(`/api/v1/packages/${id}`);
    return res.data.data;
  },

  createPackage: async (data: CreatePackageRequest): Promise<PackageDto> => {
    const res = await apiClient.post<ApiResponse<PackageDto>>('/api/v1/packages', data);
    return res.data.data;
  },

  updatePackage: async (id: string, data: Partial<CreatePackageRequest>): Promise<PackageDto> => {
    const res = await apiClient.put<ApiResponse<PackageDto>>(`/api/v1/packages/${id}`, data);
    return res.data.data;
  },


  listUsage: async (): Promise<any[]> => {
    const res = await apiClient.get<ApiResponse<any[]>>('/api/v1/packages/usage');
    return res.data.data;
  },

  redeemPackage: async (data: {
    customerPackageId: string;
    serviceId: string;
    appointmentId?: string;
    quantity?: number;
  }): Promise<any> => {
    const res = await apiClient.post<ApiResponse<any>>('/api/v1/packages/usage/redeem', data);
    return res.data.data;
  },

  getAnalytics: async (): Promise<any> => {
    const res = await apiClient.get<ApiResponse<any>>('/api/v1/packages/analytics');
    return res.data.data;
  },
};

