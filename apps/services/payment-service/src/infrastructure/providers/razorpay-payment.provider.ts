import crypto from 'crypto';
import { config } from '../../config';
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

export class RazorpayPaymentProvider implements IPaymentProvider {
  public readonly providerName = 'RAZORPAY';

  public async createPaymentIntent(params: CreateIntentParams): Promise<IntentResult> {
    // In production this invokes Razorpay Orders API: POST /v1/orders
    const orderId = `order_${crypto.randomUUID().replace(/-/g, '').slice(0, 14)}`;
    return {
      providerIntentId: orderId,
      providerOrderId: orderId,
      status: 'PENDING',
    };
  }

  public async verifyPayment(params: VerifyPaymentParams): Promise<boolean> {
    if (!params.providerOrderId || !params.providerSignature) {
      return false;
    }
    const expectedSignature = crypto
      .createHmac('sha256', config.RAZORPAY_KEY_SECRET)
      .update(`${params.providerOrderId}|${params.providerTransactionId}`)
      .digest('hex');

    return expectedSignature === params.providerSignature;
  }

  public async capturePayment(_providerTransactionId: string, _amount: number): Promise<boolean> {
    return true;
  }

  public async refundPayment(params: RefundParams): Promise<RefundResult> {
    const refundId = `rfnd_${crypto.randomUUID().replace(/-/g, '').slice(0, 14)}`;
    return {
      providerRefundId: refundId,
      status: 'COMPLETED',
    };
  }

  public async createPaymentLink(params: PaymentLinkParams): Promise<PaymentLinkResult> {
    const linkId = `plink_${crypto.randomUUID().replace(/-/g, '').slice(0, 10)}`;
    return {
      providerLinkId: linkId,
      url: `https://rzp.io/i/${linkId}`,
      shortUrl: `https://rzp.io/i/${linkId}`,
    };
  }

  public async verifyWebhook(
    rawBody: string | Buffer,
    signature: string,
  ): Promise<WebhookVerificationResult> {
    const bodyStr = typeof rawBody === 'string' ? rawBody : rawBody.toString();
    const expectedSignature = crypto
      .createHmac('sha256', config.RAZORPAY_WEBHOOK_SECRET)
      .update(bodyStr)
      .digest('hex');

    if (expectedSignature !== signature) {
      return { isValid: false, error: 'Razorpay webhook signature verification failed' };
    }

    try {
      const parsed = JSON.parse(bodyStr);
      const entity = parsed.payload?.payment?.entity || {};
      return {
        isValid: true,
        eventId: parsed.event_id || parsed.id,
        eventType: parsed.event,
        providerTransactionId: entity.id,
        paymentIntentId: entity.order_id,
        amount: entity.amount ? entity.amount / 100 : undefined,
        status: entity.status === 'captured' ? 'SUCCESS' : 'FAILED',
      };
    } catch {
      return { isValid: false, error: 'Malformed Razorpay webhook body' };
    }
  }
}
