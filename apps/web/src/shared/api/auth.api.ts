import { apiClient, tokenStorage } from './client';
import type {
  ApiResponse,
  ForgotPasswordRequest,
  LoginRequest,
  LoginResponse,
  MfaVerifyRequest,
  RefreshTokenRequest,
  RefreshTokenResponse,
  ResetPasswordRequest,
  SuperAdminLoginRequest,
  SuperAdminLoginResponse,
  TenantLoginRequest,
  TenantLoginResponse,
  UserDto,
  UserSessionDto,
} from './types';

function extractAndStoreTokens(data: any): void {
  if (!data) return;

  if (data.accessToken) {
    tokenStorage.setAccessToken(data.accessToken);
  }
  if (data.refreshToken) {
    tokenStorage.setRefreshToken(data.refreshToken);
  }

  // Tenant ID from principal or user
  const tenantId =
    data.principal?.tenantId ||
    data.user?.tenantId ||
    (data.principal?.type === 'TENANT' ? data.principal.tenantId : null);

  if (tenantId) {
    tokenStorage.setTenantId(tenantId);
  }

  // Franchise ID
  const franchiseId = data.principal?.franchiseId || data.user?.franchiseId;
  if (franchiseId) {
    tokenStorage.setFranchiseId(franchiseId);
  }

  // Branch ID
  const branchIds = data.principal?.branchIds || data.user?.branchIds;
  if (branchIds && branchIds.length > 0) {
    tokenStorage.setBranchId(branchIds[0]);
  }
}

