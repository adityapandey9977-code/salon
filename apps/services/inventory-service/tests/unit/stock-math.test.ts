import { describe, it, expect, vi, beforeEach } from 'vitest';
import { StockService } from '../../src/application/services/stock.service';
import { ConsumptionService } from '../../src/application/services/consumption.service';
import { StockMovementType } from '../../src/infrastructure/prisma/generated-client';

describe('Inventory Stock & Math Unit Tests', () => {
  let stockService: StockService;
  let mockStockRepo: any;
  let mockMovementRepo: any;
  let mockSkuRepo: any;
  let mockCache: any;

  beforeEach(() => {
    mockCache = {
      getBranchStock: vi.fn().mockResolvedValue(null),
      setBranchStock: vi.fn().mockResolvedValue(undefined),
      invalidateBranchStock: vi.fn().mockResolvedValue(undefined),
      checkAndMarkProcessed: vi.fn().mockResolvedValue(true),
    };

    mockStockRepo = {
      listBranchStock: vi.fn(),
      getBranchStock: vi.fn(),
      getLowStockAlerts: vi.fn(),
      getCriticalStockAlerts: vi.fn(),
      updateStockProjection: vi.fn(),
    };

    mockMovementRepo = {
      createMovement: vi.fn(),
      listMovements: vi.fn(),
    };

    mockSkuRepo = {
      findById: vi.fn(),
      findByCode: vi.fn(),
    };

    stockService = new StockService(mockStockRepo, mockMovementRepo, mockSkuRepo, mockCache);
  });

  it('should accurately calculate total inventory valuation across multiple branch items', async () => {
    mockStockRepo.listBranchStock.mockResolvedValue([
      {
        id: 'stk-1',
        quantityOnHandProjection: '20',
        sku: { costPrice: '500.00' },
      },
      {
        id: 'stk-2',
        quantityOnHandProjection: '10',
        sku: { costPrice: '1250.50' },
      },
    ]);
    mockStockRepo.getLowStockAlerts.mockResolvedValue([{ id: 'stk-2' }]);
    mockStockRepo.getCriticalStockAlerts.mockResolvedValue([]);

    const kpis = await stockService.getDashboardKpis('tenant-1', 'branch-1');

    // 20 * 500 = 10000; 10 * 1250.50 = 12505; Total = 22505
    expect(kpis.totalValuation).toBe(22505);
    expect(kpis.totalItemsOnHand).toBe(30);
    expect(kpis.totalSkus).toBe(2);
    expect(kpis.lowStockCount).toBe(1);
    expect(kpis.criticalStockCount).toBe(0);
  });

  it('should post immutable ADJUSTMENT_IN movement and update stock projection on positive adjustment', async () => {
    mockSkuRepo.findById.mockResolvedValue({
      id: 'sku-1',
      skuCode: 'SKU-001',
      costPrice: '100.00',
    });
    mockMovementRepo.createMovement.mockResolvedValue({ id: 'mov-1' });
    mockStockRepo.updateStockProjection.mockResolvedValue({
      id: 'stk-1',
      quantityOnHandProjection: '15',
      reorderLevel: 5,
    });

    const result = await stockService.adjustStock('tenant-1', {
      branchId: 'branch-1',
      skuId: 'sku-1',
      deltaQuantity: 5,
      reason: 'Physical recount found extra stock',
    });

    expect(mockMovementRepo.createMovement).toHaveBeenCalledWith(
      expect.objectContaining({
        movementType: StockMovementType.ADJUSTMENT_IN,
        quantity: 5,
        unitCost: 100,
        referenceType: 'MANUAL_ADJUSTMENT',
      })
    );
    expect(mockStockRepo.updateStockProjection).toHaveBeenCalledWith('tenant-1', 'branch-1', 'sku-1', 5);
    expect(result.stock.id).toBe('stk-1');
  });
});

describe('ConsumptionService - Idempotency & Recipe Consumption', () => {
  let consumptionService: ConsumptionService;
  let mockStockRepo: any;
  let mockMovementRepo: any;
  let mockSkuRepo: any;
  let mockCache: any;

  beforeEach(() => {
    mockCache = {
      checkAndMarkProcessed: vi.fn(),
      invalidateBranchStock: vi.fn().mockResolvedValue(undefined),
    };

    mockStockRepo = {
      updateStockProjection: vi.fn().mockResolvedValue({
        id: 'stk-1',
        quantityOnHandProjection: '18',
        reorderLevel: 5,
      }),
    };

    mockMovementRepo = {
      createMovement: vi.fn().mockResolvedValue({ id: 'mov-1' }),
    };

    mockSkuRepo = {
      findById: vi.fn().mockResolvedValue({
        id: 'sku-cream',
        skuCode: 'SKU-CREAM',
        costPrice: '250.00',
      }),
    };

    consumptionService = new ConsumptionService(mockStockRepo, mockMovementRepo, mockSkuRepo, mockCache);
  });

  it('should consume recipe SKUs on first ServiceCompleted event', async () => {
    mockCache.checkAndMarkProcessed.mockResolvedValue(true);

    await consumptionService.handleServiceCompleted({
      eventId: 'evt-1001',
      tenantId: 'tenant-1',
      branchId: 'branch-1',
      payload: {
        appointmentId: 'apt-1',
        serviceId: 'srv-spa',
        serviceName: 'Deluxe Hair Spa',
        recipeItems: [{ skuId: 'sku-cream', quantity: 2 }],
      },
    });

    expect(mockMovementRepo.createMovement).toHaveBeenCalledWith(
      expect.objectContaining({
        movementType: StockMovementType.SERVICE_CONSUMPTION,
        quantity: 2,
        referenceType: 'SERVICE_BOM',
      })
    );
    expect(mockStockRepo.updateStockProjection).toHaveBeenCalledWith('tenant-1', 'branch-1', 'sku-cream', -2);
  });

  it('should NOT consume stock twice on duplicate ServiceCompleted event delivery', async () => {
    // Redis returns false (already processed)
    mockCache.checkAndMarkProcessed.mockResolvedValue(false);

    await consumptionService.handleServiceCompleted({
      eventId: 'evt-1001',
      tenantId: 'tenant-1',
      branchId: 'branch-1',
      payload: {
        appointmentId: 'apt-1',
        serviceId: 'srv-spa',
        recipeItems: [{ skuId: 'sku-cream', quantity: 2 }],
      },
    });

    expect(mockMovementRepo.createMovement).not.toHaveBeenCalled();
    expect(mockStockRepo.updateStockProjection).not.toHaveBeenCalled();
  });
});
