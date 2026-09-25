import { prisma } from '../prisma/client';
import { AccountingPeriodStatus } from '../prisma/generated-client';
export class AccountRepository {
    // Chart of Accounts
    async listAccounts(tenantId, type) {
        const where = { tenantId, isActive: true };
        if (type)
            where.type = type;
        return prisma.chartOfAccount.findMany({
            where,
            orderBy: { code: 'asc' },
        });
    }
    async findByCode(tenantId, code) {
        return prisma.chartOfAccount.findUnique({
            where: {
                tenantId_code: {
                    tenantId,
                    code: code.trim().toUpperCase(),
                },
            },
        });
    }
    async findById(tenantId, id) {
        return prisma.chartOfAccount.findFirst({
            where: { id, tenantId },
        });
    }
    async createAccount(tenantId, data) {
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
    async listPeriods(tenantId) {
        return prisma.accountingPeriod.findMany({
            where: { tenantId },
            orderBy: { startDate: 'desc' },
        });
    }
    async findActivePeriod(tenantId, date = new Date()) {
        return prisma.accountingPeriod.findFirst({
            where: {
                tenantId,
                startDate: { lte: date },
                endDate: { gte: date },
            },
        });
    }
    async createPeriod(tenantId, data) {
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
    async updatePeriodStatus(tenantId, id, status) {
        return prisma.accountingPeriod.update({
            where: { id },
            data: { status },
        });
    }
}