export const authApi = {
  /**
   * Universal Login (Intelligently handles Super Admin, Tenant, and Staff)
   */
  async login(payload: LoginRequest): Promise<LoginResponse> {
    const cleanEmail = (payload.email || '').trim();
    const cleanPassword = (payload.password || '').trim();
    const cleanTenantId = payload.tenantId ? payload.tenantId.trim() : undefined;

    const normalizedPayload: LoginRequest = {
      ...payload,
      email: cleanEmail,
      password: cleanPassword,
      tenantId: cleanTenantId,
    };

    const normalizedEmail = cleanEmail.toLowerCase();

    // 1. If super admin email pattern, route directly to super admin endpoint
    if (normalizedEmail.startsWith('superadmin@') || normalizedEmail.includes('superadmin')) {
      try {
        const saRes = await this.loginSuperAdmin({
          email: cleanEmail,
          password: cleanPassword,
        });

        const principal = saRes.principal;
        const normalizedUser = principal
          ? {
              id: principal.userId,
              email: principal.email,
              fullName: principal.fullName,
              userType: 'PLATFORM' as const,
              status: principal.status,
              isMfaEnabled: principal.isMfaEnabled,
              roles: principal.roles || [principal.role],
              permissions: principal.permissions || [],
              tenantId: principal.tenantId,
              branchIds: principal.branchIds || [],
            }
          : undefined;

        return {
          requiresMfa: saRes.requiresMfa,
          mfaChallengeId: saRes.mfaChallengeId,
          accessToken: saRes.accessToken,
          refreshToken: saRes.refreshToken,
          expiresIn: saRes.expiresIn,
          user: normalizedUser,
        };
      } catch (err: any) {
        // If super admin route fails, fallback to general auth route
        if (err.response?.status !== 404) throw err;
      }
    }

    // 2. Standard auth route (which internally supports both tenants and users)
    const response = await apiClient.post<ApiResponse<any>>(
      '/api/v1/auth/login',
      normalizedPayload,
    );

    const data = response.data.data;
    extractAndStoreTokens(data);

    // Normalize output format
    if (data.principal && !data.user) {
      if (data.principal.type === 'TENANT') {
        data.user = {
          id: data.principal.credentialId || data.principal.tenantId,
          email: data.principal.loginEmail,
          fullName: data.principal.salonName || 'Salon Owner',
          userType: 'TENANT',
          status: 'ACTIVE',
          isMfaEnabled: false,
          roles: ['TENANT_ADMIN', 'SALON_ADMIN'],
          permissions: data.principal.permissions || [],
          tenantId: data.principal.tenantId,
          branchIds: [],
        };
      } else {
        const isPlatform =
          data.principal.userType === 'PLATFORM' ||
          data.principal.scopeType === 'PLATFORM' ||
          data.principal.roles?.includes('SUPER_ADMIN');
        data.user = {
          id: data.principal.userId,
          email: data.principal.email,
          fullName: data.principal.fullName,
          userType: isPlatform ? 'PLATFORM' : (data.principal.userType || 'TENANT'),
          status: data.principal.status,
          isMfaEnabled: data.principal.isMfaEnabled,
          roles: data.principal.roles || [data.principal.role],
          permissions: data.principal.permissions || [],
          tenantId: data.principal.tenantId || null,
          branchIds: data.principal.branchIds || [],
        };
      }
    }

    return data;
  },

  /**
   * Super Administrator Auth Endpoint
   */
  async loginSuperAdmin(payload: SuperAdminLoginRequest): Promise<SuperAdminLoginResponse> {
    const cleanPayload: SuperAdminLoginRequest = {
      ...payload,
      email: (payload.email || '').trim(),
      password: (payload.password || '').trim(),
    };

    const response = await apiClient.post<ApiResponse<SuperAdminLoginResponse>>(
      '/api/v1/super-admin/auth/login',
      cleanPayload,
    );

    const data = response.data.data;
    extractAndStoreTokens(data);
    return data;
  },

  /**
   * Franchise Partner Auth Endpoint
   */
  async loginFranchise(payload: { email: string; password: string }): Promise<any> {
    const cleanPayload = {
      email: (payload.email || '').trim(),
      password: (payload.password || '').trim(),
    };

    const response = await apiClient.post<ApiResponse<any>>(
      '/api/v1/auth/login?portal=franchise',
      cleanPayload,
    );

    const data = response.data.data;
    extractAndStoreTokens(data);
    return data;
  },

  /**
   * Direct Tenant / Salon Credential Auth Endpoint
   */
  async loginTenant(payload: TenantLoginRequest): Promise<TenantLoginResponse> {
    const cleanPayload: TenantLoginRequest = {
      ...payload,
      email: (payload.email || '').trim(),
      password: (payload.password || '').trim(),
      tenantCode: payload.tenantCode ? payload.tenantCode.trim() : undefined,
    };

    const response = await apiClient.post<ApiResponse<TenantLoginResponse>>(
      '/api/v1/auth/tenant/login',
      cleanPayload,
    );

    const data = response.data.data;
    extractAndStoreTokens(data);
    return data;
  },

  /**
   * Verify Multi-Factor Authentication (MFA) challenge code
   */
  async verifyMfa(payload: MfaVerifyRequest): Promise<LoginResponse> {
    const response = await apiClient.post<ApiResponse<LoginResponse>>(
      '/api/v1/auth/mfa/verify',
      payload,
    );

    const data = response.data.data;
    extractAndStoreTokens(data);
    return data;
  },

  /**
   * Refresh JWT access token using stored refresh token
   */
  async refreshToken(payload: RefreshTokenRequest): Promise<RefreshTokenResponse> {
    const response = await apiClient.post<ApiResponse<RefreshTokenResponse>>(
      '/api/v1/auth/refresh-token',
      payload,
    );

    const data = response.data.data;
    if (data.accessToken) {
      tokenStorage.setAccessToken(data.accessToken);
    }
    if (data.refreshToken) {
      tokenStorage.setRefreshToken(data.refreshToken);
    }
    return data;
  },

  /**
   * Fetch currently authenticated user or tenant profile
   */
  async getMe(): Promise<UserDto> {
    try {
      const response = await apiClient.get<ApiResponse<any>>('/api/v1/auth/me');
      const data = response.data.data;
      const rawUser = data.user || data.profile || data;

      // Extract roles
      const rawRoles =
        data.effectiveAccess?.roles ||
        rawUser.roles ||
        (data.principal?.role ? [data.principal.role] : []);

      const normalizedRoles = Array.isArray(rawRoles)
        ? rawRoles.map((r: any) =>
            typeof r === 'string' ? { id: r, code: r, name: r } : r,
          )
        : [];

      return {
        id: rawUser.id || rawUser.userId || rawUser.credentialId || data.principal?.credentialId,
        email: rawUser.email || rawUser.loginEmail || data.principal?.loginEmail || '',
        fullName:
          rawUser.fullName ||
          rawUser.salonName ||
          data.principal?.salonName ||
          'Authenticated User',
        mobilePhone: rawUser.mobilePhone || null,
        userType:
          rawUser.userType ||
          (data.principal?.type === 'TENANT' || data.effectiveAccess?.tenantId || data.tenantId
            ? 'TENANT'
            : 'PLATFORM'),
        status: rawUser.status || 'ACTIVE',
        isMfaRequired: Boolean(rawUser.isMfaRequired),
        isMfaEnabled: Boolean(rawUser.isMfaEnabled),
        tenantId:
          rawUser.tenantId ||
          data.effectiveAccess?.tenantId ||
          data.tenantId ||
          data.principal?.tenantId ||
          null,
        franchiseId:
          rawUser.franchiseId ||
          data.effectiveAccess?.franchiseId ||
          data.franchiseId ||
          data.principal?.franchiseId ||
          null,
        branchIds:
          rawUser.branchIds ||
          data.effectiveAccess?.branchIds ||
          data.branchIds ||
          data.principal?.branchIds ||
          [],
        salonName: rawUser.salonName || data.principal?.salonName,
        role: rawUser.role || (normalizedRoles[0]?.code ?? 'USER'),
        roles: normalizedRoles,
        permissions:
          data.effectiveAccess?.permissions ||
          rawUser.permissions ||
          data.principal?.permissions ||
          [],
        scopes: rawUser.scopes || [],
        createdAt: rawUser.createdAt,
        updatedAt: rawUser.updatedAt,
      };
    } catch (err: any) {
      // Fallback attempt to super admin me if standard /me is not found
      if (err.response?.status === 404) {
        const saRes = await apiClient.get<ApiResponse<any>>('/api/v1/super-admin/auth/me');
        const p = saRes.data.data.principal;
        return {
          id: p.userId,
          email: p.email,
          fullName: p.fullName,
          userType: 'PLATFORM',
          status: p.status,
          isMfaRequired: false,
          isMfaEnabled: p.isMfaEnabled,
          roles: (p.roles || [p.role]).map((r: string) => ({ id: r, code: r, name: r })),
          permissions: p.permissions || [],
          branchIds: p.branchIds || [],
        };
      }
      throw err;
    }
  },

  /**
   * Logout user/tenant and revoke active session
   */
  async logout(): Promise<void> {
    try {
      await apiClient.post<ApiResponse<{ message: string }>>('/api/v1/auth/logout');
    } catch {
      // Ignore network/status errors on logout to guarantee client tokens are cleared
    } finally {
      tokenStorage.clearTokens();
    }
  },

  /**
   * Request password reset link / token
   */
  async forgotPassword(payload: ForgotPasswordRequest & { portal?: string }): Promise<{ message?: string }> {
    const query = payload.portal ? `?portal=${payload.portal}` : '';
    const response = await apiClient.post<ApiResponse<{ message?: string }>>(
      `/api/v1/auth/forgot-password${query}`,
      { email: payload.email },
    );
    return response.data.data;
  },

  /**
   * Set new password using reset token
   */
  async resetPassword(payload: ResetPasswordRequest): Promise<{ message?: string }> {
    const response = await apiClient.post<ApiResponse<{ message?: string }>>(
      '/api/v1/auth/reset-password',
      payload,
    );
    return response.data.data;
  },

  /**
   * Update security password for franchise owner/tenant
   */
  async changePassword(payload: {
    email?: string;
    currentPassword?: string;
    newPassword?: string;
  }): Promise<{ message?: string }> {
    const response = await apiClient.post<ApiResponse<{ message?: string }>>(
      '/api/v1/auth/change-password',
      payload,
    );
    return response.data.data;
  },

  /**
   * List all active user sessions
   */
  async getSessions(): Promise<UserSessionDto[]> {
    const response = await apiClient.get<ApiResponse<UserSessionDto[]>>(
      '/api/v1/auth/sessions',
    );
    return response.data.data;
  },

  /**
   * Revoke a specific session
   */
  async revokeSession(sessionId: string): Promise<void> {
    await apiClient.delete<ApiResponse<{ message: string }>>(
      `/api/v1/auth/sessions/${sessionId}`,
    );
  },
};
