import { createLogger } from '@salon-spa-saas/logger';
import Redis from 'ioredis';
import { config } from '../../config';
const logger = createLogger('platform-read-store');
export class PlatformReadStore {
    redis = null;
    isConnecting = false;
    getClient() {
        if (this.redis)
            return this.redis;
        if (this.isConnecting)
            return null;
        try {
            this.isConnecting = true;
            this.redis = new Redis(config.REDIS_URL || 'redis://localhost:6379', {
                maxRetriesPerRequest: 1,
                enableOfflineQueue: false,
                retryStrategy: () => null,
            });
            this.redis.on('error', (err) => {
                logger.warn({ err: err.message }, 'Redis platform store connection error');
            });
            return this.redis;
        }
        catch {
            return null;
        }
        finally {
            this.isConnecting = false;
        }
    }
    async getPlan(planIdOrCode) {
        const client = this.getClient();
        if (!client)
            return null;
        try {
            const cached = await client.get(`platform:plan:${planIdOrCode}`);
            return cached ? JSON.parse(cached) : null;
        }
        catch {
            return null;
        }
    }
    async setPlan(planIdOrCode, data, ttlSeconds = 3600) {
        const client = this.getClient();
        if (!client)
            return;
        try {
            await client.setex(`platform:plan:${planIdOrCode}`, ttlSeconds, JSON.stringify(data));
            if (data?.code) {
                await client.setex(`platform:plan:${data.code}`, ttlSeconds, JSON.stringify(data));
            }
        }
        catch { }
    }
    async invalidatePlan(planId, planCode) {
        const client = this.getClient();
        if (!client)
            return;
        try {
            const keys = [`platform:plan:${planId}`];
            if (planCode)
                keys.push(`platform:plan:${planCode}`);
            await client.del(...keys);
        }
        catch { }
    }
    async getEntitlements(tenantId) {
        const client = this.getClient();
        if (!client)
            return null;
        try {
            const cached = await client.get(`tenant:${tenantId}:entitlements`);
            return cached ? JSON.parse(cached) : null;
        }
        catch {
            return null;
        }
    }
    async setEntitlements(tenantId, data, ttlSeconds = 300) {
        const client = this.getClient();
        if (!client)
            return;
        try {
            await client.setex(`tenant:${tenantId}:entitlements`, ttlSeconds, JSON.stringify(data));
        }
        catch { }
    }
    async invalidateEntitlements(tenantId) {
        const client = this.getClient();
        if (!client)
            return;
        try {
            await client.del(`tenant:${tenantId}:entitlements`);
        }
        catch { }
    }
    async getSubscription(tenantId) {
        const client = this.getClient();
        if (!client)
            return null;
        try {
            const cached = await client.get(`tenant:${tenantId}:subscription`);
            return cached ? JSON.parse(cached) : null;
        }
        catch {
            return null;
        }
    }
    async setSubscription(tenantId, data, ttlSeconds = 900) {
        const client = this.getClient();
        if (!client)
            return;
        try {
            await client.setex(`tenant:${tenantId}:subscription`, ttlSeconds, JSON.stringify(data));
        }
        catch { }
    }
    async invalidateSubscription(tenantId) {
        const client = this.getClient();
        if (!client)
            return;
        try {
            await client.del(`tenant:${tenantId}:subscription`);
        }
        catch { }
    }
    async getDomains(tenantId) {
        const client = this.getClient();
        if (!client)
            return null;
        try {
            const cached = await client.get(`tenant:${tenantId}:domains`);
            return cached ? JSON.parse(cached) : null;
        }
        catch {
            return null;
        }
    }
    async setDomains(tenantId, data, ttlSeconds = 1800) {
        const client = this.getClient();
        if (!client)
            return;
        try {
            await client.setex(`tenant:${tenantId}:domains`, ttlSeconds, JSON.stringify(data));
        }
        catch { }
    }
    async invalidateDomains(tenantId) {
        const client = this.getClient();
        if (!client)
            return;
        try {
            await client.del(`tenant:${tenantId}:domains`);
        }
        catch { }
    }
    async getDomainResolution(hostname) {
        const client = this.getClient();
        if (!client)
            return null;
        try {
            const cached = await client.get(`domain:${hostname}:tenant-resolution`);
            return cached ? JSON.parse(cached) : null;
        }
        catch {
            return null;
        }
    }
    async setDomainResolution(hostname, data, ttlSeconds = 3600) {
        const client = this.getClient();
        if (!client)
            return;
        try {
            await client.setex(`domain:${hostname}:tenant-resolution`, ttlSeconds, JSON.stringify(data));
        }
        catch { }
    }
    async invalidateDomainResolution(hostname) {
        const client = this.getClient();
        if (!client)
            return;
        try {
            await client.del(`domain:${hostname}:tenant-resolution`);
        }
        catch { }
    }
}
export const platformReadStore = new PlatformReadStore();
