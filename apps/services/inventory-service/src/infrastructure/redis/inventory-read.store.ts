import { createLogger } from '@salon-spa-saas/logger';
import Redis from 'ioredis';
import { config } from '../../config';

const logger = createLogger('inventory-read-store');

export class InventoryReadStore {
  private redis: Redis | null = null;
  private isConnecting = false;

  private getClient(): Redis | null {
    if (this.redis) return this.redis;
    if (this.isConnecting) return null;

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
    } catch {
      return null;
    } finally {
      this.isConnecting = false;
    }
  }

  // SKU Caching
  public async getSku(tenantId: string, skuId: string): Promise<any | null> {
    const client = this.getClient();
    if (!client) return null;
    try {
      const cached = await client.get(`tenant:${tenantId}:sku:${skuId}`);
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  }

  public async setSku(tenantId: string, skuId: string, data: any, ttlSeconds = 3600): Promise<void> {
    const client = this.getClient();
    if (!client) return;
    try {
      await client.setex(`tenant:${tenantId}:sku:${skuId}`, ttlSeconds, JSON.stringify(data));
    } catch {}
  }

  public async invalidateSku(tenantId: string, skuId: string): Promise<void> {
    const client = this.getClient();
    if (!client) return;
    try {
      await client.del(`tenant:${tenantId}:sku:${skuId}`);
    } catch {}
  }

  // Branch Stock Caching
  public async getBranchStock(tenantId: string, branchId: string, skuId: string): Promise<any | null> {
    const client = this.getClient();
    if (!client) return null;
    try {
      const cached = await client.get(`tenant:${tenantId}:branch:${branchId}:stock:${skuId}`);
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  }

  public async setBranchStock(
    tenantId: string,
    branchId: string,
    skuId: string,
    data: any,
    ttlSeconds = 300
  ): Promise<void> {
    const client = this.getClient();
    if (!client) return;
    try {
      await client.setex(`tenant:${tenantId}:branch:${branchId}:stock:${skuId}`, ttlSeconds, JSON.stringify(data));
    } catch {}
  }

  public async invalidateBranchStock(tenantId: string, branchId: string, skuId?: string): Promise<void> {
    const client = this.getClient();
    if (!client) return;
    try {
      if (skuId) {
        await client.del(`tenant:${tenantId}:branch:${branchId}:stock:${skuId}`);
      }
    } catch {}
  }

  // Supplier Caching
  public async getSupplier(tenantId: string, supplierId: string): Promise<any | null> {
    const client = this.getClient();
    if (!client) return null;
    try {
      const cached = await client.get(`tenant:${tenantId}:supplier:${supplierId}`);
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  }

  public async setSupplier(tenantId: string, supplierId: string, data: any, ttlSeconds = 1800): Promise<void> {
    const client = this.getClient();
    if (!client) return;
    try {
      await client.setex(`tenant:${tenantId}:supplier:${supplierId}`, ttlSeconds, JSON.stringify(data));
    } catch {}
  }

  public async invalidateSupplier(tenantId: string, supplierId: string): Promise<void> {
    const client = this.getClient();
    if (!client) return;
    try {
      await client.del(`tenant:${tenantId}:supplier:${supplierId}`);
    } catch {}
  }

  // Inbox / Deduplication
  public async checkAndMarkProcessed(eventId: string, ttlSeconds = 86400): Promise<boolean> {
    const client = this.getClient();
    if (!client) return true; // Fail-open if Redis unavailable
    try {
      const key = `inventory:inbox:${eventId}`;
      const res = await client.set(key, '1', 'EX', ttlSeconds, 'NX');
      return res === 'OK';
    } catch {
      return true;
    }
  }
}

export const inventoryReadStore = new InventoryReadStore();
