import Redis from 'ioredis';
export declare class RedisConnectionManager {
    private static instance;
    private client;
    private isConnected;
    private constructor();
    static getInstance(): RedisConnectionManager;
    private init;
    getClient(): Redis | null;
    isReady(): boolean;
    close(): Promise<void>;
}
export declare const redisConnectionManager: RedisConnectionManager;
//# sourceMappingURL=redis-connection.manager.d.ts.map