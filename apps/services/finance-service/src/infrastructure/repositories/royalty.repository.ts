import { prisma } from '../prisma/client';
import { RoyaltyRevenueBasis, CalculationType, SettlementStatus, Prisma } from '../prisma/generated-client';

export class RoyaltyRepository {
  // Rules & Overrides
  async listRoyaltyRules(tenantId: string, franchiseId?: string) {
    const where: Prisma.RoyaltyRuleWhereInput = { tenantId, isActive: true };
    if (franchiseId) where.franchiseId = franchiseId;

    return prisma.royaltyRule.findMany({
      where,
      include: {
        overrides: true,
      },
      orderBy: { priority: 'asc' },
    });
  }

  async findBranchOverride(tenantId: string, branchId: string) {
    return prisma.branchRoyaltyOverride.findUnique({
      where: {
        tenantId_branchId: {
          tenantId,
          branchId,
        },
      },
      include: {
        royaltyRule: true,
      },
    });
  }

  async findFranchiseRule(tenantId: string, franchiseId: string) {
    return prisma.royaltyRule.findFirst({
      where: {
        tenantId,
        franchiseId,
        isActive: true,
      },
      orderBy: { priority: 'asc' },
    });
  }

  async findDefaultRule(tenantId: string) {
    return prisma.royaltyRule.findFirst({
      where: {
        tenantId,
        franchiseId: null,
        isActive: true,
      },
      orderBy: { priority: 'asc' },
    });
  }

  async createRoyaltyRule(data: {
    tenantId: string;
    franchiseId?: string;
    name: string;
    calculationType?: CalculationType;
    percentage?: number;
    fixedAmount?: number;
    revenueBasis?: RoyaltyRevenueBasis;
    priority?: number;
  }) {
    return prisma.royaltyRule.create({
      data: {
        tenantId: data.tenantId,
        franchiseId: data.franchiseId,
        name: data.name,
        calculationType: data.calculationType || CalculationType.PERCENTAGE,
        percentage: data.percentage !== undefined ? new Prisma.Decimal(data.percentage) : null,
        fixedAmount: data.fixedAmount !== undefined ? new Prisma.Decimal(data.fixedAmount) : null,
        revenueBasis: data.revenueBasis || RoyaltyRevenueBasis.GROSS_SALES,
        priority: data.priority ?? 100,
      },
    });
  }

  async upsertBranchOverride(data: {
    tenantId: string;
    branchId: string;
    royaltyRuleId?: string;
    calculationType?: CalculationType;
    percentage?: number;
    fixedAmount?: number;
    priority?: number;
  }) {
    return prisma.branchRoyaltyOverride.upsert({
      where: {
        tenantId_branchId: {
          tenantId: data.tenantId,
          branchId: data.branchId,
        },
      },
      create: {
        tenantId: data.tenantId,
        branchId: data.branchId,
        royaltyRuleId: data.royaltyRuleId,
        calculationType: data.calculationType || CalculationType.PERCENTAGE,
        percentage: data.percentage !== undefined ? new Prisma.Decimal(data.percentage) : null,
        fixedAmount: data.fixedAmount !== undefined ? new Prisma.Decimal(data.fixedAmount) : null,
        priority: data.priority ?? 10,
      },
      update: {
        royaltyRuleId: data.royaltyRuleId,
        calculationType: data.calculationType,
        percentage: data.percentage !== undefined ? new Prisma.Decimal(data.percentage) : null,
        fixedAmount: data.fixedAmount !== undefined ? new Prisma.Decimal(data.fixedAmount) : null,
        priority: data.priority,
      },
    });
  }

  // Royalty Transactions
  async recordRoyaltyTransaction(data: {
    tenantId: string;
    branchId: string;
    franchiseId: string;
    invoiceId: string;
    saleId: string;
    ruleId?: string;
    ruleVersion?: number;
    eligibleRevenue: number;
    royaltyAmount: number;
  }) {
    return prisma.royaltyTransaction.create({
      data: {
        tenantId: data.tenantId,
        branchId: data.branchId,
        franchiseId: data.franchiseId,
        invoiceId: data.invoiceId,
        saleId: data.saleId,
        ruleId: data.ruleId,
        ruleVersion: data.ruleVersion,
        eligibleRevenue: new Prisma.Decimal(data.eligibleRevenue),
        royaltyAmount: new Prisma.Decimal(data.royaltyAmount),
        status: 'ACCRUED',
      },
    });
  }

  async listRoyaltyTransactions(tenantId: string, filter?: { franchiseId?: string; branchId?: string; from?: Date; to?: Date }) {
    const where: Prisma.RoyaltyTransactionWhereInput = { tenantId };
    if (filter?.franchiseId) where.franchiseId = filter.franchiseId;
    if (filter?.branchId) where.branchId = filter.branchId;

    return prisma.royaltyTransaction.findMany({
      where,
      orderBy: { occurredAt: 'desc' },
    });
  }

  // Settlements
  async listSettlements(tenantId: string, franchiseId?: string) {
    const where: Prisma.FranchiseSettlementWhereInput = { tenantId };
    if (franchiseId) where.franchiseId = franchiseId;

    return prisma.franchiseSettlement.findMany({
      where,
      orderBy: { periodEnd: 'desc' },
    });
  }

  async createSettlement(data: {
    tenantId: string;
    franchiseId: string;
    periodStart: Date;
    periodEnd: Date;
    grossEligibleRevenue: number;
    royaltyAmount: number;
    adjustmentAmount?: number;
    totalPayable: number;
    dueAt?: Date;
  }) {
    return prisma.franchiseSettlement.create({
      data: {
        tenantId: data.tenantId,
        franchiseId: data.franchiseId,
        periodStart: data.periodStart,
        periodEnd: data.periodEnd,
        grossEligibleRevenue: new Prisma.Decimal(data.grossEligibleRevenue),
        royaltyAmount: new Prisma.Decimal(data.royaltyAmount),
        adjustmentAmount: new Prisma.Decimal(data.adjustmentAmount || 0),
        totalPayable: new Prisma.Decimal(data.totalPayable),
        status: SettlementStatus.ISSUED,
        dueAt: data.dueAt,
      },
    });
  }

  async markSettlementPaid(tenantId: string, id: string, paymentReferenceId?: string) {
    return prisma.franchiseSettlement.update({
      where: { id },
      data: {
        status: SettlementStatus.PAID,
        paidAt: new Date(),
        paymentReferenceId,
      },
    });
  }
}
