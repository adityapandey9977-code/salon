import { describe, expect, it } from 'vitest';
import { PasswordService } from '../../src/infrastructure/security/password.service';

describe('PasswordService', () => {
  it('should hash a password and verify correctly', async () => {
    const rawPassword = 'SecurePassword123!';
    const hash = await PasswordService.hash(rawPassword);

    expect(hash).toBeDefined();
    expect(hash).not.toEqual(rawPassword);

    const isValid = await PasswordService.verify(rawPassword, hash);
    expect(isValid).toBe(true);

    const isInvalid = await PasswordService.verify('WrongPassword', hash);
    expect(isInvalid).toBe(false);
  });
});
