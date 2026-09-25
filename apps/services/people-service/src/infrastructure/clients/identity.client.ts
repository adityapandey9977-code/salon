import { createLogger } from '@salon-spa-saas/logger';
import { config } from '../../config';

const logger = createLogger('identity-client');

export interface ProvisionUserResult {
  success: boolean;
  userId?: string;
  error?: string;
}

export class IdentityClient {
  private static instance: IdentityClient;

  private constructor() {}

  public static getInstance(): IdentityClient {
    if (!IdentityClient.instance) {
      IdentityClient.instance = new IdentityClient();
    }
    return IdentityClient.instance;
  }

  public async provisionStaffUser(params: {
    tenantId: string;
    email: string;
    fullName: string;
    mobilePhone?: string;
    initialPassword?: string;
    branchIds?: string[];
    roles?: string[];
  }): Promise<ProvisionUserResult> {
    try {
      const response = await fetch(`${config.IDENTITY_SERVICE_URL}/internal/v1/users`, {
        method: 'POST',
        headers: {
          'x-internal-secret': config.SERVICE_INTERNAL_SECRET,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: params.email,
          fullName: params.fullName,
          mobilePhone: params.mobilePhone,
          password: params.initialPassword || 'DefaultStaffPass123!',
          tenantId: params.tenantId,
          userType: 'TENANT',
          branchIds: params.branchIds || [],
          roles: params.roles || ['STAFF'],
        }),
        signal: AbortSignal.timeout(3000),
      });

      if (!response.ok) {
        const body = (await response.json()) as any;
        return { success: false, error: body.error?.message || 'Failed to provision Identity user' };
      }

      const body = (await response.json()) as any;
      return { success: true, userId: body.data?.id || body.data?.userId };
    } catch (err: any) {
      logger.error({ err: err.message }, 'Identity service client error');
      return { success: false, error: err.message };
    }
  }
}

export const identityClient = IdentityClient.getInstance();
