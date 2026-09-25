import { createLogger } from '@salon-spa-saas/logger';
import Redis from 'ioredis';
import { gatewayConfig } from '../config';
const logger = createLogger('gateway-redis');
export class GatewayRedisManager {
    static instance;
    client = null;
    isConnected = false;
    constructor() { }
    static getInstance() {
        if (!GatewayRedisManager.instance) {
            GatewayRedisManager.instance = new GatewayRedisManager();
        }
        return GatewayRedisManager.instance;
    }
    getClient() {
        if (!this.client) {
            this.client = new Redis(gatewayConfig.REDIS_URL, {
                lazyConnect: true,
                maxRetriesPerRequest: 3,
                enableReadyCheck: true,
                retryStrategy(times) {
                    if (times > 5)
                        return null;
                    return Math.min(times * 300, 3000);
                },
            });
            this.client.on('connect', () => {
                logger.info('Gateway Redis connected');
            });
            this.client.on('ready', () => {
                this.isConnected = true;
            });
            this.client.on('error', (err) => {
                this.isConnected = false;
                logger.warn({ error: err.message }, 'Gateway Redis connection error, rate limiting in fallback mode');
            });
        }
        return this.client;
    }
    async isHealthy() {
        if (!this.client)
            return false;
        try {
            const res = await this.client.ping();
            return res === 'PONG';
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
export const gatewayRedis = GatewayRedisManager.getInstance().getClient();
