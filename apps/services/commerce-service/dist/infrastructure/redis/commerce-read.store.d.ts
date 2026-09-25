import type { CachedServiceMaster } from '../../domain/entities/commerce.dto';
export declare class CommerceReadStore {
    private static instance;
    static getInstance(): CommerceReadStore;
    getServiceDetailKey(tenantId: string, serviceId: string): string;
    getServiceCatalogueKey(tenantId: string): string;
    getBranchServicePriceKey(tenantId: string, branchId: string, serviceId: string): string;
    getService(tenantId: string, serviceId: string): Promise<CachedServiceMaster | null>;
    setService(tenantId: string, service: CachedServiceMaster, ttlSeconds?: number): Promise<void>;
    invalidateService(tenantId: string, serviceId: string): Promise<void>;
}
export declare const commerceReadStore: CommerceReadStore;
//# sourceMappingURL=commerce-read.store.d.ts.map