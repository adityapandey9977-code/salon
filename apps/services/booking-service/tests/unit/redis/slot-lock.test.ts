import { describe, expect, it, vi } from 'vitest';
import { SlotLockManager, redis } from '../../../src/infrastructure/redis/client';

describe('Slot Lock Manager Unit Tests', () => {
  it('should acquire lock successfully when slot is free', async () => {
    vi.spyOn(redis, 'set').mockResolvedValue('OK' as any);

    const acquired = await SlotLockManager.acquireLock(
      'tenant-1',
      'branch-1',
      'staff-1',
      '2026-10-15T10:00:00.000Z',
      'token-123',
    );

    expect(acquired).toBe(true);
  });

  it('should fail to acquire lock when slot is already locked', async () => {
    vi.spyOn(redis, 'set').mockResolvedValue(null as any);

    const acquired = await SlotLockManager.acquireLock(
      'tenant-1',
      'branch-1',
      'staff-1',
      '2026-10-15T10:00:00.000Z',
      'token-456',
    );

    expect(acquired).toBe(false);
  });
});
