import type { AuthPrincipalType, ScopeType, TenantCredentialStatus, UserStatus, UserType } from '../../infrastructure/prisma/generated-client';
export interface CachedUserProfile {
    id: string;
    userType: UserType;
    fullName: string;
    email: string;
    mobilePhone: string | null;
    status: UserStatus;
    isMfaRequired: boolean;
    isMfaEnabled: boolean;
    role?: string;
    roles?: Array<{
        id: string;
        name: string;
        code: string;
    }>;
    lastLoginAt: string | null;
    createdAt: string;
}
export interface CachedTenantProfile {
    credentialId: string;
    tenantId: string;
    loginEmail: string;
    mobilePhone: string | null;
    status: TenantCredentialStatus;
    salonName?: string;
    tenantCode?: string;
    isMfaRequired: boolean;
    isMfaEnabled: boolean;
    lastLoginAt: string | null;
    createdAt: string;
}
export interface CachedEffectiveAccess {
    userId: string;
    roles: string[];
    permissions: string[];
    tenantId: string | null;
    franchiseId: string | null;
    branchIds: string[];
    scopeTypes: ScopeType[];
}
export interface CachedTenantEffectiveAccess {
    tenantId: string;
    credentialId: string;
    role: 'TENANT_ADMIN';
    scopeType: 'TENANT';
    permissions: string[];
}
export interface CachedSessionMetadata {
    id: string;
    principalType: AuthPrincipalType;
    userId?: string | null;
    tenantCredentialId?: string | null;
    tokenFamily: string;
    status: string;
    expiresAt: string;
    ipAddress: string | null;
    userAgent: string | null;
}
export interface CachedUserScope {
    id: string;
    scopeType: ScopeType;
    tenantId: string | null;
    franchiseId: string | null;
    branchId: string | null;
}
export interface MfaChallengeData {
    challengeId: string;
    principalType?: AuthPrincipalType;
    userId?: string;
    tenantCredentialId?: string;
    attempts: number;
    expiresAt: number;
}
//# sourceMappingURL=auth.dto.d.ts.map