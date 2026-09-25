import { describe, expect, it } from 'vitest';
import { scopeService } from '../../src/application/services/scope.service';

describe('ScopeService Validation Rules', () => {
  it('should reject BRANCH scope without branchId', async () => {
    await expect(
      scopeService.createScope({
        userId: '11111111-1111-1111-1111-111111111111',
        scopeType: 'BRANCH',
        tenantId: '22222222-2222-2222-2222-222222222222',
        branchId: null,
      }),
    ).rejects.toThrow('BRANCH scope requires both tenantId and branchId');
  });

  it('should reject FRANCHISE scope without franchiseId', async () => {
    await expect(
      scopeService.createScope({
        userId: '11111111-1111-1111-1111-111111111111',
        scopeType: 'FRANCHISE',
        tenantId: '22222222-2222-2222-2222-222222222222',
        franchiseId: null,
      }),
    ).rejects.toThrow('FRANCHISE scope requires both tenantId and franchiseId');
  });

  it('should reject TENANT scope without tenantId', async () => {
    await expect(
      scopeService.createScope({
        userId: '11111111-1111-1111-1111-111111111111',
        scopeType: 'TENANT',
        tenantId: null,
      }),
    ).rejects.toThrow('TENANT scope requires tenantId');
  });

  it('should reject PLATFORM scope with tenantId', async () => {
    await expect(
      scopeService.createScope({
        userId: '11111111-1111-1111-1111-111111111111',
        scopeType: 'PLATFORM',
        tenantId: '22222222-2222-2222-2222-222222222222',
      }),
    ).rejects.toThrow('PLATFORM scope must not include tenantId');
  });
});
