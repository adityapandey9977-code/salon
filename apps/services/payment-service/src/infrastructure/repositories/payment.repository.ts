import { ConflictError, NotFoundError } from '@salon-spa-saas/common-types';
import type {
  PaymentIntentDto,
  PaymentLinkDto,
  PaymentTransactionDto,
  RefundDto,
} from '../../domain/entities/payment.dto';
import { prisma } from '../prisma/client';
import {
  type PaymentIntent,
  type PaymentLink,
  type PaymentMethod,
  type PaymentPurpose,
  type PaymentStatus,
  type PaymentTransaction,
  Prisma,
  type Refund,
} from '../prisma/generated-client';

type IntentWithTransactions = PaymentIntent & { transactions?: PaymentTransaction[] };

export class PaymentRepository {
  private toIntentDto(record: IntentWithTransactions): PaymentIntentDto {
    return {
      id: record.id,
      tenantId: record.tenantId,
      purpose: record.purpose,
      referenceType: record.referenceType,
      referenceId: record.referenceId,
      customerId: record.customerId,
      amount: Number(record.amount),
      currency: record.currency,
      status: record.status,
      provider: record.provider,
      providerIntentId: record.providerIntentId,
      idempotencyKey: record.idempotencyKey,
      expiresAt: record.expiresAt ? record.expiresAt.toISOString() : null,
      transactions: record.transactions?.map((t) => this.toTransactionDto(t)),
      createdAt: record.createdAt.toISOString(),
      updatedAt: record.updatedAt.toISOString(),
    };
  }

  private toTransactionDto(record: PaymentTransaction): PaymentTransactionDto {
    return {
      id: record.id,
      tenantId: record.tenantId,
      paymentIntentId: record.paymentIntentId,
      method: record.method,
      amount: Number(record.amount),
      currency: record.currency,
      status: record.status,
      provider: record.provider,
      providerTransactionId: record.providerTransactionId,
      providerOrderId: record.providerOrderId,
      paidAt: record.paidAt ? record.paidAt.toISOString() : null,
      failedAt: record.failedAt ? record.failedAt.toISOString() : null,
      createdAt: record.createdAt.toISOString(),
    };
  }

  private toRefundDto(record: Refund): RefundDto {
    return {
      id: record.id,
      tenantId: record.tenantId,
      paymentTransactionId: record.paymentTransactionId,
      amount: Number(record.amount),
      reason: record.reason,
      status: record.status,
      providerRefundId: record.providerRefundId,
      requestedByPrincipalType: record.requestedByPrincipalType,
      requestedByUserId: record.requestedByUserId,
      requestedAt: record.requestedAt.toISOString(),
      processedAt: record.processedAt ? record.processedAt.toISOString() : null,
      createdAt: record.createdAt.toISOString(),
    };
  }

  public async findIntentById(tenantId: string, id: string): Promise<PaymentIntentDto | null> {
    const record = await prisma.paymentIntent.findFirst({
      where: { id, tenantId },
      include: { transactions: true },
    });
    if (!record) return null;
    return this.toIntentDto(record);
  }

  public async findIntentByIdempotencyKey(
    tenantId: string,
    idempotencyKey: string,
  ): Promise<PaymentIntentDto | null> {
    const record = await prisma.paymentIntent.findFirst({
      where: { tenantId, idempotencyKey },
      include: { transactions: true },
    });
    if (!record) return null;
    return this.toIntentDto(record);
  }

