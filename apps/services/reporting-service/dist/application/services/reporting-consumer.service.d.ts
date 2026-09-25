export interface DomainEventEnvelope<T = Record<string, unknown>> {
    eventId: string;
    eventType: string;
    eventVersion: string;
    occurredAt: string;
    tenantId?: string;
    branchId?: string;
    franchiseId?: string;
    actorUserId?: string;
    principalType?: string;
    correlationId: string;
    causationId?: string;
    aggregateType: string;
    aggregateId: string;
    payload: T;
}
export declare class ReportingConsumerService {
    static processEvent(event: DomainEventEnvelope): Promise<void>;
}
//# sourceMappingURL=reporting-consumer.service.d.ts.map