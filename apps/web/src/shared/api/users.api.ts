import { apiClient } from './client';
import type {
  ApiResponse,
  CreateUserRequest,
  CreateUserScopeRequest,
  PaginationMeta,
  UpdateUserRequest,
  UserDto,
  UserEffectiveAccessDto,
  UserQueryFilters,
  UserScopeDto,
} from './types';

export interface UserListResult {
  users: UserDto[];
  pagination: PaginationMeta;
}

export const usersApi = {
  /**
   * List users with optional pagination, search and filters
   */
  async list(filters?: UserQueryFilters): Promise<UserListResult> {
    const response = await apiClient.get<ApiResponse<UserDto[]>>('/api/v1/users', {
      params: filters,
    });
    return {
      users: response.data.data,
      pagination: response.data.pagination ?? {
        page: filters?.page || 1,
        limit: filters?.limit || 20,
        total: response.data.data.length,
        totalPages: 1,
      },
    };
  },

  /**
   * Get single user by ID
   */
  async getById(id: string): Promise<UserDto> {
    const response = await apiClient.get<ApiResponse<UserDto>>(`/api/v1/users/${id}`);
    return response.data.data;
  },

  /**
   * Create a new tenant or platform user
   */
  async create(payload: CreateUserRequest): Promise<UserDto> {
    const response = await apiClient.post<ApiResponse<UserDto>>('/api/v1/users', payload);
    return response.data.data;
  },

  /**
   * Update user details (name, status, mobile phone, MFA)
   */
  async update(id: string, payload: UpdateUserRequest): Promise<UserDto> {
    const response = await apiClient.patch<ApiResponse<UserDto>>(
      `/api/v1/users/${id}`,
      payload,
    );
    return response.data.data;
  },

  /**
   * Suspend user account
   */
  async suspend(id: string): Promise<UserDto> {
    const response = await apiClient.post<ApiResponse<UserDto>>(
      `/api/v1/users/${id}/suspend`,
    );
    return response.data.data;
  },

  /**
   * Activate user account
   */
  async activate(id: string): Promise<UserDto> {
    const response = await apiClient.post<ApiResponse<UserDto>>(
      `/api/v1/users/${id}/activate`,
    );
    return response.data.data;
  },

  /**
   * Assign roles to user
   */
  async assignRoles(userId: string, roleIds: string[]): Promise<void> {
    await apiClient.post<ApiResponse<{ message: string }>>(`/api/v1/users/${userId}/roles`, {
      roleIds,
    });
  },

  /**
   * Remove a specific role from user
   */
  async removeRole(userId: string, roleId: string): Promise<void> {
    await apiClient.delete<ApiResponse<{ message: string }>>(
      `/api/v1/users/${userId}/roles/${roleId}`,
    );
  },

  /**
   * Get effective permissions, roles, and scope access for user
   */
  async getEffectiveAccess(userId: string): Promise<UserEffectiveAccessDto> {
    const response = await apiClient.get<ApiResponse<UserEffectiveAccessDto>>(
      `/api/v1/users/${userId}/effective-access`,
    );
    return response.data.data;
  },

  /**
   * Get assigned scopes for user
   */
  async getScopes(userId: string): Promise<UserScopeDto[]> {
    const response = await apiClient.get<ApiResponse<UserScopeDto[]>>(
      `/api/v1/users/${userId}/scopes`,
    );
    return response.data.data;
  },

  /**
   * Create a new scope assignment for user
   */
  async createScope(userId: string, payload: CreateUserScopeRequest): Promise<UserScopeDto> {
    const response = await apiClient.post<ApiResponse<UserScopeDto>>(
      `/api/v1/users/${userId}/scopes`,
      payload,
    );
    return response.data.data;
  },

  /**
   * Delete a scope assignment
   */
  async deleteScope(userId: string, scopeId: string): Promise<void> {
    await apiClient.delete<ApiResponse<{ message: string }>>(
      `/api/v1/users/${userId}/scopes/${scopeId}`,
    );
  },
};
