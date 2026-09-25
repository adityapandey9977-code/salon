import type { MfaMethod, User } from '../prisma/generated-client';
export declare class AuthRepository {
    /**
     * Load user credentials securely from PostgreSQL.
     * NEVER cache passwordHash or auth secrets.
     */
    findByNormalizedEmail(email: string): Promise<User | null>;
    findById(id: string): Promise<User | null>;
    recordLoginAttempt(data: {
        email: string;
        ipAddress?: string | null;
        userAgent?: string | null;
        isSuccess: boolean;
        failureReason?: string | null;
    }): Promise<void>;
    handleFailedLogin(user: User, maxAttempts?: number, lockDurationMinutes?: number): Promise<{
        isLocked: boolean;
        attempts: number;
    }>;
    handleSuccessfulLogin(userId: string): Promise<void>;
    updatePassword(userId: string, newPasswordHash: string): Promise<void>;
    findMfaMethods(userId: string): Promise<MfaMethod[]>;
    createOrUpdateTotpMfa(userId: string, secretEncrypted: string): Promise<MfaMethod>;
}
export declare const authRepository: AuthRepository;
//# sourceMappingURL=auth.repository.d.ts.map