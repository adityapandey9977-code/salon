import { JournalService } from './journal.service';
import { CommissionService } from './commission.service';
import { RoyaltyService } from './royalty.service';
import { AccountRepository } from '../../infrastructure/repositories/account.repository';
import { FinanceReadStore } from '../../infrastructure/redis/finance-read.store';
import { createLogger } from '@salon-spa-saas/logger';
const logger = createLogger('finance-event-service');
export class FinanceEventService {
    journalService;
    commissionService;
    royaltyService;
    accountRepo;
    cache;
    constructor(journalService = new JournalService(), commissionService = new CommissionService(), royaltyService = new RoyaltyService(), accountRepo = new AccountRepository(), cache = new FinanceReadStore()) {
        this.journalService = journalService;
        this.commissionService = commissionService;
        this.royaltyService = royaltyService;
        this.accountRepo = accountRepo;
        this.cache = cache;
    }
    /**
     * Handle SALE_COMPLETED.v1:
     * 1. Post Revenue & Tax double-entry journal (Debits Accounts Receivable, Credits Service/Retail Revenue & Tax Payable)
     * 2. Calculate & record staff commission for each line item
     * 3. If branch belongs to franchise, calculate franchise royalty
     */
    async handleSaleCompleted(event) {
        const isFirstTime = await this.cache.checkAndMarkProcessed(`sale-fin:${event.eventId}`);
        if (!isFirstTime) {
            logger.info({ eventId: event.eventId }, 'SaleCompleted event already processed, skipping duplicate');
            return;
        }
        const { tenantId, payload } = event;
        const branchId = payload.branchId || event.branchId;
        // 1. Double-Entry Revenue Journal
        try {
            const arAccount = await this.accountRepo.findByCode(tenantId, '1100'); // Accounts Receivable
            const revAccount = await this.accountRepo.findByCode(tenantId, '4000'); // Sales Revenue
            const taxAccount = await this.accountRepo.findByCode(tenantId, '2200'); // GST/Tax Payable
            if (arAccount && revAccount) {
                const lines = [
                    {
                        accountId: arAccount.id,
                        debit: payload.grandTotal,
                        description: `Receivable for invoice ${payload.invoiceId}`,
                    },
                    {
                        accountId: revAccount.id,
                        credit: payload.subtotal,
                        description: `Revenue for invoice ${payload.invoiceId}`,
                    },
                ];
                if (payload.taxTotal > 0 && taxAccount) {
                    lines.push({
                        accountId: taxAccount.id,
                        credit: payload.taxTotal,
                        description: `Tax payable for invoice ${payload.invoiceId}`,
                    });
                }
                await this.journalService.postJournal(tenantId, {
                    branchId,
                    sourceType: 'SALE',
                    sourceId: payload.saleId || payload.invoiceId,
                    description: `Sale completion journal for invoice ${payload.invoiceId}`,
                    lines,
                });
            }
        }
        catch (jErr) {
            logger.warn({ err: jErr.message }, 'Failed to post revenue journal on sale completed');
        }
        // 2. Staff Commission Calculation
        for (const item of payload.items || []) {
            const staffId = item.performedByStaffId || item.soldByStaffId;
            if (staffId) {
                try {
                    await this.commissionService.calculateAndRecordCommission(tenantId, {
                        branchId: branchId || 'default-branch',
                        employeeId: staffId,
                        saleId: payload.saleId,
                        invoiceId: payload.invoiceId,
                        invoiceItemId: item.id,
                        itemType: item.type === 'PRODUCT' ? 'PRODUCT' : 'SERVICE',
                        serviceId: item.serviceId,
                        amount: item.price || item.lineTotal,
                    });
                }
                catch (cErr) {
                    logger.warn({ err: cErr.message, staffId }, 'Failed to calculate commission on item');
                }
            }
        }
        // 3. Franchise Royalty Calculation
        if (payload.franchiseId && branchId) {
            try {
                let serviceRevenue = 0;
                for (const item of payload.items || []) {
                    if (item.type === 'SERVICE')
                        serviceRevenue += item.lineTotal;
                }
                await this.royaltyService.calculateAndRecordRoyalty({
                    tenantId,
                    branchId,
                    franchiseId: payload.franchiseId,
                    invoiceId: payload.invoiceId,
                    saleId: payload.saleId,
                    grossSales: payload.grandTotal,
                    netSales: payload.subtotal,
                    serviceRevenue,
                });
            }
            catch (rErr) {
                logger.warn({ err: rErr.message, franchiseId: payload.franchiseId }, 'Failed to calculate royalty on sale');
            }
        }
    }
    /**
     * Handle PAYMENT_COMPLETED.v1:
     * Double-entry: Debit Cash/Bank (1000), Credit Accounts Receivable (1100)
     */
    async handlePaymentCompleted(event) {
        const isFirstTime = await this.cache.checkAndMarkProcessed(`pay-fin:${event.eventId}`);
        if (!isFirstTime)
            return;
        const { tenantId, payload } = event;
        const branchId = event.branchId;
        try {
            const bankAccount = await this.accountRepo.findByCode(tenantId, '1000'); // Cash & Bank
            const arAccount = await this.accountRepo.findByCode(tenantId, '1100'); // Accounts Receivable
            if (bankAccount && arAccount) {
                await this.journalService.postJournal(tenantId, {
                    branchId,
                    sourceType: 'PAYMENT',
                    sourceId: payload.paymentId,
                    description: `Payment receipt (${payload.method}) for invoice ${payload.invoiceId}`,
                    lines: [
                        {
                            accountId: bankAccount.id,
                            debit: payload.amount,
                            description: `Receipt in Bank/Cash via ${payload.method}`,
                        },
                        {
                            accountId: arAccount.id,
                            credit: payload.amount,
                            description: `AR clearance for invoice ${payload.invoiceId}`,
                        },
                    ],
                });
            }
        }
        catch (err) {
            logger.warn({ err: err.message }, 'Failed to post payment journal entry');
        }
    }
    /**
     * Handle REFUND_COMPLETED.v1:
     * Double-entry: Debit Revenue/Refund (4000), Credit Bank (1000)
     */
    async handleRefundCompleted(event) {
        const isFirstTime = await this.cache.checkAndMarkProcessed(`ref-fin:${event.eventId}`);
        if (!isFirstTime)
            return;
        const { tenantId, payload } = event;
        try {
            const revAccount = await this.accountRepo.findByCode(tenantId, '4000'); // Sales Revenue
            const bankAccount = await this.accountRepo.findByCode(tenantId, '1000'); // Cash & Bank
            if (revAccount && bankAccount) {
                await this.journalService.postJournal(tenantId, {
                    branchId: event.branchId,
                    sourceType: 'REFUND',
                    sourceId: payload.refundId,
                    description: `Customer refund for invoice ${payload.invoiceId}`,
                    lines: [
                        {
                            accountId: revAccount.id,
                            debit: payload.amount,
                            description: 'Refund revenue reversal',
                        },
                        {
                            accountId: bankAccount.id,
                            credit: payload.amount,
                            description: 'Cash/Bank refund payout',
                        },
                    ],
                });
            }
        }
        catch (err) {
            logger.warn({ err: err.message }, 'Failed to post refund journal entry');
        }
    }
    /**
     * Handle GOODS_RECEIVED.v1:
     * Double-entry: Debit Inventory Asset (1200), Credit Accounts Payable (2000)
     */
    async handleGoodsReceived(event) {
        const isFirstTime = await this.cache.checkAndMarkProcessed(`grn-fin:${event.eventId}`);
        if (!isFirstTime)
            return;
        const { tenantId, payload } = event;
        const totalCost = payload.totalCost || 5000;
        try {
            const invAccount = await this.accountRepo.findByCode(tenantId, '1200'); // Inventory Asset
            const apAccount = await this.accountRepo.findByCode(tenantId, '2000'); // Accounts Payable
            if (invAccount && apAccount) {
                await this.journalService.postJournal(tenantId, {
                    branchId: event.branchId,
                    sourceType: 'GRN',
                    sourceId: payload.grnId,
                    description: `Inventory goods received from PO ${payload.poNumber} (${payload.grnNumber})`,
                    lines: [
                        {
                            accountId: invAccount.id,
                            debit: totalCost,
                            description: `Inventory asset increase from GRN ${payload.grnNumber}`,
                        },
                        {
                            accountId: apAccount.id,
                            credit: totalCost,
                            description: `Supplier payable accrued for GRN ${payload.grnNumber}`,
                        },
                    ],
                });
            }
        }
        catch (err) {
            logger.warn({ err: err.message }, 'Failed to post GRN journal entry');
        }
    }
}
