import { createLogger } from '@salon-spa-saas/logger';
import { config } from '../../config';
const logger = createLogger('identity-client');
export class IdentityClient {
    static instance;
    constructor() { }
    static getInstance() {
        if (!IdentityClient.instance) {
            IdentityClient.instance = new IdentityClient();
        }
        return IdentityClient.instance;
    }
    async provisionStaffUser(params) {
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
                const body = (await response.json());
                return { success: false, error: body.error?.message || 'Failed to provision Identity user' };
            }
            const body = (await response.json());
            return { success: true, userId: body.data?.id || body.data?.userId };
        }
        catch (err) {
            logger.error({ err: err.message }, 'Identity service client error');
            return { success: false, error: err.message };
        }
    }
}
export const identityClient = IdentityClient.getInstance();
