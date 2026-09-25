import { prisma } from '../prisma/client';
import { AccountType, AccountingPeriodStatus, Prisma } from '../prisma/generated-client';

export class AccountRepository {
  // Chart of Accounts
  async listAccounts(tenantId: string, type?: AccountType) {
    const where: Prisma.ChartOfAccountWhereInput = { tenantId, isActive: true };
    if (type) where.type = type;

    return prisma.chartOfAccount.findMany({
      where,
      orderBy: { code: 'asc' },
    });
  }

  async findByCode(tenantId: string, code: string) {
    return prisma.chartOfAccount.findUnique({
      where: {
        tenantId_code: {
          tenantId,
          code: code.trim().toUpperCase(),
        },
      },
    });
  }

  async findById(tenantId: string, id: string) {
    return prisma.chartOfAccount.findFirst({
      where: { id, tenantId },
    });
  }

  async createAccount(tenantId: string, data: {
    code: string;
    name: string;
    type: AccountType;
    parentAccountId?: string;
    description?: string;
    isSystem?: boolean;
  }) {
    return prisma.chartOfAccount.create({
      data: {
        tenantId,
        code: data.code.trim().toUpperCase(),
        name: data.name,
        type: data.type,
        parentAccountId: data.parentAccountId,
        description: data.description,
        isSystem: data.isSystem ?? false,
      },
    });
  }

  // Accounting Periods
  async listPeriods(tenantId: string) {
    return prisma.accountingPeriod.findMany({
      where: { tenantId },
      orderBy: { startDate: 'desc' },
    });
  }

  async findActivePeriod(tenantId: string, date: Date = new Date()) {
    return prisma.accountingPeriod.findFirst({
      where: {
        tenantId,
        startDate: { lte: date },
        endDate: { gte: date },
      },
    });
  }

  async createPeriod(tenantId: string, data: {
    name: string;
    startDate: Date;
    endDate: Date;
    status?: AccountingPeriodStatus;
  }) {
    return prisma.accountingPeriod.create({
      data: {
        tenantId,
        name: data.name,
        startDate: data.startDate,
        endDate: data.endDate,
        status: data.status || AccountingPeriodStatus.OPEN,
      },
    });
  }

  async updatePeriodStatus(tenantId: string, id: string, status: AccountingPeriodStatus) {
    return prisma.accountingPeriod.update({
      where: { id },
      data: { status },
    });
  }
}
