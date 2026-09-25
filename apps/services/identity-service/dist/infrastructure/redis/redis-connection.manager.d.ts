import Redis from 'ioredis';
export declare class RedisConnectionManager {
    private static instance;
    private client;
    private isConnected;
    private reconnectAttempts;
    private constructor();
    static getInstance(): RedisConnectionManager;
    getClient(): Redis;
    private initClient;
    connect(): Promise<void>;
    isHealthy(): Promise<boolean>;
    disconnect(): Promise<void>;
}
export declare const redisConnectionManager: RedisConnectionManager;
export declare const redis: Redis;
//# sourceMappingURL=redis-connection.manager.d.ts.map