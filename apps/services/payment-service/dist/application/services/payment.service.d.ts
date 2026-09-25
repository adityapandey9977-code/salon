import type { PaymentIntentDto, PaymentLinkDto, PaymentTransactionDto, RefundDto } from '../../domain/entities/payment.dto';
import type { PaymentMethod, PaymentPurpose, PaymentStatus } from '../../infrastructure/prisma/generated-client';
export declare class PaymentService {
    createIntent(tenantId: string, data: {
        purpose?: PaymentPurpose;
        referenceType?: string | null;
        referenceId?: string | null;
        customerId?: string | null;
        amount: number;
        currency?: string;
        provider?: string;
        idempotencyKey: string;
    }, actor: {
        principalType: string;
        userId?: string | null;
    }): Promise<PaymentIntentDto>;
    getIntentById(tenantId: string, id: string): Promise<PaymentIntentDto>;
    recordTransaction(tenantId: string, data: {
        paymentIntentId: string;
        method: PaymentMethod;
        amount: number;
        currency?: string;
        status?: PaymentStatus;
        provider?: string;
        providerTransactionId?: string;
        providerOrderId?: string;
        providerSignature?: string;
    }, actor: {
        principalType: string;
        userId?: string | null;
    }): Promise<PaymentTransactionDto>;
    refund(tenantId: string, data: {
        paymentTransactionId: string;
        amount: number;
        reason: string;
    }, actor: {
        principalType: string;
        userId?: string | null;
    }): Promise<RefundDto>;
    createPaymentLink(tenantId: string, data: {
        paymentIntentId: string;
        amount: number;
        currency?: string;
        description?: string;
    }): Promise<PaymentLinkDto>;
}
export declare const paymentService: PaymentService;
//# sourceMappingURL=payment.service.d.ts.map