import { randomUUID } from 'node:crypto';
import type { RequestContext } from '@salon-spa-saas/common-types';
import type { EventEnvelope } from '@salon-spa-saas/events';

export function createMockRequestContext(overrides?: Partial<RequestContext>): RequestContext {
  return {
    requestId: randomUUID(),
    correlationId: randomUUID(),
    userId: randomUUID(),
    tenantId: randomUUID(),
    franchiseId: null,
    branchIds: [randomUUID()],
    role: 'BRANCH_MANAGER',
    permissions: ['*'],
    ...overrides,
  };
}

export class MockEventBus {
  public publishedEvents: EventEnvelope[] = [];

  public async publish<T extends Record<string, unknown>>(
    event: EventEnvelope<T>,
  ): Promise<boolean> {
    this.publishedEvents.push(event as unknown as EventEnvelope);
    return true;
  }

  public async subscribe(): Promise<void> {}
  public async close(): Promise<void> {}
  public isConnected(): boolean {
    return true;
  }
}
