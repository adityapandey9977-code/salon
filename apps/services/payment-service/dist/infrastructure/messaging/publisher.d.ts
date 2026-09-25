import { type DomainEventName } from '@salon-spa-saas/events';
export declare class PaymentEventPublisher {
    private static instance;
    private bus;
    private constructor();
    static getInstance(): PaymentEventPublisher;
    publish<T extends Record<string, unknown>>(params: {
        eventType: DomainEventName;
        aggregateType: string;
        aggregateId: string;
        tenantId: string;
        payload: T;
        userId?: string | null;
        correlationId?: string;
    }): Promise<void>;
    close(): Promise<void>;
}
export declare const paymentEventPublisher: PaymentEventPublisher;
//# sourceMappingURL=publisher.d.ts.map