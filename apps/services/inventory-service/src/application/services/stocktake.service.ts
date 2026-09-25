import { StocktakeRepository } from '../../infrastructure/repositories/stocktake.repository';
import { StockRepository } from '../../infrastructure/repositories/stock.repository';
import { MovementRepository } from '../../infrastructure/repositories/movement.repository';
import { SkuRepository } from '../../infrastructure/repositories/sku.repository';
import { InventoryReadStore } from '../../infrastructure/redis/inventory-read.store';
import { eventBus } from '../../infrastructure/messaging/publisher';
import { StockMovementType, StocktakeStatus } from '../../infrastructure/prisma/generated-client';
import { NotFoundError, BadRequestError } from '@salon-spa-saas/common-types';

export class StocktakeService {
  constructor(
    private stocktakeRepo: StocktakeRepository = new StocktakeRepository(),
    private stockRepo: StockRepository = new StockRepository(),
    private movementRepo: MovementRepository = new MovementRepository(),
    private skuRepo: SkuRepository = new SkuRepository(),
    private cache: InventoryReadStore = new InventoryReadStore()
  ) {}

  async listStocktakes(tenantId: string, branchId?: string) {
    return this.stocktakeRepo.listStocktakes(tenantId, branchId);
  }

  async getStocktakeById(tenantId: string, id: string) {
    const stocktake = await this.stocktakeRepo.findById(tenantId, id);
    if (!stocktake) throw new NotFoundError(`Stocktake ${id} not found`);
    return stocktake;
  }

  async createStocktake(tenantId: string, data: {
    branchId: string;
    createdByUserId?: string;
    notes?: string;
    items: Array<{
      skuId: string;
      expectedQuantity: number;
      countedQuantity: number;
    }>;
  }) {
    if (!data.items || data.items.length === 0) {
      throw new BadRequestError('Stocktake must include items');
    }

    return this.stocktakeRepo.createStocktake(tenantId, data);
  }

  async completeAndAdjust(tenantId: string, id: string, actorUserId?: string) {
    const stocktake = await this.getStocktakeById(tenantId, id);
    if (stocktake.status === StocktakeStatus.COMPLETED || stocktake.status === StocktakeStatus.CANCELLED) {
      throw new BadRequestError(`Stocktake ${id} is already in status ${stocktake.status}`);
    }

    const adjustmentMap: Record<string, string> = {};

    for (const item of stocktake.items) {
      const variance = Number(item.variance);
      if (variance !== 0) {
        const sku = await this.skuRepo.findById(tenantId, item.skuId);
        const movementType = variance > 0 ? StockMovementType.ADJUSTMENT_IN : StockMovementType.ADJUSTMENT_OUT;

        // 1. Post compensating StockMovement
        const movement = await this.movementRepo.createMovement({
          tenantId,
          branchId: stocktake.branchId,
          skuId: item.skuId,
          movementType,
          quantity: Math.abs(variance),
          unitCost: Number(sku?.costPrice || 0),
          referenceType: 'STOCKTAKE',
          referenceId: stocktake.id,
          reason: `Stocktake count adjustment: variance of ${variance}`,
          actorUserId,
        });

        adjustmentMap[item.id] = movement.id;

        // 2. Update BranchStock projection
        await this.stockRepo.updateStockProjection(
          tenantId,
          stocktake.branchId,
          item.skuId,
          variance
        );

        await this.cache.invalidateBranchStock(tenantId, stocktake.branchId, item.skuId);
      }
    }

    const completed = await this.stocktakeRepo.completeStocktake(id, adjustmentMap);

    // Emit STOCKTAKE_COMPLETED.v1
    await eventBus.publish({
      eventType: 'STOCKTAKE_COMPLETED.v1',
      aggregateType: 'Stocktake',
      aggregateId: completed.id,
      tenantId,
      branchId: completed.branchId,
      payload: {
        stocktakeId: completed.id,
        tenantId,
        branchId: completed.branchId,
        itemsCount: completed.items.length,
      },
    });

    return completed;
  }
}
