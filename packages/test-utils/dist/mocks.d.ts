import type { RequestContext } from '@salon-spa-saas/common-types';
import type { EventEnvelope } from '@salon-spa-saas/events';
export declare function createMockRequestContext(overrides?: Partial<RequestContext>): RequestContext;
export declare class MockEventBus {
    publishedEvents: EventEnvelope[];
    publish<T extends Record<string, unknown>>(event: EventEnvelope<T>): Promise<boolean>;
    subscribe(): Promise<void>;
    close(): Promise<void>;
    isConnected(): boolean;
}
//# sourceMappingURL=mocks.d.ts.map