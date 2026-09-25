export declare class IdempotencyStore {
    private readonly DEFAULT_TTL;
    private idempotencyKey;
    getResult<T>(tenantId: string, key: string): Promise<T | null>;
    saveResult<T>(tenantId: string, key: string, result: T, ttlSeconds?: number): Promise<void>;
}
export declare const idempotencyStore: IdempotencyStore;
//# sourceMappingURL=idempotency.store.d.ts.map