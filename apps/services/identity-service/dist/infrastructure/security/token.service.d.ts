import type { AuthPrincipalType, UserType } from '../../infrastructure/prisma/generated-client';
export interface JwtPayload {
    sub: string;
    sid: string;
    principalType: AuthPrincipalType;
    role: string;
    roles?: string[];
    permissions?: string[];
    scopeType: string;
    tenantId?: string | null;
    userType?: UserType;
    jti: string;
    iat?: number;
    exp?: number;
}
export declare class TokenService {
    static createAccessToken(payloadOptions: {
        sub: string;
        sid: string;
        principalType: AuthPrincipalType;
        role: string;
        scopeType: string;
        tenantId?: string | null;
        userType?: UserType;
    }): string;
    static createAccessToken(userId: string, sessionId: string, userType: UserType): string;
    static createTenantAccessToken(params: {
        tenantCredentialId: string;
        sessionId: string;
        tenantId: string;
    }): string;
    static createUserAccessToken(params: {
        userId: string;
        sessionId: string;
        role: string;
        roles?: string[];
        permissions?: string[];
        scopeType: string;
        tenantId?: string | null;
        userType?: UserType;
    }): string;
    static verifyAccessToken(token: string): JwtPayload;
    static hashToken(rawToken: string): string;
    static generateRefreshToken(ttlDays?: number): {
        rawToken: string;
        tokenHash: string;
        expiresAt: Date;
    };
    static generateResetToken(): {
        rawToken: string;
        tokenHash: string;
    };
    static generateMfaChallengeId(): string;
}
//# sourceMappingURL=token.service.d.ts.map