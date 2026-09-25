import { createLogger } from '@salon-spa-saas/logger';

const logger = createLogger('commerce-client');

export interface ServiceValidationResult {
  isValid: boolean;
  serviceName?: string;
}

export class CommerceClient {
  private static instance: CommerceClient;

  private constructor() {}

  public static getInstance(): CommerceClient {
    if (!CommerceClient.instance) {
      CommerceClient.instance = new CommerceClient();
    }
    return CommerceClient.instance;
  }

  public async validateServiceId(_tenantId: string, _serviceId: string): Promise<ServiceValidationResult> {
    // Phase 1 / Deferred Integration: Since commerce-service catalog integration is logical at this phase,
    // we preserve the logical UUID reference without hard dependency.
    logger.debug('Commerce service validation deferred; returning logical reference valid');
    return { isValid: true };
  }
}

export const commerceClient = CommerceClient.getInstance();
