import { TransferRepository } from '../../infrastructure/repositories/transfer.repository';
import { StockRepository } from '../../infrastructure/repositories/stock.repository';
import { MovementRepository } from '../../infrastructure/repositories/movement.repository';
import { SkuRepository } from '../../infrastructure/repositories/sku.repository';
import { InventoryReadStore } from '../../infrastructure/redis/inventory-read.store';
import { TransferStatus } from '../../infrastructure/prisma/generated-client';
export declare class TransferService {
    private transferRepo;
    private stockRepo;
    private movementRepo;
    private skuRepo;
    private cache;
    constructor(transferRepo?: TransferRepository, stockRepo?: StockRepository, movementRepo?: MovementRepository, skuRepo?: SkuRepository, cache?: InventoryReadStore);
    listTransfers(tenantId: string, filter?: {
        status?: TransferStatus;
        sourceBranchId?: string;
        destinationBranchId?: string;
    }): Promise<({
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
            receivedQuantity: import("../../infrastructure/prisma/generated-client/runtime/library").Decimal | null;
            transferId: string;
            requestedQuantity: import("../../infrastructure/prisma/generated-client/runtime/library").Decimal;
            dispatchedQuantity: import("../../infrastructure/prisma/generated-client/runtime/library").Decimal | null;
        })[];
    } & {
        tenantId: string;
        status: import("../../infrastructure/prisma/generated-client").$Enums.TransferStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        receivedAt: Date | null;
        transferNumber: string;
        sourceBranchId: string;
        destinationBranchId: string;
        requestedAt: Date;
        dispatchedAt: Date | null;
    })[]>;
    getTransferById(tenantId: string, id: string): Promise<{
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
            receivedQuantity: import("../../infrastructure/prisma/generated-client/runtime/library").Decimal | null;
            transferId: string;
            requestedQuantity: import("../../infrastructure/prisma/generated-client/runtime/library").Decimal;
            dispatchedQuantity: import("../../infrastructure/prisma/generated-client/runtime/library").Decimal | null;
        })[];
    } & {
        tenantId: string;
        status: import("../../infrastructure/prisma/generated-client").$Enums.TransferStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        receivedAt: Date | null;
        transferNumber: string;
        sourceBranchId: string;
        destinationBranchId: string;
        requestedAt: Date;
        dispatchedAt: Date | null;
    }>;
    createTransfer(tenantId: string, data: {
        sourceBranchId: string;
        destinationBranchId: string;
        items: Array<{
            skuId: string;
            requestedQuantity: number;
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
            receivedQuantity: import("../../infrastructure/prisma/generated-client/runtime/library").Decimal | null;
            transferId: string;
            requestedQuantity: import("../../infrastructure/prisma/generated-client/runtime/library").Decimal;
            dispatchedQuantity: import("../../infrastructure/prisma/generated-client/runtime/library").Decimal | null;
        })[];
    } & {
        tenantId: string;
        status: import("../../infrastructure/prisma/generated-client").$Enums.TransferStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        receivedAt: Date | null;
        transferNumber: string;
        sourceBranchId: string;
        destinationBranchId: string;
        requestedAt: Date;
        dispatchedAt: Date | null;
    }>;
    dispatchTransfer(tenantId: string, id: string, data?: {
        dispatchedQuantities?: Record<string, number>;
        actorUserId?: string;
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
            receivedQuantity: import("../../infrastructure/prisma/generated-client/runtime/library").Decimal | null;
            transferId: string;
            requestedQuantity: import("../../infrastructure/prisma/generated-client/runtime/library").Decimal;
            dispatchedQuantity: import("../../infrastructure/prisma/generated-client/runtime/library").Decimal | null;
        })[];
    } & {
        tenantId: string;
        status: import("../../infrastructure/prisma/generated-client").$Enums.TransferStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        receivedAt: Date | null;
        transferNumber: string;
        sourceBranchId: string;
        destinationBranchId: string;
        requestedAt: Date;
        dispatchedAt: Date | null;
    }>;
    receiveTransfer(tenantId: string, id: string, data?: {
        receivedQuantities?: Record<string, number>;
        actorUserId?: string;
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
            receivedQuantity: import("../../infrastructure/prisma/generated-client/runtime/library").Decimal | null;
            transferId: string;
            requestedQuantity: import("../../infrastructure/prisma/generated-client/runtime/library").Decimal;
            dispatchedQuantity: import("../../infrastructure/prisma/generated-client/runtime/library").Decimal | null;
        })[];
    } & {
        tenantId: string;
        status: import("../../infrastructure/prisma/generated-client").$Enums.TransferStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        receivedAt: Date | null;
        transferNumber: string;
        sourceBranchId: string;
        destinationBranchId: string;
        requestedAt: Date;
        dispatchedAt: Date | null;
    }>;
}
//# sourceMappingURL=transfer.service.d.ts.map