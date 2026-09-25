import { createLogger } from '@salon-spa-saas/logger';
import { config } from '../../config';
import { redisConnectionManager } from './redis-connection.manager';
const logger = createLogger('commerce-read-store');
export class CommerceReadStore {
    static instance;
    static getInstance() {
        if (!CommerceReadStore.instance) {
            CommerceReadStore.instance = new CommerceReadStore();
        }
        return CommerceReadStore.instance;
    }
    // Key Builders
    getServiceDetailKey(tenantId, serviceId) {
        return `tenant:${tenantId}:service:${serviceId}`;
    }
    getServiceCatalogueKey(tenantId) {
        return `tenant:${tenantId}:services:catalogue`;
    }
    getBranchServicePriceKey(tenantId, branchId, serviceId) {
        return `tenant:${tenantId}:branch:${branchId}:service:${serviceId}:price`;
    }
    async getService(tenantId, serviceId) {
        const client = redisConnectionManager.getClient();
        if (!client || !redisConnectionManager.isReady())
            return null;
        try {
            const data = await client.get(this.getServiceDetailKey(tenantId, serviceId));
            if (!data)
                return null;
            return JSON.parse(data);
        }
        catch (err) {
            logger.warn({ err }, 'Failed to read service from Redis');
            return null;
        }
    }
    async setService(tenantId, service, ttlSeconds = config.COMMERCE_CACHE_TTL) {
        const client = redisConnectionManager.getClient();
        if (!client || !redisConnectionManager.isReady())
            return;
        try {
            const key = this.getServiceDetailKey(tenantId, service.id);
            await client.setex(key, ttlSeconds, JSON.stringify(service));
        }
        catch (err) {
            logger.warn({ err }, 'Failed to cache service in Redis');
        }
    }
    async invalidateService(tenantId, serviceId) {
        const client = redisConnectionManager.getClient();
        if (!client || !redisConnectionManager.isReady())
            return;
        try {
            const keys = [
                this.getServiceDetailKey(tenantId, serviceId),
                this.getServiceCatalogueKey(tenantId),
            ];
            await client.del(...keys);
        }
        catch (err) {
            logger.warn({ err }, 'Failed to invalidate service cache');
        }
    }
}
export const commerceReadStore = CommerceReadStore.getInstance();
