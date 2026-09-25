import { SkuRepository } from '../../infrastructure/repositories/sku.repository';
import { InventoryReadStore } from '../../infrastructure/redis/inventory-read.store';
export declare class SkuService {
    private skuRepo;
    private cache;
    constructor(skuRepo?: SkuRepository, cache?: InventoryReadStore);
    listSkus(tenantId: string, filter?: {
        categoryId?: string;
        isRetail?: boolean;
        isConsumable?: boolean;
        search?: string;
    }): Promise<({
        category: {
            tenantId: string;
            id: string;
            name: string;
            description: string | null;
            parentCategoryId: string | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        } | null;
        branchStocks: {
            tenantId: string;
            id: string;
            updatedAt: Date;
            branchId: string;
            skuId: string;
            quantityOnHandProjection: import("../../infrastructure/prisma/generated-client/runtime/library").Decimal;
            quantityReservedProjection: import("../../infrastructure/prisma/generated-client/runtime/library").Decimal;
            quantityAvailableProjection: import("../../infrastructure/prisma/generated-client/runtime/library").Decimal;
            reorderLevel: number | null;
            reorderQuantity: number | null;
        }[];
    } & {
        tenantId: string;
        id: string;
        name: string;
        description: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        skuCode: string;
        barcode: string | null;
        categoryId: string | null;
        unitOfMeasure: string;
        purchaseUnit: string | null;
        consumptionUnit: string | null;
        conversionFactor: import("../../infrastructure/prisma/generated-client/runtime/library").Decimal | null;
        costPrice: import("../../infrastructure/prisma/generated-client/runtime/library").Decimal;
        retailPrice: import("../../infrastructure/prisma/generated-client/runtime/library").Decimal | null;
        isConsumable: boolean;
        isRetail: boolean;
        trackBatch: boolean;
        trackExpiry: boolean;
        reorderEnabled: boolean;
        deletedAt: Date | null;
    })[]>;
    getSkuById(tenantId: string, id: string): Promise<any>;
    createSku(tenantId: string, data: {
        skuCode: string;
        barcode?: string;
        name: string;
        description?: string;
        categoryId?: string;
        unitOfMeasure?: string;
        purchaseUnit?: string;
        consumptionUnit?: string;
        conversionFactor?: number;
        costPrice?: number;
        retailPrice?: number;
        isConsumable?: boolean;
        isRetail?: boolean;
        trackBatch?: boolean;
        trackExpiry?: boolean;
        reorderEnabled?: boolean;
    }): Promise<{
        category: {
            tenantId: string;
            id: string;
            name: string;
            description: string | null;
            parentCategoryId: string | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        } | null;
    } & {
        tenantId: string;
        id: string;
        name: string;
        description: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        skuCode: string;
        barcode: string | null;
        categoryId: string | null;
        unitOfMeasure: string;
        purchaseUnit: string | null;
        consumptionUnit: string | null;
        conversionFactor: import("../../infrastructure/prisma/generated-client/runtime/library").Decimal | null;
        costPrice: import("../../infrastructure/prisma/generated-client/runtime/library").Decimal;
        retailPrice: import("../../infrastructure/prisma/generated-client/runtime/library").Decimal | null;
        isConsumable: boolean;
        isRetail: boolean;
        trackBatch: boolean;
        trackExpiry: boolean;
        reorderEnabled: boolean;
        deletedAt: Date | null;
    }>;
    updateSku(tenantId: string, id: string, data: any): Promise<{
        category: {
            tenantId: string;
            id: string;
            name: string;
            description: string | null;
            parentCategoryId: string | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        } | null;
    } & {
        tenantId: string;
        id: string;
        name: string;
        description: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        skuCode: string;
        barcode: string | null;
        categoryId: string | null;
        unitOfMeasure: string;
        purchaseUnit: string | null;
        consumptionUnit: string | null;
        conversionFactor: import("../../infrastructure/prisma/generated-client/runtime/library").Decimal | null;
        costPrice: import("../../infrastructure/prisma/generated-client/runtime/library").Decimal;
        retailPrice: import("../../infrastructure/prisma/generated-client/runtime/library").Decimal | null;
        isConsumable: boolean;
        isRetail: boolean;
        trackBatch: boolean;
        trackExpiry: boolean;
        reorderEnabled: boolean;
        deletedAt: Date | null;
    }>;
    deleteSku(tenantId: string, id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    listCategories(tenantId: string): Promise<{
        tenantId: string;
        id: string;
        name: string;
        description: string | null;
        parentCategoryId: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    createCategory(tenantId: string, data: {
        name: string;
        description?: string;
        parentCategoryId?: string;
    }): Promise<{
        tenantId: string;
        id: string;
        name: string;
        description: string | null;
        parentCategoryId: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
//# sourceMappingURL=sku.service.d.ts.map