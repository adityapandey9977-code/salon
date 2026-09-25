import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authApi } from '../auth.api';
import { tokenStorage } from '../client';
import type {
  ForgotPasswordRequest,
  LoginRequest,
  MfaVerifyRequest,
  ResetPasswordRequest,
} from '../types';

export const AUTH_QUERY_KEYS = {
  me: ['auth', 'me'] as const,
  sessions: ['auth', 'sessions'] as const,
};

export function useCurrentUser() {
  const hasToken = Boolean(tokenStorage.getAccessToken());

  return useQuery({
    queryKey: AUTH_QUERY_KEYS.me,
    queryFn: () => authApi.getMe(),
    enabled: hasToken,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}

export function useLoginMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: LoginRequest) => authApi.login(credentials),
    onSuccess: (data) => {
      if (!data.requiresMfa) {
        queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEYS.me });
      }
    },
  });
}

export function useMfaVerifyMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: MfaVerifyRequest) => authApi.verifyMfa(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEYS.me });
    },
  });
}

export function useLogoutMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSettled: () => {
      queryClient.clear();
    },
  });
}

export function useForgotPasswordMutation() {
  return useMutation({
    mutationFn: (payload: ForgotPasswordRequest) => authApi.forgotPassword(payload),
  });
}

export function useResetPasswordMutation() {
  return useMutation({
    mutationFn: (payload: ResetPasswordRequest) => authApi.resetPassword(payload),
  });
}

export function useUserSessions() {
  const hasToken = Boolean(tokenStorage.getAccessToken());

  return useQuery({
    queryKey: AUTH_QUERY_KEYS.sessions,
    queryFn: () => authApi.getSessions(),
    enabled: hasToken,
  });
}

export function useRevokeSessionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sessionId: string) => authApi.revokeSession(sessionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEYS.sessions });
    },
  });
}
