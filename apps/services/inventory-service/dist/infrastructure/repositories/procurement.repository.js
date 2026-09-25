import { prisma } from '../prisma/client';
import { PoStatus, GoodsReceiptStatus, Prisma } from '../prisma/generated-client';
export class ProcurementRepository {
    // Purchase Orders
    async listPurchaseOrders(tenantId, filter) {
        const where = { tenantId };
        if (filter?.status)
            where.status = filter.status;
        if (filter?.branchId)
            where.orderingBranchId = filter.branchId;
        if (filter?.supplierId)
            where.supplierId = filter.supplierId;
        return prisma.purchaseOrder.findMany({
            where,
            include: {
                supplier: true,
                items: {
                    include: {
                        sku: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findPoById(tenantId, id) {
        return prisma.purchaseOrder.findFirst({
            where: { id, tenantId },
            include: {
                supplier: true,
                items: {
                    include: {
                        sku: true,
                    },
                },
                goodsReceipts: {
                    include: {
                        items: true,
                    },
                },
            },
        });
    }
    async createPurchaseOrder(tenantId, data) {
        let subtotal = 0;
        let taxTotal = 0;
        const itemsData = data.items.map((item) => {
            const lineSub = item.orderedQuantity * item.unitPrice;
            const rate = item.taxRate || 0;
            const lineTax = (lineSub * rate) / 100;
            const lineTotal = lineSub + lineTax;
            subtotal += lineSub;
            taxTotal += lineTax;
            return {
                tenantId,
                skuId: item.skuId,
                orderedQuantity: new Prisma.Decimal(item.orderedQuantity),
                unitPrice: new Prisma.Decimal(item.unitPrice),
                taxRate: new Prisma.Decimal(rate),
                taxAmount: new Prisma.Decimal(lineTax),
                lineTotal: new Prisma.Decimal(lineTotal),
            };
        });
        const grandTotal = subtotal + taxTotal;
        return prisma.purchaseOrder.create({
            data: {
                tenantId,
                poNumber: data.poNumber,
                supplierId: data.supplierId,
                orderingBranchId: data.orderingBranchId,
                status: PoStatus.DRAFT,
                currency: data.currency || 'INR',
                subtotal: new Prisma.Decimal(subtotal),
                taxTotal: new Prisma.Decimal(taxTotal),
                grandTotal: new Prisma.Decimal(grandTotal),
                expectedDeliveryAt: data.expectedDeliveryAt,
                createdByPrincipalType: data.createdByPrincipalType || 'USER',
                createdByUserId: data.createdByUserId,
                items: {
                    create: itemsData,
                },
            },
            include: {
                supplier: true,
                items: {
                    include: {
                        sku: true,
                    },
                },
            },
        });
    }
    async updatePoStatus(tenantId, id, status, approvedByUserId) {
        return prisma.purchaseOrder.update({
            where: { id },
            data: {
                status,
                ...(approvedByUserId ? { approvedByUserId } : {}),
            },
            include: {
                supplier: true,
                items: {
                    include: {
                        sku: true,
                    },
                },
            },
        });
    }
    // Goods Receipt / GRN
    async createGoodsReceipt(tenantId, data) {
        return prisma.$transaction(async (tx) => {
            const grn = await tx.goodsReceipt.create({
                data: {
                    tenantId,
                    branchId: data.branchId,
                    purchaseOrderId: data.purchaseOrderId,
                    grnNumber: data.grnNumber,
                    supplierInvoiceNumber: data.supplierInvoiceNumber,
                    receivedByUserId: data.receivedByUserId,
                    status: GoodsReceiptStatus.COMPLETED,
                    items: {
                        create: data.items.map((item) => ({
                            tenantId,
                            purchaseOrderItemId: item.purchaseOrderItemId,
                            skuId: item.skuId,
                            batchNumber: item.batchNumber,
                            expiryDate: item.expiryDate,
                            receivedQuantity: new Prisma.Decimal(item.receivedQuantity),
                            acceptedQuantity: new Prisma.Decimal(item.acceptedQuantity),
                            rejectedQuantity: new Prisma.Decimal(item.rejectedQuantity || 0),
                            unitCost: new Prisma.Decimal(item.unitCost),
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
            // Update receivedQuantityProjection on PO items
            for (const item of data.items) {
                if (item.purchaseOrderItemId) {
                    await tx.purchaseOrderItem.update({
                        where: { id: item.purchaseOrderItemId },
                        data: {
                            receivedQuantityProjection: {
                                increment: new Prisma.Decimal(item.acceptedQuantity),
                            },
                        },
                    });
                }
            }
            // Check if PO is completely received
            const poItems = await tx.purchaseOrderItem.findMany({
                where: { purchaseOrderId: data.purchaseOrderId },
            });
            const allReceived = poItems.every((pi) => pi.receivedQuantityProjection.greaterThanOrEqualTo(pi.orderedQuantity));
            await tx.purchaseOrder.update({
                where: { id: data.purchaseOrderId },
                data: {
                    status: allReceived ? PoStatus.RECEIVED : PoStatus.PARTIALLY_RECEIVED,
                },
            });
            return grn;
        });
    }
}
