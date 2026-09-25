import { beforeEach, describe, expect, it, vi } from 'vitest';
import { peopleReadStore } from '../../../src/infrastructure/redis/people-read.store';
import { redis } from '../../../src/infrastructure/redis/redis-connection.manager';

describe('PeopleReadStore Redis Caching & Invalidation', () => {
  const tenantId = '11111111-1111-1111-1111-111111111111';
  const employeeId = '22222222-2222-2222-2222-222222222222';
  const branchId = '33333333-3333-3333-3333-333333333333';

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('should generate correct tenant-scoped Redis cache keys', () => {
    expect(peopleReadStore.getEmployeeDetailKey(tenantId, employeeId)).toBe(
      `tenant:${tenantId}:staff:${employeeId}`,
    );
    expect(peopleReadStore.getBranchTeamKey(tenantId, branchId)).toBe(
      `tenant:${tenantId}:branch:${branchId}:staff`,
    );
    expect(peopleReadStore.getEmployeeBranchesKey(tenantId, employeeId)).toBe(
      `tenant:${tenantId}:staff:${employeeId}:branches`,
    );
    expect(peopleReadStore.getEmployeeSkillsKey(tenantId, employeeId)).toBe(
      `tenant:${tenantId}:staff:${employeeId}:skills`,
    );
    expect(peopleReadStore.getBranchShiftsKey(tenantId, branchId)).toBe(
      `tenant:${tenantId}:branch:${branchId}:shifts`,
    );
    expect(peopleReadStore.getEmployeeRosterKey(tenantId, employeeId, '2026-09-04')).toBe(
      `tenant:${tenantId}:staff:${employeeId}:roster:2026-09-04`,
    );
  });

  it('should return cached data on cache HIT without invoking DB fallback', async () => {
    const mockCached = {
      id: employeeId,
      tenantId,
      employeeCode: 'EMP-001',
      displayName: 'Priya Sharma',
    };

    vi.spyOn(redis, 'get').mockResolvedValueOnce(JSON.stringify(mockCached));
    const fallback = vi.fn();

    const result = await peopleReadStore.getEmployeeDetail(tenantId, employeeId, fallback);

    expect(result).toEqual(mockCached);
    expect(fallback).not.toHaveBeenCalled();
  });

  it('should invoke fallback and populate Redis on cache MISS', async () => {
    vi.spyOn(redis, 'get').mockResolvedValueOnce(null);
    const setSpy = vi.spyOn(redis, 'set').mockResolvedValueOnce('OK');

    const dbResult: any = {
      id: employeeId,
      tenantId,
      employeeCode: 'EMP-001',
      displayName: 'Priya Sharma',
    };
    const fallback = vi.fn().mockResolvedValueOnce(dbResult);

    const result = await peopleReadStore.getEmployeeDetail(tenantId, employeeId, fallback);

    expect(result).toEqual(dbResult);
    expect(fallback).toHaveBeenCalledTimes(1);
    expect(setSpy).toHaveBeenCalledWith(
      `tenant:${tenantId}:staff:${employeeId}`,
      JSON.stringify(dbResult),
      'EX',
      3600,
    );
  });

  it('should fall back gracefully to DB when Redis errors', async () => {
    vi.spyOn(redis, 'get').mockRejectedValueOnce(new Error('Redis connection lost'));

    const dbResult: any = { id: employeeId, displayName: 'Priya' };
    const fallback = vi.fn().mockResolvedValueOnce(dbResult);

    const result = await peopleReadStore.getEmployeeDetail(tenantId, employeeId, fallback);

    expect(result).toEqual(dbResult);
    expect(fallback).toHaveBeenCalledTimes(1);
  });

  it('should delete relevant cache keys during employee invalidation', async () => {
    const delSpy = vi.spyOn(redis, 'del').mockResolvedValueOnce(2);

    await peopleReadStore.invalidateEmployee(tenantId, employeeId, branchId);

    expect(delSpy).toHaveBeenCalledWith(
      `tenant:${tenantId}:staff:${employeeId}`,
      `tenant:${tenantId}:branch:${branchId}:staff`,
    );
  });
});
