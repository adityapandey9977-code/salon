import { StockRepository } from '../../infrastructure/repositories/stock.repository';
import { MovementRepository } from '../../infrastructure/repositories/movement.repository';
import { SkuRepository } from '../../infrastructure/repositories/sku.repository';
import { InventoryReadStore } from '../../infrastructure/redis/inventory-read.store';
export declare class ConsumptionService {
    private stockRepo;
    private movementRepo;
    private skuRepo;
    private cache;
    constructor(stockRepo?: StockRepository, movementRepo?: MovementRepository, skuRepo?: SkuRepository, cache?: InventoryReadStore);
    /**
     * Consume inventory for service recipe (BOM) when a salon service is completed.
     * Idempotent by eventId + appointmentId/serviceId.
     */
    handleServiceCompleted(event: {
        eventId: string;
        tenantId: string;
        branchId: string;
        payload: {
            appointmentId?: string;
            serviceId?: string;
            serviceName?: string;
            recipeItems?: Array<{
                skuId: string;
                quantity: number;
            }>;
            actorUserId?: string;
            correlationId?: string;
        };
    }): Promise<void>;
    /**
     * Consume inventory for retail product sale when POS sale is completed.
     * Idempotent by eventId + invoiceId/itemId.
     */
    handleSaleCompleted(event: {
        eventId: string;
        tenantId: string;
        branchId: string;
        payload: {
            invoiceId?: string;
            items?: Array<{
                type: 'SERVICE' | 'PRODUCT' | 'PACKAGE';
                skuId?: string;
                productId?: string;
                quantity: number;
                unitPrice?: number;
            }>;
            actorUserId?: string;
            correlationId?: string;
        };
    }): Promise<void>;
    listConsumptionHistory(tenantId: string, filter?: {
        branchId?: string;
        skuId?: string;
        from?: Date;
        to?: Date;
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
        })[];
        total: number;
    }>;
}
//# sourceMappingURL=consumption.service.d.ts.map