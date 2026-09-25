import { beforeEach, describe, expect, it, vi } from 'vitest';
import { tenantAuthService } from '../../src/application/services/tenant-auth.service';
import { sessionRepository } from '../../src/infrastructure/repositories/session.repository';
import { tenantCredentialRepository } from '../../src/infrastructure/repositories/tenant-credential.repository';
import { authRepository } from '../../src/infrastructure/repositories/auth.repository';
import { identityReadStore } from '../../src/infrastructure/redis/identity-read.store';
import { PasswordService } from '../../src/infrastructure/security/password.service';

describe('TenantAuthService Unit Tests', () => {
  beforeEach(() => {
    vi.spyOn(authRepository, 'recordLoginAttempt').mockResolvedValue(undefined as any);
    vi.spyOn(identityReadStore, 'getTenantAuthProfile').mockImplementation(async (_tenantId, fallback) => fallback());
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        success: true,
        data: {
          id: 'a0000000-0000-0000-0000-000000000001',
          status: 'ACTIVE',
          salonName: 'Glamour Salon',
          code: 'GLAMOUR-01',
        },
      }),
    }));
  });
  const mockTenantCredential = {
    id: 'credential-uuid-1',
    tenantId: 'a0000000-0000-0000-0000-000000000001',
    loginEmail: 'owner@glamour-salon.com',
    normalizedEmail: 'owner@glamour-salon.com',
    mobilePhone: '+91 9888800000',
    passwordHash: '$2a$10$hashedpassword',
    status: 'ACTIVE' as const,
    isMfaRequired: false,
    isMfaEnabled: false,
    failedLoginAttempts: 0,
    lockedUntil: null,
    lastLoginAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  it('should authenticate tenant direct login successfully without requiring a User row', async () => {
    vi.spyOn(tenantCredentialRepository, 'findByNormalizedEmail').mockResolvedValue(
      mockTenantCredential,
    );
    vi.spyOn(PasswordService, 'verify').mockResolvedValue(true);
    vi.spyOn(tenantCredentialRepository, 'handleSuccessfulLogin').mockResolvedValue(
      undefined,
    );
    vi.spyOn(sessionRepository, 'createSession').mockResolvedValue({
      session: {
        id: 'session-uuid-1',
        principalType: 'TENANT',
        userId: null,
        tenantCredentialId: mockTenantCredential.id,
        tokenFamily: 'family-1',
        status: 'ACTIVE',
        ipAddress: '127.0.0.1',
        userAgent: 'test-agent',
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        createdAt: new Date(),
        revokedAt: null,
      },
      tokenFamily: 'family-1',
    });
    vi.spyOn(sessionRepository, 'saveRefreshToken').mockResolvedValue({} as any);

    const result = await tenantAuthService.login({
      email: 'owner@glamour-salon.com',
      password: 'ValidPassword123!',
    });

    expect(result.requiresMfa).toBe(false);
    expect(result.accessToken).toBeDefined();
    expect(result.refreshToken).toBeDefined();
    expect(result.principal).toBeDefined();
    expect(result.principal?.type).toBe('TENANT');
    expect(result.principal?.tenantId).toBe(mockTenantCredential.tenantId);
    expect(result.principal?.role).toBe('TENANT_ADMIN');
    expect(result.principal?.scopeType).toBe('TENANT');
    expect(result.principal?.permissions).toContain('branch.manage');
    expect(result.principal?.permissions).toContain('staff.manage');
  });

  it('should reject login if password does not match', async () => {
    vi.spyOn(tenantCredentialRepository, 'findByNormalizedEmail').mockResolvedValue(
      mockTenantCredential,
    );
    vi.spyOn(PasswordService, 'verify').mockResolvedValue(false);
    vi.spyOn(tenantCredentialRepository, 'handleFailedLogin').mockResolvedValue({
      isLocked: false,
      attempts: 1,
    });

    await expect(
      tenantAuthService.login({
        email: 'owner@glamour-salon.com',
        password: 'WrongPassword!',
      }),
    ).rejects.toThrow('Invalid email or password');
  });

  it('should reject login if tenant credential is suspended', async () => {
    vi.spyOn(tenantCredentialRepository, 'findByNormalizedEmail').mockResolvedValue({
      ...mockTenantCredential,
      status: 'SUSPENDED',
    });

    await expect(
      tenantAuthService.login({
        email: 'owner@glamour-salon.com',
        password: 'ValidPassword123!',
      }),
    ).rejects.toThrow('suspended or disabled');
  });
});
