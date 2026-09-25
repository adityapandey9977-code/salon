import Redis from 'ioredis';
import { config } from '../../config';
export const redis = new Redis(config.REDIS_URL, {
    lazyConnect: true,
    maxRetriesPerRequest: 3,
    retryStrategy(times) {
        return Math.min(times * 100, 2000);
    },
});
export const SlotLockManager = {
    /**
     * Safe token-based distributed lock with TTL
     */
    async acquireLock(tenantId, branchId, resourceOrStaff, startAt, lockToken, ttlSeconds = 30) {
        try {
            const key = `tenant:${tenantId}:branch:${branchId}:booking-slot:${resourceOrStaff}:${startAt}`;
            const result = await redis.set(key, lockToken, 'EX', ttlSeconds, 'NX');
            return result === 'OK';
        }
        catch {
            // In case Redis is down, allow proceeding to database transaction lock/checks
            return true;
        }
    },
    /**
     * Release lock safely only if the token matches
     */
    async releaseLock(tenantId, branchId, resourceOrStaff, startAt, lockToken) {
        try {
            const key = `tenant:${tenantId}:branch:${branchId}:booking-slot:${resourceOrStaff}:${startAt}`;
            const luaScript = `
        if redis.call("get", KEYS[1]) == ARGV[1] then
          return redis.call("del", KEYS[1])
        else
          return 0
        end
      `;
            await redis.eval(luaScript, 1, key, lockToken);
        }
        catch {
            // Ignore lock release failures
        }
    },
};
