import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CommissionService } from '../../src/application/services/commission.service';
import { RoyaltyService } from '../../src/application/services/royalty.service';
import { CalculationType, RoyaltyRevenueBasis } from '../../src/infrastructure/prisma/generated-client';

describe('CommissionService - Calculation & Versioned Rules', () => {
  let commissionService: CommissionService;
  let mockCommRepo: any;
  let mockCache: any;

  beforeEach(() => {
    mockCache = {
      getCommissionRules: vi.fn().mockResolvedValue(null),
      setCommissionRules: vi.fn().mockResolvedValue(undefined),
      invalidateCommissionRules: vi.fn().mockResolvedValue(undefined),
    };

    mockCommRepo = {
      listRules: vi.fn(),
      findMatchingRule: vi.fn(),
      recordTransaction: vi.fn().mockImplementation((data) => ({ id: 'tx-1', ...data })),
    };

    commissionService = new CommissionService(mockCommRepo, mockCache);
  });

  it('should calculate percentage commission correctly based on matched rule', async () => {
    mockCommRepo.findMatchingRule.mockResolvedValue({
      id: 'rule-stylist',
      version: 2,
      calculationType: CalculationType.PERCENTAGE,
      percentage: '15.00',
    });

    const result = await commissionService.calculateAndRecordCommission('tenant-1', {
      branchId: 'branch-1',
      employeeId: 'emp-stylist-1',
      saleId: 'sale-1',
      invoiceId: 'inv-1',
      itemType: 'SERVICE',
      amount: 2000,
    });

    // 15% of 2000 = 300
    expect(result.commissionAmount).toBe(300);
    expect(result.ruleId).toBe('rule-stylist');
    expect(result.ruleVersion).toBe(2);
  });

  it('should calculate tiered commission based on threshold slabs', async () => {
    mockCommRepo.findMatchingRule.mockResolvedValue({
      id: 'rule-tiered',
      version: 1,
      calculationType: CalculationType.TIERED,
      percentage: '10.00',
      thresholdJson: {
        slabs: [
          { min: 0, max: 1000, percentage: 8 },
          { min: 1001, max: 5000, percentage: 12 },
          { min: 5001, percentage: 18 },
        ],
      },
    });

    const result = await commissionService.calculateAndRecordCommission('tenant-1', {
      branchId: 'branch-1',
      employeeId: 'emp-senior-1',
      saleId: 'sale-2',
      invoiceId: 'inv-2',
      itemType: 'SERVICE',
      amount: 3500,
    });

    // Slab 1001-5000 is 12% of 3500 = 420
    expect(result.commissionAmount).toBe(420);
  });
});

describe('RoyaltyService - 3-Tier Resolution Hierarchy', () => {
  let royaltyService: RoyaltyService;
  let mockRoyaltyRepo: any;
  let mockCache: any;

  beforeEach(() => {
    mockCache = {
      invalidateRoyaltyRules: vi.fn().mockResolvedValue(undefined),
    };

    mockRoyaltyRepo = {
      findBranchOverride: vi.fn(),
      findFranchiseRule: vi.fn(),
      findDefaultRule: vi.fn(),
      recordRoyaltyTransaction: vi.fn().mockImplementation((data) => ({ id: 'rtx-1', ...data })),
    };

    royaltyService = new RoyaltyService(mockRoyaltyRepo, mockCache);
  });

  it('Priority 1: should apply BranchRoyaltyOverride if configured for the branch', async () => {
    mockRoyaltyRepo.findBranchOverride.mockResolvedValue({
      id: 'ov-1',
      calculationType: CalculationType.PERCENTAGE,
      percentage: '7.50',
    });

    const result = await royaltyService.calculateAndRecordRoyalty({
      tenantId: 'tenant-1',
      branchId: 'branch-franchise-1',
      franchiseId: 'fran-partner-1',
      invoiceId: 'inv-100',
      saleId: 'sale-100',
      grossSales: 10000,
      netSales: 8500,
      serviceRevenue: 7000,
    });

    // 7.5% of 10000 = 750
    expect(result.royaltyAmount).toBe(750);
  });

  it('Priority 2: should apply Franchise Rule when no branch override exists', async () => {
    mockRoyaltyRepo.findBranchOverride.mockResolvedValue(null);
    mockRoyaltyRepo.findFranchiseRule.mockResolvedValue({
      id: 'frule-1',
      version: 1,
      calculationType: CalculationType.PERCENTAGE,
      percentage: '6.00',
      revenueBasis: RoyaltyRevenueBasis.GROSS_SALES,
    });

    const result = await royaltyService.calculateAndRecordRoyalty({
      tenantId: 'tenant-1',
      branchId: 'branch-franchise-2',
      franchiseId: 'fran-partner-1',
      invoiceId: 'inv-101',
      saleId: 'sale-101',
      grossSales: 10000,
      netSales: 8500,
      serviceRevenue: 7000,
    });

    // 6% of 10000 = 600
    expect(result.royaltyAmount).toBe(600);
  });

  it('Priority 3: should fallback to Brand/Tenant Default Rule when no override or franchise rule exists', async () => {
    mockRoyaltyRepo.findBranchOverride.mockResolvedValue(null);
    mockRoyaltyRepo.findFranchiseRule.mockResolvedValue(null);
    mockRoyaltyRepo.findDefaultRule.mockResolvedValue({
      id: 'def-rule-1',
      version: 1,
      calculationType: CalculationType.PERCENTAGE,
      percentage: '5.00',
      revenueBasis: RoyaltyRevenueBasis.GROSS_SALES,
    });

    const result = await royaltyService.calculateAndRecordRoyalty({
      tenantId: 'tenant-1',
      branchId: 'branch-franchise-3',
      franchiseId: 'fran-partner-2',
      invoiceId: 'inv-102',
      saleId: 'sale-102',
      grossSales: 10000,
      netSales: 8500,
      serviceRevenue: 7000,
    });

    // 5% of 10000 = 500
    expect(result.royaltyAmount).toBe(500);
  });
});
