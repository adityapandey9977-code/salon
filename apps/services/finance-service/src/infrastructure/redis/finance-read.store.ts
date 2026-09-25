import { createLogger } from '@salon-spa-saas/logger';
import Redis from 'ioredis';
import { config } from '../../config';

const logger = createLogger('finance-read-store');

export class FinanceReadStore {
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
        logger.warn({ err: err.message }, 'Redis finance store connection error');
      });

      return this.redis;
    } catch {
      return null;
    } finally {
      this.isConnecting = false;
    }
  }

  // Finance Overview Projections
  public async getOverview(tenantId: string, period: string): Promise<any | null> {
    const client = this.getClient();
    if (!client) return null;
    try {
      const cached = await client.get(`tenant:${tenantId}:finance:overview:${period}`);
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  }

  public async setOverview(tenantId: string, period: string, data: any, ttlSeconds = 300): Promise<void> {
    const client = this.getClient();
    if (!client) return;
    try {
      await client.setex(`tenant:${tenantId}:finance:overview:${period}`, ttlSeconds, JSON.stringify(data));
    } catch {}
  }

  public async invalidateOverview(tenantId: string): Promise<void> {
    const client = this.getClient();
    if (!client) return;
    try {
      const keys = await client.keys(`tenant:${tenantId}:finance:overview:*`);
      if (keys.length > 0) {
        await client.del(...keys);
      }
    } catch {}
  }

  // Commission Rules Cache
  public async getCommissionRules(tenantId: string): Promise<any | null> {
    const client = this.getClient();
    if (!client) return null;
    try {
      const cached = await client.get(`tenant:${tenantId}:commission-rules`);
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  }

  public async setCommissionRules(tenantId: string, data: any, ttlSeconds = 1800): Promise<void> {
    const client = this.getClient();
    if (!client) return;
    try {
      await client.setex(`tenant:${tenantId}:commission-rules`, ttlSeconds, JSON.stringify(data));
    } catch {}
  }

  public async invalidateCommissionRules(tenantId: string): Promise<void> {
    const client = this.getClient();
    if (!client) return;
    try {
      await client.del(`tenant:${tenantId}:commission-rules`);
    } catch {}
  }

  // Royalty Rules Cache
  public async getRoyaltyRules(tenantId: string, franchiseId: string): Promise<any | null> {
    const client = this.getClient();
    if (!client) return null;
    try {
      const cached = await client.get(`tenant:${tenantId}:franchise:${franchiseId}:royalty-rules`);
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  }

  public async setRoyaltyRules(tenantId: string, franchiseId: string, data: any, ttlSeconds = 1800): Promise<void> {
    const client = this.getClient();
    if (!client) return;
    try {
      await client.setex(`tenant:${tenantId}:franchise:${franchiseId}:royalty-rules`, ttlSeconds, JSON.stringify(data));
    } catch {}
  }

  public async invalidateRoyaltyRules(tenantId: string, franchiseId?: string): Promise<void> {
    const client = this.getClient();
    if (!client) return;
    try {
      if (franchiseId) {
        await client.del(`tenant:${tenantId}:franchise:${franchiseId}:royalty-rules`);
      } else {
        const keys = await client.keys(`tenant:${tenantId}:franchise:*:royalty-rules`);
        if (keys.length > 0) await client.del(...keys);
      }
    } catch {}
  }

  // Idempotency Inbox
  public async checkAndMarkProcessed(eventId: string, ttlSeconds = 86400): Promise<boolean> {
    const client = this.getClient();
    if (!client) return true;
    try {
      const key = `finance:inbox:${eventId}`;
      const res = await client.set(key, '1', 'EX', ttlSeconds, 'NX');
      return res === 'OK';
    } catch {
      return true;
    }
  }
}

export const financeReadStore = new FinanceReadStore();
