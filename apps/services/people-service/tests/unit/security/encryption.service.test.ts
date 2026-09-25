import { describe, expect, it } from 'vitest';
import { EncryptionService } from '../../../src/infrastructure/security/encryption.service';

describe('EncryptionService for Sensitive Statutory Data', () => {
  it('should encrypt and decrypt a sensitive Aadhaar number correctly', () => {
    const rawAadhaar = '1234-5678-9012';
    const encrypted = EncryptionService.encrypt(rawAadhaar);

    expect(encrypted).not.toBeNull();
    expect(encrypted).not.toBe(rawAadhaar);
    expect(encrypted).toContain(':');

    const decrypted = EncryptionService.decrypt(encrypted);
    expect(decrypted).toBe(rawAadhaar);
  });

  it('should encrypt and decrypt bank account details', () => {
    const rawBank = '98765432109876';
    const encrypted = EncryptionService.encrypt(rawBank);
    const decrypted = EncryptionService.decrypt(encrypted);

    expect(decrypted).toBe(rawBank);
  });

  it('should handle null or undefined gracefully', () => {
    expect(EncryptionService.encrypt(null)).toBeNull();
    expect(EncryptionService.encrypt(undefined)).toBeNull();
    expect(EncryptionService.decrypt(null)).toBeNull();
    expect(EncryptionService.decrypt(undefined)).toBeNull();
  });

  it('should return null when decrypting corrupted ciphertext', () => {
    expect(EncryptionService.decrypt('invalid:corrupted:hex')).toBeNull();
  });
});
