import { type DomainEventName } from '@salon-spa-saas/events';
export declare class FinanceEventPublisher {
    private static instance;
    private bus;
    private constructor();
    static getInstance(): FinanceEventPublisher;
    connect(): Promise<void>;
    publishEvent<T extends Record<string, unknown>>(params: {
        eventType: DomainEventName | string;
        aggregateType: string;
        aggregateId: string;
        tenantId: string;
        branchId?: string;
        franchiseId?: string;
        payload: T;
        userId?: string | null;
        correlationId?: string;
    }): Promise<void>;
    close(): Promise<void>;
}
export declare const eventPublisher: FinanceEventPublisher;
export declare const eventBus: {
    publish: (event: any) => Promise<void>;
};
//# sourceMappingURL=publisher.d.ts.map