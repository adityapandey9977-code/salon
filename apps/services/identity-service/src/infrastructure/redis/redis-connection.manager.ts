import { createLogger } from '@salon-spa-saas/logger';
import Redis, { type RedisOptions } from 'ioredis';
import { config } from '../../config';

const logger = createLogger('identity-redis-manager');

export class RedisConnectionManager {
  private static instance: RedisConnectionManager;
  private client: Redis | null = null;
  private isConnected = false;
  private reconnectAttempts = 0;

  private constructor() {}

  public static getInstance(): RedisConnectionManager {
    if (!RedisConnectionManager.instance) {
      RedisConnectionManager.instance = new RedisConnectionManager();
    }
    return RedisConnectionManager.instance;
  }

  public getClient(): Redis {
    if (!this.client) {
      this.initClient();
    }
    return this.client!;
  }

  private initClient(): void {
    const options: RedisOptions = {
      connectTimeout: config.REDIS_CONNECT_TIMEOUT,
      commandTimeout: config.REDIS_COMMAND_TIMEOUT,
      maxRetriesPerRequest: config.REDIS_MAX_RETRIES,
      enableReadyCheck: true,
      lazyConnect: true,
      retryStrategy: (times: number) => {
        this.reconnectAttempts = times;
        if (times > config.REDIS_MAX_RETRIES) {
          logger.error(
            { times },
            'Redis connection retry limit reached. Falling back to DB-only mode.',
          );
          return null; // Stop retrying automatically, will fallback
        }
        const delay = Math.min(times * config.REDIS_RECONNECT_DELAY, 5000);
        logger.warn({ attempt: times, nextDelayMs: delay }, 'Reconnecting to Redis...');
        return delay;
      },
    };

    this.client = new Redis(config.REDIS_URL, options);

    this.client.on('connect', () => {
      logger.info('Redis client connected');
    });

    this.client.on('ready', () => {
      this.isConnected = true;
      this.reconnectAttempts = 0;
      logger.info('Redis client ready to receive commands');
    });

    this.client.on('error', (err) => {
      this.isConnected = false;
      logger.warn(
        { error: err.message },
        'Redis connection error. Safe read operations will fall back to PostgreSQL.',
      );
    });

    this.client.on('close', () => {
      this.isConnected = false;
      logger.warn('Redis connection closed');
    });

    this.client.on('end', () => {
      this.isConnected = false;
      logger.warn('Redis connection ended');
    });
  }

  public async connect(): Promise<void> {
    const client = this.getClient();
    if (client.status === 'wait') {
      try {
        await client.connect();
      } catch (err: any) {
        logger.warn(
          { error: err.message },
          'Initial Redis connection failed, running in resilient fallback mode',
        );
      }
    }
  }

  public async isHealthy(): Promise<boolean> {
    if (!this.client) return false;
    try {
      const pong = await this.client.ping();
      return pong === 'PONG';
    } catch {
      return false;
    }
  }

  public async disconnect(): Promise<void> {
    if (this.client) {
      try {
        await this.client.quit();
      } catch (err) {
        this.client.disconnect();
      }
      this.client = null;
      this.isConnected = false;
    }
  }
}

export const redisConnectionManager = RedisConnectionManager.getInstance();
export const redis = redisConnectionManager.getClient();
