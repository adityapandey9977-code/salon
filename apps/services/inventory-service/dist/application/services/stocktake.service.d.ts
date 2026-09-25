import { StocktakeRepository } from '../../infrastructure/repositories/stocktake.repository';
import { StockRepository } from '../../infrastructure/repositories/stock.repository';
import { MovementRepository } from '../../infrastructure/repositories/movement.repository';
import { SkuRepository } from '../../infrastructure/repositories/sku.repository';
import { InventoryReadStore } from '../../infrastructure/redis/inventory-read.store';
export declare class StocktakeService {
    private stocktakeRepo;
    private stockRepo;
    private movementRepo;
    private skuRepo;
    private cache;
    constructor(stocktakeRepo?: StocktakeRepository, stockRepo?: StockRepository, movementRepo?: MovementRepository, skuRepo?: SkuRepository, cache?: InventoryReadStore);
    listStocktakes(tenantId: string, branchId?: string): Promise<({
        items: ({
            sku: {
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
            };
        } & {
            tenantId: string;
            id: string;
            skuId: string;
            stocktakeId: string;
            expectedQuantity: import("../../infrastructure/prisma/generated-client/runtime/library").Decimal;
            countedQuantity: import("../../infrastructure/prisma/generated-client/runtime/library").Decimal;
            variance: import("../../infrastructure/prisma/generated-client/runtime/library").Decimal;
            adjustmentMovementId: string | null;
        })[];
    } & {
        tenantId: string;
        status: import("../../infrastructure/prisma/generated-client").$Enums.StocktakeStatus;
        id: string;
        createdAt: Date;
        branchId: string;
        createdByUserId: string | null;
        startedAt: Date;
        completedAt: Date | null;
        notes: string | null;
    })[]>;
    getStocktakeById(tenantId: string, id: string): Promise<{
        items: ({
            sku: {
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
            };
        } & {
            tenantId: string;
            id: string;
            skuId: string;
            stocktakeId: string;
            expectedQuantity: import("../../infrastructure/prisma/generated-client/runtime/library").Decimal;
            countedQuantity: import("../../infrastructure/prisma/generated-client/runtime/library").Decimal;
            variance: import("../../infrastructure/prisma/generated-client/runtime/library").Decimal;
            adjustmentMovementId: string | null;
        })[];
    } & {
        tenantId: string;
        status: import("../../infrastructure/prisma/generated-client").$Enums.StocktakeStatus;
        id: string;
        createdAt: Date;
        branchId: string;
        createdByUserId: string | null;
        startedAt: Date;
        completedAt: Date | null;
        notes: string | null;
    }>;
    createStocktake(tenantId: string, data: {
        branchId: string;
        createdByUserId?: string;
        notes?: string;
        items: Array<{
            skuId: string;
            expectedQuantity: number;
            countedQuantity: number;
        }>;
    }): Promise<{
        items: ({
            sku: {
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
            };
        } & {
            tenantId: string;
            id: string;
            skuId: string;
            stocktakeId: string;
            expectedQuantity: import("../../infrastructure/prisma/generated-client/runtime/library").Decimal;
            countedQuantity: import("../../infrastructure/prisma/generated-client/runtime/library").Decimal;
            variance: import("../../infrastructure/prisma/generated-client/runtime/library").Decimal;
            adjustmentMovementId: string | null;
        })[];
    } & {
        tenantId: string;
        status: import("../../infrastructure/prisma/generated-client").$Enums.StocktakeStatus;
        id: string;
        createdAt: Date;
        branchId: string;
        createdByUserId: string | null;
        startedAt: Date;
        completedAt: Date | null;
        notes: string | null;
    }>;
    completeAndAdjust(tenantId: string, id: string, actorUserId?: string): Promise<{
        items: ({
            sku: {
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
            };
        } & {
            tenantId: string;
            id: string;
            skuId: string;
            stocktakeId: string;
            expectedQuantity: import("../../infrastructure/prisma/generated-client/runtime/library").Decimal;
            countedQuantity: import("../../infrastructure/prisma/generated-client/runtime/library").Decimal;
            variance: import("../../infrastructure/prisma/generated-client/runtime/library").Decimal;
            adjustmentMovementId: string | null;
        })[];
    } & {
        tenantId: string;
        status: import("../../infrastructure/prisma/generated-client").$Enums.StocktakeStatus;
        id: string;
        createdAt: Date;
        branchId: string;
        createdByUserId: string | null;
        startedAt: Date;
        completedAt: Date | null;
        notes: string | null;
    }>;
}
//# sourceMappingURL=stocktake.service.d.ts.map