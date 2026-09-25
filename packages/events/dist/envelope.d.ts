import { z } from 'zod';
export declare const EventEnvelopeSchema: z.ZodObject<{
    eventId: z.ZodString;
    eventType: z.ZodString;
    eventVersion: z.ZodDefault<z.ZodNumber>;
    occurredAt: z.ZodString;
    tenantId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    branchId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    franchiseId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    actorUserId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    correlationId: z.ZodString;
    causationId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    aggregateType: z.ZodString;
    aggregateId: z.ZodString;
    payload: z.ZodRecord<z.ZodString, z.ZodUnknown>;
}, "strip", z.ZodTypeAny, {
    eventId: string;
    eventType: string;
    eventVersion: number;
    occurredAt: string;
    correlationId: string;
    aggregateType: string;
    aggregateId: string;
    payload: Record<string, unknown>;
    tenantId?: string | null | undefined;
    branchId?: string | null | undefined;
    franchiseId?: string | null | undefined;
    actorUserId?: string | null | undefined;
    causationId?: string | null | undefined;
}, {
    eventId: string;
    eventType: string;
    occurredAt: string;
    correlationId: string;
    aggregateType: string;
    aggregateId: string;
    payload: Record<string, unknown>;
    eventVersion?: number | undefined;
    tenantId?: string | null | undefined;
    branchId?: string | null | undefined;
    franchiseId?: string | null | undefined;
    actorUserId?: string | null | undefined;
    causationId?: string | null | undefined;
}>;
export type EventEnvelope<TPayload = Record<string, unknown>> = {
    eventId: string;
    eventType: string;
    eventVersion: number;
    occurredAt: string;
    tenantId: string | null;
    branchId: string | null;
    franchiseId: string | null;
    actorUserId: string | null;
    correlationId: string;
    causationId: string | null;
    aggregateType: string;
    aggregateId: string;
    payload: TPayload;
};
export interface CreateEventOptions<TPayload> {
    eventType: string;
    aggregateType: string;
    aggregateId: string;
    payload: TPayload;
    tenantId?: string | null;
    branchId?: string | null;
    franchiseId?: string | null;
    actorUserId?: string | null;
    correlationId?: string;
    causationId?: string | null;
    eventVersion?: number;
}
export declare function createEventEnvelope<TPayload extends Record<string, unknown>>(options: CreateEventOptions<TPayload>): EventEnvelope<TPayload>;
//# sourceMappingURL=envelope.d.ts.map