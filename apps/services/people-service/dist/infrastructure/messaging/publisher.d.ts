import { type DomainEventName } from '@salon-spa-saas/events';
export declare class PeopleEventPublisher {
    private static instance;
    private bus;
    private constructor();
    static getInstance(): PeopleEventPublisher;
    connect(): Promise<void>;
    publishEvent<T extends Record<string, unknown>>(params: {
        eventType: DomainEventName | string;
        aggregateType: string;
        aggregateId: string;
        tenantId: string;
        payload: T;
        userId?: string | null;
        correlationId?: string;
    }): Promise<void>;
    close(): Promise<void>;
}
export declare const eventPublisher: PeopleEventPublisher;
//# sourceMappingURL=publisher.d.ts.map