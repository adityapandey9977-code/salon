import { describe, expect, it, vi } from 'vitest';
import { idempotencyStore } from '../../src/infrastructure/redis/idempotency.store';
import { redis } from '../../src/infrastructure/redis/client';

describe('Idempotency Store Unit Tests', () => {
  it('should return null when idempotency key is not found', async () => {
    vi.spyOn(redis, 'get').mockResolvedValue(null);

    const result = await idempotencyStore.getResult('tenant-1', 'idem-key-1');
    expect(result).toBeNull();
  });

  it('should return cached result when idempotency key is present', async () => {
    const mockData = { id: 'intent-123', amount: 500 };
    vi.spyOn(redis, 'get').mockResolvedValue(JSON.stringify(mockData));

    const result = await idempotencyStore.getResult('tenant-1', 'idem-key-1');
    expect(result).toEqual(mockData);
  });
});
