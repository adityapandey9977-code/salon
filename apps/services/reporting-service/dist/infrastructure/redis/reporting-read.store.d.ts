export declare class ReportingReadStore {
    private static readonly DEFAULT_TTL_SECONDS;
    static get<T>(key: string): Promise<T | null>;
    static set(key: string, value: unknown, ttlSeconds?: number): Promise<void>;
    static invalidateTenantDashboard(tenantId: string): Promise<void>;
    static invalidatePlatformDashboard(): Promise<void>;
}
//# sourceMappingURL=reporting-read.store.d.ts.map