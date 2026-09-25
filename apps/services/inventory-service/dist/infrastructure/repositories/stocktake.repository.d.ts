import { Prisma } from '../prisma/generated-client';
export declare class StocktakeRepository {
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
                conversionFactor: Prisma.Decimal | null;
                costPrice: Prisma.Decimal;
                retailPrice: Prisma.Decimal | null;
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
            expectedQuantity: Prisma.Decimal;
            countedQuantity: Prisma.Decimal;
            variance: Prisma.Decimal;
            adjustmentMovementId: string | null;
        })[];
    } & {
        tenantId: string;
        status: import("../prisma/generated-client").$Enums.StocktakeStatus;
        id: string;
        createdAt: Date;
        branchId: string;
        createdByUserId: string | null;
        startedAt: Date;
        completedAt: Date | null;
        notes: string | null;
    })[]>;
    findById(tenantId: string, id: string): Promise<({
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
                conversionFactor: Prisma.Decimal | null;
                costPrice: Prisma.Decimal;
                retailPrice: Prisma.Decimal | null;
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
            expectedQuantity: Prisma.Decimal;
            countedQuantity: Prisma.Decimal;
            variance: Prisma.Decimal;
            adjustmentMovementId: string | null;
        })[];
    } & {
        tenantId: string;
        status: import("../prisma/generated-client").$Enums.StocktakeStatus;
        id: string;
        createdAt: Date;
        branchId: string;
        createdByUserId: string | null;
        startedAt: Date;
        completedAt: Date | null;
        notes: string | null;
    }) | null>;
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
                conversionFactor: Prisma.Decimal | null;
                costPrice: Prisma.Decimal;
                retailPrice: Prisma.Decimal | null;
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
            expectedQuantity: Prisma.Decimal;
            countedQuantity: Prisma.Decimal;
            variance: Prisma.Decimal;
            adjustmentMovementId: string | null;
        })[];
    } & {
        tenantId: string;
        status: import("../prisma/generated-client").$Enums.StocktakeStatus;
        id: string;
        createdAt: Date;
        branchId: string;
        createdByUserId: string | null;
        startedAt: Date;
        completedAt: Date | null;
        notes: string | null;
    }>;
    completeStocktake(id: string, adjustmentMovementIds?: Record<string, string>): Promise<{
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
                conversionFactor: Prisma.Decimal | null;
                costPrice: Prisma.Decimal;
                retailPrice: Prisma.Decimal | null;
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
            expectedQuantity: Prisma.Decimal;
            countedQuantity: Prisma.Decimal;
            variance: Prisma.Decimal;
            adjustmentMovementId: string | null;
        })[];
    } & {
        tenantId: string;
        status: import("../prisma/generated-client").$Enums.StocktakeStatus;
        id: string;
        createdAt: Date;
        branchId: string;
        createdByUserId: string | null;
        startedAt: Date;
        completedAt: Date | null;
        notes: string | null;
    }>;
}
//# sourceMappingURL=stocktake.repository.d.ts.map