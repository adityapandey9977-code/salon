import { prisma } from '../prisma/client';
import { TransferStatus, Prisma } from '../prisma/generated-client';
export class TransferRepository {
    async listTransfers(tenantId, filter) {
        const where = { tenantId };
        if (filter?.status)
            where.status = filter.status;
        if (filter?.sourceBranchId)
            where.sourceBranchId = filter.sourceBranchId;
        if (filter?.destinationBranchId)
            where.destinationBranchId = filter.destinationBranchId;
        return prisma.stockTransfer.findMany({
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
        return prisma.stockTransfer.findFirst({
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
    async createTransfer(tenantId, data) {
        return prisma.stockTransfer.create({
            data: {
                tenantId,
                transferNumber: data.transferNumber,
                sourceBranchId: data.sourceBranchId,
                destinationBranchId: data.destinationBranchId,
                status: TransferStatus.REQUESTED,
                items: {
                    create: data.items.map((item) => ({
                        tenantId,
                        skuId: item.skuId,
                        requestedQuantity: new Prisma.Decimal(item.requestedQuantity),
                    })),
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
    async dispatchTransfer(id, dispatchedQuantities) {
        return prisma.$transaction(async (tx) => {
            const transfer = await tx.stockTransfer.findUniqueOrThrow({
                where: { id },
                include: { items: true },
            });
            for (const item of transfer.items) {
                const qty = dispatchedQuantities?.[item.id] !== undefined
                    ? new Prisma.Decimal(dispatchedQuantities[item.id])
                    : item.requestedQuantity;
                await tx.stockTransferItem.update({
                    where: { id: item.id },
                    data: { dispatchedQuantity: qty },
                });
            }
            return tx.stockTransfer.update({
                where: { id },
                data: {
                    status: TransferStatus.DISPATCHED,
                    dispatchedAt: new Date(),
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
    async receiveTransfer(id, receivedQuantities) {
        return prisma.$transaction(async (tx) => {
            const transfer = await tx.stockTransfer.findUniqueOrThrow({
                where: { id },
                include: { items: true },
            });
            for (const item of transfer.items) {
                const qty = receivedQuantities?.[item.id] !== undefined
                    ? new Prisma.Decimal(receivedQuantities[item.id])
                    : (item.dispatchedQuantity || item.requestedQuantity);
                await tx.stockTransferItem.update({
                    where: { id: item.id },
                    data: { receivedQuantity: qty },
                });
            }
            return tx.stockTransfer.update({
                where: { id },
                data: {
                    status: TransferStatus.RECEIVED,
                    receivedAt: new Date(),
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
