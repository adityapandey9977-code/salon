import type { CachedCustomer } from '../../domain/entities/customer.dto';
export declare class CustomerReadStore {
    private static instance;
    static getInstance(): CustomerReadStore;
    getCustomerDetailKey(tenantId: string, customerId: string): string;
    getCustomerMobileKey(tenantId: string, normalizedMobile: string): string;
    getCustomerEmailKey(tenantId: string, normalizedEmail: string): string;
    getCustomerPreferencesKey(tenantId: string, customerId: string): string;
    getCustomer(tenantId: string, customerId: string): Promise<CachedCustomer | null>;
    setCustomer(tenantId: string, customer: CachedCustomer, ttlSeconds?: number): Promise<void>;
    invalidateCustomer(tenantId: string, customerId: string): Promise<void>;
}
export declare const customerReadStore: CustomerReadStore;
//# sourceMappingURL=customer-read.store.d.ts.map