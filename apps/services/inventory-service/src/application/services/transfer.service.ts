import { TransferRepository } from '../../infrastructure/repositories/transfer.repository';
import { StockRepository } from '../../infrastructure/repositories/stock.repository';
import { MovementRepository } from '../../infrastructure/repositories/movement.repository';
import { SkuRepository } from '../../infrastructure/repositories/sku.repository';
import { InventoryReadStore } from '../../infrastructure/redis/inventory-read.store';
import { eventBus } from '../../infrastructure/messaging/publisher';
import { StockMovementType, TransferStatus } from '../../infrastructure/prisma/generated-client';
import { NotFoundError, BadRequestError } from '@salon-spa-saas/common-types';
import crypto from 'crypto';

export class TransferService {
  constructor(
    private transferRepo: TransferRepository = new TransferRepository(),
    private stockRepo: StockRepository = new StockRepository(),
    private movementRepo: MovementRepository = new MovementRepository(),
    private skuRepo: SkuRepository = new SkuRepository(),
    private cache: InventoryReadStore = new InventoryReadStore()
  ) {}

  async listTransfers(tenantId: string, filter?: { status?: TransferStatus; sourceBranchId?: string; destinationBranchId?: string }) {
    return this.transferRepo.listTransfers(tenantId, filter);
  }

  async getTransferById(tenantId: string, id: string) {
    const transfer = await this.transferRepo.findById(tenantId, id);
    if (!transfer) throw new NotFoundError(`Stock transfer ${id} not found`);
    return transfer;
  }

  async createTransfer(tenantId: string, data: {
    sourceBranchId: string;
    destinationBranchId: string;
    items: Array<{
      skuId: string;
      requestedQuantity: number;
    }>;
  }) {
    if (data.sourceBranchId === data.destinationBranchId) {
      throw new BadRequestError('Source and destination branches cannot be the same');
    }

    if (!data.items || data.items.length === 0) {
      throw new BadRequestError('Transfer must have at least one item');
    }

    const transferNumber = `TRF-${Date.now().toString(36).toUpperCase()}-${crypto.randomBytes(2).toString('hex').toUpperCase()}`;

    return this.transferRepo.createTransfer(tenantId, {
      transferNumber,
      sourceBranchId: data.sourceBranchId,
      destinationBranchId: data.destinationBranchId,
      items: data.items,
    });
  }

  async dispatchTransfer(tenantId: string, id: string, data?: { dispatchedQuantities?: Record<string, number>; actorUserId?: string }) {
    const transfer = await this.getTransferById(tenantId, id);
    if (transfer.status !== TransferStatus.REQUESTED && transfer.status !== TransferStatus.DRAFT) {
      throw new BadRequestError(`Cannot dispatch transfer in status ${transfer.status}`);
    }

    const updated = await this.transferRepo.dispatchTransfer(id, data?.dispatchedQuantities);

    // Create TRANSFER_OUT movements and deduct source branch stock
    for (const item of updated.items) {
      const qty = Number(item.dispatchedQuantity || item.requestedQuantity);
      if (qty > 0) {
        const sku = await this.skuRepo.findById(tenantId, item.skuId);

        // 1. Append-only movement
        await this.movementRepo.createMovement({
          tenantId,
          branchId: transfer.sourceBranchId,
          skuId: item.skuId,
          movementType: StockMovementType.TRANSFER_OUT,
          quantity: qty,
          unitCost: Number(sku?.costPrice || 0),
          referenceType: 'TRANSFER',
          referenceId: transfer.id,
          reason: `Dispatched to branch ${transfer.destinationBranchId}`,
          actorUserId: data?.actorUserId,
        });

        // 2. Deduct from source branch stock projection
        await this.stockRepo.updateStockProjection(
          tenantId,
          transfer.sourceBranchId,
          item.skuId,
          -qty
        );

        await this.cache.invalidateBranchStock(tenantId, transfer.sourceBranchId, item.skuId);
      }
    }

    return updated;
  }

  async receiveTransfer(tenantId: string, id: string, data?: { receivedQuantities?: Record<string, number>; actorUserId?: string }) {
    const transfer = await this.getTransferById(tenantId, id);
    if (transfer.status !== TransferStatus.DISPATCHED) {
      throw new BadRequestError(`Cannot receive transfer in status ${transfer.status}`);
    }

    const updated = await this.transferRepo.receiveTransfer(id, data?.receivedQuantities);

    // Create TRANSFER_IN movements and add to destination branch stock
    for (const item of updated.items) {
      const qty = Number(item.receivedQuantity || item.dispatchedQuantity || item.requestedQuantity);
      if (qty > 0) {
        const sku = await this.skuRepo.findById(tenantId, item.skuId);

        // 1. Append-only movement
        await this.movementRepo.createMovement({
          tenantId,
          branchId: transfer.destinationBranchId,
          skuId: item.skuId,
          movementType: StockMovementType.TRANSFER_IN,
          quantity: qty,
          unitCost: Number(sku?.costPrice || 0),
          referenceType: 'TRANSFER',
          referenceId: transfer.id,
          reason: `Received from branch ${transfer.sourceBranchId}`,
          actorUserId: data?.actorUserId,
        });

        // 2. Add to destination branch stock projection
        await this.stockRepo.updateStockProjection(
          tenantId,
          transfer.destinationBranchId,
          item.skuId,
          qty
        );

        await this.cache.invalidateBranchStock(tenantId, transfer.destinationBranchId, item.skuId);
      }
    }

    // Publish STOCK_TRANSFERRED.v1
    await eventBus.publish({
      eventType: 'STOCK_TRANSFERRED.v1',
      aggregateType: 'StockTransfer',
      aggregateId: transfer.id,
      tenantId,
      payload: {
        transferId: transfer.id,
        transferNumber: transfer.transferNumber,
        tenantId,
        sourceBranchId: transfer.sourceBranchId,
        destinationBranchId: transfer.destinationBranchId,
      },
    });

    return updated;
  }
}
