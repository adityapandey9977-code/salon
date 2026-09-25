import { type DomainEventName } from '@salon-spa-saas/events';
export declare class PlatformEventPublisher {
    private static instance;
    private bus;
    private constructor();
    static getInstance(): PlatformEventPublisher;
    connect(): Promise<void>;
    publishEvent<T extends Record<string, unknown>>(params: {
        eventType: DomainEventName | string;
        aggregateType: string;
        aggregateId: string;
        tenantId?: string;
        payload: T;
        userId?: string | null;
        correlationId?: string;
    }): Promise<void>;
    close(): Promise<void>;
}
export declare const eventPublisher: PlatformEventPublisher;
export declare const eventBus: {
    publish: (event: any) => Promise<void>;
};
//# sourceMappingURL=publisher.d.ts.map