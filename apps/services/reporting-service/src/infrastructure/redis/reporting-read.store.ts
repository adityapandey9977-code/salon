import { redis } from './client';
import { config } from '../../config';
import { createLogger } from '@salon-spa-saas/logger';

const logger = createLogger('reporting-service:redis');

export class ReportingReadStore {
  private static readonly DEFAULT_TTL_SECONDS = 120; // 2 minutes short cache

  public static async get<T>(key: string): Promise<T | null> {
    if (config.NODE_ENV === 'test') return null;
    try {
      const data = await redis.get(key);
      if (!data) return null;
      return JSON.parse(data) as T;
    } catch (err) {
      logger.warn({ error: (err as Error).message }, `Redis get failed for key: ${key}`);
      return null;
    }
  }

  public static async set(key: string, value: unknown, ttlSeconds = this.DEFAULT_TTL_SECONDS): Promise<void> {
    if (config.NODE_ENV === 'test') return;
    try {
      await redis.set(key, JSON.stringify(value), 'EX', ttlSeconds);
    } catch (err) {
      logger.warn({ error: (err as Error).message }, `Redis set failed for key: ${key}`);
    }
  }

  public static async invalidateTenantDashboard(tenantId: string): Promise<void> {
    if (config.NODE_ENV === 'test') return;
    try {
      const pattern = `tenant:${tenantId}:dashboard:*`;
      const keys = await redis.keys(pattern);
      if (keys.length > 0) {
        await redis.del(...keys);
      }
    } catch (err) {
      logger.warn({ error: (err as Error).message }, `Redis invalidate failed for tenant: ${tenantId}`);
    }
  }

  public static async invalidatePlatformDashboard(): Promise<void> {
    if (config.NODE_ENV === 'test') return;
    try {
      const keys = await redis.keys('platform:dashboard:*');
      if (keys.length > 0) {
        await redis.del(...keys);
      }
    } catch (err) {
      logger.warn({ error: (err as Error).message }, 'Redis invalidate platform dashboard failed');
    }
  }
}
