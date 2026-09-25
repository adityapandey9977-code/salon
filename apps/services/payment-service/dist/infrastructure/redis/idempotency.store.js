import { redis } from './client';
export class IdempotencyStore {
    DEFAULT_TTL = 86400; // 24 hours
    idempotencyKey(tenantId, key) {
        return `tenant:${tenantId}:idempotency:${key}`;
    }
    async getResult(tenantId, key) {
        try {
            const data = await redis.get(this.idempotencyKey(tenantId, key));
            return data ? JSON.parse(data) : null;
        }
        catch {
            return null;
        }
    }
    async saveResult(tenantId, key, result, ttlSeconds = this.DEFAULT_TTL) {
        try {
            await redis.set(this.idempotencyKey(tenantId, key), JSON.stringify(result), 'EX', ttlSeconds);
        }
        catch {
            // Safe fallback
        }
    }
}
export const idempotencyStore = new IdempotencyStore();
