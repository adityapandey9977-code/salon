export interface CreateIntentParams {
    amount: number;
    currency: string;
    receiptId: string;
    metadata?: Record<string, any>;
}
export interface IntentResult {
    providerIntentId: string;
    providerOrderId?: string;
    clientSecret?: string;
    status: 'PENDING' | 'REQUIRES_ACTION' | 'CAPTURED';
    rawPayload?: any;
}
export interface VerifyPaymentParams {
    providerTransactionId: string;
    providerOrderId?: string;
    providerSignature?: string;
    rawPayload?: any;
}
export interface RefundParams {
    providerTransactionId: string;
    amount: number;
    currency: string;
    reason?: string;
}
export interface RefundResult {
    providerRefundId: string;
    status: 'COMPLETED' | 'PROCESSING' | 'FAILED';
    rawPayload?: any;
}
export interface PaymentLinkParams {
    amount: number;
    currency: string;
    description: string;
    customerName?: string;
    customerEmail?: string;
    customerPhone?: string;
}
export interface PaymentLinkResult {
    url: string;
    shortUrl: string;
    providerLinkId: string;
}
export interface WebhookVerificationResult {
    isValid: boolean;
    eventId?: string;
    eventType?: string;
    paymentIntentId?: string;
    providerTransactionId?: string;
    amount?: number;
    status?: 'SUCCESS' | 'FAILED';
    error?: string;
}
export interface IPaymentProvider {
    readonly providerName: string;
    createPaymentIntent(params: CreateIntentParams): Promise<IntentResult>;
    verifyPayment(params: VerifyPaymentParams): Promise<boolean>;
    capturePayment(providerTransactionId: string, amount: number): Promise<boolean>;
    refundPayment(params: RefundParams): Promise<RefundResult>;
    createPaymentLink(params: PaymentLinkParams): Promise<PaymentLinkResult>;
    verifyWebhook(rawBody: string | Buffer, signature: string, headers?: Record<string, any>): Promise<WebhookVerificationResult>;
}
//# sourceMappingURL=payment-provider.interface.d.ts.map