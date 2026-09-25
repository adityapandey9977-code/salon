import { createLogger } from '@salon-spa-saas/logger';
import Redis from 'ioredis';
import { config } from '../../config';
const logger = createLogger('customer-redis-manager');
export class RedisConnectionManager {
    static instance;
    client = null;
    isConnected = false;
    constructor() {
        this.init();
    }
    static getInstance() {
        if (!RedisConnectionManager.instance) {
            RedisConnectionManager.instance = new RedisConnectionManager();
        }
        return RedisConnectionManager.instance;
    }
    init() {
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
        }
        catch (err) {
            logger.error({ err }, 'Failed to initialize Redis connection');
        }
    }
    getClient() {
        return this.client;
    }
    isReady() {
        return this.isConnected && this.client?.status === 'ready';
    }
    async close() {
        if (this.client) {
            await this.client.quit().catch(() => { });
            this.isConnected = false;
        }
    }
}
export const redisConnectionManager = RedisConnectionManager.getInstance();
