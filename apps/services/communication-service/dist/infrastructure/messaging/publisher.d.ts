import { type DomainEventName } from '@salon-spa-saas/events';
export declare class CommunicationEventPublisher {
    private static instance;
    private bus;
    private constructor();
    static getInstance(): CommunicationEventPublisher;
    connect(): Promise<void>;
    publishEvent<T extends Record<string, unknown>>(params: {
        eventType: DomainEventName | string;
        aggregateType: string;
        aggregateId: string;
        tenantId: string;
        branchId?: string;
        payload: T;
        userId?: string | null;
        correlationId?: string;
    }): Promise<void>;
    close(): Promise<void>;
}
export declare const eventPublisher: CommunicationEventPublisher;
export declare const eventBus: {
    publish: (event: any) => Promise<void>;
};
//# sourceMappingURL=publisher.d.ts.map