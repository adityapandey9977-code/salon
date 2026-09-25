import type { RefreshTokenResponse, TenantLoginResponse } from '@salon-spa-saas/contracts';
import type { CachedTenantEffectiveAccess, CachedTenantProfile } from '../../domain/entities/auth.dto';
declare const TENANT_ADMIN_PERMISSIONS: string[];
export declare class TenantAuthService {
    /**
     * Validate Tenant Business Status from Organization Service (internal API)
     */
    private validateOrganizationTenantStatus;
    login(params: {
        email: string;
        password: string;
        tenantCode?: string;
        ipAddress?: string | null;
        userAgent?: string | null;
    }): Promise<TenantLoginResponse>;
    refreshToken(rawRefreshToken: string): Promise<RefreshTokenResponse>;
    logout(tenantCredentialId: string, sessionId: string): Promise<void>;
    getMe(tenantId: string, tenantCredentialId?: string | null): Promise<{
        profile: CachedTenantProfile;
        effectiveAccess: CachedTenantEffectiveAccess;
    }>;
    forgotPassword(email: string): Promise<{
        message: string;
    }>;
    resetPassword(token: string, newPassword: string): Promise<{
        message: string;
    }>;
}
export declare const tenantAuthService: TenantAuthService;
export { TENANT_ADMIN_PERMISSIONS };
//# sourceMappingURL=tenant-auth.service.d.ts.map