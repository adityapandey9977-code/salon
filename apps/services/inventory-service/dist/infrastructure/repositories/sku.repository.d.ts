import { Prisma } from '../prisma/generated-client';
export declare class SkuRepository {
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
            quantityOnHandProjection: Prisma.Decimal;
            quantityReservedProjection: Prisma.Decimal;
            quantityAvailableProjection: Prisma.Decimal;
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
        conversionFactor: Prisma.Decimal | null;
        costPrice: Prisma.Decimal;
        retailPrice: Prisma.Decimal | null;
        isConsumable: boolean;
        isRetail: boolean;
        trackBatch: boolean;
        trackExpiry: boolean;
        reorderEnabled: boolean;
        deletedAt: Date | null;
    })[]>;
    deleteSku(tenantId: string, id: string): Promise<Prisma.BatchPayload>;
    findById(tenantId: string, id: string): Promise<({
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
            quantityOnHandProjection: Prisma.Decimal;
            quantityReservedProjection: Prisma.Decimal;
            quantityAvailableProjection: Prisma.Decimal;
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
        conversionFactor: Prisma.Decimal | null;
        costPrice: Prisma.Decimal;
        retailPrice: Prisma.Decimal | null;
        isConsumable: boolean;
        isRetail: boolean;
        trackBatch: boolean;
        trackExpiry: boolean;
        reorderEnabled: boolean;
        deletedAt: Date | null;
    }) | null>;
    findByCode(tenantId: string, skuCode: string): Promise<({
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
        conversionFactor: Prisma.Decimal | null;
        costPrice: Prisma.Decimal;
        retailPrice: Prisma.Decimal | null;
        isConsumable: boolean;
        isRetail: boolean;
        trackBatch: boolean;
        trackExpiry: boolean;
        reorderEnabled: boolean;
        deletedAt: Date | null;
    }) | null>;
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
        conversionFactor: Prisma.Decimal | null;
        costPrice: Prisma.Decimal;
        retailPrice: Prisma.Decimal | null;
        isConsumable: boolean;
        isRetail: boolean;
        trackBatch: boolean;
        trackExpiry: boolean;
        reorderEnabled: boolean;
        deletedAt: Date | null;
    }>;
    updateSku(tenantId: string, id: string, data: {
        name?: string;
        description?: string;
        barcode?: string;
        categoryId?: string | null;
        unitOfMeasure?: string;
        purchaseUnit?: string | null;
        consumptionUnit?: string | null;
        conversionFactor?: number;
        costPrice?: number;
        retailPrice?: number | null;
        isConsumable?: boolean;
        isRetail?: boolean;
        trackBatch?: boolean;
        trackExpiry?: boolean;
        reorderEnabled?: boolean;
        isActive?: boolean;
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
        conversionFactor: Prisma.Decimal | null;
        costPrice: Prisma.Decimal;
        retailPrice: Prisma.Decimal | null;
        isConsumable: boolean;
        isRetail: boolean;
        trackBatch: boolean;
        trackExpiry: boolean;
        reorderEnabled: boolean;
        deletedAt: Date | null;
    }>;
}
//# sourceMappingURL=sku.repository.d.ts.map