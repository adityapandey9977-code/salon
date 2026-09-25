import { createLogger } from '@salon-spa-saas/logger';
import { config } from '../../config';
import type { CachedServiceMaster } from '../../domain/entities/commerce.dto';
import { redisConnectionManager } from './redis-connection.manager';

const logger = createLogger('commerce-read-store');

export class CommerceReadStore {
  private static instance: CommerceReadStore;

  public static getInstance(): CommerceReadStore {
    if (!CommerceReadStore.instance) {
      CommerceReadStore.instance = new CommerceReadStore();
    }
    return CommerceReadStore.instance;
  }

  // Key Builders
  public getServiceDetailKey(tenantId: string, serviceId: string): string {
    return `tenant:${tenantId}:service:${serviceId}`;
  }

  public getServiceCatalogueKey(tenantId: string): string {
    return `tenant:${tenantId}:services:catalogue`;
  }

  public getBranchServicePriceKey(tenantId: string, branchId: string, serviceId: string): string {
    return `tenant:${tenantId}:branch:${branchId}:service:${serviceId}:price`;
  }

  public async getService(tenantId: string, serviceId: string): Promise<CachedServiceMaster | null> {
    const client = redisConnectionManager.getClient();
    if (!client || !redisConnectionManager.isReady()) return null;

    try {
      const data = await client.get(this.getServiceDetailKey(tenantId, serviceId));
      if (!data) return null;
      return JSON.parse(data) as CachedServiceMaster;
    } catch (err) {
      logger.warn({ err }, 'Failed to read service from Redis');
      return null;
    }
  }

  public async setService(
    tenantId: string,
    service: CachedServiceMaster,
    ttlSeconds = config.COMMERCE_CACHE_TTL,
  ): Promise<void> {
    const client = redisConnectionManager.getClient();
    if (!client || !redisConnectionManager.isReady()) return;

    try {
      const key = this.getServiceDetailKey(tenantId, service.id);
      await client.setex(key, ttlSeconds, JSON.stringify(service));
    } catch (err) {
      logger.warn({ err }, 'Failed to cache service in Redis');
    }
  }

  public async invalidateService(tenantId: string, serviceId: string): Promise<void> {
    const client = redisConnectionManager.getClient();
    if (!client || !redisConnectionManager.isReady()) return;

    try {
      const keys = [
        this.getServiceDetailKey(tenantId, serviceId),
        this.getServiceCatalogueKey(tenantId),
      ];
      await client.del(...keys);
    } catch (err) {
      logger.warn({ err }, 'Failed to invalidate service cache');
    }
  }
}

export const commerceReadStore = CommerceReadStore.getInstance();
