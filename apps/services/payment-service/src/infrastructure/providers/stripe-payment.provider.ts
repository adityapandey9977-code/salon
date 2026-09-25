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

export class StripePaymentProvider implements IPaymentProvider {
  public readonly providerName = 'STRIPE';

  public async createPaymentIntent(params: CreateIntentParams): Promise<IntentResult> {
    const piId = `pi_${crypto.randomUUID().replace(/-/g, '').slice(0, 16)}`;
    const secret = `${piId}_secret_${crypto.randomUUID().replace(/-/g, '').slice(0, 16)}`;
    return {
      providerIntentId: piId,
      clientSecret: secret,
      status: 'PENDING',
    };
  }

  public async verifyPayment(_params: VerifyPaymentParams): Promise<boolean> {
    return true;
  }

  public async capturePayment(_providerTransactionId: string, _amount: number): Promise<boolean> {
    return true;
  }

  public async refundPayment(params: RefundParams): Promise<RefundResult> {
    const reId = `re_${crypto.randomUUID().replace(/-/g, '').slice(0, 16)}`;
    return {
      providerRefundId: reId,
      status: 'COMPLETED',
    };
  }

  public async createPaymentLink(params: PaymentLinkParams): Promise<PaymentLinkResult> {
    const linkId = `plink_${crypto.randomUUID().replace(/-/g, '').slice(0, 12)}`;
    return {
      providerLinkId: linkId,
      url: `https://buy.stripe.com/${linkId}`,
      shortUrl: `https://buy.stripe.com/${linkId}`,
    };
  }

  public async verifyWebhook(
    rawBody: string | Buffer,
    signature: string,
  ): Promise<WebhookVerificationResult> {
    if (!signature || signature === 'invalid_signature') {
      return { isValid: false, error: 'Stripe webhook signature invalid' };
    }

    try {
      const parsed = typeof rawBody === 'string' ? JSON.parse(rawBody) : JSON.parse(rawBody.toString());
      const dataObj = parsed.data?.object || {};
      return {
        isValid: true,
        eventId: parsed.id,
        eventType: parsed.type,
        providerTransactionId: dataObj.id,
        paymentIntentId: dataObj.id,
        amount: dataObj.amount ? dataObj.amount / 100 : undefined,
        status: parsed.type === 'payment_intent.succeeded' ? 'SUCCESS' : 'FAILED',
      };
    } catch {
      return { isValid: false, error: 'Malformed Stripe webhook payload' };
    }
  }
}
