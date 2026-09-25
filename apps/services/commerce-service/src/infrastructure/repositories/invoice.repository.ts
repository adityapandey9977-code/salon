import { NotFoundError } from '@salon-spa-saas/common-types';
import type { InvoiceDto } from '../../domain/entities/commerce.dto';
import { prisma } from '../prisma/client';
import {
  Prisma,
  type Invoice,
  type InvoiceLineItem,
  type InvoiceStatus,
  type ItemType,
} from '../prisma/generated-client';

type InvoiceWithItems = Invoice & { items: InvoiceLineItem[] };

export class InvoiceRepository {
  private toDto(item: InvoiceWithItems): InvoiceDto {
    return {
      id: item.id,
      tenantId: item.tenantId,
      branchId: item.branchId,
      customerId: item.customerId,
      appointmentId: item.appointmentId,
      invoiceNumber: item.invoiceNumber,
      subtotal: Number(item.subtotal),
      discountTotal: Number(item.discountTotal),
      taxTotal: Number(item.taxTotal),
      grandTotal: Number(item.grandTotal),
      paidAmount: Number(item.paidAmount),
      balanceDue: Number(item.balanceDue),
      status: item.status,
      issuedAt: item.issuedAt.toISOString(),
      createdAt: item.createdAt.toISOString(),
      items: item.items.map((i) => ({
        id: i.id,
        itemType: i.itemType,
        itemId: i.itemId,
        skuId: i.skuId,
        staffId: i.staffId,
        description: i.description,
        quantity: i.quantity,
        unitPrice: Number(i.unitPrice),
        discountAmount: Number(i.discountAmount),
        taxRate: Number(i.taxRate),
        taxAmount: Number(i.taxAmount),
        lineTotal: Number(i.lineTotal),
      })),
    };
  }

  public async findById(tenantId: string, id: string): Promise<InvoiceDto | null> {
    const record = await prisma.invoice.findFirst({
      where: { id, tenantId },
      include: { items: true },
    });
    if (!record) return null;
    return this.toDto(record);
  }

  public async list(
    tenantId: string,
    filters: { branchId?: string; customerId?: string; status?: InvoiceStatus; page: number; limit: number },
  ): Promise<{ items: InvoiceDto[]; total: number; page: number; limit: number }> {
    const where: Prisma.InvoiceWhereInput = { tenantId };
    if (filters.branchId) where.branchId = filters.branchId;
    if (filters.customerId) where.customerId = filters.customerId;
    if (filters.status) where.status = filters.status;

    const skip = (filters.page - 1) * filters.limit;
    const [total, records] = await Promise.all([
      prisma.invoice.count({ where }),
      prisma.invoice.findMany({
        where,
        skip,
        take: filters.limit,
        include: { items: true },
        orderBy: { issuedAt: 'desc' },
      }),
    ]);

    return {
      items: records.map((r) => this.toDto(r)),
      total,
      page: filters.page,
      limit: filters.limit,
    };
  }

  public async create(data: {
    tenantId: string;
    branchId: string;
    customerId?: string | null;
    appointmentId?: string | null;
    invoiceNumber: string;
    subtotal: number;
    discountTotal: number;
    taxTotal: number;
    grandTotal: number;
    paidAmount?: number;
    balanceDue?: number;
    status?: InvoiceStatus;
    items: Array<{
      itemType: ItemType;
      itemId: string;
      skuId?: string | null;
      staffId?: string | null;
      description?: string | null;
      quantity: number;
      unitPrice: number;
      discountAmount?: number;
      taxRate?: number;
      taxAmount?: number;
      lineTotal: number;
    }>;
  }): Promise<InvoiceDto> {
    const record = await prisma.invoice.create({
      data: {
        tenantId: data.tenantId,
        branchId: data.branchId,
        customerId: data.customerId,
        appointmentId: data.appointmentId,
        invoiceNumber: data.invoiceNumber,
        subtotal: new Prisma.Decimal(data.subtotal),
        discountTotal: new Prisma.Decimal(data.discountTotal || 0),
        taxTotal: new Prisma.Decimal(data.taxTotal || 0),
        grandTotal: new Prisma.Decimal(data.grandTotal),
        paidAmount: new Prisma.Decimal(data.paidAmount || 0),
        balanceDue: new Prisma.Decimal(data.balanceDue !== undefined ? data.balanceDue : data.grandTotal),
        status: data.status || 'PENDING_PAYMENT',
        items: {
          create: data.items.map((it) => ({
            tenantId: data.tenantId,
            itemType: it.itemType,
            itemId: it.itemId,
            skuId: it.skuId,
            staffId: it.staffId,
            description: it.description,
            quantity: it.quantity,
            unitPrice: new Prisma.Decimal(it.unitPrice),
            discountAmount: new Prisma.Decimal(it.discountAmount || 0),
            taxRate: new Prisma.Decimal(it.taxRate !== undefined ? it.taxRate : 18.0),
            taxAmount: new Prisma.Decimal(it.taxAmount || 0),
            lineTotal: new Prisma.Decimal(it.lineTotal),
          })),
        },
      },
      include: { items: true },
    });

    return this.toDto(record);
  }

  public async updatePaymentStatus(
    tenantId: string,
    invoiceId: string,
    paidAmount: number,
  ): Promise<InvoiceDto> {
    const invoice = await prisma.invoice.findFirst({
      where: { id: invoiceId, tenantId },
      include: { items: true },
    });
    if (!invoice) throw new NotFoundError('Invoice not found');

    const totalPaid = Number(invoice.paidAmount) + paidAmount;
    const balanceDue = Math.max(0, Number(invoice.grandTotal) - totalPaid);
    const status: InvoiceStatus = balanceDue === 0 ? 'PAID' : totalPaid > 0 ? 'PARTIALLY_PAID' : 'PENDING_PAYMENT';

    const updated = await prisma.invoice.update({
      where: { id: invoiceId },
      data: {
        paidAmount: new Prisma.Decimal(totalPaid),
        balanceDue: new Prisma.Decimal(balanceDue),
        status,
      },
      include: { items: true },
    });

    return this.toDto(updated);
  }
}

export const invoiceRepository = new InvoiceRepository();
