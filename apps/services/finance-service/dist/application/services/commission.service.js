import { CommissionRepository } from '../../infrastructure/repositories/commission.repository';
import { FinanceReadStore } from '../../infrastructure/redis/finance-read.store';
import { eventBus } from '../../infrastructure/messaging/publisher';
import { CalculationType } from '../../infrastructure/prisma/generated-client';
export class CommissionService {
    commRepo;
    cache;
    constructor(commRepo = new CommissionRepository(), cache = new FinanceReadStore()) {
        this.commRepo = commRepo;
        this.cache = cache;
    }
    async listRules(tenantId) {
        const cached = await this.cache.getCommissionRules(tenantId);
        if (cached)
            return cached;
        const rules = await this.commRepo.listRules(tenantId);
        await this.cache.setCommissionRules(tenantId, rules);
        return rules;
    }
    async upsertRule(data) {
        const rule = await this.commRepo.upsertRule(data);
        await this.cache.invalidateCommissionRules(data.tenantId);
        return rule;
    }
    async calculateAndRecordCommission(tenantId, data) {
        // 1. Resolve matching versioned commission rule
        const rule = await this.commRepo.findMatchingRule(tenantId, {
            branchId: data.branchId,
            employeeId: data.employeeId,
            serviceId: data.serviceId,
            categoryId: data.categoryId,
        });
        let commissionAmount = 0;
        if (rule) {
            if (rule.calculationType === CalculationType.PERCENTAGE) {
                const pct = Number(rule.percentage || 0);
                commissionAmount = Math.round(((data.amount * pct) / 100) * 100) / 100;
            }
            else if (rule.calculationType === CalculationType.FIXED) {
                commissionAmount = Number(rule.fixedAmount || 0);
            }
            else if (rule.calculationType === CalculationType.TIERED) {
                // Evaluate tiered slabs from thresholdJson
                const slabs = rule.thresholdJson?.slabs || [];
                let appliedPct = Number(rule.percentage || 10);
                for (const slab of slabs) {
                    if (data.amount >= slab.min && (!slab.max || data.amount <= slab.max)) {
                        appliedPct = slab.percentage;
                        break;
                    }
                }
                commissionAmount = Math.round(((data.amount * appliedPct) / 100) * 100) / 100;
            }
            else if (rule.calculationType === CalculationType.HYBRID) {
                const pct = Number(rule.percentage || 0);
                const fixed = Number(rule.fixedAmount || 0);
                commissionAmount = Math.round(((data.amount * pct) / 100 + fixed) * 100) / 100;
            }
        }
        else {
            // Platform default 10% on services, 5% on retail
            const defaultPct = data.itemType === 'SERVICE' ? 10 : 5;
            commissionAmount = Math.round(((data.amount * defaultPct) / 100) * 100) / 100;
        }
        // 2. Record CommissionTransaction (Never silently overwrite earned commission)
        const transaction = await this.commRepo.recordTransaction({
            tenantId,
            branchId: data.branchId,
            employeeId: data.employeeId,
            saleId: data.saleId,
            invoiceId: data.invoiceId,
            invoiceItemId: data.invoiceItemId,
            ruleId: rule?.id,
            ruleVersion: rule?.version || 1,
            eligibleAmount: data.amount,
            commissionAmount,
        });
        // 3. Emit COMMISSION_CALCULATED.v1 event
        await eventBus.publish({
            eventType: 'COMMISSION_CALCULATED.v1',
            aggregateType: 'CommissionTransaction',
            aggregateId: transaction.id,
            tenantId,
            branchId: data.branchId,
            payload: {
                transactionId: transaction.id,
                tenantId,
                branchId: data.branchId,
                employeeId: data.employeeId,
                invoiceId: data.invoiceId,
                commissionAmount,
                eligibleAmount: data.amount,
            },
        });
        return transaction;
    }
    async listStaffCommissions(tenantId, filter) {
        return this.commRepo.listTransactions(tenantId, filter);
    }
    async recordTips(tenantId, data) {
        return this.commRepo.recordTip(tenantId, data);
    }
}
