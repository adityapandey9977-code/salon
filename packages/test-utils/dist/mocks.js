import { randomUUID } from 'node:crypto';
export function createMockRequestContext(overrides) {
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
    publishedEvents = [];
    async publish(event) {
        this.publishedEvents.push(event);
        return true;
    }
    async subscribe() { }
    async close() { }
    isConnected() {
        return true;
    }
}
