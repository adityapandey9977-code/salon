import type { CachedEffectiveAccess, CachedSessionMetadata, CachedTenantEffectiveAccess, CachedTenantProfile, CachedUserProfile, CachedUserScope, MfaChallengeData } from '../../domain/entities/auth.dto';
export declare class IdentityReadStore {
    private static instance;
    private constructor();
    static getInstance(): IdentityReadStore;
    private get redis();
    private safeParse;
    getUserProfileKey(userId: string, tenantId?: string | null): string;
    getUserByEmailKey(normalizedEmail: string): string;
    getPermissionsKey(userId: string): string;
    getRolesKey(userId: string): string;
    getScopesKey(userId: string): string;
    getEffectiveAccessKey(userId: string): string;
    getSessionKey(userId: string, sessionId: string): string;
    getTenantAuthProfileKey(tenantId: string): string;
    getTenantByEmailKey(normalizedEmail: string): string;
    getTenantEffectiveAccessKey(tenantId: string): string;
    getTenantSessionKey(tenantCredentialId: string, sessionId: string): string;
    getMfaChallengeKey(challengeId: string): string;
    getUserProfile(userId: string, fallback: () => Promise<CachedUserProfile | null>, tenantId?: string | null): Promise<CachedUserProfile | null>;
    getUserIdByEmail(email: string, fallback: () => Promise<string | null>): Promise<string | null>;
    getEffectivePermissions(userId: string, fallback: () => Promise<string[]>): Promise<string[]>;
    getEffectiveRoles(userId: string, fallback: () => Promise<string[]>): Promise<string[]>;
    getUserScopes(userId: string, fallback: () => Promise<CachedUserScope[]>): Promise<CachedUserScope[]>;
    getEffectiveAccess(userId: string, fallback: () => Promise<CachedEffectiveAccess>): Promise<CachedEffectiveAccess>;
    getTenantAuthProfile(tenantId: string, fallback: () => Promise<CachedTenantProfile | null>): Promise<CachedTenantProfile | null>;
    getTenantEffectiveAccess(tenantId: string, fallback: () => Promise<CachedTenantEffectiveAccess>): Promise<CachedTenantEffectiveAccess>;
    getTenantSession(tenantCredentialId: string, sessionId: string, fallback: () => Promise<CachedSessionMetadata | null>): Promise<CachedSessionMetadata | null>;
    getSession(userId: string, sessionId: string, fallback: () => Promise<CachedSessionMetadata | null>): Promise<CachedSessionMetadata | null>;
    setMfaChallenge(data: MfaChallengeData): Promise<void>;
    getMfaChallenge(challengeId: string): Promise<MfaChallengeData | null>;
    deleteMfaChallenge(challengeId: string): Promise<void>;
    invalidateUser(userId: string, options?: {
        oldEmail?: string;
        newEmail?: string;
        tenantId?: string | null;
    }): Promise<void>;
    invalidateTenant(tenantId: string, options?: {
        credentialId?: string;
        oldEmail?: string;
        newEmail?: string;
    }): Promise<void>;
    invalidateTenantSession(tenantCredentialId: string, sessionId: string): Promise<void>;
    invalidateAllTenantSessions(tenantCredentialId: string): Promise<void>;
    invalidateUserAccess(userId: string): Promise<void>;
    invalidateSession(userId: string, sessionId: string): Promise<void>;
    invalidateAllUserSessions(userId: string): Promise<void>;
}
export declare const identityReadStore: IdentityReadStore;
//# sourceMappingURL=identity-read.store.d.ts.map