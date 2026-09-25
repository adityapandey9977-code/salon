import type { CreateIntentParams, IPaymentProvider, IntentResult, PaymentLinkParams, PaymentLinkResult, RefundParams, RefundResult, VerifyPaymentParams, WebhookVerificationResult } from '../../domain/providers/payment-provider.interface';
export declare class RazorpayPaymentProvider implements IPaymentProvider {
    readonly providerName = "RAZORPAY";
    createPaymentIntent(params: CreateIntentParams): Promise<IntentResult>;
    verifyPayment(params: VerifyPaymentParams): Promise<boolean>;
    capturePayment(_providerTransactionId: string, _amount: number): Promise<boolean>;
    refundPayment(params: RefundParams): Promise<RefundResult>;
    createPaymentLink(params: PaymentLinkParams): Promise<PaymentLinkResult>;
    verifyWebhook(rawBody: string | Buffer, signature: string): Promise<WebhookVerificationResult>;
}
//# sourceMappingURL=razorpay-payment.provider.d.ts.map