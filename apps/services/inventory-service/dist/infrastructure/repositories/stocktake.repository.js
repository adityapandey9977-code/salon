import { prisma } from '../prisma/client';
import { StocktakeStatus, Prisma } from '../prisma/generated-client';
export class StocktakeRepository {
    async listStocktakes(tenantId, branchId) {
        const where = { tenantId };
        if (branchId)
            where.branchId = branchId;
        return prisma.stocktake.findMany({
            where,
            include: {
                items: {
                    include: {
                        sku: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findById(tenantId, id) {
        return prisma.stocktake.findFirst({
            where: { id, tenantId },
            include: {
                items: {
                    include: {
                        sku: true,
                    },
                },
            },
        });
    }
    async createStocktake(tenantId, data) {
        return prisma.stocktake.create({
            data: {
                tenantId,
                branchId: data.branchId,
                createdByUserId: data.createdByUserId,
                notes: data.notes,
                status: StocktakeStatus.IN_PROGRESS,
                items: {
                    create: data.items.map((item) => {
                        const exp = new Prisma.Decimal(item.expectedQuantity);
                        const cnt = new Prisma.Decimal(item.countedQuantity);
                        const variance = cnt.sub(exp);
                        return {
                            tenantId,
                            skuId: item.skuId,
                            expectedQuantity: exp,
                            countedQuantity: cnt,
                            variance,
                        };
                    }),
                },
            },
            include: {
                items: {
                    include: {
                        sku: true,
                    },
                },
            },
        });
    }
    async completeStocktake(id, adjustmentMovementIds) {
        return prisma.$transaction(async (tx) => {
            if (adjustmentMovementIds) {
                for (const [itemId, movId] of Object.entries(adjustmentMovementIds)) {
                    await tx.stocktakeItem.update({
                        where: { id: itemId },
                        data: { adjustmentMovementId: movId },
                    });
                }
            }
            return tx.stocktake.update({
                where: { id },
                data: {
                    status: StocktakeStatus.COMPLETED,
                    completedAt: new Date(),
                },
                include: {
                    items: {
                        include: {
                            sku: true,
                        },
                    },
                },
            });
        });
    }
}
