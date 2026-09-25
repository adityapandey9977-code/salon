import { createLogger } from '@salon-spa-saas/logger';
import Redis from 'ioredis';
import { config } from '../../config';

const logger = createLogger('platform-read-store');

export class PlatformReadStore {
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
        logger.warn({ err: err.message }, 'Redis platform store connection error');
      });

      return this.redis;
    } catch {
      return null;
    } finally {
      this.isConnecting = false;
    }
  }

  public async getPlan(planIdOrCode: string): Promise<any | null> {
    const client = this.getClient();
    if (!client) return null;
    try {
      const cached = await client.get(`platform:plan:${planIdOrCode}`);
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  }

  public async setPlan(planIdOrCode: string, data: any, ttlSeconds = 3600): Promise<void> {
    const client = this.getClient();
    if (!client) return;
    try {
      await client.setex(`platform:plan:${planIdOrCode}`, ttlSeconds, JSON.stringify(data));
      if (data?.code) {
        await client.setex(`platform:plan:${data.code}`, ttlSeconds, JSON.stringify(data));
      }
    } catch {}
  }

  public async invalidatePlan(planId: string, planCode?: string): Promise<void> {
    const client = this.getClient();
    if (!client) return;
    try {
      const keys = [`platform:plan:${planId}`];
      if (planCode) keys.push(`platform:plan:${planCode}`);
      await client.del(...keys);
    } catch {}
  }

  public async getEntitlements(tenantId: string): Promise<any | null> {
    const client = this.getClient();
    if (!client) return null;
    try {
      const cached = await client.get(`tenant:${tenantId}:entitlements`);
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  }

  public async setEntitlements(tenantId: string, data: any, ttlSeconds = 300): Promise<void> {
    const client = this.getClient();
    if (!client) return;
    try {
      await client.setex(`tenant:${tenantId}:entitlements`, ttlSeconds, JSON.stringify(data));
    } catch {}
  }

  public async invalidateEntitlements(tenantId: string): Promise<void> {
    const client = this.getClient();
    if (!client) return;
    try {
      await client.del(`tenant:${tenantId}:entitlements`);
    } catch {}
  }

  public async getSubscription(tenantId: string): Promise<any | null> {
    const client = this.getClient();
    if (!client) return null;
    try {
      const cached = await client.get(`tenant:${tenantId}:subscription`);
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  }

  public async setSubscription(tenantId: string, data: any, ttlSeconds = 900): Promise<void> {
    const client = this.getClient();
    if (!client) return;
    try {
      await client.setex(`tenant:${tenantId}:subscription`, ttlSeconds, JSON.stringify(data));
    } catch {}
  }

  public async invalidateSubscription(tenantId: string): Promise<void> {
    const client = this.getClient();
    if (!client) return;
    try {
      await client.del(`tenant:${tenantId}:subscription`);
    } catch {}
  }

  public async getDomains(tenantId: string): Promise<any | null> {
    const client = this.getClient();
    if (!client) return null;
    try {
      const cached = await client.get(`tenant:${tenantId}:domains`);
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  }

  public async setDomains(tenantId: string, data: any, ttlSeconds = 1800): Promise<void> {
    const client = this.getClient();
    if (!client) return;
    try {
      await client.setex(`tenant:${tenantId}:domains`, ttlSeconds, JSON.stringify(data));
    } catch {}
  }

  public async invalidateDomains(tenantId: string): Promise<void> {
    const client = this.getClient();
    if (!client) return;
    try {
      await client.del(`tenant:${tenantId}:domains`);
    } catch {}
  }

  public async getDomainResolution(hostname: string): Promise<any | null> {
    const client = this.getClient();
    if (!client) return null;
    try {
      const cached = await client.get(`domain:${hostname}:tenant-resolution`);
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  }

  public async setDomainResolution(hostname: string, data: any, ttlSeconds = 3600): Promise<void> {
    const client = this.getClient();
    if (!client) return;
    try {
      await client.setex(`domain:${hostname}:tenant-resolution`, ttlSeconds, JSON.stringify(data));
    } catch {}
  }

  public async invalidateDomainResolution(hostname: string): Promise<void> {
    const client = this.getClient();
    if (!client) return;
    try {
      await client.del(`domain:${hostname}:tenant-resolution`);
    } catch {}
  }
}

export const platformReadStore = new PlatformReadStore();
