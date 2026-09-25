import { randomUUID } from 'node:crypto';
import type { CachedSessionMetadata } from '../../domain/entities/auth.dto';
import { prisma } from '../prisma/client';
import type { AuthPrincipalType, RefreshToken, Session } from '../prisma/generated-client';

export class SessionRepository {
  private toSafeSession(s: Session): CachedSessionMetadata {
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

  public async createSession(data: {
    principalType?: AuthPrincipalType;
    userId?: string | null;
    tenantCredentialId?: string | null;
    expiresAt: Date;
    ipAddress?: string | null;
    userAgent?: string | null;
  }): Promise<{ session: Session; tokenFamily: string }> {
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

  public async saveRefreshToken(data: {
    sessionId: string;
    tokenHash: string;
    expiresAt: Date;
  }): Promise<RefreshToken> {
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

  public async findRefreshToken(
    tokenHash: string,
  ): Promise<(RefreshToken & { session: Session }) | null> {
    return prisma.refreshToken.findUnique({
      where: { tokenHash },
      include: { session: true },
    });
  }

  public async getLatestActiveTokenForSession(
    sessionId: string,
  ): Promise<RefreshToken | null> {
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

  public async rotateRefreshToken(
    oldTokenId: string,
    newTokenHash: string,
    newExpiresAt: Date,
  ): Promise<RefreshToken> {
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

  public async revokeTokenFamily(tokenFamily: string): Promise<void> {
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

  public async findSessionById(id: string): Promise<CachedSessionMetadata | null> {
    const s = await prisma.session.findUnique({
      where: { id },
    });
    return s ? this.toSafeSession(s) : null;
  }

  public async listUserSessions(userId: string): Promise<CachedSessionMetadata[]> {
    const sessions = await prisma.session.findMany({
      where: { userId, status: 'ACTIVE' },
      orderBy: { createdAt: 'desc' },
    });
    return sessions.map((s) => this.toSafeSession(s));
  }

  public async listTenantSessions(
    tenantCredentialId: string,
  ): Promise<CachedSessionMetadata[]> {
    const sessions = await prisma.session.findMany({
      where: { tenantCredentialId, status: 'ACTIVE' },
      orderBy: { createdAt: 'desc' },
    });
    return sessions.map((s) => this.toSafeSession(s));
  }

  public async revokeSession(sessionId: string): Promise<void> {
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

  public async revokeAllUserSessions(userId: string): Promise<void> {
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

  public async revokeAllTenantSessions(tenantCredentialId: string): Promise<void> {
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

