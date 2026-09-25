import { apiClient } from './client';
import type { ApiResponse } from './types';

// ==========================================
// Types
// ==========================================

export interface ApiInventoryCategory {
  id: string;
  tenantId: string;
  name: string;
  description?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiBranchStock {
  id: string;
  tenantId: string;
  branchId: string;
  skuId: string;
  quantityOnHandProjection: number | string;
  quantityAvailableProjection: number | string;
  quantityReservedProjection: number | string;
  reorderLevel: number;
  reorderQuantity: number;
}

export interface ApiInventorySku {
  id: string;
  tenantId: string;
  skuCode: string;
  barcode?: string | null;
  name: string;
  description?: string | null;
  categoryId: string;
  unitOfMeasure: string;
  costPrice: number | string;
  retailPrice?: number | string | null;
  taxRatePercent?: number | string | null;
  isConsumable: boolean;
  isRetail: boolean;
  reorderEnabled: boolean;
  isActive: boolean;
  deletedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
  branchStocks?: ApiBranchStock[];
}

export interface CreateSkuPayload {
  skuCode: string;
  barcode?: string;
  name: string;
  description?: string;
  categoryId: string;
  unitOfMeasure: string;
  costPrice: number;
  retailPrice?: number;
  taxRatePercent?: number;
  isConsumable?: boolean;
  isRetail?: boolean;
  reorderEnabled?: boolean;
}

export interface UpdateSkuPayload {
  name?: string;
  description?: string;
  barcode?: string;
  categoryId?: string;
  unitOfMeasure?: string;
  costPrice?: number;
  retailPrice?: number;
  taxRatePercent?: number;
  isConsumable?: boolean;
  isRetail?: boolean;
  reorderEnabled?: boolean;
  isActive?: boolean;
}

export interface CreateCategoryPayload {
  name: string;
  description?: string;
}

export interface ListSkusQuery {
  categoryId?: string;
  isRetail?: boolean;
  isConsumable?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}

// ==========================================
// Inventory API Service
// ==========================================

export const inventoryApi = {
  // SKUs
  async listSkus(params?: ListSkusQuery): Promise<ApiInventorySku[]> {
    const response = await apiClient.get<ApiResponse<ApiInventorySku[]>>('/api/v1/inventory/skus', {
      params,
    });
    return response.data.data || [];
  },

  async getSku(id: string): Promise<ApiInventorySku> {
    const response = await apiClient.get<ApiResponse<ApiInventorySku>>(`/api/v1/inventory/skus/${id}`);
    return response.data.data;
  },

  async createSku(payload: CreateSkuPayload): Promise<ApiInventorySku> {
    const response = await apiClient.post<ApiResponse<ApiInventorySku>>('/api/v1/inventory/skus', payload);
    return response.data.data;
  },

  async updateSku(id: string, payload: UpdateSkuPayload): Promise<ApiInventorySku> {
    const response = await apiClient.put<ApiResponse<ApiInventorySku>>(`/api/v1/inventory/skus/${id}`, payload);
    return response.data.data;
  },

  async deleteSku(id: string): Promise<void> {
    await apiClient.delete<ApiResponse<{ message: string }>>(`/api/v1/inventory/skus/${id}`);
  },

  // Categories
  async listCategories(): Promise<ApiInventoryCategory[]> {
    const response = await apiClient.get<ApiResponse<ApiInventoryCategory[]>>('/api/v1/inventory/categories');
    return response.data.data || [];
  },

  async createCategory(payload: CreateCategoryPayload): Promise<ApiInventoryCategory> {
    const response = await apiClient.post<ApiResponse<ApiInventoryCategory>>('/api/v1/inventory/categories', payload);
    return response.data.data;
  },

  // Stock
  async getStock(branchId?: string): Promise<ApiBranchStock[]> {
    const response = await apiClient.get<ApiResponse<ApiBranchStock[]>>('/api/v1/inventory/stock', {
      params: branchId ? { branchId } : undefined,
    });
    return response.data.data || [];
  },
};
