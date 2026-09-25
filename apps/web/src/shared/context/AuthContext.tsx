import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { authApi } from '../api/auth.api';
import { tokenStorage } from '../api/client';
import type { LoginRequest, LoginResponse, MfaVerifyRequest, UserDto } from '../api/types';

interface AuthContextValue {
  user: UserDto | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  requiresMfa: boolean;
  mfaChallengeId: string | null;
  login: (credentials: LoginRequest) => Promise<LoginResponse>;
  verifyMfa: (code: string) => Promise<LoginResponse>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  hasPermission: (permissionCode: string) => boolean;
  hasRole: (roleCode: string) => boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserDto | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [requiresMfa, setRequiresMfa] = useState<boolean>(false);
  const [mfaChallengeId, setMfaChallengeId] = useState<string | null>(null);

  const fetchUserProfile = useCallback(async () => {
    const token = tokenStorage.getAccessToken();
    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const res: any = await authApi.getMe();
      const userData = res.user || res;
      const roles = res.effectiveAccess?.roles || userData.roles || [];
      const normalizedRoles = Array.isArray(roles)
        ? roles.map((r: any) => (typeof r === 'string' ? { id: r, code: r, name: r } : r))
        : [];

      // Ensure SALON_ADMIN and TENANT_ADMIN are normalized
      const hasTenantAdmin = normalizedRoles.some(
        (r: any) => r.code === 'TENANT_ADMIN' || r.code === 'SALON_ADMIN',
      );
      if (hasTenantAdmin) {
        if (!normalizedRoles.some((r: any) => r.code === 'SALON_ADMIN')) {
          normalizedRoles.push({
            id: 'SALON_ADMIN',
            code: 'SALON_ADMIN',
            name: 'Salon Administrator',
          });
        }
        if (!normalizedRoles.some((r: any) => r.code === 'TENANT_ADMIN')) {
          normalizedRoles.push({
            id: 'TENANT_ADMIN',
            code: 'TENANT_ADMIN',
            name: 'Tenant Administrator',
          });
        }
      }

      const tenantId = userData.tenantId || res.effectiveAccess?.tenantId;
      if (tenantId) {
        tokenStorage.setTenantId(tenantId);
      }

      setUser({
        ...userData,
        roles: normalizedRoles,
        permissions: res.effectiveAccess?.permissions || userData.permissions || [],
        branchIds: res.effectiveAccess?.branchIds || userData.branchIds || [],
      });
    } catch {
      setUser(null);
      tokenStorage.clearTokens();
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserProfile();

    const handleUnauthorized = () => {
      setUser(null);
      tokenStorage.clearTokens();
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
    };
  }, [fetchUserProfile]);

  const login = useCallback(
    async (credentials: LoginRequest): Promise<LoginResponse> => {
      setIsLoading(true);
      const sanitizedCredentials: LoginRequest = {
        ...credentials,
        email: credentials.email ? credentials.email.trim() : credentials.email,
        password: credentials.password ? credentials.password.trim() : credentials.password,
        tenantId: credentials.tenantId ? credentials.tenantId.trim() : credentials.tenantId,
      };

      try {
        const response = await authApi.login(sanitizedCredentials);

        if (response.requiresMfa) {
          setRequiresMfa(true);
          setMfaChallengeId(response.mfaChallengeId || null);
        } else {
          setRequiresMfa(false);
          setMfaChallengeId(null);
          await fetchUserProfile();
        }

        return response;
      } finally {
        setIsLoading(false);
      }
    },
    [fetchUserProfile],
  );

  const verifyMfa = useCallback(
    async (code: string): Promise<LoginResponse> => {
      if (!mfaChallengeId) {
        throw new Error('No active MFA challenge.');
      }

      setIsLoading(true);
      try {
        const payload: MfaVerifyRequest = {
          challengeId: mfaChallengeId,
          code,
        };
        const response = await authApi.verifyMfa(payload);
        setRequiresMfa(false);
        setMfaChallengeId(null);
        await fetchUserProfile();
        return response;
      } finally {
        setIsLoading(false);
      }
    },
    [mfaChallengeId, fetchUserProfile],
  );

  const logout = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    try {
      await authApi.logout();
    } finally {
      setUser(null);
      setRequiresMfa(false);
      setMfaChallengeId(null);
      tokenStorage.clearTokens();
      setIsLoading(false);
    }
  }, []);

  const refreshProfile = useCallback(async (): Promise<void> => {
    await fetchUserProfile();
  }, [fetchUserProfile]);

  const hasPermission = useCallback(
    (permissionCode: string): boolean => {
      if (!user) return false;
      const isSuper = user.roles.some((r) => r.code === 'SUPER_ADMIN') || user.userType === 'PLATFORM';
      if (isSuper) return true;
      const isTenantAdmin =
        user.role === 'TENANT_ADMIN' ||
        user.role === 'SALON_ADMIN' ||
        user.roles.some((r) => r.code === 'TENANT_ADMIN' || r.code === 'SALON_ADMIN');
      if (isTenantAdmin) return true;

      const permissions = user.permissions || [];
      if (permissions.includes('*')) return true;
      if (permissions.includes(permissionCode)) return true;

      // Handle service.* <-> commerce.* permission aliases used across the platform
      if (permissionCode.startsWith('service.')) {
        const commerceEquivalent = permissionCode.replace('service.', 'commerce.');
        if (permissions.includes(commerceEquivalent)) return true;
      }
      if (permissionCode.startsWith('commerce.')) {
        const serviceEquivalent = permissionCode.replace('commerce.', 'service.');
        if (permissions.includes(serviceEquivalent)) return true;
      }

      return false;
    },
    [user],
  );

  const hasRole = useCallback(
    (roleCode: string): boolean => {
      if (!user) return false;
      if (user.role === roleCode) return true;
      if (
        (roleCode === 'SALON_ADMIN' || roleCode === 'TENANT_ADMIN') &&
        user.roles.some((r) => r.code === 'SALON_ADMIN' || r.code === 'TENANT_ADMIN')
      ) {
        return true;
      }
      return user.roles.some((role) => role.code === roleCode);
    },
    [user],
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user && tokenStorage.getAccessToken()),
      isLoading,
      requiresMfa,
      mfaChallengeId,
      login,
      verifyMfa,
      logout,
      refreshProfile,
      hasPermission,
      hasRole,
    }),
    [
      user,
      isLoading,
      requiresMfa,
      mfaChallengeId,
      login,
      verifyMfa,
      logout,
      refreshProfile,
      hasPermission,
      hasRole,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
