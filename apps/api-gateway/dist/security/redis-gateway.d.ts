import Redis from 'ioredis';
export declare class GatewayRedisManager {
    private static instance;
    private client;
    private isConnected;
    private constructor();
    static getInstance(): GatewayRedisManager;
    getClient(): Redis;
    isHealthy(): Promise<boolean>;
    disconnect(): Promise<void>;
}
export declare const gatewayRedis: Redis;
//# sourceMappingURL=redis-gateway.d.ts.map