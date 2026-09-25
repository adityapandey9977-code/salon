import { createLogger } from '@salon-spa-saas/logger';
import Redis from 'ioredis';
import { config } from '../../config';
const logger = createLogger('finance-read-store');
export class FinanceReadStore {
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
                logger.warn({ err: err.message }, 'Redis finance store connection error');
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
    // Finance Overview Projections
    async getOverview(tenantId, period) {
        const client = this.getClient();
        if (!client)
            return null;
        try {
            const cached = await client.get(`tenant:${tenantId}:finance:overview:${period}`);
            return cached ? JSON.parse(cached) : null;
        }
        catch {
            return null;
        }
    }
    async setOverview(tenantId, period, data, ttlSeconds = 300) {
        const client = this.getClient();
        if (!client)
            return;
        try {
            await client.setex(`tenant:${tenantId}:finance:overview:${period}`, ttlSeconds, JSON.stringify(data));
        }
        catch { }
    }
    async invalidateOverview(tenantId) {
        const client = this.getClient();
        if (!client)
            return;
        try {
            const keys = await client.keys(`tenant:${tenantId}:finance:overview:*`);
            if (keys.length > 0) {
                await client.del(...keys);
            }
        }
        catch { }
    }
    // Commission Rules Cache
    async getCommissionRules(tenantId) {
        const client = this.getClient();
        if (!client)
            return null;
        try {
            const cached = await client.get(`tenant:${tenantId}:commission-rules`);
            return cached ? JSON.parse(cached) : null;
        }
        catch {
            return null;
        }
    }
    async setCommissionRules(tenantId, data, ttlSeconds = 1800) {
        const client = this.getClient();
        if (!client)
            return;
        try {
            await client.setex(`tenant:${tenantId}:commission-rules`, ttlSeconds, JSON.stringify(data));
        }
        catch { }
    }
    async invalidateCommissionRules(tenantId) {
        const client = this.getClient();
        if (!client)
            return;
        try {
            await client.del(`tenant:${tenantId}:commission-rules`);
        }
        catch { }
    }
    // Royalty Rules Cache
    async getRoyaltyRules(tenantId, franchiseId) {
        const client = this.getClient();
        if (!client)
            return null;
        try {
            const cached = await client.get(`tenant:${tenantId}:franchise:${franchiseId}:royalty-rules`);
            return cached ? JSON.parse(cached) : null;
        }
        catch {
            return null;
        }
    }
    async setRoyaltyRules(tenantId, franchiseId, data, ttlSeconds = 1800) {
        const client = this.getClient();
        if (!client)
            return;
        try {
            await client.setex(`tenant:${tenantId}:franchise:${franchiseId}:royalty-rules`, ttlSeconds, JSON.stringify(data));
        }
        catch { }
    }
    async invalidateRoyaltyRules(tenantId, franchiseId) {
        const client = this.getClient();
        if (!client)
            return;
        try {
            if (franchiseId) {
                await client.del(`tenant:${tenantId}:franchise:${franchiseId}:royalty-rules`);
            }
            else {
                const keys = await client.keys(`tenant:${tenantId}:franchise:*:royalty-rules`);
                if (keys.length > 0)
                    await client.del(...keys);
            }
        }
        catch { }
    }
    // Idempotency Inbox
    async checkAndMarkProcessed(eventId, ttlSeconds = 86400) {
        const client = this.getClient();
        if (!client)
            return true;
        try {
            const key = `finance:inbox:${eventId}`;
            const res = await client.set(key, '1', 'EX', ttlSeconds, 'NX');
            return res === 'OK';
        }
        catch {
            return true;
        }
    }
}
export const financeReadStore = new FinanceReadStore();
