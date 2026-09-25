import { describe, expect, it } from 'vitest';
import { commerceReadStore } from '../../../src/infrastructure/redis/commerce-read.store';

describe('CommerceReadStore Key Builders', () => {
  const tenantId = '11111111-1111-1111-1111-111111111111';
  const serviceId = '22222222-2222-2222-2222-222222222222';
  const branchId = '33333333-3333-3333-3333-333333333333';

  it('should generate properly scoped service redis cache keys', () => {
    expect(commerceReadStore.getServiceDetailKey(tenantId, serviceId)).toBe(
      `tenant:${tenantId}:service:${serviceId}`,
    );
    expect(commerceReadStore.getServiceCatalogueKey(tenantId)).toBe(
      `tenant:${tenantId}:services:catalogue`,
    );
    expect(commerceReadStore.getBranchServicePriceKey(tenantId, branchId, serviceId)).toBe(
      `tenant:${tenantId}:branch:${branchId}:service:${serviceId}:price`,
    );
  });
});
