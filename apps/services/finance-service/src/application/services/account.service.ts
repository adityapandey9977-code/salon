import { AccountRepository } from '../../infrastructure/repositories/account.repository';
import { AccountType, AccountingPeriodStatus } from '../../infrastructure/prisma/generated-client';
import { NotFoundError, ConflictError } from '@salon-spa-saas/common-types';

export class AccountService {
  constructor(private accountRepo: AccountRepository = new AccountRepository()) {}

  async listAccounts(tenantId: string, type?: AccountType) {
    return this.accountRepo.listAccounts(tenantId, type);
  }

  async getAccountById(tenantId: string, id: string) {
    const acc = await this.accountRepo.findById(tenantId, id);
    if (!acc) throw new NotFoundError(`Account ${id} not found`);
    return acc;
  }

  async createAccount(tenantId: string, data: {
    code: string;
    name: string;
    type: AccountType;
    parentAccountId?: string;
    description?: string;
  }) {
    const existing = await this.accountRepo.findByCode(tenantId, data.code);
    if (existing) throw new ConflictError(`Account code ${data.code} already exists for this tenant`);
    return this.accountRepo.createAccount(tenantId, data);
  }

  // Periods
  async listPeriods(tenantId: string) {
    return this.accountRepo.listPeriods(tenantId);
  }

  async createPeriod(tenantId: string, data: {
    name: string;
    startDate: Date;
    endDate: Date;
  }) {
    return this.accountRepo.createPeriod(tenantId, data);
  }

  async lockPeriod(tenantId: string, id: string) {
    return this.accountRepo.updatePeriodStatus(tenantId, id, AccountingPeriodStatus.LOCKED);
  }
}
