import { createLogger } from '@salon-spa-saas/logger';
import { redis } from './client';

const logger = createLogger('organization-read-store');

export class OrganizationReadStore {
  private static instance: OrganizationReadStore;

  public static getInstance(): OrganizationReadStore {
    if (!OrganizationReadStore.instance) {
      OrganizationReadStore.instance = new OrganizationReadStore();
    }
    return OrganizationReadStore.instance;
  }

  public getTenantProfileKey(tenantId: string): string {
    return `organization:tenant:${tenantId}:profile`;
  }

  public async getTenantProfile<T>(
    tenantId: string,
    fallback: () => Promise<T | null>,
    ttlSeconds = 300,
  ): Promise<T | null> {
    const key = this.getTenantProfileKey(tenantId);
    try {
      const cached = await redis.get(key);
      if (cached) {
        logger.debug({ tenantId, key }, 'Redis Cache HIT: Organization Tenant Profile');
        return JSON.parse(cached) as T;
      }
    } catch (err: any) {
      logger.warn(
        { error: err.message, tenantId },
        'Redis read error in Organization Service, falling back to PostgreSQL',
      );
    }

    logger.debug({ tenantId, key }, 'Redis Cache MISS: Organization Tenant Profile');
    const dbData = await fallback();
    if (dbData) {
      try {
        await redis.set(key, JSON.stringify(dbData), 'EX', ttlSeconds);
      } catch (err: any) {
        logger.warn(
          { error: err.message, tenantId },
          'Redis write error while caching tenant profile',
        );
      }
    }
    return dbData;
  }

  public async invalidateTenantProfile(tenantId: string): Promise<void> {
    const key = this.getTenantProfileKey(tenantId);
    try {
      await redis.del(key);
      logger.debug({ tenantId, key }, 'Invalidated Organization Tenant Profile cache');
    } catch (err: any) {
      logger.warn({ error: err.message, tenantId }, 'Error invalidating tenant cache');
    }
  }
}

export const organizationReadStore = OrganizationReadStore.getInstance();
