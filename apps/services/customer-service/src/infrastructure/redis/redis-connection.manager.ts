import { createLogger } from '@salon-spa-saas/logger';
import Redis from 'ioredis';
import { config } from '../../config';

const logger = createLogger('customer-redis-manager');

export class RedisConnectionManager {
  private static instance: RedisConnectionManager;
  private client: Redis | null = null;
  private isConnected = false;

  private constructor() {
    this.init();
  }

  public static getInstance(): RedisConnectionManager {
    if (!RedisConnectionManager.instance) {
      RedisConnectionManager.instance = new RedisConnectionManager();
    }
    return RedisConnectionManager.instance;
  }

  private init(): void {
    if (config.NODE_ENV === 'test') {
      return;
    }

    try {
      this.client = new Redis(config.REDIS_URL, {
        maxRetriesPerRequest: 2,
        enableReadyCheck: true,
        reconnectOnError: () => true,
        retryStrategy: (times) => Math.min(times * 100, 3000),
        lazyConnect: true,
      });

      this.client.on('connect', () => {
        logger.info('Redis client connected');
        this.isConnected = true;
      });

      this.client.on('ready', () => {
        logger.info('Redis client ready to receive commands');
        this.isConnected = true;
      });

      this.client.on('error', (err) => {
        logger.warn({ err: err.message }, 'Redis connection error; fallback to DB active');
        this.isConnected = false;
      });

      this.client.on('close', () => {
        this.isConnected = false;
      });

      this.client.connect().catch((err) => {
        logger.warn({ err: err.message }, 'Initial Redis connection failed; will retry in background');
      });
    } catch (err) {
      logger.error({ err }, 'Failed to initialize Redis connection');
    }
  }

  public getClient(): Redis | null {
    return this.client;
  }

  public isReady(): boolean {
    return this.isConnected && this.client?.status === 'ready';
  }

  public async close(): Promise<void> {
    if (this.client) {
      await this.client.quit().catch(() => {});
      this.isConnected = false;
    }
  }
}

export const redisConnectionManager = RedisConnectionManager.getInstance();
