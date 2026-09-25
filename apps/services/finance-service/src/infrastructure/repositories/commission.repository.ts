import { prisma } from '../prisma/client';
import { CommissionStatus, CalculationType, Prisma } from '../prisma/generated-client';

export class CommissionRepository {
  // Rules
  async listRules(tenantId: string) {
    return prisma.commissionRule.findMany({
      where: { tenantId, isActive: true },
      orderBy: { priority: 'asc' },
    });
  }

  async findMatchingRule(tenantId: string, params: {
    branchId?: string;
    employeeId?: string;
    serviceId?: string;
    categoryId?: string;
  }) {
    const rules = await this.listRules(tenantId);
    // Evaluate priority order: employee-specific -> service-specific -> branch-specific -> general
    for (const r of rules) {
      if (r.appliesToEmployeeId && r.appliesToEmployeeId === params.employeeId) return r;
      if (r.appliesToServiceId && r.appliesToServiceId === params.serviceId) return r;
      if (r.appliesToBranchId && r.appliesToBranchId === params.branchId) return r;
    }
    // Return general default rule if present
    return rules.find((r) => !r.appliesToEmployeeId && !r.appliesToServiceId && !r.appliesToBranchId) || null;
  }

  async upsertRule(data: {
    id?: string;
    tenantId: string;
    name: string;
    ruleType?: string;
    appliesToBranchId?: string;
    appliesToEmployeeId?: string;
    appliesToServiceId?: string;
    appliesToCategoryId?: string;
    calculationType?: CalculationType;
    percentage?: number;
    fixedAmount?: number;
    thresholdJson?: any;
    priority?: number;
  }) {
    if (data.id) {
      return prisma.commissionRule.update({
        where: { id: data.id },
        data: {
          name: data.name,
          ruleType: data.ruleType,
          appliesToBranchId: data.appliesToBranchId,
          appliesToEmployeeId: data.appliesToEmployeeId,
          appliesToServiceId: data.appliesToServiceId,
          appliesToCategoryId: data.appliesToCategoryId,
          calculationType: data.calculationType,
          percentage: data.percentage !== undefined ? new Prisma.Decimal(data.percentage) : null,
          fixedAmount: data.fixedAmount !== undefined ? new Prisma.Decimal(data.fixedAmount) : null,
          thresholdJson: data.thresholdJson,
          priority: data.priority,
          version: { increment: 1 },
        },
      });
    }

    return prisma.commissionRule.create({
      data: {
        tenantId: data.tenantId,
        name: data.name,
        ruleType: data.ruleType || 'GENERAL',
        appliesToBranchId: data.appliesToBranchId,
        appliesToEmployeeId: data.appliesToEmployeeId,
        appliesToServiceId: data.appliesToServiceId,
        appliesToCategoryId: data.appliesToCategoryId,
        calculationType: data.calculationType || CalculationType.PERCENTAGE,
        percentage: data.percentage !== undefined ? new Prisma.Decimal(data.percentage) : null,
        fixedAmount: data.fixedAmount !== undefined ? new Prisma.Decimal(data.fixedAmount) : null,
        thresholdJson: data.thresholdJson,
        priority: data.priority ?? 100,
      },
    });
  }

  // Commission Transactions
  async recordTransaction(data: {
    tenantId: string;
    branchId: string;
    employeeId: string;
    saleId: string;
    invoiceId: string;
    invoiceItemId?: string;
    ruleId?: string;
    ruleVersion?: number;
    eligibleAmount: number;
    commissionAmount: number;
  }) {
    return prisma.commissionTransaction.create({
      data: {
        tenantId: data.tenantId,
        branchId: data.branchId,
        employeeId: data.employeeId,
        saleId: data.saleId,
        invoiceId: data.invoiceId,
        invoiceItemId: data.invoiceItemId,
        ruleId: data.ruleId,
        ruleVersion: data.ruleVersion || 1,
        eligibleAmount: new Prisma.Decimal(data.eligibleAmount),
        commissionAmount: new Prisma.Decimal(data.commissionAmount),
        status: CommissionStatus.PENDING,
      },
      include: {
        rule: true,
      },
    });
  }

  async listTransactions(tenantId: string, filter?: { employeeId?: string; branchId?: string; status?: CommissionStatus }) {
    const where: Prisma.CommissionTransactionWhereInput = { tenantId };
    if (filter?.employeeId) where.employeeId = filter.employeeId;
    if (filter?.branchId) where.branchId = filter.branchId;
    if (filter?.status) where.status = filter.status;

    return prisma.commissionTransaction.findMany({
      where,
      include: {
        rule: true,
      },
      orderBy: { earnedAt: 'desc' },
    });
  }

  // Tips
  async recordTip(tenantId: string, data: {
    branchId: string;
    invoiceId: string;
    totalTip: number;
    allocations: Array<{ employeeId: string; amount: number }>;
  }) {
    return prisma.tipTransaction.create({
      data: {
        tenantId,
        branchId: data.branchId,
        invoiceId: data.invoiceId,
        totalTip: new Prisma.Decimal(data.totalTip),
        allocations: {
          create: data.allocations.map((a) => ({
            tenantId,
            employeeId: a.employeeId,
            amount: new Prisma.Decimal(a.amount),
          })),
        },
      },
      include: {
        allocations: true,
      },
    });
  }
}
