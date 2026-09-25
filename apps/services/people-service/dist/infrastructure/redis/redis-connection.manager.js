import { createLogger } from '@salon-spa-saas/logger';
import Redis from 'ioredis';
import { config } from '../../config';
const logger = createLogger('people-redis-manager');
export class RedisConnectionManager {
    static instance;
    client = null;
    isConnected = false;
    reconnectAttempts = 0;
    constructor() { }
    static getInstance() {
        if (!RedisConnectionManager.instance) {
            RedisConnectionManager.instance = new RedisConnectionManager();
        }
        return RedisConnectionManager.instance;
    }
    getClient() {
        if (!this.client) {
            this.initClient();
        }
        return this.client;
    }
    initClient() {
        const isTest = config.NODE_ENV === 'test' || process.env.NODE_ENV === 'test';
        const options = {
            connectTimeout: isTest ? 1000 : config.REDIS_CONNECT_TIMEOUT,
            commandTimeout: isTest ? 1000 : config.REDIS_COMMAND_TIMEOUT,
            maxRetriesPerRequest: isTest ? 1 : config.REDIS_MAX_RETRIES,
            enableOfflineQueue: !isTest,
            enableReadyCheck: true,
            lazyConnect: true,
            retryStrategy: isTest
                ? () => null
                : (times) => {
                    this.reconnectAttempts = times;
                    if (times > config.REDIS_MAX_RETRIES) {
                        logger.error({ times }, 'Redis connection retry limit reached. Falling back to DB-only mode.');
                        return null;
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
            logger.warn({ error: err.message }, 'Redis connection error. Safe read operations will fall back to PostgreSQL.');
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
    async connect() {
        const client = this.getClient();
        if (client.status === 'wait') {
            try {
                await client.connect();
            }
            catch (err) {
                logger.warn({ error: err.message }, 'Initial Redis connection failed, running in resilient fallback mode');
            }
        }
    }
    async isHealthy() {
        if (!this.client)
            return false;
        try {
            const pong = await this.client.ping();
            return pong === 'PONG';
        }
        catch {
            return false;
        }
    }
    async disconnect() {
        if (this.client) {
            try {
                await this.client.quit();
            }
            catch {
                this.client.disconnect();
            }
            this.client = null;
            this.isConnected = false;
        }
    }
}
export const redisConnectionManager = RedisConnectionManager.getInstance();
export const redis = redisConnectionManager.getClient();
