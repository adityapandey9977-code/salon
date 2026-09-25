import { redis } from './client';

export class IdempotencyStore {
  private readonly DEFAULT_TTL = 86400; // 24 hours

  private idempotencyKey(tenantId: string, key: string): string {
    return `tenant:${tenantId}:idempotency:${key}`;
  }

  public async getResult<T>(tenantId: string, key: string): Promise<T | null> {
    try {
      const data = await redis.get(this.idempotencyKey(tenantId, key));
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  public async saveResult<T>(
    tenantId: string,
    key: string,
    result: T,
    ttlSeconds = this.DEFAULT_TTL,
  ): Promise<void> {
    try {
      await redis.set(
        this.idempotencyKey(tenantId, key),
        JSON.stringify(result),
        'EX',
        ttlSeconds,
      );
    } catch {
      // Safe fallback
    }
  }
}

export const idempotencyStore = new IdempotencyStore();
