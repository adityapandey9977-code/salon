import { prisma } from '../prisma/client';
import { Prisma } from '../prisma/generated-client';
export class SkuRepository {
    // Categories
    async listCategories(tenantId) {
        return prisma.inventoryCategory.findMany({
            where: { tenantId, isActive: true },
            orderBy: { name: 'asc' },
        });
    }
    async createCategory(tenantId, data) {
        return prisma.inventoryCategory.create({
            data: {
                tenantId,
                name: data.name,
                description: data.description,
                parentCategoryId: data.parentCategoryId,
            },
        });
    }
    // SKUs
    async listSkus(tenantId, filter) {
        const where = {
            tenantId,
            deletedAt: null,
        };
        if (filter?.categoryId)
            where.categoryId = filter.categoryId;
        if (filter?.isRetail !== undefined)
            where.isRetail = filter.isRetail;
        if (filter?.isConsumable !== undefined)
            where.isConsumable = filter.isConsumable;
        if (filter?.search) {
            where.OR = [
                { name: { contains: filter.search, mode: 'insensitive' } },
                { skuCode: { contains: filter.search, mode: 'insensitive' } },
                { barcode: { contains: filter.search, mode: 'insensitive' } },
            ];
        }
        return prisma.inventorySku.findMany({
            where,
            include: {
                category: true,
                branchStocks: true,
            },
            orderBy: { name: 'asc' },
        });
    }
    async deleteSku(tenantId, id) {
        return prisma.inventorySku.updateMany({
            where: { id, tenantId },
            data: { deletedAt: new Date(), isActive: false },
        });
    }
    async findById(tenantId, id) {
        return prisma.inventorySku.findFirst({
            where: { id, tenantId, deletedAt: null },
            include: {
                category: true,
                branchStocks: true,
            },
        });
    }
    async findByCode(tenantId, skuCode) {
        return prisma.inventorySku.findUnique({
            where: {
                tenantId_skuCode: {
                    tenantId,
                    skuCode: skuCode.toUpperCase().trim(),
                },
            },
            include: {
                category: true,
            },
        });
    }
    async createSku(tenantId, data) {
        return prisma.inventorySku.create({
            data: {
                tenantId,
                skuCode: data.skuCode.toUpperCase().trim(),
                barcode: data.barcode?.trim(),
                name: data.name,
                description: data.description,
                categoryId: data.categoryId,
                unitOfMeasure: data.unitOfMeasure || 'PIECE',
                purchaseUnit: data.purchaseUnit,
                consumptionUnit: data.consumptionUnit,
                conversionFactor: data.conversionFactor ? new Prisma.Decimal(data.conversionFactor) : new Prisma.Decimal(1.0),
                costPrice: data.costPrice !== undefined ? new Prisma.Decimal(data.costPrice) : new Prisma.Decimal(0.0),
                retailPrice: data.retailPrice !== undefined ? new Prisma.Decimal(data.retailPrice) : null,
                isConsumable: data.isConsumable ?? true,
                isRetail: data.isRetail ?? true,
                trackBatch: data.trackBatch ?? false,
                trackExpiry: data.trackExpiry ?? false,
                reorderEnabled: data.reorderEnabled ?? true,
            },
            include: {
                category: true,
            },
        });
    }
    async updateSku(tenantId, id, data) {
        return prisma.inventorySku.update({
            where: { id },
            data: {
                ...(data.name ? { name: data.name } : {}),
                ...(data.description !== undefined ? { description: data.description } : {}),
                ...(data.barcode !== undefined ? { barcode: data.barcode } : {}),
                ...(data.categoryId !== undefined ? { categoryId: data.categoryId } : {}),
                ...(data.unitOfMeasure ? { unitOfMeasure: data.unitOfMeasure } : {}),
                ...(data.purchaseUnit !== undefined ? { purchaseUnit: data.purchaseUnit } : {}),
                ...(data.consumptionUnit !== undefined ? { consumptionUnit: data.consumptionUnit } : {}),
                ...(data.conversionFactor !== undefined ? { conversionFactor: new Prisma.Decimal(data.conversionFactor) } : {}),
                ...(data.costPrice !== undefined ? { costPrice: new Prisma.Decimal(data.costPrice) } : {}),
                ...(data.retailPrice !== undefined ? { retailPrice: data.retailPrice !== null ? new Prisma.Decimal(data.retailPrice) : null } : {}),
                ...(data.isConsumable !== undefined ? { isConsumable: data.isConsumable } : {}),
                ...(data.isRetail !== undefined ? { isRetail: data.isRetail } : {}),
                ...(data.trackBatch !== undefined ? { trackBatch: data.trackBatch } : {}),
                ...(data.trackExpiry !== undefined ? { trackExpiry: data.trackExpiry } : {}),
                ...(data.reorderEnabled !== undefined ? { reorderEnabled: data.reorderEnabled } : {}),
                ...(data.isActive !== undefined ? { isActive: data.isActive } : {}),
            },
            include: {
                category: true,
            },
        });
    }
}
