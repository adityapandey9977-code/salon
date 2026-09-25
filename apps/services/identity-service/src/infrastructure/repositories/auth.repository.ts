import { prisma } from '../prisma/client';
import type { MfaMethod, User } from '../prisma/generated-client';

export class AuthRepository {
  /**
   * Load user credentials securely from PostgreSQL.
   * NEVER cache passwordHash or auth secrets.
   */
  public async findByNormalizedEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });
  }

  public async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  public async recordLoginAttempt(data: {
    email: string;
    ipAddress?: string | null;
    userAgent?: string | null;
    isSuccess: boolean;
    failureReason?: string | null;
  }): Promise<void> {
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

  public async handleFailedLogin(
    user: User,
    maxAttempts = 5,
    lockDurationMinutes = 15,
  ): Promise<{ isLocked: boolean; attempts: number }> {
    const attempts = user.failedLoginAttempts + 1;
    let lockedUntil: Date | null = null;
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

  public async handleSuccessfulLogin(userId: string): Promise<void> {
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

  public async updatePassword(userId: string, newPasswordHash: string): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: {
        passwordHash: newPasswordHash,
        failedLoginAttempts: 0,
        lockedUntil: null,
      },
    });
  }

  public async findMfaMethods(userId: string): Promise<MfaMethod[]> {
    return prisma.mfaMethod.findMany({
      where: { userId, isVerified: true },
    });
  }

  public async createOrUpdateTotpMfa(userId: string, secretEncrypted: string): Promise<MfaMethod> {
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
