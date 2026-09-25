import { MockPaymentProvider } from './mock-payment.provider';
import { RazorpayPaymentProvider } from './razorpay-payment.provider';
import { StripePaymentProvider } from './stripe-payment.provider';
export class PaymentProviderFactory {
    static providers = new Map([
        ['MOCK', new MockPaymentProvider()],
        ['RAZORPAY', new RazorpayPaymentProvider()],
        ['STRIPE', new StripePaymentProvider()],
    ]);
    static getProvider(name) {
        const key = (name || 'MOCK').toUpperCase();
        return this.providers.get(key) || this.providers.get('MOCK');
    }
}
