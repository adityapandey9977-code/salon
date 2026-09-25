import { ConflictError, NotFoundError } from '@salon-spa-saas/common-types';
import type {
  CalculateTaxRequest,
  CheckoutCartRequest,
  RequestRefund,
} from '@salon-spa-saas/contracts';
import { DOMAIN_EVENTS } from '@salon-spa-saas/events';
import { calculateCartTax } from '../../domain/calculations/tax.calc';
import type { InvoiceDto } from '../../domain/entities/commerce.dto';
import { commerceEventPublisher } from '../../infrastructure/messaging/publisher';
import { invoiceRepository } from '../../infrastructure/repositories/invoice.repository';
import { loyaltyRepository } from '../../infrastructure/repositories/loyalty.repository';
import { membershipRepository } from '../../infrastructure/repositories/membership.repository';
import { packageRepository } from '../../infrastructure/repositories/package.repository';
import { walletRepository } from '../../infrastructure/repositories/wallet.repository';

export class BillingService {
  private generateInvoiceNumber(): string {
    const random = Math.floor(1000 + Math.random() * 9000);
    return `INV-${Date.now().toString().slice(-4)}${random}`;
  }

  public async calculateTax(tenantId: string, input: CalculateTaxRequest) {
    const items = input.items.map((it) => ({
      itemType: it.itemType,
      unitPrice: it.unitPrice,
      quantity: it.quantity,
      discountAmount: it.discountAmount,
    }));

    return calculateCartTax(items);
  }

  public async getInvoiceById(tenantId: string, id: string): Promise<InvoiceDto> {
    const record = await invoiceRepository.findById(tenantId, id);
    if (!record) throw new NotFoundError('Invoice not found');
    return record;
  }

  public async listInvoices(
    tenantId: string,
    filters: { branchId?: string; customerId?: string; status?: any; page: number; limit: number },
  ) {
    return invoiceRepository.list(tenantId, filters);
  }

  public async checkout(
    tenantId: string,
    input: CheckoutCartRequest,
    userId: string | null = null,
    correlationId?: string,
  ): Promise<{ invoice: InvoiceDto }> {
    // 1. Calculate Tax & Line Items
    const taxResult = calculateCartTax(
      input.items.map((it) => ({
        itemType: it.itemType,
        unitPrice: it.unitPrice,
        quantity: it.quantity,
        discountAmount: it.discountAmount,
      })),
    );

    let payableAmount = taxResult.grandTotal;

    // 2. Handle Wallet Redemption if applicable
    if (input.walletAmountToRedeem && input.walletAmountToRedeem > 0 && input.customerId) {
      const walletBalance = await walletRepository.getBalance(tenantId, input.customerId);
      if (walletBalance < input.walletAmountToRedeem) {
        throw new ConflictError('Insufficient wallet balance to redeem');
      }
      await walletRepository.postTransaction({
        tenantId,
        customerId: input.customerId,
        type: 'DEBIT',
        amount: input.walletAmountToRedeem,
        referenceType: 'POS_CHECKOUT',
      });
      payableAmount = Math.max(0, payableAmount - input.walletAmountToRedeem);
    }

    // 3. Handle Loyalty Points Redemption
    if (input.loyaltyPointsToRedeem && input.loyaltyPointsToRedeem > 0 && input.customerId) {
      await loyaltyRepository.postTransaction({
        tenantId,
        customerId: input.customerId,
        type: 'REDEEM',
        points: input.loyaltyPointsToRedeem,
        referenceType: 'POS_CHECKOUT',
      });
    }

    const invoiceNumber = this.generateInvoiceNumber();
    const paidAmount = input.paymentMethod === 'CASH' ? taxResult.grandTotal : 0;
    const balanceDue = taxResult.grandTotal - paidAmount;
    const initialStatus = paidAmount >= taxResult.grandTotal ? 'PAID' : 'PENDING_PAYMENT';

    // 4. Create Invoice in PostgreSQL
    const invoice = await invoiceRepository.create({
      tenantId,
      branchId: input.branchId,
      customerId: input.customerId,
      appointmentId: input.appointmentId,
      invoiceNumber,
      subtotal: taxResult.subtotal,
      discountTotal: taxResult.discountTotal,
      taxTotal: taxResult.taxTotal,
      grandTotal: taxResult.grandTotal,
      paidAmount,
      balanceDue,
      status: initialStatus,
      items: input.items.map((it, idx) => ({
        itemType: it.itemType,
        itemId: it.itemId,
        skuId: it.skuId,
        staffId: it.staffId,
        description: it.description,
        quantity: it.quantity,
        unitPrice: it.unitPrice,
        discountAmount: it.discountAmount,
        taxRate: taxResult.items[idx]?.taxRate || 18.0,
        taxAmount: taxResult.items[idx]?.taxAmount || 0,
        lineTotal: taxResult.items[idx]?.lineTotal || it.unitPrice * it.quantity,
      })),
    });

    // 5. Publish Invoice Created
    await commerceEventPublisher.publish({
      eventType: DOMAIN_EVENTS.INVOICE_CREATED,
      aggregateType: 'Invoice',
      aggregateId: invoice.id,
      tenantId,
      userId,
      correlationId,
      payload: {
        tenantId,
        branchId: input.branchId,
        invoiceId: invoice.id,
        invoiceNumber: invoice.invoiceNumber,
        clientId: input.customerId || '',
        subtotal: invoice.subtotal,
        taxAmount: invoice.taxTotal,
        discountAmount: invoice.discountTotal,
        grandTotal: invoice.grandTotal,
        items: invoice.items.map((i) => ({
          itemId: i.itemId,
          itemType: i.itemType,
          quantity: i.quantity,
          unitPrice: i.unitPrice,
          staffId: i.staffId || undefined,
        })),
      },
    });

    // If fully paid immediately (e.g. Cash), emit SaleCompleted and trigger package/membership activation
    if (initialStatus === 'PAID') {
      await this.handlePaidInvoice(tenantId, invoice, userId, correlationId);
    }

    return { invoice };
  }

