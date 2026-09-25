import { createLogger } from '@salon-spa-saas/logger';
import { redis } from './client';
const logger = createLogger('organization-read-store');
export class OrganizationReadStore {
    static instance;
    static getInstance() {
        if (!OrganizationReadStore.instance) {
            OrganizationReadStore.instance = new OrganizationReadStore();
        }
        return OrganizationReadStore.instance;
    }
    getTenantProfileKey(tenantId) {
        return `organization:tenant:${tenantId}:profile`;
    }
    async getTenantProfile(tenantId, fallback, ttlSeconds = 300) {
        const key = this.getTenantProfileKey(tenantId);
        try {
            const cached = await redis.get(key);
            if (cached) {
                logger.debug({ tenantId, key }, 'Redis Cache HIT: Organization Tenant Profile');
                return JSON.parse(cached);
            }
        }
        catch (err) {
            logger.warn({ error: err.message, tenantId }, 'Redis read error in Organization Service, falling back to PostgreSQL');
        }
        logger.debug({ tenantId, key }, 'Redis Cache MISS: Organization Tenant Profile');
        const dbData = await fallback();
        if (dbData) {
            try {
                await redis.set(key, JSON.stringify(dbData), 'EX', ttlSeconds);
            }
            catch (err) {
                logger.warn({ error: err.message, tenantId }, 'Redis write error while caching tenant profile');
            }
        }
        return dbData;
    }
    async invalidateTenantProfile(tenantId) {
        const key = this.getTenantProfileKey(tenantId);
        try {
            await redis.del(key);
            logger.debug({ tenantId, key }, 'Invalidated Organization Tenant Profile cache');
        }
        catch (err) {
            logger.warn({ error: err.message, tenantId }, 'Error invalidating tenant cache');
        }
    }
}
export const organizationReadStore = OrganizationReadStore.getInstance();
