import type { PaymentIntentDto, PaymentLinkDto, PaymentTransactionDto, RefundDto } from '../../domain/entities/payment.dto';
import { type PaymentMethod, type PaymentPurpose, type PaymentStatus } from '../prisma/generated-client';
export declare class PaymentRepository {
    private toIntentDto;
    private toTransactionDto;
    private toRefundDto;
    findIntentById(tenantId: string, id: string): Promise<PaymentIntentDto | null>;
    findIntentByIdempotencyKey(tenantId: string, idempotencyKey: string): Promise<PaymentIntentDto | null>;
    createIntent(data: {
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
    }): Promise<PaymentIntentDto>;
    recordTransaction(data: {
        tenantId: string;
        paymentIntentId: string;
        method: PaymentMethod;
        amount: number;
        currency?: string;
        status: PaymentStatus;
        provider: string;
        providerTransactionId?: string;
        providerOrderId?: string;
    }): Promise<PaymentTransactionDto>;
    createRefund(data: {
        tenantId: string;
        paymentTransactionId: string;
        amount: number;
        reason: string;
        providerRefundId?: string;
        requestedByPrincipalType: string;
        requestedByUserId?: string | null;
    }): Promise<RefundDto>;
    createPaymentLink(data: {
        tenantId: string;
        paymentIntentId: string;
        url: string;
        shortUrl: string;
        expiresInHours?: number;
    }): Promise<PaymentLinkDto>;
}
export declare const paymentRepository: PaymentRepository;
//# sourceMappingURL=payment.repository.d.ts.map