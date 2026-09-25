import { StockMovementType, Prisma } from '../prisma/generated-client';
export declare class MovementRepository {
    createMovement(data: {
        tenantId: string;
        branchId: string;
        skuId: string;
        batchId?: string;
        movementType: StockMovementType;
        quantity: number;
        unitCost?: number;
        referenceType: string;
        referenceId?: string;
        reason?: string;
        occurredAt?: Date;
        actorPrincipalType?: string;
        actorUserId?: string;
        correlationId?: string;
    }): Promise<{
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
            receivedQuantity: Prisma.Decimal;
            remainingQuantityProjection: Prisma.Decimal;
            unitCost: Prisma.Decimal;
        } | null;
    } & {
        correlationId: string | null;
        tenantId: string;
        id: string;
        createdAt: Date;
        branchId: string;
        skuId: string;
        unitCost: Prisma.Decimal | null;
        batchId: string | null;
        movementType: import("../prisma/generated-client").$Enums.StockMovementType;
        quantity: Prisma.Decimal;
        referenceType: string;
        referenceId: string | null;
        reason: string | null;
        occurredAt: Date;
        actorPrincipalType: string;
        actorUserId: string | null;
    }>;
    listMovements(tenantId: string, filter?: {
        branchId?: string;
        skuId?: string;
        movementType?: StockMovementType;
        referenceType?: string;
        referenceId?: string;
        from?: Date;
        to?: Date;
        skip?: number;
        take?: number;
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
                receivedQuantity: Prisma.Decimal;
                remainingQuantityProjection: Prisma.Decimal;
                unitCost: Prisma.Decimal;
            } | null;
        } & {
            correlationId: string | null;
            tenantId: string;
            id: string;
            createdAt: Date;
            branchId: string;
            skuId: string;
            unitCost: Prisma.Decimal | null;
            batchId: string | null;
            movementType: import("../prisma/generated-client").$Enums.StockMovementType;
            quantity: Prisma.Decimal;
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
//# sourceMappingURL=movement.repository.d.ts.map