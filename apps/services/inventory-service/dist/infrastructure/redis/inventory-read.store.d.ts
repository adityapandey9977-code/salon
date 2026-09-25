export declare class InventoryReadStore {
    private redis;
    private isConnecting;
    private getClient;
    getSku(tenantId: string, skuId: string): Promise<any | null>;
    setSku(tenantId: string, skuId: string, data: any, ttlSeconds?: number): Promise<void>;
    invalidateSku(tenantId: string, skuId: string): Promise<void>;
    getBranchStock(tenantId: string, branchId: string, skuId: string): Promise<any | null>;
    setBranchStock(tenantId: string, branchId: string, skuId: string, data: any, ttlSeconds?: number): Promise<void>;
    invalidateBranchStock(tenantId: string, branchId: string, skuId?: string): Promise<void>;
    getSupplier(tenantId: string, supplierId: string): Promise<any | null>;
    setSupplier(tenantId: string, supplierId: string, data: any, ttlSeconds?: number): Promise<void>;
    invalidateSupplier(tenantId: string, supplierId: string): Promise<void>;
    checkAndMarkProcessed(eventId: string, ttlSeconds?: number): Promise<boolean>;
}
export declare const inventoryReadStore: InventoryReadStore;
//# sourceMappingURL=inventory-read.store.d.ts.map