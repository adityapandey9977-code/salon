import type { CachedSessionMetadata } from '../../domain/entities/auth.dto';
import type { AuthPrincipalType, RefreshToken, Session } from '../prisma/generated-client';
export declare class SessionRepository {
    private toSafeSession;
    createSession(data: {
        principalType?: AuthPrincipalType;
        userId?: string | null;
        tenantCredentialId?: string | null;
        expiresAt: Date;
        ipAddress?: string | null;
        userAgent?: string | null;
    }): Promise<{
        session: Session;
        tokenFamily: string;
    }>;
    saveRefreshToken(data: {
        sessionId: string;
        tokenHash: string;
        expiresAt: Date;
    }): Promise<RefreshToken>;
    findRefreshToken(tokenHash: string): Promise<(RefreshToken & {
        session: Session;
    }) | null>;
    getLatestActiveTokenForSession(sessionId: string): Promise<RefreshToken | null>;
    rotateRefreshToken(oldTokenId: string, newTokenHash: string, newExpiresAt: Date): Promise<RefreshToken>;
    revokeTokenFamily(tokenFamily: string): Promise<void>;
    findSessionById(id: string): Promise<CachedSessionMetadata | null>;
    listUserSessions(userId: string): Promise<CachedSessionMetadata[]>;
    listTenantSessions(tenantCredentialId: string): Promise<CachedSessionMetadata[]>;
    revokeSession(sessionId: string): Promise<void>;
    revokeAllUserSessions(userId: string): Promise<void>;
    revokeAllTenantSessions(tenantCredentialId: string): Promise<void>;
}
export declare const sessionRepository: SessionRepository;
//# sourceMappingURL=session.repository.d.ts.map