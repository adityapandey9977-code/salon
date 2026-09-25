import { beforeEach, describe, expect, it, vi } from 'vitest';
import { authService } from '../../src/application/services/auth.service';
import { tenantAuthService } from '../../src/application/services/tenant-auth.service';
import { identityReadStore } from '../../src/infrastructure/redis/identity-read.store';
import { roleRepository } from '../../src/infrastructure/repositories/role.repository';
import { sessionRepository } from '../../src/infrastructure/repositories/session.repository';
import { tenantCredentialRepository } from '../../src/infrastructure/repositories/tenant-credential.repository';
import { userRepository } from '../../src/infrastructure/repositories/user.repository';
import { TokenService } from '../../src/infrastructure/security/token.service';

describe('Polymorphic Refresh Token Service Tests', () => {
  const mockTenantCredential = {
    id: 'cred-tenant-uuid-1',
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

  const mockUser = {
    id: 'user-uuid-1',
    email: 'admin@glamour-salon.com',
    fullName: 'Brand Administrator',
    userType: 'TENANT' as const,
    status: 'ACTIVE' as const,
    isMfaEnabled: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('should successfully refresh token for TENANT principal via authService.refreshToken', async () => {
    const rawRefreshToken = 'sample_tenant_refresh_token_1234567890';
    const tokenHash = TokenService.hashToken(rawRefreshToken);

    vi.spyOn(sessionRepository, 'findRefreshToken').mockResolvedValue({
      id: 'token-row-1',
      sessionId: 'session-tenant-1',
      tokenHash,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      isUsed: false,
      isRevoked: false,
      createdAt: new Date(),
      session: {
        id: 'session-tenant-1',
        principalType: 'TENANT',
        userId: null,
        tenantCredentialId: mockTenantCredential.id,
        tokenFamily: 'family-tenant-1',
        status: 'ACTIVE',
        ipAddress: '127.0.0.1',
        userAgent: 'test-agent',
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        createdAt: new Date(),
        revokedAt: null,
      },
    });

    vi.spyOn(sessionRepository, 'rotateRefreshToken').mockResolvedValue({} as any);
    vi.spyOn(tenantCredentialRepository, 'findById').mockResolvedValue(mockTenantCredential);

    const result = await authService.refreshToken(rawRefreshToken);

    expect(result.accessToken).toBeDefined();
    expect(result.refreshToken).toBeDefined();
    expect(result.expiresIn).toBe(900);

    const decoded = TokenService.verifyAccessToken(result.accessToken);
    expect(decoded.sub).toBe(mockTenantCredential.id);
    expect(decoded.principalType).toBe('TENANT');
    expect(decoded.tenantId).toBe(mockTenantCredential.tenantId);
    expect(decoded.role).toBe('TENANT_ADMIN');
  });

  it('should successfully refresh token for USER principal via authService.refreshToken', async () => {
    const rawRefreshToken = 'sample_user_refresh_token_1234567890';
    const tokenHash = TokenService.hashToken(rawRefreshToken);

    vi.spyOn(sessionRepository, 'findRefreshToken').mockResolvedValue({
      id: 'token-row-2',
      sessionId: 'session-user-1',
      tokenHash,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      isUsed: false,
      isRevoked: false,
      createdAt: new Date(),
      session: {
        id: 'session-user-1',
        principalType: 'USER',
        userId: mockUser.id,
        tenantCredentialId: null,
        tokenFamily: 'family-user-1',
        status: 'ACTIVE',
        ipAddress: '127.0.0.1',
        userAgent: 'test-agent',
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        createdAt: new Date(),
        revokedAt: null,
      },
    });

    vi.spyOn(sessionRepository, 'rotateRefreshToken').mockResolvedValue({} as any);
    vi.spyOn(userRepository, 'findRawById').mockResolvedValue(mockUser as any);
    vi.spyOn(identityReadStore, 'getEffectiveAccess').mockResolvedValue({
      userId: mockUser.id,
      roles: ['BRANCH_MANAGER'],
      permissions: ['appointment.read', 'appointment.create'],
      tenantId: 'a0000000-0000-0000-0000-000000000001',
      franchiseId: null,
      branchIds: ['b0000000-0000-0000-0000-000000000001'],
      scopeType: 'BRANCH',
    });

    const result = await authService.refreshToken(rawRefreshToken);

    expect(result.accessToken).toBeDefined();
    expect(result.refreshToken).toBeDefined();

    const decoded = TokenService.verifyAccessToken(result.accessToken);
    expect(decoded.sub).toBe(mockUser.id);
    expect(decoded.principalType).toBe('USER');
    expect(decoded.role).toBe('BRANCH_MANAGER');
    expect(decoded.tenantId).toBe('a0000000-0000-0000-0000-000000000001');
  });

  it('should delegate tenantAuthService.refreshToken directly to authService.refreshToken', async () => {
    const rawRefreshToken = 'sample_delegation_token_12345';
    const spy = vi.spyOn(authService, 'refreshToken').mockResolvedValue({
      accessToken: 'mock_access_token',
      refreshToken: 'mock_refresh_token',
      expiresIn: 900,
    });

    const result = await tenantAuthService.refreshToken(rawRefreshToken);

    expect(spy).toHaveBeenCalledWith(rawRefreshToken);
    expect(result.accessToken).toBe('mock_access_token');
  });

  it('should detect token reuse and revoke token family', async () => {
    const rawRefreshToken = 'reused_token_12345';
    const tokenHash = TokenService.hashToken(rawRefreshToken);

    vi.spyOn(sessionRepository, 'findRefreshToken').mockResolvedValue({
      id: 'token-row-3',
      sessionId: 'session-tenant-1',
      tokenHash,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      isUsed: true, // ALREADY USED
      isRevoked: false,
      createdAt: new Date(),
      session: {
        id: 'session-tenant-1',
        principalType: 'TENANT',
        userId: null,
        tenantCredentialId: mockTenantCredential.id,
        tokenFamily: 'family-tenant-1',
        status: 'ACTIVE',
        ipAddress: '127.0.0.1',
        userAgent: 'test-agent',
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        createdAt: new Date(),
        revokedAt: null,
      },
    });

    const revokeSpy = vi.spyOn(sessionRepository, 'revokeTokenFamily').mockResolvedValue(undefined);
    const invalidateSpy = vi
      .spyOn(identityReadStore, 'invalidateAllTenantSessions')
      .mockResolvedValue(undefined);

    await expect(authService.refreshToken(rawRefreshToken)).rejects.toThrow(
      'security breach detected',
    );

    expect(revokeSpy).toHaveBeenCalledWith('family-tenant-1');
    expect(invalidateSpy).toHaveBeenCalledWith(mockTenantCredential.id);
  });
});
