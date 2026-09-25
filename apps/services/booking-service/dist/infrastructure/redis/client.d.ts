import Redis from 'ioredis';
export declare const redis: Redis;
export declare const SlotLockManager: {
    /**
     * Safe token-based distributed lock with TTL
     */
    acquireLock(tenantId: string, branchId: string, resourceOrStaff: string, startAt: string, lockToken: string, ttlSeconds?: number): Promise<boolean>;
    /**
     * Release lock safely only if the token matches
     */
    releaseLock(tenantId: string, branchId: string, resourceOrStaff: string, startAt: string, lockToken: string): Promise<void>;
};
//# sourceMappingURL=client.d.ts.map