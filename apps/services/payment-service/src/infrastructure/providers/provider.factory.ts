import type { IPaymentProvider } from '../../domain/providers/payment-provider.interface';
import { MockPaymentProvider } from './mock-payment.provider';
import { RazorpayPaymentProvider } from './razorpay-payment.provider';
import { StripePaymentProvider } from './stripe-payment.provider';

export class PaymentProviderFactory {
  private static providers: Map<string, IPaymentProvider> = new Map<string, IPaymentProvider>([
    ['MOCK', new MockPaymentProvider()],
    ['RAZORPAY', new RazorpayPaymentProvider()],
    ['STRIPE', new StripePaymentProvider()],
  ]);

  public static getProvider(name?: string): IPaymentProvider {
    const key = (name || 'MOCK').toUpperCase();
    return this.providers.get(key) || this.providers.get('MOCK')!;
  }
}
