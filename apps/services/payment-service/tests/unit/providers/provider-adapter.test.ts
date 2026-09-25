import { describe, expect, it } from 'vitest';
import { PaymentProviderFactory } from '../../../src/infrastructure/providers/provider.factory';
import { RazorpayPaymentProvider } from '../../../src/infrastructure/providers/razorpay-payment.provider';
import { StripePaymentProvider } from '../../../src/infrastructure/providers/stripe-payment.provider';

describe('Payment Provider Adapters Unit Tests', () => {
  it('should instantiate and return Razorpay provider', () => {
    const provider = PaymentProviderFactory.getProvider('RAZORPAY');
    expect(provider).toBeInstanceOf(RazorpayPaymentProvider);
    expect(provider.providerName).toBe('RAZORPAY');
  });

  it('should instantiate and return Stripe provider', () => {
    const provider = PaymentProviderFactory.getProvider('STRIPE');
    expect(provider).toBeInstanceOf(StripePaymentProvider);
    expect(provider.providerName).toBe('STRIPE');
  });

  it('should fallback to Mock provider for unknown providers', () => {
    const provider = PaymentProviderFactory.getProvider('UNKNOWN_GATEWAY');
    expect(provider.providerName).toBe('MOCK');
  });

  it('should generate valid mock intent', async () => {
    const provider = PaymentProviderFactory.getProvider('MOCK');
    const result = await provider.createPaymentIntent({
      amount: 1500,
      currency: 'INR',
      receiptId: 'test-rec-1',
    });

    expect(result.providerIntentId).toBeDefined();
    expect(result.status).toBe('PENDING');
  });
});
