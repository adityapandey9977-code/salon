import { describe, expect, it } from 'vitest';
import { TokenService } from '../../src/infrastructure/security/token.service';

describe('TokenService', () => {
  it('should generate and verify USER access token with platform claims', () => {
    const userId = '11111111-1111-1111-1111-111111111111';
    const sessionId = '22222222-2222-2222-2222-222222222222';

    const token = TokenService.createUserAccessToken({
      userId,
      sessionId,
      role: 'SUPER_ADMIN',
      scopeType: 'PLATFORM',
      userType: 'PLATFORM',
    });
    expect(token).toBeDefined();

    const payload = TokenService.verifyAccessToken(token);
    expect(payload.sub).toBe(userId);
    expect(payload.sid).toBe(sessionId);
    expect(payload.principalType).toBe('USER');
    expect(payload.role).toBe('SUPER_ADMIN');
    expect(payload.scopeType).toBe('PLATFORM');
    expect(payload.jti).toBeDefined();
  });

  it('should generate and verify TENANT access token with tenant claims', () => {
    const credentialId = '33333333-3333-3333-3333-333333333333';
    const sessionId = '44444444-4444-4444-4444-444444444444';
    const tenantId = 'a0000000-0000-0000-0000-000000000001';

    const token = TokenService.createTenantAccessToken({
      tenantCredentialId: credentialId,
      sessionId,
      tenantId,
    });
    expect(token).toBeDefined();

    const payload = TokenService.verifyAccessToken(token);
    expect(payload.sub).toBe(credentialId);
    expect(payload.sid).toBe(sessionId);
    expect(payload.principalType).toBe('TENANT');
    expect(payload.tenantId).toBe(tenantId);
    expect(payload.role).toBe('TENANT_ADMIN');
    expect(payload.scopeType).toBe('TENANT');
    expect(payload.jti).toBeDefined();
  });

  it('should generate random refresh token and hash it reproducibly', () => {
    const { rawToken, tokenHash, expiresAt } = TokenService.generateRefreshToken();

    expect(rawToken).toHaveLength(80);
    expect(tokenHash).toBeDefined();
    expect(expiresAt.getTime()).toBeGreaterThan(Date.now());

    // Deterministic hash check
    const rehash = TokenService.hashToken(rawToken);
    expect(rehash).toBe(tokenHash);
  });
});

