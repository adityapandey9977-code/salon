import { AsyncLocalStorage } from 'node:async_hooks';
import type { RequestContext } from '@salon-spa-saas/common-types';

const asyncLocalStorage = new AsyncLocalStorage<RequestContext>();

export const ObservabilityContext = {
  run<R>(context: RequestContext, callback: () => R): R {
    return asyncLocalStorage.run(context, callback);
  },

  get(): RequestContext | undefined {
    return asyncLocalStorage.getStore();
  },

  getCorrelationId(): string | undefined {
    return asyncLocalStorage.getStore()?.correlationId;
  },

  getTenantId(): string | null | undefined {
    return asyncLocalStorage.getStore()?.tenantId;
  },

  getUserId(): string | null | undefined {
    return asyncLocalStorage.getStore()?.userId;
  },
};
