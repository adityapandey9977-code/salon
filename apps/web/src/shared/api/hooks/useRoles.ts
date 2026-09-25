import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { rolesApi } from '../roles.api';
import type { CreateRoleRequest, UpdateRoleRequest } from '../types';

export const ROLE_QUERY_KEYS = {
  all: ['roles'] as const,
  lists: () => [...ROLE_QUERY_KEYS.all, 'list'] as const,
  details: () => [...ROLE_QUERY_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...ROLE_QUERY_KEYS.details(), id] as const,
  permissions: ['permissions'] as const,
};

export function useRoles() {
  return useQuery({
    queryKey: ROLE_QUERY_KEYS.lists(),
    queryFn: () => rolesApi.list(),
  });
}

export function useRole(id: string) {
  return useQuery({
    queryKey: ROLE_QUERY_KEYS.detail(id),
    queryFn: () => rolesApi.getById(id),
    enabled: Boolean(id),
  });
}

export function usePermissions() {
  return useQuery({
    queryKey: ROLE_QUERY_KEYS.permissions,
    queryFn: () => rolesApi.listPermissions(),
  });
}

export function useCreateRoleMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateRoleRequest) => rolesApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ROLE_QUERY_KEYS.lists() });
    },
  });
}

export function useUpdateRoleMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateRoleRequest }) =>
      rolesApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ROLE_QUERY_KEYS.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: ROLE_QUERY_KEYS.lists() });
    },
  });
}

export function useAssignRolePermissionsMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      roleId,
      permissions,
    }: {
      roleId: string;
      permissions: string[];
    }) => rolesApi.assignPermissions(roleId, permissions),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ROLE_QUERY_KEYS.detail(variables.roleId) });
      queryClient.invalidateQueries({ queryKey: ROLE_QUERY_KEYS.lists() });
    },
  });
}
