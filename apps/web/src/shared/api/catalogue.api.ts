import { apiClient, tokenStorage } from './client';
import type { ApiResponse } from './types';

// ==========================================
// Types
// ==========================================

export interface ApiServiceCategory {
  id: string;
  tenantId?: string;
  name: string;
  code: string;
  description?: string | null;
  sortOrder?: number;
  imageUrl?: string | null;
  accentColor?: string | null;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiBranchPrice {
  branchId: string;
  price: number;
  isActive: boolean;
  effectiveFrom?: string | null;
  effectiveTo?: string | null;
}

export interface ApiServiceMaster {
  id: string;
  tenantId?: string;
  categoryId: string;
  code: string;
  name: string;
  description?: string | null;
  durationMinutes: number;
  bufferBeforeMinutes?: number;
  bufferAfterMinutes?: number;
  basePrice: number;
  gstRate?: number;
  taxCode?: string | null;
  sacCode?: string | null;
  requiresConsultation?: boolean;
  requiresPatchTest?: boolean;
  isActive: boolean;
  isBookableOnline?: boolean;
  imageUrl?: string | null;
  requiredSkill?: string | null;
  requiredLevel?: string | null;
  requiredRoomOrChair?: string | null;
  requiredEquipment?: string | null;
  pricingMode?: string | null;
  discountEligible?: boolean;
  availableBranches?: string[];
  metadata?: any;
  createdAt?: string;
  updatedAt?: string;
  branchPrices?: ApiBranchPrice[];
}

export interface ApiBranchResource {
  id: string;
  branchId: string;
  name: string;
  code?: string | null;
  type: 'ROOM' | 'CHAIR' | 'EQUIPMENT' | 'OTHER';
  capacity: number;
  description?: string | null;
  isAvailable: boolean;
  createdAt?: string;
  updatedAt?: string;
  branch?: {
    id: string;
    name: string;
    code: string;
    city?: string;
  };
}

export interface CreateCategoryPayload {
  name: string;
  code: string;
  description?: string | null;
  sortOrder?: number;
  imageUrl?: string | null;
  accentColor?: string | null;
  isActive?: boolean;
}

export interface UpdateCategoryPayload {
  name?: string;
  code?: string;
  description?: string | null;
  sortOrder?: number;
  imageUrl?: string | null;
  accentColor?: string | null;
  isActive?: boolean;
}

export interface CreateServicePayload {
  categoryId: string;
  code: string;
  name: string;
  description?: string | null;
  durationMinutes: number;
  bufferBeforeMinutes?: number;
  bufferAfterMinutes?: number;
  basePrice: number;
  gstRate?: number;
  taxCode?: string | null;
  sacCode?: string | null;
  requiresConsultation?: boolean;
  requiresPatchTest?: boolean;
  isActive?: boolean;
  isBookableOnline?: boolean;
  imageUrl?: string | null;
  requiredSkill?: string | null;
  requiredLevel?: string | null;
  requiredRoomOrChair?: string | null;
  requiredEquipment?: string | null;
  pricingMode?: string | null;
  discountEligible?: boolean;
  availableBranches?: string[];
  metadata?: any;
}

export interface UpdateServicePayload extends Partial<CreateServicePayload> {}

export interface SetBranchPricePayload {
  branchId: string;
  price: number;
  effectiveFrom?: string | null;
  effectiveTo?: string | null;
  isActive?: boolean;
}

export interface SetRecipePayload {
  name?: string;
  description?: string | null;
  version?: number;
  items: Array<{
    skuId: string;
    quantityRequired: number;
    unit?: string;
  }>;
}

export interface CreateResourcePayload {
  branchId: string;
  name: string;
  code?: string;
  type: 'ROOM' | 'CHAIR' | 'EQUIPMENT' | 'OTHER';
  capacity?: number;
  description?: string;
  isAvailable?: boolean;
}

export interface UpdateResourcePayload {
  branchId?: string;
  name?: string;
  code?: string;
  type?: 'ROOM' | 'CHAIR' | 'EQUIPMENT' | 'OTHER';
  capacity?: number;
  description?: string;
  isAvailable?: boolean;
}

// ==========================================
// Catalogue API Client
// ==========================================

export const catalogueApi = {
  // --- Category Endpoints ---
  async fetchCategories(): Promise<ApiServiceCategory[]> {
    const response = await apiClient.get<ApiResponse<ApiServiceCategory[]>>('/api/v1/services/categories');
    return response.data.data || [];
  },

  async createCategory(payload: CreateCategoryPayload): Promise<ApiServiceCategory> {
    const response = await apiClient.post<ApiResponse<ApiServiceCategory>>('/api/v1/services/categories', payload);
    return response.data.data;
  },

  async updateCategory(id: string, payload: UpdateCategoryPayload): Promise<ApiServiceCategory> {
    const response = await apiClient.patch<ApiResponse<ApiServiceCategory>>(`/api/v1/services/categories/${id}`, payload);
    return response.data.data;
  },

  async deleteCategory(id: string): Promise<void> {
    await apiClient.delete(`/api/v1/services/categories/${id}`);
  },

  // --- Service Endpoints ---
  async fetchServices(params?: {
    categoryId?: string;
    branchId?: string;
    search?: string;
    isActive?: string;
    page?: number;
    limit?: number;
  }): Promise<ApiServiceMaster[]> {
    const response = await apiClient.get<ApiResponse<ApiServiceMaster[]>>('/api/v1/services', { params });
    return response.data.data || [];
  },

  async fetchServiceDetail(id: string): Promise<ApiServiceMaster> {
    const response = await apiClient.get<ApiResponse<ApiServiceMaster>>(`/api/v1/services/${id}`);
    return response.data.data;
  },

  async createService(payload: CreateServicePayload): Promise<ApiServiceMaster> {
    const response = await apiClient.post<ApiResponse<ApiServiceMaster>>('/api/v1/services', payload);
    return response.data.data;
  },

  async updateService(id: string, payload: UpdateServicePayload): Promise<ApiServiceMaster> {
    const response = await apiClient.patch<ApiResponse<ApiServiceMaster>>(`/api/v1/services/${id}`, payload);
    return response.data.data;
  },

  async deleteService(id: string): Promise<void> {
    await apiClient.delete(`/api/v1/services/${id}`);
  },

  // --- Branch Price Endpoints ---
  async setBranchPrice(serviceId: string, payload: SetBranchPricePayload): Promise<void> {
    await apiClient.put(`/api/v1/services/${serviceId}/pricing`, payload);
  },

  // --- Service Recipe / BOM Endpoints ---
  async setServiceRecipe(serviceId: string, payload: SetRecipePayload): Promise<void> {
    await apiClient.post(`/api/v1/services/${serviceId}/recipe`, payload);
  },

  // --- Branch Resources Endpoints ---
  async fetchResources(branchId?: string): Promise<ApiBranchResource[]> {
    const tid = tokenStorage.getTenantId() || undefined;
    const headers = tid ? { 'x-tenant-id': tid } : undefined;
    const response = await apiClient.get<ApiResponse<ApiBranchResource[]>>('/api/v1/branches/resources', {
      params: {
        ...(tid ? { tenantId: tid } : {}),
        ...(branchId ? { branchId } : {}),
      },
      headers,
    });
    return response.data.data || [];
  },

  async createResource(payload: CreateResourcePayload): Promise<ApiBranchResource> {
    const response = await apiClient.post<ApiResponse<ApiBranchResource>>('/api/v1/branches/resources', payload);
    return response.data.data;
  },

  async updateResource(id: string, payload: UpdateResourcePayload): Promise<ApiBranchResource> {
    const response = await apiClient.patch<ApiResponse<ApiBranchResource>>(`/api/v1/branches/resources/${id}`, payload);
    return response.data.data;
  },

  async deleteResource(id: string): Promise<void> {
    await apiClient.delete(`/api/v1/branches/resources/${id}`);
  },

  async fetchSkills(tenantId?: string): Promise<ApiSkillMaster[]> {
    const params: Record<string, string> = {};
    if (tenantId) params.tenantId = tenantId;
    const response = await apiClient.get<ApiResponse<ApiSkillMaster[]>>('/api/v1/services/skills', {
      params,
      headers: tenantId ? { 'x-tenant-id': tenantId } : undefined,
    });
    return response.data.data || [];
  },

  async seedSkills(tenantId?: string): Promise<ApiSkillMaster[]> {
    const params: Record<string, string> = {};
    if (tenantId) params.tenantId = tenantId;
    const response = await apiClient.post<ApiResponse<ApiSkillMaster[]>>('/api/v1/services/skills/seed', null, {
      params,
      headers: tenantId ? { 'x-tenant-id': tenantId } : undefined,
    });
    return response.data.data || [];
  },

  async createSkill(payload: CreateSkillPayload): Promise<ApiSkillMaster> {
    const response = await apiClient.post<ApiResponse<ApiSkillMaster>>('/api/v1/services/skills', payload);
    return response.data.data;
  },

  async updateSkill(id: string, payload: UpdateSkillPayload): Promise<ApiSkillMaster> {
    const response = await apiClient.patch<ApiResponse<ApiSkillMaster>>(`/api/v1/services/skills/${id}`, payload);
    return response.data.data;
  },

  async deleteSkill(id: string): Promise<void> {
    await apiClient.delete(`/api/v1/services/skills/${id}`);
  },
};

export interface ApiSkillMaster {
  id: string;
  tenantId?: string;
  code: string;
  name: string;
  categoryId?: string | null;
  categoryName?: string | null;
  description?: string | null;
  status: 'Active' | 'Inactive';
  servicesLinked?: number;
  staffCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateSkillPayload {
  code: string;
  name: string;
  categoryId?: string | null;
  categoryName?: string | null;
  description?: string | null;
  status?: 'Active' | 'Inactive';
}

export interface UpdateSkillPayload extends Partial<CreateSkillPayload> {}
