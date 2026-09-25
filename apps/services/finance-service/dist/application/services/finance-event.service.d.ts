import { JournalService } from './journal.service';
import { CommissionService } from './commission.service';
import { RoyaltyService } from './royalty.service';
import { AccountRepository } from '../../infrastructure/repositories/account.repository';
import { FinanceReadStore } from '../../infrastructure/redis/finance-read.store';
export declare class FinanceEventService {
    private journalService;
    private commissionService;
    private royaltyService;
    private accountRepo;
    private cache;
    constructor(journalService?: JournalService, commissionService?: CommissionService, royaltyService?: RoyaltyService, accountRepo?: AccountRepository, cache?: FinanceReadStore);
    /**
     * Handle SALE_COMPLETED.v1:
     * 1. Post Revenue & Tax double-entry journal (Debits Accounts Receivable, Credits Service/Retail Revenue & Tax Payable)
     * 2. Calculate & record staff commission for each line item
     * 3. If branch belongs to franchise, calculate franchise royalty
     */
    handleSaleCompleted(event: {
        eventId: string;
        tenantId: string;
        branchId?: string;
        payload: {
            saleId: string;
            invoiceId: string;
            branchId?: string;
            franchiseId?: string;
            subtotal: number;
            taxTotal: number;
            grandTotal: number;
            items: Array<{
                id: string;
                type: 'SERVICE' | 'PRODUCT' | 'PACKAGE';
                serviceId?: string;
                skuId?: string;
                performedByStaffId?: string;
                soldByStaffId?: string;
                price: number;
                taxAmount?: number;
                lineTotal: number;
            }>;
        };
    }): Promise<void>;
    /**
     * Handle PAYMENT_COMPLETED.v1:
     * Double-entry: Debit Cash/Bank (1000), Credit Accounts Receivable (1100)
     */
    handlePaymentCompleted(event: {
        eventId: string;
        tenantId: string;
        branchId?: string;
        payload: {
            paymentId: string;
            invoiceId: string;
            amount: number;
            method: string;
        };
    }): Promise<void>;
    /**
     * Handle REFUND_COMPLETED.v1:
     * Double-entry: Debit Revenue/Refund (4000), Credit Bank (1000)
     */
    handleRefundCompleted(event: {
        eventId: string;
        tenantId: string;
        branchId?: string;
        payload: {
            refundId: string;
            paymentId: string;
            invoiceId: string;
            amount: number;
        };
    }): Promise<void>;
    /**
     * Handle GOODS_RECEIVED.v1:
     * Double-entry: Debit Inventory Asset (1200), Credit Accounts Payable (2000)
     */
    handleGoodsReceived(event: {
        eventId: string;
        tenantId: string;
        branchId?: string;
        payload: {
            grnId: string;
            grnNumber: string;
            purchaseOrderId: string;
            poNumber: string;
            supplierId: string;
            totalCost?: number;
        };
    }): Promise<void>;
}
//# sourceMappingURL=finance-event.service.d.ts.map