  public async createIntent(data: {
    tenantId: string;
    purpose?: PaymentPurpose;
    referenceType?: string | null;
    referenceId?: string | null;
    customerId?: string | null;
    amount: number;
    currency?: string;
    provider?: string;
    providerIntentId?: string;
    idempotencyKey: string;
  }): Promise<PaymentIntentDto> {
    try {
      const record = await prisma.paymentIntent.create({
        data: {
          tenantId: data.tenantId,
          purpose: data.purpose || 'INVOICE_PAYMENT',
          referenceType: data.referenceType,
          referenceId: data.referenceId,
          customerId: data.customerId,
          amount: new Prisma.Decimal(data.amount),
          currency: data.currency || 'INR',
          status: 'CREATED',
          provider: data.provider || 'MOCK',
          providerIntentId: data.providerIntentId,
          idempotencyKey: data.idempotencyKey,
        },
        include: { transactions: true },
      });
      return this.toIntentDto(record);
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
        const existing = await this.findIntentByIdempotencyKey(data.tenantId, data.idempotencyKey);
        if (existing) return existing;
        throw new ConflictError('A payment with this idempotency key already exists');
      }
      throw err;
    }
  }

  public async recordTransaction(data: {
    tenantId: string;
    paymentIntentId: string;
    method: PaymentMethod;
    amount: number;
    currency?: string;
    status: PaymentStatus;
    provider: string;
    providerTransactionId?: string;
    providerOrderId?: string;
  }): Promise<PaymentTransactionDto> {
    const isSuccess = data.status === 'CAPTURED' || data.status === 'AUTHORIZED';

    const tx = await prisma.$transaction(async (prismaTx) => {
      const transaction = await prismaTx.paymentTransaction.create({
        data: {
          tenantId: data.tenantId,
          paymentIntentId: data.paymentIntentId,
          method: data.method,
          amount: new Prisma.Decimal(data.amount),
          currency: data.currency || 'INR',
          status: data.status,
          provider: data.provider,
          providerTransactionId: data.providerTransactionId,
          providerOrderId: data.providerOrderId,
          paidAt: isSuccess ? new Date() : null,
          failedAt: data.status === 'FAILED' ? new Date() : null,
        },
      });

      if (isSuccess) {
        await prismaTx.paymentIntent.update({
          where: { id: data.paymentIntentId },
          data: { status: 'CAPTURED' },
        });
      }

      return transaction;
    });

    return this.toTransactionDto(tx);
  }

  public async createRefund(data: {
    tenantId: string;
    paymentTransactionId: string;
    amount: number;
    reason: string;
    providerRefundId?: string;
    requestedByPrincipalType: string;
    requestedByUserId?: string | null;
  }): Promise<RefundDto> {
    const record = await prisma.$transaction(async (tx) => {
      const refund = await tx.refund.create({
        data: {
          tenantId: data.tenantId,
          paymentTransactionId: data.paymentTransactionId,
          amount: new Prisma.Decimal(data.amount),
          reason: data.reason,
          status: 'COMPLETED',
          providerRefundId: data.providerRefundId,
          requestedByPrincipalType: data.requestedByPrincipalType,
          requestedByUserId: data.requestedByUserId,
          processedAt: new Date(),
        },
      });

      await tx.paymentTransaction.update({
        where: { id: data.paymentTransactionId },
        data: { status: 'REFUNDED' },
      });

      return refund;
    });

    return this.toRefundDto(record);
  }

  public async createPaymentLink(data: {
    tenantId: string;
    paymentIntentId: string;
    url: string;
    shortUrl: string;
    expiresInHours?: number;
  }): Promise<PaymentLinkDto> {
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + (data.expiresInHours || 24));

    const record = await prisma.paymentLink.create({
      data: {
        tenantId: data.tenantId,
        paymentIntentId: data.paymentIntentId,
        url: data.url,
        shortUrl: data.shortUrl,
        expiresAt,
      },
    });

    return {
      id: record.id,
      tenantId: record.tenantId,
      paymentIntentId: record.paymentIntentId,
      url: record.url,
      shortUrl: record.shortUrl,
      expiresAt: record.expiresAt.toISOString(),
      isPaid: record.isPaid,
      createdAt: record.createdAt.toISOString(),
    };
  }
}

export const paymentRepository = new PaymentRepository();
