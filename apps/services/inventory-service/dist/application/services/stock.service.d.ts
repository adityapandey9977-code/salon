import { StockRepository } from '../../infrastructure/repositories/stock.repository';
import { MovementRepository } from '../../infrastructure/repositories/movement.repository';
import { SkuRepository } from '../../infrastructure/repositories/sku.repository';
import { InventoryReadStore } from '../../infrastructure/redis/inventory-read.store';
export declare class StockService {
    private stockRepo;
    private movementRepo;
    private skuRepo;
    private cache;
    constructor(stockRepo?: StockRepository, movementRepo?: MovementRepository, skuRepo?: SkuRepository, cache?: InventoryReadStore);
    listStock(tenantId: string, branchId?: string): Promise<({
        sku: {
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
        };
    } & {
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
    })[]>;
    getBranchStock(tenantId: string, branchId: string, skuId: string): Promise<any>;
    getDashboardKpis(tenantId: string, branchId?: string): Promise<{
        totalValuation: number;
        totalItemsOnHand: number;
        totalSkus: number;
        lowStockCount: number;
        criticalStockCount: number;
    }>;
    getBranchAlerts(tenantId: string, branchId?: string): Promise<({
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
        updatedAt: Date;
        branchId: string;
        skuId: string;
        quantityOnHandProjection: import("../../infrastructure/prisma/generated-client/runtime/library").Decimal;
        quantityReservedProjection: import("../../infrastructure/prisma/generated-client/runtime/library").Decimal;
        quantityAvailableProjection: import("../../infrastructure/prisma/generated-client/runtime/library").Decimal;
        reorderLevel: number | null;
        reorderQuantity: number | null;
    })[]>;
    getCriticalAlerts(tenantId: string): Promise<({
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
        updatedAt: Date;
        branchId: string;
        skuId: string;
        quantityOnHandProjection: import("../../infrastructure/prisma/generated-client/runtime/library").Decimal;
        quantityReservedProjection: import("../../infrastructure/prisma/generated-client/runtime/library").Decimal;
        quantityAvailableProjection: import("../../infrastructure/prisma/generated-client/runtime/library").Decimal;
        reorderLevel: number | null;
        reorderQuantity: number | null;
    })[]>;
    adjustStock(tenantId: string, data: {
        branchId: string;
        skuId: string;
        batchId?: string;
        deltaQuantity: number;
        reason: string;
        actorPrincipalType?: string;
        actorUserId?: string;
    }): Promise<{
        movement: {
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
            batch: {
                tenantId: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                branchId: string;
                skuId: string;
                batchNumber: string;
                supplierId: string | null;
                manufacturedAt: Date | null;
                expiresAt: Date | null;
                receivedQuantity: import("../../infrastructure/prisma/generated-client/runtime/library").Decimal;
                remainingQuantityProjection: import("../../infrastructure/prisma/generated-client/runtime/library").Decimal;
                unitCost: import("../../infrastructure/prisma/generated-client/runtime/library").Decimal;
            } | null;
        } & {
            correlationId: string | null;
            tenantId: string;
            id: string;
            createdAt: Date;
            branchId: string;
            skuId: string;
            unitCost: import("../../infrastructure/prisma/generated-client/runtime/library").Decimal | null;
            batchId: string | null;
            movementType: import("../../infrastructure/prisma/generated-client").$Enums.StockMovementType;
            quantity: import("../../infrastructure/prisma/generated-client/runtime/library").Decimal;
            referenceType: string;
            referenceId: string | null;
            reason: string | null;
            occurredAt: Date;
            actorPrincipalType: string;
            actorUserId: string | null;
        };
        stock: {
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
            updatedAt: Date;
            branchId: string;
            skuId: string;
            quantityOnHandProjection: import("../../infrastructure/prisma/generated-client/runtime/library").Decimal;
            quantityReservedProjection: import("../../infrastructure/prisma/generated-client/runtime/library").Decimal;
            quantityAvailableProjection: import("../../infrastructure/prisma/generated-client/runtime/library").Decimal;
            reorderLevel: number | null;
            reorderQuantity: number | null;
        };
    }>;
}
//# sourceMappingURL=stock.service.d.ts.map