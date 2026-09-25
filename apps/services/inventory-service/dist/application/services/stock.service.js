import { StockRepository } from '../../infrastructure/repositories/stock.repository';
import { MovementRepository } from '../../infrastructure/repositories/movement.repository';
import { SkuRepository } from '../../infrastructure/repositories/sku.repository';
import { InventoryReadStore } from '../../infrastructure/redis/inventory-read.store';
import { eventBus } from '../../infrastructure/messaging/publisher';
import { StockMovementType } from '../../infrastructure/prisma/generated-client';
import { NotFoundError, BadRequestError } from '@salon-spa-saas/common-types';
export class StockService {
    stockRepo;
    movementRepo;
    skuRepo;
    cache;
    constructor(stockRepo = new StockRepository(), movementRepo = new MovementRepository(), skuRepo = new SkuRepository(), cache = new InventoryReadStore()) {
        this.stockRepo = stockRepo;
        this.movementRepo = movementRepo;
        this.skuRepo = skuRepo;
        this.cache = cache;
    }
    async listStock(tenantId, branchId) {
        return this.stockRepo.listBranchStock(tenantId, branchId);
    }
    async getBranchStock(tenantId, branchId, skuId) {
        const cached = await this.cache.getBranchStock(tenantId, branchId, skuId);
        if (cached)
            return cached;
        const stock = await this.stockRepo.getBranchStock(tenantId, branchId, skuId);
        if (stock) {
            await this.cache.setBranchStock(tenantId, branchId, skuId, stock);
        }
        return stock;
    }
    async getDashboardKpis(tenantId, branchId) {
        const allStock = await this.stockRepo.listBranchStock(tenantId, branchId);
        const lowStock = await this.stockRepo.getLowStockAlerts(tenantId, branchId);
        const criticalStock = await this.stockRepo.getCriticalStockAlerts(tenantId);
        let totalValuation = 0;
        let totalItemsOnHand = 0;
        for (const item of allStock) {
            const qty = Number(item.quantityOnHandProjection);
            const cost = Number(item.sku.costPrice);
            totalValuation += qty * cost;
            totalItemsOnHand += qty;
        }
        return {
            totalValuation: Math.round(totalValuation * 100) / 100,
            totalItemsOnHand,
            totalSkus: allStock.length,
            lowStockCount: lowStock.length,
            criticalStockCount: criticalStock.length,
        };
    }
    async getBranchAlerts(tenantId, branchId) {
        return this.stockRepo.getLowStockAlerts(tenantId, branchId);
    }
    async getCriticalAlerts(tenantId) {
        return this.stockRepo.getCriticalStockAlerts(tenantId);
    }
    async adjustStock(tenantId, data) {
        if (data.deltaQuantity === 0) {
            throw new BadRequestError('Adjustment quantity cannot be zero');
        }
        const sku = await this.skuRepo.findById(tenantId, data.skuId);
        if (!sku)
            throw new NotFoundError(`SKU ${data.skuId} not found`);
        const movementType = data.deltaQuantity > 0 ? StockMovementType.ADJUSTMENT_IN : StockMovementType.ADJUSTMENT_OUT;
        // 1. Create append-only StockMovement record
        const movement = await this.movementRepo.createMovement({
            tenantId,
            branchId: data.branchId,
            skuId: data.skuId,
            batchId: data.batchId,
            movementType,
            quantity: Math.abs(data.deltaQuantity),
            unitCost: Number(sku.costPrice),
            referenceType: 'MANUAL_ADJUSTMENT',
            reason: data.reason,
            actorPrincipalType: data.actorPrincipalType || 'USER',
            actorUserId: data.actorUserId,
        });
        // 2. Update BranchStock projection
        const updatedStock = await this.stockRepo.updateStockProjection(tenantId, data.branchId, data.skuId, data.deltaQuantity);
        // Invalidate cache
        await this.cache.invalidateBranchStock(tenantId, data.branchId, data.skuId);
        // 3. Publish STOCK_ADJUSTED.v1
        await eventBus.publish({
            eventType: 'STOCK_ADJUSTED.v1',
            aggregateType: 'BranchStock',
            aggregateId: updatedStock.id,
            tenantId,
            branchId: data.branchId,
            payload: {
                movementId: movement.id,
                tenantId,
                branchId: data.branchId,
                skuId: data.skuId,
                skuCode: sku.skuCode,
                deltaQuantity: data.deltaQuantity,
                newQuantityOnHand: Number(updatedStock.quantityOnHandProjection),
                reason: data.reason,
            },
        });
        // 4. Check if stock is low
        const reorderLevel = updatedStock.reorderLevel ?? 5;
        if (Number(updatedStock.quantityOnHandProjection) <= reorderLevel) {
            await eventBus.publish({
                eventType: 'STOCK_LOW.v1',
                aggregateType: 'BranchStock',
                aggregateId: updatedStock.id,
                tenantId,
                branchId: data.branchId,
                payload: {
                    tenantId,
                    branchId: data.branchId,
                    skuId: data.skuId,
                    skuCode: sku.skuCode,
                    quantityOnHand: Number(updatedStock.quantityOnHandProjection),
                    reorderLevel,
                },
            });
        }
        return { movement, stock: updatedStock };
    }
}
