import { describe, expect, it } from 'vitest';
import { customerReadStore } from '../../../src/infrastructure/redis/customer-read.store';

describe('CustomerReadStore Key Builder Tests', () => {
  const tenantId = '11111111-1111-1111-1111-111111111111';
  const customerId = '22222222-2222-2222-2222-222222222222';

  it('should generate properly scoped redis cache keys', () => {
    expect(customerReadStore.getCustomerDetailKey(tenantId, customerId)).toBe(
      `tenant:${tenantId}:customer:${customerId}`,
    );
    expect(customerReadStore.getCustomerMobileKey(tenantId, '9876543210')).toBe(
      `tenant:${tenantId}:customer:mobile:9876543210`,
    );
    expect(customerReadStore.getCustomerEmailKey(tenantId, 'test@example.com')).toBe(
      `tenant:${tenantId}:customer:email:test@example.com`,
    );
    expect(customerReadStore.getCustomerPreferencesKey(tenantId, customerId)).toBe(
      `tenant:${tenantId}:customer:${customerId}:preferences`,
    );
  });
});
