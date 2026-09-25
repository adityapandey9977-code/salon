import { createLogger } from '@salon-spa-saas/logger';
import { config } from '../../config';
import type { CachedCustomer } from '../../domain/entities/customer.dto';
import { redisConnectionManager } from './redis-connection.manager';

const logger = createLogger('customer-read-store');

export class CustomerReadStore {
  private static instance: CustomerReadStore;

  public static getInstance(): CustomerReadStore {
    if (!CustomerReadStore.instance) {
      CustomerReadStore.instance = new CustomerReadStore();
    }
    return CustomerReadStore.instance;
  }

  // Key Builders
  public getCustomerDetailKey(tenantId: string, customerId: string): string {
    return `tenant:${tenantId}:customer:${customerId}`;
  }

  public getCustomerMobileKey(tenantId: string, normalizedMobile: string): string {
    return `tenant:${tenantId}:customer:mobile:${normalizedMobile}`;
  }

  public getCustomerEmailKey(tenantId: string, normalizedEmail: string): string {
    return `tenant:${tenantId}:customer:email:${normalizedEmail}`;
  }

  public getCustomerPreferencesKey(tenantId: string, customerId: string): string {
    return `tenant:${tenantId}:customer:${customerId}:preferences`;
  }

  public async getCustomer(tenantId: string, customerId: string): Promise<CachedCustomer | null> {
    const client = redisConnectionManager.getClient();
    if (!client || !redisConnectionManager.isReady()) return null;

    try {
      const data = await client.get(this.getCustomerDetailKey(tenantId, customerId));
      if (!data) return null;
      return JSON.parse(data) as CachedCustomer;
    } catch (err) {
      logger.warn({ err }, 'Failed to read customer from Redis');
      return null;
    }
  }

  public async setCustomer(
    tenantId: string,
    customer: CachedCustomer,
    ttlSeconds = config.CUSTOMER_CACHE_TTL,
  ): Promise<void> {
    const client = redisConnectionManager.getClient();
    if (!client || !redisConnectionManager.isReady()) return;

    try {
      const key = this.getCustomerDetailKey(tenantId, customer.id);
      await client.setex(key, ttlSeconds, JSON.stringify(customer));
    } catch (err) {
      logger.warn({ err }, 'Failed to cache customer in Redis');
    }
  }

  public async invalidateCustomer(tenantId: string, customerId: string): Promise<void> {
    const client = redisConnectionManager.getClient();
    if (!client || !redisConnectionManager.isReady()) return;

    try {
      const keys = [
        this.getCustomerDetailKey(tenantId, customerId),
        this.getCustomerPreferencesKey(tenantId, customerId),
      ];
      await client.del(...keys);
    } catch (err) {
      logger.warn({ err }, 'Failed to invalidate customer cache');
    }
  }
}

export const customerReadStore = CustomerReadStore.getInstance();
