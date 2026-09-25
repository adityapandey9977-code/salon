import { AccountRepository } from '../../infrastructure/repositories/account.repository';
import { AccountingPeriodStatus } from '../../infrastructure/prisma/generated-client';
import { NotFoundError, ConflictError } from '@salon-spa-saas/common-types';
export class AccountService {
    accountRepo;
    constructor(accountRepo = new AccountRepository()) {
        this.accountRepo = accountRepo;
    }
    async listAccounts(tenantId, type) {
        return this.accountRepo.listAccounts(tenantId, type);
    }
    async getAccountById(tenantId, id) {
        const acc = await this.accountRepo.findById(tenantId, id);
        if (!acc)
            throw new NotFoundError(`Account ${id} not found`);
        return acc;
    }
    async createAccount(tenantId, data) {
        const existing = await this.accountRepo.findByCode(tenantId, data.code);
        if (existing)
            throw new ConflictError(`Account code ${data.code} already exists for this tenant`);
        return this.accountRepo.createAccount(tenantId, data);
    }
    // Periods
    async listPeriods(tenantId) {
        return this.accountRepo.listPeriods(tenantId);
    }
    async createPeriod(tenantId, data) {
        return this.accountRepo.createPeriod(tenantId, data);
    }
    async lockPeriod(tenantId, id) {
        return this.accountRepo.updatePeriodStatus(tenantId, id, AccountingPeriodStatus.LOCKED);
    }
}
