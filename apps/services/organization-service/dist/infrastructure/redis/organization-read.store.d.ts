export declare class OrganizationReadStore {
    private static instance;
    static getInstance(): OrganizationReadStore;
    getTenantProfileKey(tenantId: string): string;
    getTenantProfile<T>(tenantId: string, fallback: () => Promise<T | null>, ttlSeconds?: number): Promise<T | null>;
    invalidateTenantProfile(tenantId: string): Promise<void>;
}
export declare const organizationReadStore: OrganizationReadStore;
//# sourceMappingURL=organization-read.store.d.ts.map