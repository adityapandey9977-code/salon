import { ProcurementRepository } from '../../infrastructure/repositories/procurement.repository';
import { SupplierRepository } from '../../infrastructure/repositories/supplier.repository';
import { StockRepository } from '../../infrastructure/repositories/stock.repository';
import { MovementRepository } from '../../infrastructure/repositories/movement.repository';
import { SkuRepository } from '../../infrastructure/repositories/sku.repository';
import { InventoryReadStore } from '../../infrastructure/redis/inventory-read.store';
import { eventBus } from '../../infrastructure/messaging/publisher';
import { PoStatus, StockMovementType } from '../../infrastructure/prisma/generated-client';
import { NotFoundError, ConflictError, BadRequestError } from '@salon-spa-saas/common-types';
import crypto from 'crypto';
export class ProcurementService {
    procRepo;
    supplierRepo;
    stockRepo;
    movementRepo;
    skuRepo;
    cache;
    constructor(procRepo = new ProcurementRepository(), supplierRepo = new SupplierRepository(), stockRepo = new StockRepository(), movementRepo = new MovementRepository(), skuRepo = new SkuRepository(), cache = new InventoryReadStore()) {
        this.procRepo = procRepo;
        this.supplierRepo = supplierRepo;
        this.stockRepo = stockRepo;
        this.movementRepo = movementRepo;
        this.skuRepo = skuRepo;
        this.cache = cache;
    }
    // Suppliers
    async listSuppliers(tenantId, filter) {
        return this.supplierRepo.listSuppliers(tenantId, filter);
    }
    async createSupplier(tenantId, data) {
        const existing = await this.supplierRepo.findByCode(tenantId, data.supplierCode);
        if (existing)
            throw new ConflictError(`Supplier code ${data.supplierCode} already exists`);
        return this.supplierRepo.createSupplier(tenantId, data);
    }
    // Purchase Orders
    async listPurchaseOrders(tenantId, filter) {
        return this.procRepo.listPurchaseOrders(tenantId, filter);
    }
    async getPoById(tenantId, id) {
        const po = await this.procRepo.findPoById(tenantId, id);
        if (!po)
            throw new NotFoundError(`Purchase order ${id} not found`);
        return po;
    }
    async createPurchaseOrder(tenantId, data) {
        const supplier = await this.supplierRepo.findById(tenantId, data.supplierId);
        if (!supplier)
            throw new NotFoundError(`Supplier ${data.supplierId} not found`);
        if (!data.items || data.items.length === 0) {
            throw new BadRequestError('Purchase order must contain at least one item');
        }
        const poNumber = `PO-${Date.now().toString(36).toUpperCase()}-${crypto.randomBytes(2).toString('hex').toUpperCase()}`;
        const po = await this.procRepo.createPurchaseOrder(tenantId, {
            poNumber,
            supplierId: data.supplierId,
            orderingBranchId: data.orderingBranchId,
            expectedDeliveryAt: data.expectedDeliveryAt,
            createdByPrincipalType: data.createdByPrincipalType,
            createdByUserId: data.createdByUserId,
            items: data.items,
        });
        await eventBus.publish({
            eventType: 'PURCHASE_ORDER_CREATED.v1',
            aggregateType: 'PurchaseOrder',
            aggregateId: po.id,
            tenantId,
            branchId: data.orderingBranchId,
            payload: {
                purchaseOrderId: po.id,
                tenantId,
                poNumber: po.poNumber,
                supplierId: po.supplierId,
                grandTotal: Number(po.grandTotal),
            },
        });
        return po;
    }
    async approvePurchaseOrder(tenantId, id, approvedByUserId) {
        const po = await this.getPoById(tenantId, id);
        if (po.status !== PoStatus.DRAFT && po.status !== PoStatus.PENDING_APPROVAL) {
            throw new BadRequestError(`Cannot approve PO in status ${po.status}`);
        }
        const updated = await this.procRepo.updatePoStatus(tenantId, id, PoStatus.APPROVED, approvedByUserId);
        await eventBus.publish({
            eventType: 'PURCHASE_ORDER_APPROVED.v1',
            aggregateType: 'PurchaseOrder',
            aggregateId: updated.id,
            tenantId,
            branchId: updated.orderingBranchId || undefined,
            payload: {
                purchaseOrderId: updated.id,
                tenantId,
                poNumber: updated.poNumber,
                approvedByUserId,
            },
        });
        return updated;
    }
    // Goods Receipt / GRN
    async receiveGoods(tenantId, data) {
        const po = await this.getPoById(tenantId, data.purchaseOrderId);
        if (po.status === PoStatus.CANCELLED || po.status === PoStatus.CLOSED) {
            throw new BadRequestError(`Cannot receive goods for PO in status ${po.status}`);
        }
        const grnNumber = `GRN-${Date.now().toString(36).toUpperCase()}-${crypto.randomBytes(2).toString('hex').toUpperCase()}`;
        const grn = await this.procRepo.createGoodsReceipt(tenantId, {
            branchId: data.branchId,
            purchaseOrderId: data.purchaseOrderId,
            grnNumber,
            supplierInvoiceNumber: data.supplierInvoiceNumber,
            receivedByUserId: data.receivedByUserId,
            items: data.items,
        });
        // For each accepted item: post StockMovement and update BranchStock projection
        for (const item of data.items) {
            if (item.acceptedQuantity > 0) {
                let batchId = undefined;
                // If batch is tracked or batchNumber supplied, create stock batch
                if (item.batchNumber) {
                    const batch = await this.stockRepo.createBatch({
                        tenantId,
                        branchId: data.branchId,
                        skuId: item.skuId,
                        batchNumber: item.batchNumber,
                        supplierId: po.supplierId,
                        expiresAt: item.expiryDate,
                        receivedQuantity: item.acceptedQuantity,
                        unitCost: item.unitCost,
                    });
                    batchId = batch.id;
                }
                // 1. Create append-only StockMovement
                await this.movementRepo.createMovement({
                    tenantId,
                    branchId: data.branchId,
                    skuId: item.skuId,
                    batchId,
                    movementType: StockMovementType.PURCHASE_RECEIPT,
                    quantity: item.acceptedQuantity,
                    unitCost: item.unitCost,
                    referenceType: 'GRN',
                    referenceId: grn.id,
                    reason: `Goods receipt for PO ${po.poNumber}`,
                    actorUserId: data.receivedByUserId,
                });
                // 2. Update BranchStock projection
                await this.stockRepo.updateStockProjection(tenantId, data.branchId, item.skuId, item.acceptedQuantity);
                // Invalidate cache
                await this.cache.invalidateBranchStock(tenantId, data.branchId, item.skuId);
            }
        }
        // 3. Emit GOODS_RECEIVED.v1 (Finance will consume this to create payables)
        await eventBus.publish({
            eventType: 'GOODS_RECEIVED.v1',
            aggregateType: 'GoodsReceipt',
            aggregateId: grn.id,
            tenantId,
            branchId: data.branchId,
            payload: {
                grnId: grn.id,
                grnNumber: grn.grnNumber,
                tenantId,
                branchId: data.branchId,
                purchaseOrderId: po.id,
                poNumber: po.poNumber,
                supplierId: po.supplierId,
                supplierInvoiceNumber: grn.supplierInvoiceNumber,
                itemsCount: grn.items.length,
            },
        });
        // 4. Emit STOCK_RECEIVED.v1
        await eventBus.publish({
            eventType: 'STOCK_RECEIVED.v1',
            aggregateType: 'GoodsReceipt',
            aggregateId: grn.id,
            tenantId,
            branchId: data.branchId,
            payload: {
                grnId: grn.id,
                tenantId,
                branchId: data.branchId,
                poNumber: po.poNumber,
            },
        });
        return grn;
    }
}
