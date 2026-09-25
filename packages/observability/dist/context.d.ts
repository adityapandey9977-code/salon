import type { RequestContext } from '@salon-spa-saas/common-types';
export declare const ObservabilityContext: {
    run<R>(context: RequestContext, callback: () => R): R;
    get(): RequestContext | undefined;
    getCorrelationId(): string | undefined;
    getTenantId(): string | null | undefined;
    getUserId(): string | null | undefined;
};
//# sourceMappingURL=context.d.ts.map