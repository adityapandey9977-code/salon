import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { staffApi, type ListStaffParams } from '../staff.api';
import type { FullStaffRecord } from '../../../modules/admin/pages/staff/StaffProfilePage';

export const STAFF_QUERY_KEYS = {
  all: ['staff'] as const,
  lists: () => [...STAFF_QUERY_KEYS.all, 'list'] as const,
  list: (params?: ListStaffParams) => [...STAFF_QUERY_KEYS.lists(), params] as const,
  details: () => [...STAFF_QUERY_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...STAFF_QUERY_KEYS.details(), id] as const,
  branchTeam: (branchId: string) => [...STAFF_QUERY_KEYS.all, 'branchTeam', branchId] as const,
  shifts: (branchId?: string) => [...STAFF_QUERY_KEYS.all, 'shifts', branchId] as const,
  roster: (params?: any) => [...STAFF_QUERY_KEYS.all, 'roster', params] as const,
  attendance: (params?: any) => [...STAFF_QUERY_KEYS.all, 'attendance', params] as const,
};

export function useStaffList(params?: ListStaffParams) {
  return useQuery({
    queryKey: STAFF_QUERY_KEYS.list(params),
    queryFn: () => staffApi.list(params),
  });
}

export function useStaffDetail(id: string) {
  return useQuery({
    queryKey: STAFF_QUERY_KEYS.detail(id),
    queryFn: () => staffApi.getById(id),
    enabled: Boolean(id),
  });
}

export function useBranchTeam(branchId: string) {
  return useQuery({
    queryKey: STAFF_QUERY_KEYS.branchTeam(branchId),
    queryFn: () => staffApi.getBranchTeam(branchId),
    enabled: Boolean(branchId),
  });
}

export function useCreateStaffMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Partial<FullStaffRecord>) => staffApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: STAFF_QUERY_KEYS.lists() });
    },
  });
}

export function useUpdateStaffMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<FullStaffRecord> }) =>
      staffApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: STAFF_QUERY_KEYS.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: STAFF_QUERY_KEYS.lists() });
    },
  });
}

export function useDeleteStaffMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) => staffApi.delete(id, reason),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: STAFF_QUERY_KEYS.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: STAFF_QUERY_KEYS.lists() });
    },
  });
}
