import type { SettlementReconciliationDto } from '../../domain/entities/payment.dto';
import { prisma } from '../prisma/client';
import { Prisma } from '../prisma/generated-client';

export class ReconciliationRepository {
  public async create(data: {
    tenantId: string;
    provider: string;
    settlementDate: string;
    totalAmount: number;
    feeAmount?: number;
    taxAmount?: number;
    netAmount: number;
  }): Promise<SettlementReconciliationDto> {
    const record = await prisma.settlementReconciliation.create({
      data: {
        tenantId: data.tenantId,
        provider: data.provider,
        settlementDate: new Date(data.settlementDate),
        totalAmount: new Prisma.Decimal(data.totalAmount),
        feeAmount: new Prisma.Decimal(data.feeAmount || 0),
        taxAmount: new Prisma.Decimal(data.taxAmount || 0),
        netAmount: new Prisma.Decimal(data.netAmount),
        status: 'RECONCILED',
      },
    });

    return {
      id: record.id,
      tenantId: record.tenantId,
      provider: record.provider,
      settlementDate: record.settlementDate.toISOString().split('T')[0],
      totalAmount: Number(record.totalAmount),
      feeAmount: Number(record.feeAmount),
      taxAmount: Number(record.taxAmount),
      netAmount: Number(record.netAmount),
      status: record.status,
      createdAt: record.createdAt.toISOString(),
    };
  }

  public async list(tenantId: string): Promise<SettlementReconciliationDto[]> {
    const records = await prisma.settlementReconciliation.findMany({
      where: { tenantId },
      orderBy: { settlementDate: 'desc' },
    });

    return records.map((r) => ({
      id: r.id,
      tenantId: r.tenantId,
      provider: r.provider,
      settlementDate: r.settlementDate.toISOString().split('T')[0],
      totalAmount: Number(r.totalAmount),
      feeAmount: Number(r.feeAmount),
      taxAmount: Number(r.taxAmount),
      netAmount: Number(r.netAmount),
      status: r.status,
      createdAt: r.createdAt.toISOString(),
    }));
  }
}

export const reconciliationRepository = new ReconciliationRepository();
