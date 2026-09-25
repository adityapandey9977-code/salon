import { JournalRepository } from '../../infrastructure/repositories/journal.repository';
import { AccountRepository } from '../../infrastructure/repositories/account.repository';
import { FinanceReadStore } from '../../infrastructure/redis/finance-read.store';
import { eventBus } from '../../infrastructure/messaging/publisher';
import { AccountingPeriodStatus } from '../../infrastructure/prisma/generated-client';
import { NotFoundError, BadRequestError } from '@salon-spa-saas/common-types';
import crypto from 'crypto';

export class JournalService {
  constructor(
    private journalRepo: JournalRepository = new JournalRepository(),
    private accountRepo: AccountRepository = new AccountRepository(),
    private cache: FinanceReadStore = new FinanceReadStore()
  ) {}

  async listJournals(tenantId: string, filter?: any) {
    return this.journalRepo.listJournals(tenantId, filter);
  }

  async getJournalById(tenantId: string, id: string) {
    const journal = await this.journalRepo.findById(tenantId, id);
    if (!journal) throw new NotFoundError(`Journal entry ${id} not found`);
    return journal;
  }

  async postJournal(tenantId: string, data: {
    branchId?: string;
    entryDate?: Date;
    sourceType: string;
    sourceId?: string;
    description?: string;
    correlationId?: string;
    lines: Array<{
      accountId: string;
      debit?: number;
      credit?: number;
      description?: string;
    }>;
  }) {
    // 1. Check Accounting Period status
    const entryDate = data.entryDate || new Date();
    const period = await this.accountRepo.findActivePeriod(tenantId, entryDate);
    if (period && period.status === AccountingPeriodStatus.LOCKED) {
      throw new BadRequestError(`Cannot post journal to locked accounting period: ${period.name}`);
    }

    // 2. Generate unique journal number
    const journalNumber = `JRN-${Date.now().toString(36).toUpperCase()}-${crypto.randomBytes(2).toString('hex').toUpperCase()}`;

    // 3. Create & Post balanced journal (validates SUM(debit) == SUM(credit))
    const journal = await this.journalRepo.createAndPostJournal(tenantId, {
      branchId: data.branchId,
      journalNumber,
      entryDate,
      sourceType: data.sourceType,
      sourceId: data.sourceId,
      description: data.description,
      correlationId: data.correlationId,
      lines: data.lines,
    });

    // Invalidate finance overview caches
    await this.cache.invalidateOverview(tenantId);

    // 4. Publish JOURNAL_POSTED.v1 event
    await eventBus.publish({
      eventType: 'JOURNAL_POSTED.v1',
      aggregateType: 'JournalEntry',
      aggregateId: journal.id,
      tenantId,
      branchId: data.branchId,
      payload: {
        journalId: journal.id,
        journalNumber: journal.journalNumber,
        tenantId,
        sourceType: journal.sourceType,
        sourceId: journal.sourceId,
        linesCount: journal.lines.length,
      },
    });

    return journal;
  }

  async reverseJournal(tenantId: string, originalJournalId: string, reason?: string) {
    const reversalNumber = `REV-${Date.now().toString(36).toUpperCase()}-${crypto.randomBytes(2).toString('hex').toUpperCase()}`;
    const reversal = await this.journalRepo.createReversalJournal(tenantId, originalJournalId, reversalNumber, reason);

    await this.cache.invalidateOverview(tenantId);

    await eventBus.publish({
      eventType: 'JOURNAL_POSTED.v1',
      aggregateType: 'JournalEntry',
      aggregateId: reversal.id,
      tenantId,
      payload: {
        journalId: reversal.id,
        journalNumber: reversal.journalNumber,
        tenantId,
        sourceType: 'REVERSAL',
        originalJournalId,
      },
    });

    return reversal;
  }
}
