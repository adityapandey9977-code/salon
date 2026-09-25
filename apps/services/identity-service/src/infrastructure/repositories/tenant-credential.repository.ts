import { prisma } from '../prisma/client';
import type {
  TenantCredential,
  TenantCredentialStatus,
} from '../prisma/generated-client';

export class TenantCredentialRepository {
  public async findByNormalizedEmail(
    normalizedEmail: string,
  ): Promise<TenantCredential | null> {
    return prisma.tenantCredential.findUnique({
      where: { normalizedEmail: normalizedEmail.toLowerCase().trim() },
    });
  }

  public async findById(id: string): Promise<TenantCredential | null> {
    return prisma.tenantCredential.findUnique({
      where: { id },
    });
  }

  public async findByTenantId(tenantId: string): Promise<TenantCredential | null> {
    return prisma.tenantCredential.findFirst({
      where: { tenantId },
    });
  }

  public async create(data: {
    tenantId: string;
    loginEmail: string;
    normalizedEmail: string;
    passwordHash: string;
    mobilePhone?: string | null;
    status?: TenantCredentialStatus;
  }): Promise<TenantCredential> {
    return prisma.tenantCredential.create({
      data: {
        tenantId: data.tenantId,
        loginEmail: data.loginEmail.trim(),
        normalizedEmail: data.normalizedEmail.toLowerCase().trim(),
        passwordHash: data.passwordHash,
        mobilePhone: data.mobilePhone || null,
        status: data.status || 'ACTIVE',
      },
    });
  }

  /**
   * Upsert by normalizedEmail:
   * - If no credential exists → create a new one.
   * - If one exists → UPDATE tenantId + passwordHash + mobilePhone so the
   *   credential always points to the LATEST tenant for that email address.
   */
  public async upsertByEmail(data: {
    tenantId: string;
    loginEmail: string;
    normalizedEmail: string;
    passwordHash: string;
    mobilePhone?: string | null;
  }): Promise<{ credential: TenantCredential; created: boolean }> {
    const normalizedEmail = data.normalizedEmail.toLowerCase().trim();
    const existing = await prisma.tenantCredential.findUnique({
      where: { normalizedEmail },
    });

    if (existing) {
      const updated = await prisma.tenantCredential.update({
        where: { normalizedEmail },
        data: {
          tenantId: data.tenantId,
          loginEmail: data.loginEmail.trim(),
          passwordHash: data.passwordHash,
          mobilePhone: data.mobilePhone || existing.mobilePhone,
          failedLoginAttempts: 0,
          lockedUntil: null,
          status: 'ACTIVE',
        },
      });
      return { credential: updated, created: false };
    }

    const created = await prisma.tenantCredential.create({
      data: {
        tenantId: data.tenantId,
        loginEmail: data.loginEmail.trim(),
        normalizedEmail,
        passwordHash: data.passwordHash,
        mobilePhone: data.mobilePhone || null,
        status: 'ACTIVE',
      },
    });
    return { credential: created, created: true };
  }

  public async handleFailedLogin(credential: TenantCredential): Promise<{
    isLocked: boolean;
    attempts: number;
  }> {
    const attempts = credential.failedLoginAttempts + 1;
    const isLocked = attempts >= 5;
    const lockedUntil = isLocked ? new Date(Date.now() + 15 * 60 * 1000) : null;

    await prisma.tenantCredential.update({
      where: { id: credential.id },
      data: {
        failedLoginAttempts: attempts,
        lockedUntil,
      },
    });

    return { isLocked, attempts };
  }

  public async handleSuccessfulLogin(credentialId: string): Promise<void> {
    await prisma.tenantCredential.update({
      where: { id: credentialId },
      data: {
        failedLoginAttempts: 0,
        lockedUntil: null,
        lastLoginAt: new Date(),
      },
    });
  }

  public async updatePassword(credentialId: string, passwordHash: string): Promise<void> {
    await prisma.tenantCredential.update({
      where: { id: credentialId },
      data: {
        passwordHash,
        failedLoginAttempts: 0,
        lockedUntil: null,
      },
    });
  }

  public async updateStatus(
    credentialId: string,
    status: TenantCredentialStatus,
  ): Promise<TenantCredential> {
    return prisma.tenantCredential.update({
      where: { id: credentialId },
      data: { status },
    });
  }
}

export const tenantCredentialRepository = new TenantCredentialRepository();
