import { apiClient } from './client';
import type {
  ApiResponse,
  CreateRoleRequest,
  PermissionDto,
  RoleDto,
  UpdateRoleRequest,
} from './types';

export const rolesApi = {
  /**
   * List all available roles
   */
  async list(params?: { scope?: string; showOnFrontend?: boolean; panel?: string }): Promise<RoleDto[]> {
    const response = await apiClient.get<ApiResponse<RoleDto[]>>('/api/v1/roles', { params });
    return response.data.data;
  },

  /**
   * Get single role by ID
   */
  async getById(id: string): Promise<RoleDto> {
    const response = await apiClient.get<ApiResponse<RoleDto>>(`/api/v1/roles/${id}`);
    return response.data.data;
  },

  /**
   * Create a new custom role
   */
  async create(payload: CreateRoleRequest): Promise<RoleDto> {
    const response = await apiClient.post<ApiResponse<RoleDto>>('/api/v1/roles', payload);
    return response.data.data;
  },

  /**
   * Update role name/description
   */
  async update(id: string, payload: UpdateRoleRequest): Promise<RoleDto> {
    const response = await apiClient.patch<ApiResponse<RoleDto>>(
      `/api/v1/roles/${id}`,
      payload,
    );
    return response.data.data;
  },

  /**
   * Assign permissions to a role
   */
  async assignPermissions(roleId: string, permissions: string[]): Promise<void> {
    await apiClient.put<ApiResponse<{ message: string }>>(
      `/api/v1/roles/${roleId}/permissions`,
      { permissions },
    );
  },

  /**
   * Delete a role
   */
  async delete(id: string): Promise<void> {
    await apiClient.delete<ApiResponse<{ message: string }>>(`/api/v1/roles/${id}`);
  },

  /**
   * List all system permissions
   */
  async listPermissions(): Promise<PermissionDto[]> {
    const response = await apiClient.get<ApiResponse<PermissionDto[]>>(
      '/api/v1/permissions',
    );
    return response.data.data;
  },
};
