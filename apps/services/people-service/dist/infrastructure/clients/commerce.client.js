import { createLogger } from '@salon-spa-saas/logger';
const logger = createLogger('commerce-client');
export class CommerceClient {
    static instance;
    constructor() { }
    static getInstance() {
        if (!CommerceClient.instance) {
            CommerceClient.instance = new CommerceClient();
        }
        return CommerceClient.instance;
    }
    async validateServiceId(_tenantId, _serviceId) {
        // Phase 1 / Deferred Integration: Since commerce-service catalog integration is logical at this phase,
        // we preserve the logical UUID reference without hard dependency.
        logger.debug('Commerce service validation deferred; returning logical reference valid');
        return { isValid: true };
    }
}
export const commerceClient = CommerceClient.getInstance();
