import crypto from 'crypto';
import type {
  CreateIntentParams,
  IPaymentProvider,
  IntentResult,
  PaymentLinkParams,
  PaymentLinkResult,
  RefundParams,
  RefundResult,
  VerifyPaymentParams,
  WebhookVerificationResult,
} from '../../domain/providers/payment-provider.interface';

export class MockPaymentProvider implements IPaymentProvider {
  public readonly providerName = 'MOCK';

  public async createPaymentIntent(params: CreateIntentParams): Promise<IntentResult> {
    const id = `mock_intent_${crypto.randomUUID().slice(0, 8)}`;
    return {
      providerIntentId: id,
      providerOrderId: `mock_order_${crypto.randomUUID().slice(0, 8)}`,
      clientSecret: `mock_sec_${crypto.randomUUID().slice(0, 16)}`,
      status: 'PENDING',
    };
  }

  public async verifyPayment(_params: VerifyPaymentParams): Promise<boolean> {
    return true;
  }

  public async capturePayment(_providerTransactionId: string, _amount: number): Promise<boolean> {
    return true;
  }

  public async refundPayment(_params: RefundParams): Promise<RefundResult> {
    return {
      providerRefundId: `mock_rfnd_${crypto.randomUUID().slice(0, 8)}`,
      status: 'COMPLETED',
    };
  }

  public async createPaymentLink(params: PaymentLinkParams): Promise<PaymentLinkResult> {
    const id = crypto.randomUUID().slice(0, 8);
    return {
      providerLinkId: `mock_plink_${id}`,
      url: `https://pay.digiflexsalon.com/mock/${id}`,
      shortUrl: `https://dgfx.link/${id}`,
    };
  }

  public async verifyWebhook(
    rawBody: string | Buffer,
    signature: string,
  ): Promise<WebhookVerificationResult> {
    if (!signature || signature === 'invalid_signature') {
      return { isValid: false, error: 'Invalid webhook signature' };
    }

    try {
      const payload = typeof rawBody === 'string' ? JSON.parse(rawBody) : JSON.parse(rawBody.toString());
      return {
        isValid: true,
        eventId: payload.event_id || `evt_${crypto.randomUUID().slice(0, 8)}`,
        eventType: payload.event || 'payment.captured',
        paymentIntentId: payload.paymentIntentId,
        providerTransactionId: payload.transaction_id || `txn_${crypto.randomUUID().slice(0, 8)}`,
        amount: payload.amount,
        status: 'SUCCESS',
      };
    } catch {
      return { isValid: false, error: 'Malformed webhook payload' };
    }
  }
}
