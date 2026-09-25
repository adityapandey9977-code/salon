import { RoyaltyRepository } from '../../infrastructure/repositories/royalty.repository';
import { FinanceReadStore } from '../../infrastructure/redis/finance-read.store';
import { eventBus } from '../../infrastructure/messaging/publisher';
import { CalculationType, RoyaltyRevenueBasis } from '../../infrastructure/prisma/generated-client';
export class RoyaltyService {
    royaltyRepo;
    cache;
    constructor(royaltyRepo = new RoyaltyRepository(), cache = new FinanceReadStore()) {
        this.royaltyRepo = royaltyRepo;
        this.cache = cache;
    }
    async listRules(tenantId, franchiseId) {
        return this.royaltyRepo.listRoyaltyRules(tenantId, franchiseId);
    }
    async createRule(data) {
        const rule = await this.royaltyRepo.createRoyaltyRule(data);
        await this.cache.invalidateRoyaltyRules(data.tenantId, data.franchiseId);
        return rule;
    }
    async setBranchOverride(data) {
        const override = await this.royaltyRepo.upsertBranchOverride(data);
        await this.cache.invalidateRoyaltyRules(data.tenantId);
        return override;
    }
    /**
     * Resolve royalty for a completed sale in a franchise branch.
     * 3-tier resolution order:
     * 1. Branch Override
     * 2. Franchise Rule
     * 3. Tenant / Brand Default Rule
     */
    async calculateAndRecordRoyalty(data) {
        const { tenantId, branchId, franchiseId } = data;
        // 1. Check Branch Override
        const branchOverride = await this.royaltyRepo.findBranchOverride(tenantId, branchId);
        let calcType = CalculationType.PERCENTAGE;
        let percentage = null;
        let fixedAmount = null;
        let basis = RoyaltyRevenueBasis.GROSS_SALES;
        let ruleId = undefined;
        let ruleVersion = 1;
        if (branchOverride && (branchOverride.percentage || branchOverride.fixedAmount)) {
            calcType = branchOverride.calculationType;
            percentage = branchOverride.percentage ? Number(branchOverride.percentage) : null;
            fixedAmount = branchOverride.fixedAmount ? Number(branchOverride.fixedAmount) : null;
            ruleId = branchOverride.royaltyRuleId || undefined;
        }
        else {
            // 2. Check Franchise Rule
            const franchiseRule = await this.royaltyRepo.findFranchiseRule(tenantId, franchiseId);
            if (franchiseRule) {
                calcType = franchiseRule.calculationType;
                percentage = franchiseRule.percentage ? Number(franchiseRule.percentage) : null;
                fixedAmount = franchiseRule.fixedAmount ? Number(franchiseRule.fixedAmount) : null;
                basis = franchiseRule.revenueBasis;
                ruleId = franchiseRule.id;
                ruleVersion = franchiseRule.version;
            }
            else {
                // 3. Fallback to Tenant / Brand Default Rule
                const defaultRule = await this.royaltyRepo.findDefaultRule(tenantId);
                if (defaultRule) {
                    calcType = defaultRule.calculationType;
                    percentage = defaultRule.percentage ? Number(defaultRule.percentage) : null;
                    fixedAmount = defaultRule.fixedAmount ? Number(defaultRule.fixedAmount) : null;
                    basis = defaultRule.revenueBasis;
                    ruleId = defaultRule.id;
                    ruleVersion = defaultRule.version;
                }
                else {
                    // Standard system default 5% of gross sales
                    percentage = 5.0;
                }
            }
        }
        // Determine eligible revenue based on revenueBasis
        let eligibleRevenue = data.grossSales;
        if (basis === RoyaltyRevenueBasis.NET_SALES)
            eligibleRevenue = data.netSales;
        if (basis === RoyaltyRevenueBasis.SERVICE_REVENUE)
            eligibleRevenue = data.serviceRevenue;
        // Calculate royalty monetary value
        let royaltyAmount = 0;
        if (calcType === CalculationType.PERCENTAGE && percentage !== null) {
            royaltyAmount = Math.round(((eligibleRevenue * percentage) / 100) * 100) / 100;
        }
        else if (calcType === CalculationType.FIXED && fixedAmount !== null) {
            royaltyAmount = fixedAmount;
        }
        else if (calcType === CalculationType.HYBRID) {
            const pctPart = percentage ? (eligibleRevenue * percentage) / 100 : 0;
            royaltyAmount = Math.round((pctPart + (fixedAmount || 0)) * 100) / 100;
        }
        // Record RoyaltyTransaction
        const transaction = await this.royaltyRepo.recordRoyaltyTransaction({
            tenantId,
            branchId,
            franchiseId,
            invoiceId: data.invoiceId,
            saleId: data.saleId,
            ruleId,
            ruleVersion,
            eligibleRevenue,
            royaltyAmount,
        });
        // Emit FRANCHISE_ROYALTY_CALCULATED.v1
        await eventBus.publish({
            eventType: 'FRANCHISE_ROYALTY_CALCULATED.v1',
            aggregateType: 'RoyaltyTransaction',
            aggregateId: transaction.id,
            tenantId,
            branchId,
            payload: {
                transactionId: transaction.id,
                tenantId,
                branchId,
                franchiseId,
                invoiceId: data.invoiceId,
                eligibleRevenue,
                royaltyAmount,
            },
        });
        return transaction;
    }
    // Settlements
    async listSettlements(tenantId, franchiseId) {
        return this.royaltyRepo.listSettlements(tenantId, franchiseId);
    }
    async generateSettlement(tenantId, data) {
        // 1. Aggregate accrued royalty transactions for this franchise in date range
        const transactions = await this.royaltyRepo.listRoyaltyTransactions(tenantId, {
            franchiseId: data.franchiseId,
        });
        let grossEligibleRevenue = 0;
        let royaltyAmount = 0;
        for (const tx of transactions) {
            const txDate = new Date(tx.occurredAt);
            if (txDate >= data.periodStart && txDate <= data.periodEnd && tx.status === 'ACCRUED') {
                grossEligibleRevenue += Number(tx.eligibleRevenue);
                royaltyAmount += Number(tx.royaltyAmount);
            }
        }
        const adj = data.adjustmentAmount || 0;
        const totalPayable = Math.max(0, royaltyAmount + adj);
        const settlement = await this.royaltyRepo.createSettlement({
            tenantId,
            franchiseId: data.franchiseId,
            periodStart: data.periodStart,
            periodEnd: data.periodEnd,
            grossEligibleRevenue,
            royaltyAmount,
            adjustmentAmount: adj,
            totalPayable,
            dueAt: data.dueAt,
        });
        // Emit FRANCHISE_SETTLEMENT_CREATED.v1
        await eventBus.publish({
            eventType: 'FRANCHISE_SETTLEMENT_CREATED.v1',
            aggregateType: 'FranchiseSettlement',
            aggregateId: settlement.id,
            tenantId,
            payload: {
                settlementId: settlement.id,
                tenantId,
                franchiseId: settlement.franchiseId,
                totalPayable: Number(settlement.totalPayable),
                periodStart: settlement.periodStart,
                periodEnd: settlement.periodEnd,
            },
        });
        return settlement;
    }
    async markSettlementPaid(tenantId, id, paymentReferenceId) {
        const updated = await this.royaltyRepo.markSettlementPaid(tenantId, id, paymentReferenceId);
        // Emit FRANCHISE_SETTLEMENT_PAID.v1
        await eventBus.publish({
            eventType: 'FRANCHISE_SETTLEMENT_PAID.v1',
            aggregateType: 'FranchiseSettlement',
            aggregateId: updated.id,
            tenantId,
            payload: {
                settlementId: updated.id,
                tenantId,
                franchiseId: updated.franchiseId,
                paymentReferenceId,
            },
        });
        return updated;
    }
}
