import { prisma } from '../prisma/client';
import { Prisma } from '../prisma/generated-client';

export class StockRepository {
  // Branch Stock Projection
  async getBranchStock(tenantId: string, branchId: string, skuId: string) {
    return prisma.branchStock.findUnique({
      where: {
        tenantId_branchId_skuId: {
          tenantId,
          branchId,
          skuId,
        },
      },
      include: {
        sku: true,
      },
    });
  }

  async listBranchStock(tenantId: string, branchId?: string) {
    const where: Prisma.BranchStockWhereInput = { tenantId };
    if (branchId) where.branchId = branchId;

    return prisma.branchStock.findMany({
      where,
      include: {
        sku: {
          include: {
            category: true,
          },
        },
      },
      orderBy: { sku: { name: 'asc' } },
    });
  }

  async getLowStockAlerts(tenantId: string, branchId?: string) {
    const where: Prisma.BranchStockWhereInput = { tenantId };
    if (branchId) where.branchId = branchId;

    const stocks = await prisma.branchStock.findMany({
      where,
      include: {
        sku: true,
      },
    });

    return stocks.filter((s) => {
      const reorderLvl = s.reorderLevel ?? 5;
      return Number(s.quantityOnHandProjection) <= reorderLvl;
    });
  }

  async getCriticalStockAlerts(tenantId: string) {
    const stocks = await prisma.branchStock.findMany({
      where: { tenantId },
      include: {
        sku: true,
      },
    });

    return stocks.filter((s) => Number(s.quantityOnHandProjection) <= 0);
  }

  async updateStockProjection(
    tenantId: string,
    branchId: string,
    skuId: string,
    deltaQty: number,
    reorderLevel?: number,
    reorderQuantity?: number
  ) {
    const existing = await prisma.branchStock.findUnique({
      where: {
        tenantId_branchId_skuId: {
          tenantId,
          branchId,
          skuId,
        },
      },
    });

    if (!existing) {
      const initialQty = new Prisma.Decimal(deltaQty);
      return prisma.branchStock.create({
        data: {
          tenantId,
          branchId,
          skuId,
          quantityOnHandProjection: initialQty,
          quantityAvailableProjection: initialQty,
          quantityReservedProjection: new Prisma.Decimal(0),
          reorderLevel: reorderLevel ?? 5,
          reorderQuantity: reorderQuantity ?? 10,
        },
        include: { sku: true },
      });
    }

    const newOnHand = existing.quantityOnHandProjection.add(new Prisma.Decimal(deltaQty));
    const newAvailable = newOnHand.sub(existing.quantityReservedProjection);

    return prisma.branchStock.update({
      where: {
        tenantId_branchId_skuId: {
          tenantId,
          branchId,
          skuId,
        },
      },
      data: {
        quantityOnHandProjection: newOnHand,
        quantityAvailableProjection: newAvailable,
        ...(reorderLevel !== undefined ? { reorderLevel } : {}),
        ...(reorderQuantity !== undefined ? { reorderQuantity } : {}),
      },
      include: { sku: true },
    });
  }

  // Stock Batches
  async listBatches(tenantId: string, branchId: string, skuId: string) {
    return prisma.stockBatch.findMany({
      where: { tenantId, branchId, skuId },
      orderBy: { expiresAt: 'asc' },
    });
  }

  async createBatch(data: {
    tenantId: string;
    branchId: string;
    skuId: string;
    batchNumber: string;
    supplierId?: string;
    manufacturedAt?: Date;
    expiresAt?: Date;
    receivedQuantity: number;
    unitCost: number;
  }) {
    const qty = new Prisma.Decimal(data.receivedQuantity);
    return prisma.stockBatch.create({
      data: {
        tenantId: data.tenantId,
        branchId: data.branchId,
        skuId: data.skuId,
        batchNumber: data.batchNumber,
        supplierId: data.supplierId,
        manufacturedAt: data.manufacturedAt,
        expiresAt: data.expiresAt,
        receivedQuantity: qty,
        remainingQuantityProjection: qty,
        unitCost: new Prisma.Decimal(data.unitCost),
      },
    });
  }

  async updateBatchRemaining(id: string, deltaQty: number) {
    const batch = await prisma.stockBatch.findUnique({ where: { id } });
    if (!batch) return null;

    const newRemaining = batch.remainingQuantityProjection.add(new Prisma.Decimal(deltaQty));
    return prisma.stockBatch.update({
      where: { id },
      data: { remainingQuantityProjection: newRemaining },
    });
  }

  // Reorder Rules
  async listReorderRules(tenantId: string, branchId?: string) {
    const where: Prisma.ReorderRuleWhereInput = { tenantId, isActive: true };
    if (branchId) where.branchId = branchId;

    return prisma.reorderRule.findMany({
      where,
      include: {
        sku: true,
        preferredSupplier: true,
      },
    });
  }

  async upsertReorderRule(data: {
    tenantId: string;
    branchId: string;
    skuId: string;
    minimumLevel: number;
    reorderLevel: number;
    reorderQuantity: number;
    maximumLevel?: number;
    preferredSupplierId?: string;
  }) {
    return prisma.reorderRule.upsert({
      where: {
        tenantId_branchId_skuId: {
          tenantId: data.tenantId,
          branchId: data.branchId,
          skuId: data.skuId,
        },
      },
      create: data,
      update: {
        minimumLevel: data.minimumLevel,
        reorderLevel: data.reorderLevel,
        reorderQuantity: data.reorderQuantity,
        maximumLevel: data.maximumLevel,
        preferredSupplierId: data.preferredSupplierId,
      },
    });
  }
}
