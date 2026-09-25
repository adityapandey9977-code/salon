import { randomUUID } from 'node:crypto';
import { z } from 'zod';
export const EventEnvelopeSchema = z.object({
    eventId: z.string().uuid(),
    eventType: z.string().min(1),
    eventVersion: z.number().int().positive().default(1),
    occurredAt: z.string().datetime(),
    tenantId: z.string().uuid().nullable().optional(),
    branchId: z.string().uuid().nullable().optional(),
    franchiseId: z.string().uuid().nullable().optional(),
    actorUserId: z.string().uuid().nullable().optional(),
    correlationId: z.string().uuid(),
    causationId: z.string().uuid().nullable().optional(),
    aggregateType: z.string().min(1),
    aggregateId: z.string().uuid(),
    payload: z.record(z.unknown()),
});
export function createEventEnvelope(options) {
    return {
        eventId: randomUUID(),
        eventType: options.eventType,
        eventVersion: options.eventVersion ?? 1,
        occurredAt: new Date().toISOString(),
        tenantId: options.tenantId ?? null,
        branchId: options.branchId ?? null,
        franchiseId: options.franchiseId ?? null,
        actorUserId: options.actorUserId ?? null,
        correlationId: options.correlationId ?? randomUUID(),
        causationId: options.causationId ?? null,
        aggregateType: options.aggregateType,
        aggregateId: options.aggregateId,
        payload: options.payload,
    };
}
