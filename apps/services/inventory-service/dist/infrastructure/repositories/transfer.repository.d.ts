import { TransferStatus, Prisma } from '../prisma/generated-client';
export declare class TransferRepository {
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
            receivedQuantity: Prisma.Decimal | null;
            transferId: string;
            requestedQuantity: Prisma.Decimal;
            dispatchedQuantity: Prisma.Decimal | null;
        })[];
    } & {
        tenantId: string;
        status: import("../prisma/generated-client").$Enums.TransferStatus;
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
            receivedQuantity: Prisma.Decimal | null;
            transferId: string;
            requestedQuantity: Prisma.Decimal;
            dispatchedQuantity: Prisma.Decimal | null;
        })[];
    } & {
        tenantId: string;
        status: import("../prisma/generated-client").$Enums.TransferStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        receivedAt: Date | null;
        transferNumber: string;
        sourceBranchId: string;
        destinationBranchId: string;
        requestedAt: Date;
        dispatchedAt: Date | null;
    }) | null>;
    createTransfer(tenantId: string, data: {
        transferNumber: string;
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
            receivedQuantity: Prisma.Decimal | null;
            transferId: string;
            requestedQuantity: Prisma.Decimal;
            dispatchedQuantity: Prisma.Decimal | null;
        })[];
    } & {
        tenantId: string;
        status: import("../prisma/generated-client").$Enums.TransferStatus;
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
    dispatchTransfer(id: string, dispatchedQuantities?: Record<string, number>): Promise<{
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
            receivedQuantity: Prisma.Decimal | null;
            transferId: string;
            requestedQuantity: Prisma.Decimal;
            dispatchedQuantity: Prisma.Decimal | null;
        })[];
    } & {
        tenantId: string;
        status: import("../prisma/generated-client").$Enums.TransferStatus;
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
    receiveTransfer(id: string, receivedQuantities?: Record<string, number>): Promise<{
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
            receivedQuantity: Prisma.Decimal | null;
            transferId: string;
            requestedQuantity: Prisma.Decimal;
            dispatchedQuantity: Prisma.Decimal | null;
        })[];
    } & {
        tenantId: string;
        status: import("../prisma/generated-client").$Enums.TransferStatus;
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
//# sourceMappingURL=transfer.repository.d.ts.map