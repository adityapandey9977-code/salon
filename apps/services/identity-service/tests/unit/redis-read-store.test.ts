import { describe, expect, it, vi } from 'vitest';
import type { CachedUserProfile } from '../../src/domain/entities/auth.dto';
import { IdentityReadStore } from '../../src/infrastructure/redis/identity-read.store';

describe('IdentityReadStore Redis-First Read Pattern', () => {
  const sampleUser: CachedUserProfile = {
    id: '11111111-1111-1111-1111-111111111111',
    userType: 'TENANT',
    fullName: 'Test Stylist',
    email: 'stylist@salon.com',
    mobilePhone: '+1234567890',
    status: 'ACTIVE',
    isMfaRequired: false,
    isMfaEnabled: false,
    lastLoginAt: null,
    createdAt: new Date().toISOString(),
  };

  it('should call DB fallback on cache miss and set Redis cache', async () => {
    const store = IdentityReadStore.getInstance();
    const mockDbFallback = vi.fn().mockResolvedValue(sampleUser);

    // Mock Redis get to return null (cache miss)
    const mockGet = vi.fn().mockResolvedValue(null);
    const mockSet = vi.fn().mockResolvedValue('OK');
    (store as any).redis.get = mockGet;
    (store as any).redis.set = mockSet;

    const result = await store.getUserProfile(sampleUser.id, mockDbFallback);

    expect(mockGet).toHaveBeenCalled();
    expect(mockDbFallback).toHaveBeenCalledTimes(1);
    expect(mockSet).toHaveBeenCalled();
    expect(result).toEqual(sampleUser);
  });

  it('should return cached data on cache hit without calling DB fallback', async () => {
    const store = IdentityReadStore.getInstance();
    const mockDbFallback = vi.fn().mockResolvedValue(sampleUser);

    // Mock Redis get to return JSON string (cache hit)
    const mockGet = vi.fn().mockResolvedValue(JSON.stringify(sampleUser));
    const mockSet = vi.fn();
    (store as any).redis.get = mockGet;
    (store as any).redis.set = mockSet;

    const result = await store.getUserProfile(sampleUser.id, mockDbFallback);

    expect(mockGet).toHaveBeenCalled();
    expect(mockDbFallback).not.toHaveBeenCalled();
    expect(result).toEqual(sampleUser);
  });

  it('should gracefully fall back to DB when Redis errors', async () => {
    const store = IdentityReadStore.getInstance();
    const mockDbFallback = vi.fn().mockResolvedValue(sampleUser);

    // Mock Redis get to throw error (Redis connection outage)
    const mockGet = vi.fn().mockRejectedValue(new Error('Connection lost'));
    (store as any).redis.get = mockGet;

    const result = await store.getUserProfile(sampleUser.id, mockDbFallback);

    expect(mockDbFallback).toHaveBeenCalledTimes(1);
    expect(result).toEqual(sampleUser);
  });
});
