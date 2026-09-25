import { prisma } from '../prisma/client';
import { JournalStatus, Prisma } from '../prisma/generated-client';
import { BadRequestError } from '@salon-spa-saas/common-types';

export class JournalRepository {
  async listJournals(tenantId: string, filter?: {
    branchId?: string;
    sourceType?: string;
    sourceId?: string;
    status?: JournalStatus;
    from?: Date;
    to?: Date;
    skip?: number;
    take?: number;
  }) {
    const where: Prisma.JournalEntryWhereInput = { tenantId };
    if (filter?.branchId) where.branchId = filter.branchId;
    if (filter?.sourceType) where.sourceType = filter.sourceType;
    if (filter?.sourceId) where.sourceId = filter.sourceId;
    if (filter?.status) where.status = filter.status;
    if (filter?.from || filter?.to) {
      where.entryDate = {};
      if (filter.from) where.entryDate.gte = filter.from;
      if (filter.to) where.entryDate.lte = filter.to;
    }

    const [items, total] = await Promise.all([
      prisma.journalEntry.findMany({
        where,
        include: {
          lines: {
            include: {
              account: true,
            },
          },
        },
        skip: filter?.skip || 0,
        take: filter?.take || 50,
        orderBy: { entryDate: 'desc' },
      }),
      prisma.journalEntry.count({ where }),
    ]);

    return { items, total };
  }

  async findById(tenantId: string, id: string) {
    return prisma.journalEntry.findFirst({
      where: { id, tenantId },
      include: {
        lines: {
          include: {
            account: true,
          },
        },
      },
    });
  }

  async createAndPostJournal(tenantId: string, data: {
    branchId?: string;
    journalNumber: string;
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
    if (!data.lines || data.lines.length < 2) {
      throw new BadRequestError('Double-entry journal must have at least 2 lines (debit & credit)');
    }

    let totalDebit = 0;
    let totalCredit = 0;

    const formattedLines = data.lines.map((line) => {
      const d = line.debit ? Math.round(line.debit * 100) / 100 : 0;
      const c = line.credit ? Math.round(line.credit * 100) / 100 : 0;

      if (d < 0 || c < 0) {
        throw new BadRequestError('Debit and credit amounts cannot be negative');
      }

      totalDebit += d;
      totalCredit += c;

      return {
        tenantId,
        accountId: line.accountId,
        debit: new Prisma.Decimal(d),
        credit: new Prisma.Decimal(c),
        description: line.description,
      };
    });

    totalDebit = Math.round(totalDebit * 100) / 100;
    totalCredit = Math.round(totalCredit * 100) / 100;

    // Strict Double-Entry Balance Check
    if (Math.abs(totalDebit - totalCredit) > 0.01) {
      throw new BadRequestError(
        `Journal is unbalanced: Total Debits (${totalDebit}) do not equal Total Credits (${totalCredit})`
      );
    }

    return prisma.journalEntry.create({
      data: {
        tenantId,
        branchId: data.branchId,
        journalNumber: data.journalNumber,
        entryDate: data.entryDate || new Date(),
        sourceType: data.sourceType,
        sourceId: data.sourceId,
        description: data.description,
        status: JournalStatus.POSTED,
        correlationId: data.correlationId,
        postedAt: new Date(),
        lines: {
          create: formattedLines,
        },
      },
      include: {
        lines: {
          include: {
            account: true,
          },
        },
      },
    });
  }

  async createReversalJournal(tenantId: string, originalJournalId: string, reversalNumber: string, reason?: string) {
    const original = await this.findById(tenantId, originalJournalId);
    if (!original) throw new BadRequestError(`Original journal ${originalJournalId} not found`);

    if (original.status === JournalStatus.REVERSED) {
      throw new BadRequestError(`Journal ${original.journalNumber} is already reversed`);
    }

    // Invert lines (debits become credits, credits become debits)
    const reversedLines = original.lines.map((l) => ({
      accountId: l.accountId,
      debit: Number(l.credit),
      credit: Number(l.debit),
      description: `Reversal of ${original.journalNumber}: ${l.description || ''}`,
    }));

    return prisma.$transaction(async (tx) => {
      await tx.journalEntry.update({
        where: { id: original.id },
        data: { status: JournalStatus.REVERSED },
      });

      return tx.journalEntry.create({
        data: {
          tenantId,
          branchId: original.branchId,
          journalNumber: reversalNumber,
          entryDate: new Date(),
          sourceType: 'REVERSAL',
          sourceId: original.id,
          description: reason || `Reversal journal for ${original.journalNumber}`,
          status: JournalStatus.POSTED,
          postedAt: new Date(),
          lines: {
            create: reversedLines.map((rl) => ({
              tenantId,
              accountId: rl.accountId,
              debit: new Prisma.Decimal(rl.debit),
              credit: new Prisma.Decimal(rl.credit),
              description: rl.description,
            })),
          },
        },
        include: {
          lines: {
            include: {
              account: true,
            },
          },
        },
      });
    });
  }
}
