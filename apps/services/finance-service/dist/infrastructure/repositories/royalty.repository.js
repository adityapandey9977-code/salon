import { prisma } from '../prisma/client';
import { RoyaltyRevenueBasis, CalculationType, SettlementStatus, Prisma } from '../prisma/generated-client';
export class RoyaltyRepository {
    // Rules & Overrides
    async listRoyaltyRules(tenantId, franchiseId) {
        const where = { tenantId, isActive: true };
        if (franchiseId)
            where.franchiseId = franchiseId;
        return prisma.royaltyRule.findMany({
            where,
            include: {
                overrides: true,
            },
            orderBy: { priority: 'asc' },
        });
    }
    async findBranchOverride(tenantId, branchId) {
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
    async findFranchiseRule(tenantId, franchiseId) {
        return prisma.royaltyRule.findFirst({
            where: {
                tenantId,
                franchiseId,
                isActive: true,
            },
            orderBy: { priority: 'asc' },
        });
    }
    async findDefaultRule(tenantId) {
        return prisma.royaltyRule.findFirst({
            where: {
                tenantId,
                franchiseId: null,
                isActive: true,
            },
            orderBy: { priority: 'asc' },
        });
    }
    async createRoyaltyRule(data) {
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
    async upsertBranchOverride(data) {
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
    async recordRoyaltyTransaction(data) {
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
    async listRoyaltyTransactions(tenantId, filter) {
        const where = { tenantId };
        if (filter?.franchiseId)
            where.franchiseId = filter.franchiseId;
        if (filter?.branchId)
            where.branchId = filter.branchId;
        return prisma.royaltyTransaction.findMany({
            where,
            orderBy: { occurredAt: 'desc' },
        });
    }
    // Settlements
    async listSettlements(tenantId, franchiseId) {
        const where = { tenantId };
        if (franchiseId)
            where.franchiseId = franchiseId;
        return prisma.franchiseSettlement.findMany({
            where,
            orderBy: { periodEnd: 'desc' },
        });
    }
    async createSettlement(data) {
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
    async markSettlementPaid(tenantId, id, paymentReferenceId) {
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
