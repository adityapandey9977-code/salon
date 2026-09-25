import type { CreateIntentParams, IPaymentProvider, IntentResult, PaymentLinkParams, PaymentLinkResult, RefundParams, RefundResult, VerifyPaymentParams, WebhookVerificationResult } from '../../domain/providers/payment-provider.interface';
export declare class MockPaymentProvider implements IPaymentProvider {
    readonly providerName = "MOCK";
    createPaymentIntent(params: CreateIntentParams): Promise<IntentResult>;
    verifyPayment(_params: VerifyPaymentParams): Promise<boolean>;
    capturePayment(_providerTransactionId: string, _amount: number): Promise<boolean>;
    refundPayment(_params: RefundParams): Promise<RefundResult>;
    createPaymentLink(params: PaymentLinkParams): Promise<PaymentLinkResult>;
    verifyWebhook(rawBody: string | Buffer, signature: string): Promise<WebhookVerificationResult>;
}
//# sourceMappingURL=mock-payment.provider.d.ts.map