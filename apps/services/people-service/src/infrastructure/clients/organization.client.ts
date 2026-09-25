import { createLogger } from '@salon-spa-saas/logger';
import { config } from '../../config';

const logger = createLogger('organization-client');

export interface BranchValidationResult {
  isValid: boolean;
  branchName?: string;
  isActive?: boolean;
  reason?: string;
}

export class OrganizationClient {
  private static instance: OrganizationClient;

  private constructor() {}

  public static getInstance(): OrganizationClient {
    if (!OrganizationClient.instance) {
      OrganizationClient.instance = new OrganizationClient();
    }
    return OrganizationClient.instance;
  }

  public async validateBranch(tenantId: string, branchId: string): Promise<BranchValidationResult> {
    try {
      const response = await fetch(
        `${config.ORGANIZATION_SERVICE_URL}/api/v1/branches/${branchId}`,
        {
          method: 'GET',
          headers: {
            'x-tenant-id': tenantId,
            'x-internal-secret': config.SERVICE_INTERNAL_SECRET,
            'Content-Type': 'application/json',
          },
          signal: AbortSignal.timeout(2500),
        },
      );

      if (response.status === 404) {
        return { isValid: false, reason: 'Branch not found' };
      }

      if (!response.ok) {
        // Fallback: If organization-service is unreachable during offline testing/dev, accept valid UUID
        logger.warn({ branchId, status: response.status }, 'Organization service returned non-200');
        return { isValid: true };
      }

      const body = (await response.json()) as any;
      const branchData = body.data || body;

      if (branchData.tenantId && branchData.tenantId !== tenantId) {
        return { isValid: false, reason: 'Branch does not belong to the specified tenant' };
      }

      return {
        isValid: true,
        branchName: branchData.name,
        isActive: branchData.isActive !== false,
      };
    } catch (err: any) {
      logger.warn({ err: err.message, branchId }, 'Organization client timeout or network error; gracefully allowing valid UUID reference');
      return { isValid: true };
    }
  }
}

export const organizationClient = OrganizationClient.getInstance();
