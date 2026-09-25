export declare class FinanceReadStore {
    private redis;
    private isConnecting;
    private getClient;
    getOverview(tenantId: string, period: string): Promise<any | null>;
    setOverview(tenantId: string, period: string, data: any, ttlSeconds?: number): Promise<void>;
    invalidateOverview(tenantId: string): Promise<void>;
    getCommissionRules(tenantId: string): Promise<any | null>;
    setCommissionRules(tenantId: string, data: any, ttlSeconds?: number): Promise<void>;
    invalidateCommissionRules(tenantId: string): Promise<void>;
    getRoyaltyRules(tenantId: string, franchiseId: string): Promise<any | null>;
    setRoyaltyRules(tenantId: string, franchiseId: string, data: any, ttlSeconds?: number): Promise<void>;
    invalidateRoyaltyRules(tenantId: string, franchiseId?: string): Promise<void>;
    checkAndMarkProcessed(eventId: string, ttlSeconds?: number): Promise<boolean>;
}
export declare const financeReadStore: FinanceReadStore;
//# sourceMappingURL=finance-read.store.d.ts.map