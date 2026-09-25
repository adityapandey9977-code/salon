import { prisma } from '../prisma/client';
import { StockMovementType, Prisma } from '../prisma/generated-client';

export class MovementRepository {
  async createMovement(data: {
    tenantId: string;
    branchId: string;
    skuId: string;
    batchId?: string;
    movementType: StockMovementType;
    quantity: number;
    unitCost?: number;
    referenceType: string;
    referenceId?: string;
    reason?: string;
    occurredAt?: Date;
    actorPrincipalType?: string;
    actorUserId?: string;
    correlationId?: string;
  }) {
    return prisma.stockMovement.create({
      data: {
        tenantId: data.tenantId,
        branchId: data.branchId,
        skuId: data.skuId,
        batchId: data.batchId,
        movementType: data.movementType,
        quantity: new Prisma.Decimal(data.quantity),
        unitCost: data.unitCost !== undefined ? new Prisma.Decimal(data.unitCost) : null,
        referenceType: data.referenceType,
        referenceId: data.referenceId,
        reason: data.reason,
        occurredAt: data.occurredAt || new Date(),
        actorPrincipalType: data.actorPrincipalType || 'USER',
        actorUserId: data.actorUserId,
        correlationId: data.correlationId,
      },
      include: {
        sku: true,
        batch: true,
      },
    });
  }

  async listMovements(tenantId: string, filter?: {
    branchId?: string;
    skuId?: string;
    movementType?: StockMovementType;
    referenceType?: string;
    referenceId?: string;
    from?: Date;
    to?: Date;
    skip?: number;
    take?: number;
  }) {
    const where: Prisma.StockMovementWhereInput = { tenantId };
    if (filter?.branchId) where.branchId = filter.branchId;
    if (filter?.skuId) where.skuId = filter.skuId;
    if (filter?.movementType) where.movementType = filter.movementType;
    if (filter?.referenceType) where.referenceType = filter.referenceType;
    if (filter?.referenceId) where.referenceId = filter.referenceId;
    if (filter?.from || filter?.to) {
      where.occurredAt = {};
      if (filter.from) where.occurredAt.gte = filter.from;
      if (filter.to) where.occurredAt.lte = filter.to;
    }

    const [items, total] = await Promise.all([
      prisma.stockMovement.findMany({
        where,
        include: {
          sku: true,
          batch: true,
        },
        skip: filter?.skip || 0,
        take: filter?.take || 50,
        orderBy: { occurredAt: 'desc' },
      }),
      prisma.stockMovement.count({ where }),
    ]);

    return { items, total };
  }
}
