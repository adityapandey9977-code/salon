import { describe, it, expect, vi, beforeEach } from 'vitest';
import { JournalService } from '../../src/application/services/journal.service';
import { BadRequestError } from '@salon-spa-saas/common-types';
import { AccountingPeriodStatus } from '../../src/infrastructure/prisma/generated-client';

describe('JournalService - Double-Entry Accounting & Period Locks', () => {
  let journalService: JournalService;
  let mockJournalRepo: any;
  let mockAccountRepo: any;
  let mockCache: any;

  beforeEach(() => {
    mockCache = {
      invalidateOverview: vi.fn().mockResolvedValue(undefined),
    };

    mockAccountRepo = {
      findActivePeriod: vi.fn(),
    };

    mockJournalRepo = {
      createAndPostJournal: vi.fn(),
      createReversalJournal: vi.fn(),
      findById: vi.fn(),
    };

    journalService = new JournalService(mockJournalRepo, mockAccountRepo, mockCache);
  });

  it('should reject journal posting if accounting period is LOCKED', async () => {
    mockAccountRepo.findActivePeriod.mockResolvedValue({
      id: 'per-1',
      name: 'FY 2025-26 Q1',
      status: AccountingPeriodStatus.LOCKED,
    });

    await expect(
      journalService.postJournal('tenant-1', {
        sourceType: 'MANUAL',
        lines: [
          { accountId: 'acc-1', debit: 100 },
          { accountId: 'acc-2', credit: 100 },
        ],
      })
    ).rejects.toThrow(BadRequestError);
  });

  it('should successfully post balanced journal when sum(debit) == sum(credit)', async () => {
    mockAccountRepo.findActivePeriod.mockResolvedValue({
      id: 'per-1',
      name: 'Current Month',
      status: AccountingPeriodStatus.OPEN,
    });

    mockJournalRepo.createAndPostJournal.mockResolvedValue({
      id: 'jrn-1',
      journalNumber: 'JRN-001',
      sourceType: 'SALE',
      lines: [
        { accountId: 'acc-ar', debit: 1180 },
        { accountId: 'acc-rev', credit: 1000 },
        { accountId: 'acc-tax', credit: 180 },
      ],
    });

    const result = await journalService.postJournal('tenant-1', {
      sourceType: 'SALE',
      lines: [
        { accountId: 'acc-ar', debit: 1180 },
        { accountId: 'acc-rev', credit: 1000 },
        { accountId: 'acc-tax', credit: 180 },
      ],
    });

    expect(mockJournalRepo.createAndPostJournal).toHaveBeenCalled();
    expect(result.journalNumber).toBe('JRN-001');
  });

  it('should create compensating reversal journal on demand', async () => {
    mockJournalRepo.createReversalJournal.mockResolvedValue({
      id: 'jrn-rev',
      journalNumber: 'REV-001',
      sourceType: 'REVERSAL',
    });

    const result = await journalService.reverseJournal('tenant-1', 'jrn-1', 'Incorrect client billing');
    expect(mockJournalRepo.createReversalJournal).toHaveBeenCalledWith('tenant-1', 'jrn-1', expect.any(String), 'Incorrect client billing');
    expect(result.sourceType).toBe('REVERSAL');
  });
});
