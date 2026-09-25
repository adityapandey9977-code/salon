import { StockRepository } from '../../infrastructure/repositories/stock.repository';
import { MovementRepository } from '../../infrastructure/repositories/movement.repository';
import { SkuRepository } from '../../infrastructure/repositories/sku.repository';
import { InventoryReadStore } from '../../infrastructure/redis/inventory-read.store';
import { eventBus } from '../../infrastructure/messaging/publisher';
import { StockMovementType } from '../../infrastructure/prisma/generated-client';
import { createLogger } from '@salon-spa-saas/logger';
const logger = createLogger('inventory-consumption-service');
export class ConsumptionService {
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
    /**
     * Consume inventory for service recipe (BOM) when a salon service is completed.
     * Idempotent by eventId + appointmentId/serviceId.
     */
    async handleServiceCompleted(event) {
        const isFirstTime = await this.cache.checkAndMarkProcessed(`service-comp:${event.eventId}`);
        if (!isFirstTime) {
            logger.info({ eventId: event.eventId }, 'ServiceCompleted event already processed, skipping duplicate');
            return;
        }
        const { tenantId, branchId, payload } = event;
        const items = payload.recipeItems || [];
        if (items.length === 0) {
            logger.info({ serviceId: payload.serviceId }, 'No recipe BOM items specified for completed service');
            return;
        }
        for (const item of items) {
            const sku = await this.skuRepo.findById(tenantId, item.skuId);
            if (!sku) {
                logger.warn({ skuId: item.skuId }, 'SKU not found during service recipe consumption');
                continue;
            }
            // 1. Post SERVICE_CONSUMPTION StockMovement
            const movement = await this.movementRepo.createMovement({
                tenantId,
                branchId,
                skuId: item.skuId,
                movementType: StockMovementType.SERVICE_CONSUMPTION,
                quantity: item.quantity,
                unitCost: Number(sku.costPrice),
                referenceType: 'SERVICE_BOM',
                referenceId: payload.appointmentId || payload.serviceId,
                reason: `Consumption for completed service: ${payload.serviceName || payload.serviceId}`,
                actorUserId: payload.actorUserId,
                correlationId: payload.correlationId,
            });
            // 2. Deduct from BranchStock projection
            const updatedStock = await this.stockRepo.updateStockProjection(tenantId, branchId, item.skuId, -item.quantity);
            await this.cache.invalidateBranchStock(tenantId, branchId, item.skuId);
            // 3. Emit STOCK_CONSUMED.v1
            await eventBus.publish({
                eventType: 'STOCK_CONSUMED.v1',
                aggregateType: 'BranchStock',
                aggregateId: updatedStock.id,
                tenantId,
                branchId,
                payload: {
                    movementId: movement.id,
                    tenantId,
                    branchId,
                    skuId: item.skuId,
                    skuCode: sku.skuCode,
                    consumedQuantity: item.quantity,
                    referenceType: 'SERVICE_BOM',
                    referenceId: payload.appointmentId || payload.serviceId,
                },
            });
            // 4. Check low stock
            const reorderLevel = updatedStock.reorderLevel ?? 5;
            if (Number(updatedStock.quantityOnHandProjection) <= reorderLevel) {
                await eventBus.publish({
                    eventType: 'STOCK_LOW.v1',
                    aggregateType: 'BranchStock',
                    aggregateId: updatedStock.id,
                    tenantId,
                    branchId,
                    payload: {
                        tenantId,
                        branchId,
                        skuId: item.skuId,
                        skuCode: sku.skuCode,
                        quantityOnHand: Number(updatedStock.quantityOnHandProjection),
                        reorderLevel,
                    },
                });
            }
        }
    }
    /**
     * Consume inventory for retail product sale when POS sale is completed.
     * Idempotent by eventId + invoiceId/itemId.
     */
    async handleSaleCompleted(event) {
        const isFirstTime = await this.cache.checkAndMarkProcessed(`sale-comp:${event.eventId}`);
        if (!isFirstTime) {
            logger.info({ eventId: event.eventId }, 'SaleCompleted event already processed, skipping duplicate');
            return;
        }
        const { tenantId, branchId, payload } = event;
        const items = payload.items || [];
        for (const item of items) {
            // Only deduct for PRODUCT retail sales with a valid SKU reference
            if (item.type === 'PRODUCT' || item.skuId) {
                const targetSkuId = item.skuId || item.productId;
                if (!targetSkuId)
                    continue;
                const sku = await this.skuRepo.findById(tenantId, targetSkuId);
                if (!sku) {
                    logger.warn({ skuId: targetSkuId }, 'SKU not found during retail sale consumption');
                    continue;
                }
                // 1. Post RETAIL_SALE StockMovement
                const movement = await this.movementRepo.createMovement({
                    tenantId,
                    branchId,
                    skuId: sku.id,
                    movementType: StockMovementType.RETAIL_SALE,
                    quantity: item.quantity,
                    unitCost: Number(sku.costPrice),
                    referenceType: 'INVOICE',
                    referenceId: payload.invoiceId,
                    reason: `Retail sale on invoice ${payload.invoiceId}`,
                    actorUserId: payload.actorUserId,
                    correlationId: payload.correlationId,
                });
                // 2. Deduct from BranchStock projection
                const updatedStock = await this.stockRepo.updateStockProjection(tenantId, branchId, sku.id, -item.quantity);
                await this.cache.invalidateBranchStock(tenantId, branchId, sku.id);
                // 3. Emit STOCK_CONSUMED.v1
                await eventBus.publish({
                    eventType: 'STOCK_CONSUMED.v1',
                    aggregateType: 'BranchStock',
                    aggregateId: updatedStock.id,
                    tenantId,
                    branchId,
                    payload: {
                        movementId: movement.id,
                        tenantId,
                        branchId,
                        skuId: sku.id,
                        skuCode: sku.skuCode,
                        consumedQuantity: item.quantity,
                        referenceType: 'RETAIL_SALE',
                        referenceId: payload.invoiceId,
                    },
                });
                // 4. Check low stock
                const reorderLevel = updatedStock.reorderLevel ?? 5;
                if (Number(updatedStock.quantityOnHandProjection) <= reorderLevel) {
                    await eventBus.publish({
                        eventType: 'STOCK_LOW.v1',
                        aggregateType: 'BranchStock',
                        aggregateId: updatedStock.id,
                        tenantId,
                        branchId,
                        payload: {
                            tenantId,
                            branchId,
                            skuId: sku.id,
                            skuCode: sku.skuCode,
                            quantityOnHand: Number(updatedStock.quantityOnHandProjection),
                            reorderLevel,
                        },
                    });
                }
            }
        }
    }
    async listConsumptionHistory(tenantId, filter) {
        return this.movementRepo.listMovements(tenantId, {
            ...filter,
            movementType: StockMovementType.SERVICE_CONSUMPTION,
        });
    }
}
