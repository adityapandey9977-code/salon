import { NotFoundError, ValidationError } from '@salon-spa-saas/common-types';
import { identityReadStore } from '../../infrastructure/redis/identity-read.store';
import { scopeRepository } from '../../infrastructure/repositories/scope.repository';
export class ScopeService {
    async listUserScopes(userId) {
        return identityReadStore.getUserScopes(userId, () => scopeRepository.listUserScopes(userId));
    }
    async createScope(data) {
        // Validate scope combinations
        if (data.scopeType === 'BRANCH') {
            if (!data.tenantId || !data.branchId) {
                throw new ValidationError('BRANCH scope requires both tenantId and branchId');
            }
        }
        else if (data.scopeType === 'FRANCHISE') {
            if (!data.tenantId || !data.franchiseId) {
                throw new ValidationError('FRANCHISE scope requires both tenantId and franchiseId');
            }
        }
        else if (data.scopeType === 'TENANT') {
            if (!data.tenantId) {
                throw new ValidationError('TENANT scope requires tenantId');
            }
        }
        else if (data.scopeType === 'PLATFORM') {
            if (data.tenantId || data.branchId || data.franchiseId) {
                throw new ValidationError('PLATFORM scope must not include tenantId, franchiseId, or branchId');
            }
        }
        const created = await scopeRepository.createScope(data);
        // Invalidate access cache for user
        await identityReadStore.invalidateUserAccess(data.userId);
        return created;
    }
    async deleteScope(id, userId) {
        const success = await scopeRepository.deleteScope(id, userId);
        if (!success) {
            throw new NotFoundError('Scope assignment not found');
        }
        // Invalidate access cache for user
        await identityReadStore.invalidateUserAccess(userId);
    }
}
export const scopeService = new ScopeService();
