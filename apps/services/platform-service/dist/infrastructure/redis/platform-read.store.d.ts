export declare class PlatformReadStore {
    private redis;
    private isConnecting;
    private getClient;
    getPlan(planIdOrCode: string): Promise<any | null>;
    setPlan(planIdOrCode: string, data: any, ttlSeconds?: number): Promise<void>;
    invalidatePlan(planId: string, planCode?: string): Promise<void>;
    getEntitlements(tenantId: string): Promise<any | null>;
    setEntitlements(tenantId: string, data: any, ttlSeconds?: number): Promise<void>;
    invalidateEntitlements(tenantId: string): Promise<void>;
    getSubscription(tenantId: string): Promise<any | null>;
    setSubscription(tenantId: string, data: any, ttlSeconds?: number): Promise<void>;
    invalidateSubscription(tenantId: string): Promise<void>;
    getDomains(tenantId: string): Promise<any | null>;
    setDomains(tenantId: string, data: any, ttlSeconds?: number): Promise<void>;
    invalidateDomains(tenantId: string): Promise<void>;
    getDomainResolution(hostname: string): Promise<any | null>;
    setDomainResolution(hostname: string, data: any, ttlSeconds?: number): Promise<void>;
    invalidateDomainResolution(hostname: string): Promise<void>;
}
export declare const platformReadStore: PlatformReadStore;
//# sourceMappingURL=platform-read.store.d.ts.map