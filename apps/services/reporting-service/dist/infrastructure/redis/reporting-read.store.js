import { redis } from './client';
import { config } from '../../config';
import { createLogger } from '@salon-spa-saas/logger';
const logger = createLogger('reporting-service:redis');
export class ReportingReadStore {
    static DEFAULT_TTL_SECONDS = 120; // 2 minutes short cache
    static async get(key) {
        if (config.NODE_ENV === 'test')
            return null;
        try {
            const data = await redis.get(key);
            if (!data)
                return null;
            return JSON.parse(data);
        }
        catch (err) {
            logger.warn({ error: err.message }, `Redis get failed for key: ${key}`);
            return null;
        }
    }
    static async set(key, value, ttlSeconds = this.DEFAULT_TTL_SECONDS) {
        if (config.NODE_ENV === 'test')
            return;
        try {
            await redis.set(key, JSON.stringify(value), 'EX', ttlSeconds);
        }
        catch (err) {
            logger.warn({ error: err.message }, `Redis set failed for key: ${key}`);
        }
    }
    static async invalidateTenantDashboard(tenantId) {
        if (config.NODE_ENV === 'test')
            return;
        try {
            const pattern = `tenant:${tenantId}:dashboard:*`;
            const keys = await redis.keys(pattern);
            if (keys.length > 0) {
                await redis.del(...keys);
            }
        }
        catch (err) {
            logger.warn({ error: err.message }, `Redis invalidate failed for tenant: ${tenantId}`);
        }
    }
    static async invalidatePlatformDashboard() {
        if (config.NODE_ENV === 'test')
            return;
        try {
            const keys = await redis.keys('platform:dashboard:*');
            if (keys.length > 0) {
                await redis.del(...keys);
            }
        }
        catch (err) {
            logger.warn({ error: err.message }, 'Redis invalidate platform dashboard failed');
        }
    }
}
