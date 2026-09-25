import type { InvoiceDto } from '../../domain/entities/commerce.dto';
import { type InvoiceStatus, type ItemType } from '../prisma/generated-client';
export declare class InvoiceRepository {
    private toDto;
    findById(tenantId: string, id: string): Promise<InvoiceDto | null>;
    list(tenantId: string, filters: {
        branchId?: string;
        customerId?: string;
        status?: InvoiceStatus;
        page: number;
        limit: number;
    }): Promise<{
        items: InvoiceDto[];
        total: number;
        page: number;
        limit: number;
    }>;
    create(data: {
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
    }): Promise<InvoiceDto>;
    updatePaymentStatus(tenantId: string, invoiceId: string, paidAmount: number): Promise<InvoiceDto>;
}
export declare const invoiceRepository: InvoiceRepository;
//# sourceMappingURL=invoice.repository.d.ts.map