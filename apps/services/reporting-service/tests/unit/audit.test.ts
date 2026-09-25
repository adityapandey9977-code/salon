import { describe, expect, it } from 'vitest';
import { sanitizePayload } from '../../src/infrastructure/repositories/audit.repository';

describe('Audit Payload Sanitization', () => {
  it('should redact sensitive credentials and tokens in audit payload', () => {
    const rawPayload = {
      user: 'admin@salon.com',
      password: 'secret_password_123',
      token: 'jwt.bearer.token',
      accessToken: 'xyz123',
      refreshToken: 'refresh_tok',
      cvv: '123',
      cardNumber: '4111222233334444',
      mfaSecret: 'JBSWY3DPEHPK3PXP',
      nested: {
        pin: 1234,
        secret: 'super-secret',
        validField: 'allowed_value',
      },
      normalField: 'all_good',
    };

    const sanitized = sanitizePayload(rawPayload) as any;

    expect(sanitized.user).toBe('admin@salon.com');
    expect(sanitized.password).toBe('[REDACTED]');
    expect(sanitized.token).toBe('[REDACTED]');
    expect(sanitized.accessToken).toBe('[REDACTED]');
    expect(sanitized.refreshToken).toBe('[REDACTED]');
    expect(sanitized.cvv).toBe('[REDACTED]');
    expect(sanitized.cardNumber).toBe('[REDACTED]');
    expect(sanitized.mfaSecret).toBe('[REDACTED]');
    expect(sanitized.nested.secret).toBe('[REDACTED]');
    expect(sanitized.nested.validField).toBe('allowed_value');
    expect(sanitized.normalField).toBe('all_good');
  });
});
