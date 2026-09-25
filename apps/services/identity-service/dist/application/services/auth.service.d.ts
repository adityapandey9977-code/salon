import type { LoginResponse, RefreshTokenResponse } from '@salon-spa-saas/contracts';
import type { CachedEffectiveAccess, CachedUserProfile } from '../../domain/entities/auth.dto';
export declare class AuthService {
    login(params: {
        email: string;
        password: string;
        tenantId?: string | null;
        ipAddress?: string | null;
        userAgent?: string | null;
    }): Promise<LoginResponse>;
    loginSuperAdmin(params: {
        email: string;
        password: string;
        ipAddress?: string | null;
        userAgent?: string | null;
    }): Promise<{
        requiresMfa: boolean;
        mfaChallengeId: string;
        accessToken?: undefined;
        refreshToken?: undefined;
        expiresIn?: undefined;
        user?: undefined;
        principal?: undefined;
    } | {
        requiresMfa: boolean;
        accessToken: string;
        refreshToken: string;
        expiresIn: number;
        user: {
            id: string;
            userId: string;
            email: string;
            fullName: string;
            userType: import("../../infrastructure/prisma/generated-client").$Enums.UserType;
            status: "ACTIVE" | "INVITED" | "LOCKED";
            isMfaEnabled: false;
            role: string;
            roles: string[];
            permissions: string[];
            scopeType: "PLATFORM";
            tenantId: null;
            franchiseId: null;
            branchIds: never[];
        };
        principal: {
            id: string;
            userId: string;
            email: string;
            fullName: string;
            userType: import("../../infrastructure/prisma/generated-client").$Enums.UserType;
            status: "ACTIVE" | "INVITED" | "LOCKED";
            isMfaEnabled: false;
            role: string;
            roles: string[];
            permissions: string[];
            scopeType: "PLATFORM";
            tenantId: null;
            franchiseId: null;
            branchIds: never[];
            type: "USER";
        };
        mfaChallengeId?: undefined;
    }>;
    refreshToken(rawRefreshToken: string): Promise<RefreshTokenResponse>;
    logout(userId: string, sessionId: string): Promise<void>;
    getMe(userId: string, tenantId?: string | null): Promise<{
        user: CachedUserProfile;
        effectiveAccess: CachedEffectiveAccess;
    }>;
    getEffectiveAccess(userId: string): Promise<CachedEffectiveAccess>;
    verifyMfa(params: {
        challengeId: string;
        code: string;
        ipAddress?: string | null;
        userAgent?: string | null;
    }): Promise<LoginResponse>;
    forgotPassword(email: string): Promise<{
        message: string;
    }>;
    resetPassword(token: string, newPassword: string): Promise<{
        message: string;
    }>;
}
export declare const authService: AuthService;
//# sourceMappingURL=auth.service.d.ts.map