  public async handlePaymentCompleted(
    tenantId: string,
    invoiceId: string,
    amount: number,
    userId: string | null = null,
    correlationId?: string,
  ): Promise<InvoiceDto> {
    const updated = await invoiceRepository.updatePaymentStatus(tenantId, invoiceId, amount);

    if (updated.status === 'PAID') {
      await this.handlePaidInvoice(tenantId, updated, userId, correlationId);
    }

    return updated;
  }

  private async handlePaidInvoice(
    tenantId: string,
    invoice: InvoiceDto,
    userId: string | null = null,
    correlationId?: string,
  ): Promise<void> {
    // 1. Publish SaleCompleted
    await commerceEventPublisher.publish({
      eventType: DOMAIN_EVENTS.SALE_COMPLETED,
      aggregateType: 'Invoice',
      aggregateId: invoice.id,
      tenantId,
      userId,
      correlationId,
      payload: {
        tenantId,
        branchId: invoice.branchId,
        invoiceId: invoice.id,
        clientId: invoice.customerId || '',
        grandTotal: invoice.grandTotal,
        paymentId: invoice.id,
        items: invoice.items.map((it) => ({
          itemId: it.itemId,
          itemType: it.itemType,
          skuId: it.skuId || undefined,
          quantity: it.quantity,
          unitPrice: it.unitPrice,
          staffId: it.staffId || undefined,
        })),
        completedAt: new Date().toISOString(),
      },
    });

    // 2. Accrue Loyalty Points if customer is associated
    if (invoice.customerId) {
      const pointsToEarn = Math.floor(invoice.grandTotal / 100); // 1 point per 100 INR spent
      if (pointsToEarn > 0) {
        await loyaltyRepository.postTransaction({
          tenantId,
          customerId: invoice.customerId,
          type: 'EARN',
          points: pointsToEarn,
          referenceType: 'INVOICE',
          referenceId: invoice.id,
        });

        await commerceEventPublisher.publish({
          eventType: DOMAIN_EVENTS.LOYALTY_POINTS_EARNED,
          aggregateType: 'Loyalty',
          aggregateId: invoice.customerId,
          tenantId,
          userId,
          correlationId,
          payload: {
            tenantId,
            clientId: invoice.customerId,
            pointsEarned: pointsToEarn,
            currentBalance: pointsToEarn,
            invoiceId: invoice.id,
          },
        });
      }

      // 3. Activate Purchased Packages or Memberships
      for (const item of invoice.items) {
        if (item.itemType === 'PACKAGE') {
          const pkg = await packageRepository.findById(tenantId, item.itemId);
          if (pkg) {
            await packageRepository.createCustomerPackage({
              tenantId,
              customerId: invoice.customerId,
              packageId: pkg.id,
              purchaseInvoiceId: invoice.id,
              validityDays: pkg.validityDays,
            });
          }
        } else if (item.itemType === 'MEMBERSHIP') {
          const mem = await membershipRepository.findById(tenantId, item.itemId);
          if (mem) {
            await membershipRepository.createCustomerMembership({
              tenantId,
              customerId: invoice.customerId,
              membershipPlanId: mem.id,
              durationMonths: mem.billingPeriod === 'ANNUAL' ? 12 : 1,
            });
          }
        }
      }
    }
  }

  public async requestRefund(
    tenantId: string,
    input: RequestRefund,
    userId: string | null = null,
    correlationId?: string,
  ) {
    const invoice = await invoiceRepository.findById(tenantId, input.invoiceId);
    if (!invoice) throw new NotFoundError('Invoice not found');

    if (input.amount > invoice.paidAmount) {
      throw new ConflictError('Refund amount exceeds paid amount');
    }

    await commerceEventPublisher.publish({
      eventType: DOMAIN_EVENTS.REFUND_REQUESTED,
      aggregateType: 'Invoice',
      aggregateId: input.invoiceId,
      tenantId,
      userId,
      correlationId,
      payload: {
        tenantId,
        invoiceId: input.invoiceId,
        amount: input.amount,
        reason: input.reason,
      },
    });

    return { message: 'Refund requested successfully', invoiceId: input.invoiceId, amount: input.amount };
  }
}

export const billingService = new BillingService();
