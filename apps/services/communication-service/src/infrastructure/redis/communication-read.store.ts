import { createLogger } from '@salon-spa-saas/logger';
import Redis from 'ioredis';
import { config } from '../../config';

const logger = createLogger('communication-read-store');

export class CommunicationReadStore {
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
        logger.warn({ err: err.message }, 'Redis communication store connection error');
      });

      return this.redis;
    } catch {
      return null;
    } finally {
      this.isConnecting = false;
    }
  }

  // Template Cache
  public async getTemplate(code: string, channel: string, language = 'en'): Promise<any | null> {
    const client = this.getClient();
    if (!client) return null;
    try {
      const cached = await client.get(`template:${code}:${channel}:${language}`);
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  }

  public async setTemplate(code: string, channel: string, language: string, data: any, ttlSeconds = 1800): Promise<void> {
    const client = this.getClient();
    if (!client) return;
    try {
      await client.setex(`template:${code}:${channel}:${language}`, ttlSeconds, JSON.stringify(data));
    } catch {}
  }

  public async invalidateTemplate(code: string, channel: string, language = 'en'): Promise<void> {
    const client = this.getClient();
    if (!client) return;
    try {
      await client.del(`template:${code}:${channel}:${language}`);
    } catch {}
  }

  // Deduplication Inbox
  public async checkAndMarkProcessed(eventId: string, ttlSeconds = 86400): Promise<boolean> {
    const client = this.getClient();
    if (!client) return true;
    try {
      const key = `comm:inbox:${eventId}`;
      const res = await client.set(key, '1', 'EX', ttlSeconds, 'NX');
      return res === 'OK';
    } catch {
      return true;
    }
  }
}

export const communicationReadStore = new CommunicationReadStore();
