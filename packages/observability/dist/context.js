import { AsyncLocalStorage } from 'node:async_hooks';
const asyncLocalStorage = new AsyncLocalStorage();
export const ObservabilityContext = {
    run(context, callback) {
        return asyncLocalStorage.run(context, callback);
    },
    get() {
        return asyncLocalStorage.getStore();
    },
    getCorrelationId() {
        return asyncLocalStorage.getStore()?.correlationId;
    },
    getTenantId() {
        return asyncLocalStorage.getStore()?.tenantId;
    },
    getUserId() {
        return asyncLocalStorage.getStore()?.userId;
    },
};
