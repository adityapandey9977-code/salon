export interface PaymentTransactionDto {
    id: string;
    tenantId: string;
    paymentIntentId: string;
    method: string;
    amount: number;
    currency: string;
    status: string;
    provider: string;
    providerTransactionId?: string | null;
    providerOrderId?: string | null;
    paidAt?: string | null;
    failedAt?: string | null;
    createdAt: string;
}
export interface PaymentIntentDto {
    id: string;
    tenantId: string;
    purpose: string;
    referenceType?: string | null;
    referenceId?: string | null;
    customerId?: string | null;
    amount: number;
    currency: string;
    status: string;
    provider?: string | null;
    providerIntentId?: string | null;
    idempotencyKey: string;
    expiresAt?: string | null;
    transactions?: PaymentTransactionDto[];
    createdAt: string;
    updatedAt: string;
}
export interface RefundDto {
    id: string;
    tenantId: string;
    paymentTransactionId: string;
    amount: number;
    reason: string;
    status: string;
    providerRefundId?: string | null;
    requestedByPrincipalType: string;
    requestedByUserId?: string | null;
    requestedAt: string;
    processedAt?: string | null;
    createdAt: string;
}
export interface PaymentLinkDto {
    id: string;
    tenantId: string;
    paymentIntentId: string;
    url: string;
    shortUrl: string;
    expiresAt: string;
    isPaid: boolean;
    createdAt: string;
}
export interface SettlementReconciliationDto {
    id: string;
    tenantId: string;
    provider: string;
    settlementDate: string;
    totalAmount: number;
    feeAmount: number;
    taxAmount: number;
    netAmount: number;
    status: string;
    createdAt: string;
}
//# sourceMappingURL=payment.dto.d.ts.map