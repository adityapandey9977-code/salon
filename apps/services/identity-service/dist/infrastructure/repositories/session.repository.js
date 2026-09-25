import { randomUUID } from 'node:crypto';
import { prisma } from '../prisma/client';
export class SessionRepository {
    toSafeSession(s) {
        return {
            id: s.id,
            principalType: s.principalType,
            userId: s.userId,
            tenantCredentialId: s.tenantCredentialId,
            tokenFamily: s.tokenFamily,
            status: s.status,
            expiresAt: s.expiresAt.toISOString(),
            ipAddress: s.ipAddress,
            userAgent: s.userAgent,
        };
    }
    async createSession(data) {
        const tokenFamily = randomUUID();
        const session = await prisma.session.create({
            data: {
                principalType: data.principalType || (data.tenantCredentialId ? 'TENANT' : 'USER'),
                userId: data.userId || null,
                tenantCredentialId: data.tenantCredentialId || null,
                tokenFamily,
                status: 'ACTIVE',
                ipAddress: data.ipAddress || null,
                userAgent: data.userAgent || null,
                expiresAt: data.expiresAt,
            },
        });
        return { session, tokenFamily };
    }
    async saveRefreshToken(data) {
        return prisma.refreshToken.create({
            data: {
                sessionId: data.sessionId,
                tokenHash: data.tokenHash,
                expiresAt: data.expiresAt,
                isUsed: false,
                isRevoked: false,
            },
        });
    }
    async findRefreshToken(tokenHash) {
        return prisma.refreshToken.findUnique({
            where: { tokenHash },
            include: { session: true },
        });
    }
    async getLatestActiveTokenForSession(sessionId) {
        return prisma.refreshToken.findFirst({
            where: {
                sessionId,
                isUsed: false,
                isRevoked: false,
                expiresAt: { gt: new Date() },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async rotateRefreshToken(oldTokenId, newTokenHash, newExpiresAt) {
        return prisma.$transaction(async (tx) => {
            // Mark old token as used
            const oldToken = await tx.refreshToken.update({
                where: { id: oldTokenId },
                data: { isUsed: true },
            });
            // Insert new token
            return tx.refreshToken.create({
                data: {
                    sessionId: oldToken.sessionId,
                    tokenHash: newTokenHash,
                    expiresAt: newExpiresAt,
                    isUsed: false,
                    isRevoked: false,
                },
            });
        });
    }
    async revokeTokenFamily(tokenFamily) {
        await prisma.$transaction(async (tx) => {
            const sessions = await tx.session.findMany({
                where: { tokenFamily },
                select: { id: true },
            });
            const sessionIds = sessions.map((s) => s.id);
            await tx.session.updateMany({
                where: { tokenFamily },
                data: { status: 'REVOKED', revokedAt: new Date() },
            });
            if (sessionIds.length > 0) {
                await tx.refreshToken.updateMany({
                    where: { sessionId: { in: sessionIds } },
                    data: { isRevoked: true },
                });
            }
        });
    }
    async findSessionById(id) {
        const s = await prisma.session.findUnique({
            where: { id },
        });
        return s ? this.toSafeSession(s) : null;
    }
    async listUserSessions(userId) {
        const sessions = await prisma.session.findMany({
            where: { userId, status: 'ACTIVE' },
            orderBy: { createdAt: 'desc' },
        });
        return sessions.map((s) => this.toSafeSession(s));
    }
    async listTenantSessions(tenantCredentialId) {
        const sessions = await prisma.session.findMany({
            where: { tenantCredentialId, status: 'ACTIVE' },
            orderBy: { createdAt: 'desc' },
        });
        return sessions.map((s) => this.toSafeSession(s));
    }
    async revokeSession(sessionId) {
        await prisma.$transaction(async (tx) => {
            await tx.session.update({
                where: { id: sessionId },
                data: { status: 'REVOKED', revokedAt: new Date() },
            });
            await tx.refreshToken.updateMany({
                where: { sessionId },
                data: { isRevoked: true },
            });
        });
    }
    async revokeAllUserSessions(userId) {
        await prisma.$transaction(async (tx) => {
            const userSessions = await tx.session.findMany({
                where: { userId },
                select: { id: true },
            });
            const sessionIds = userSessions.map((s) => s.id);
            await tx.session.updateMany({
                where: { userId },
                data: { status: 'REVOKED', revokedAt: new Date() },
            });
            if (sessionIds.length > 0) {
                await tx.refreshToken.updateMany({
                    where: { sessionId: { in: sessionIds } },
                    data: { isRevoked: true },
                });
            }
        });
    }
    async revokeAllTenantSessions(tenantCredentialId) {
        await prisma.$transaction(async (tx) => {
            const tenantSessions = await tx.session.findMany({
                where: { tenantCredentialId },
                select: { id: true },
            });
            const sessionIds = tenantSessions.map((s) => s.id);
            await tx.session.updateMany({
                where: { tenantCredentialId },
                data: { status: 'REVOKED', revokedAt: new Date() },
            });
            if (sessionIds.length > 0) {
                await tx.refreshToken.updateMany({
                    where: { sessionId: { in: sessionIds } },
                    data: { isRevoked: true },
                });
            }
        });
    }
}
export const sessionRepository = new SessionRepository();
