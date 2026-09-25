import { prisma } from '../prisma/client';
export class AuthRepository {
    /**
     * Load user credentials securely from PostgreSQL.
     * NEVER cache passwordHash or auth secrets.
     */
    async findByNormalizedEmail(email) {
        return prisma.user.findUnique({
            where: { email: email.toLowerCase().trim() },
        });
    }
    async findById(id) {
        return prisma.user.findUnique({
            where: { id },
        });
    }
    async recordLoginAttempt(data) {
        await prisma.loginAttempt.create({
            data: {
                email: data.email.toLowerCase().trim(),
                ipAddress: data.ipAddress || null,
                userAgent: data.userAgent || null,
                isSuccess: data.isSuccess,
                failureReason: data.failureReason || null,
            },
        });
    }
    async handleFailedLogin(user, maxAttempts = 5, lockDurationMinutes = 15) {
        const attempts = user.failedLoginAttempts + 1;
        let lockedUntil = null;
        let status = user.status;
        if (attempts >= maxAttempts) {
            lockedUntil = new Date(Date.now() + lockDurationMinutes * 60 * 1000);
            status = 'LOCKED';
        }
        await prisma.user.update({
            where: { id: user.id },
            data: {
                failedLoginAttempts: attempts,
                lockedUntil,
                status,
            },
        });
        return {
            isLocked: attempts >= maxAttempts,
            attempts,
        };
    }
    async handleSuccessfulLogin(userId) {
        await prisma.user.update({
            where: { id: userId },
            data: {
                failedLoginAttempts: 0,
                lockedUntil: null,
                lastLoginAt: new Date(),
                status: 'ACTIVE',
            },
        });
    }
    async updatePassword(userId, newPasswordHash) {
        await prisma.user.update({
            where: { id: userId },
            data: {
                passwordHash: newPasswordHash,
                failedLoginAttempts: 0,
                lockedUntil: null,
            },
        });
    }
    async findMfaMethods(userId) {
        return prisma.mfaMethod.findMany({
            where: { userId, isVerified: true },
        });
    }
    async createOrUpdateTotpMfa(userId, secretEncrypted) {
        const existing = await prisma.mfaMethod.findFirst({
            where: { userId, mfaType: 'TOTP' },
        });
        if (existing) {
            return prisma.mfaMethod.update({
                where: { id: existing.id },
                data: { secretEncrypted, isVerified: true },
            });
        }
        return prisma.mfaMethod.create({
            data: {
                userId,
                mfaType: 'TOTP',
                secretEncrypted,
                isVerified: true,
            },
        });
    }
}
export const authRepository = new AuthRepository();
