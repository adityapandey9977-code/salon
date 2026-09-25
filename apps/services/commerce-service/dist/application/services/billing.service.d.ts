import type { CalculateTaxRequest, CheckoutCartRequest, RequestRefund } from '@salon-spa-saas/contracts';
import type { InvoiceDto } from '../../domain/entities/commerce.dto';
export declare class BillingService {
    private generateInvoiceNumber;
    calculateTax(tenantId: string, input: CalculateTaxRequest): Promise<import("../../domain/calculations/tax.calc").TaxCalculationResult>;
    getInvoiceById(tenantId: string, id: string): Promise<InvoiceDto>;
    listInvoices(tenantId: string, filters: {
        branchId?: string;
        customerId?: string;
        status?: any;
        page: number;
        limit: number;
    }): Promise<{
        items: InvoiceDto[];
        total: number;
        page: number;
        limit: number;
    }>;
    checkout(tenantId: string, input: CheckoutCartRequest, userId?: string | null, correlationId?: string): Promise<{
        invoice: InvoiceDto;
    }>;
    handlePaymentCompleted(tenantId: string, invoiceId: string, amount: number, userId?: string | null, correlationId?: string): Promise<InvoiceDto>;
    private handlePaidInvoice;
    requestRefund(tenantId: string, input: RequestRefund, userId?: string | null, correlationId?: string): Promise<{
        message: string;
        invoiceId: string;
        amount: number;
    }>;
}
export declare const billingService: BillingService;
//# sourceMappingURL=billing.service.d.ts.map