import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type {
  CreateUserRequest,
  CreateUserScopeRequest,
  UpdateUserRequest,
  UserQueryFilters,
} from '../types';
import { usersApi } from '../users.api';

export const USER_QUERY_KEYS = {
  all: ['users'] as const,
  lists: () => [...USER_QUERY_KEYS.all, 'list'] as const,
  list: (filters?: UserQueryFilters) => [...USER_QUERY_KEYS.lists(), filters] as const,
  details: () => [...USER_QUERY_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...USER_QUERY_KEYS.details(), id] as const,
  effectiveAccess: (id: string) => [...USER_QUERY_KEYS.detail(id), 'effectiveAccess'] as const,
  scopes: (id: string) => [...USER_QUERY_KEYS.detail(id), 'scopes'] as const,
};

export function useUsers(filters?: UserQueryFilters) {
  return useQuery({
    queryKey: USER_QUERY_KEYS.list(filters),
    queryFn: () => usersApi.list(filters),
  });
}

export function useUser(id: string) {
  return useQuery({
    queryKey: USER_QUERY_KEYS.detail(id),
    queryFn: () => usersApi.getById(id),
    enabled: Boolean(id),
  });
}

export function useUserEffectiveAccess(id: string) {
  return useQuery({
    queryKey: USER_QUERY_KEYS.effectiveAccess(id),
    queryFn: () => usersApi.getEffectiveAccess(id),
    enabled: Boolean(id),
  });
}

export function useUserScopes(id: string) {
  return useQuery({
    queryKey: USER_QUERY_KEYS.scopes(id),
    queryFn: () => usersApi.getScopes(id),
    enabled: Boolean(id),
  });
}

export function useCreateUserMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateUserRequest) => usersApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.lists() });
    },
  });
}

export function useUpdateUserMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserRequest }) =>
      usersApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.lists() });
    },
  });
}

export function useSuspendUserMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => usersApi.suspend(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.detail(id) });
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.lists() });
    },
  });
}

export function useActivateUserMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => usersApi.activate(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.detail(id) });
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.lists() });
    },
  });
}

export function useAssignUserRolesMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, roleIds }: { userId: string; roleIds: string[] }) =>
      usersApi.assignRoles(userId, roleIds),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.detail(variables.userId) });
      queryClient.invalidateQueries({
        queryKey: USER_QUERY_KEYS.effectiveAccess(variables.userId),
      });
    },
  });
}

export function useCreateUserScopeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      scope,
    }: {
      userId: string;
      scope: CreateUserScopeRequest;
    }) => usersApi.createScope(userId, scope),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.scopes(variables.userId) });
      queryClient.invalidateQueries({
        queryKey: USER_QUERY_KEYS.effectiveAccess(variables.userId),
      });
    },
  });
}

export function useDeleteUserScopeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, scopeId }: { userId: string; scopeId: string }) =>
      usersApi.deleteScope(userId, scopeId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.scopes(variables.userId) });
      queryClient.invalidateQueries({
        queryKey: USER_QUERY_KEYS.effectiveAccess(variables.userId),
      });
    },
  });
}
