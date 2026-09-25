import { createLogger } from '@salon-spa-saas/logger';
import Redis from 'ioredis';
import { config } from '../../config';
const logger = createLogger('inventory-read-store');
export class InventoryReadStore {
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
                logger.warn({ err: err.message }, 'Redis inventory store connection error');
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
    // SKU Caching
    async getSku(tenantId, skuId) {
        const client = this.getClient();
        if (!client)
            return null;
        try {
            const cached = await client.get(`tenant:${tenantId}:sku:${skuId}`);
            return cached ? JSON.parse(cached) : null;
        }
        catch {
            return null;
        }
    }
    async setSku(tenantId, skuId, data, ttlSeconds = 3600) {
        const client = this.getClient();
        if (!client)
            return;
        try {
            await client.setex(`tenant:${tenantId}:sku:${skuId}`, ttlSeconds, JSON.stringify(data));
        }
        catch { }
    }
    async invalidateSku(tenantId, skuId) {
        const client = this.getClient();
        if (!client)
            return;
        try {
            await client.del(`tenant:${tenantId}:sku:${skuId}`);
        }
        catch { }
    }
    // Branch Stock Caching
    async getBranchStock(tenantId, branchId, skuId) {
        const client = this.getClient();
        if (!client)
            return null;
        try {
            const cached = await client.get(`tenant:${tenantId}:branch:${branchId}:stock:${skuId}`);
            return cached ? JSON.parse(cached) : null;
        }
        catch {
            return null;
        }
    }
    async setBranchStock(tenantId, branchId, skuId, data, ttlSeconds = 300) {
        const client = this.getClient();
        if (!client)
            return;
        try {
            await client.setex(`tenant:${tenantId}:branch:${branchId}:stock:${skuId}`, ttlSeconds, JSON.stringify(data));
        }
        catch { }
    }
    async invalidateBranchStock(tenantId, branchId, skuId) {
        const client = this.getClient();
        if (!client)
            return;
        try {
            if (skuId) {
                await client.del(`tenant:${tenantId}:branch:${branchId}:stock:${skuId}`);
            }
        }
        catch { }
    }
    // Supplier Caching
    async getSupplier(tenantId, supplierId) {
        const client = this.getClient();
        if (!client)
            return null;
        try {
            const cached = await client.get(`tenant:${tenantId}:supplier:${supplierId}`);
            return cached ? JSON.parse(cached) : null;
        }
        catch {
            return null;
        }
    }
    async setSupplier(tenantId, supplierId, data, ttlSeconds = 1800) {
        const client = this.getClient();
        if (!client)
            return;
        try {
            await client.setex(`tenant:${tenantId}:supplier:${supplierId}`, ttlSeconds, JSON.stringify(data));
        }
        catch { }
    }
    async invalidateSupplier(tenantId, supplierId) {
        const client = this.getClient();
        if (!client)
            return;
        try {
            await client.del(`tenant:${tenantId}:supplier:${supplierId}`);
        }
        catch { }
    }
    // Inbox / Deduplication
    async checkAndMarkProcessed(eventId, ttlSeconds = 86400) {
        const client = this.getClient();
        if (!client)
            return true; // Fail-open if Redis unavailable
        try {
            const key = `inventory:inbox:${eventId}`;
            const res = await client.set(key, '1', 'EX', ttlSeconds, 'NX');
            return res === 'OK';
        }
        catch {
            return true;
        }
    }
}
export const inventoryReadStore = new InventoryReadStore();
