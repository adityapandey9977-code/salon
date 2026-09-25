import { describe, expect, it } from 'vitest';
import { normalizeEmail, normalizePhoneNumber } from '../../../src/domain/normalization/phone-email';

describe('Phone & Email Normalization Helpers', () => {
  it('should strip non-digits and normalize +91 prefixes', () => {
    expect(normalizePhoneNumber('+91 98765 43210')).toBe('9876543210');
    expect(normalizePhoneNumber('919876543210')).toBe('9876543210');
    expect(normalizePhoneNumber('09876543210')).toBe('9876543210');
    expect(normalizePhoneNumber('(987) 654-3210')).toBe('9876543210');
  });

  it('should trim and lowercase email addresses', () => {
    expect(normalizeEmail('  JOHN.DOE@Example.COM  ')).toBe('john.doe@example.com');
    expect(normalizeEmail(null)).toBeNull();
    expect(normalizeEmail('')).toBeNull();
  });
});
