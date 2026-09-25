import { type DomainEventName } from '@salon-spa-saas/events';
export declare class BookingEventPublisher {
    private static instance;
    private bus;
    private constructor();
    static getInstance(): BookingEventPublisher;
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
export declare const bookingEventPublisher: BookingEventPublisher;
//# sourceMappingURL=publisher.d.ts.map