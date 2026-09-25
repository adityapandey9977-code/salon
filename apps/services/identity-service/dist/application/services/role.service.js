import { ConflictError, ForbiddenError, NotFoundError } from '@salon-spa-saas/common-types';
import { identityReadStore } from '../../infrastructure/redis/identity-read.store';
import { roleRepository } from '../../infrastructure/repositories/role.repository';
export class RoleService {
    async listRoles(scope, tenantId, showOnFrontend, panel) {
        const roles = await roleRepository.listRoles(tenantId, showOnFrontend, panel);
        if (!scope)
            return roles;
        const isPlatformOrExcluded = (r) => {
            const code = (r.code || '').toUpperCase();
            if (code === 'SUPER' ||
                code === 'SUPER_ADMIN' ||
                code === 'SUPER_ADMINISTRATOR' ||
                code === 'SUPERADMIN' ||
                code === 'SUPPORT_OPERATOR' ||
                code === 'BILLING_SPECIALIST' ||
                code === 'SECURITY_AUDITOR' ||
                code === 'PLATFORM_ADMIN' ||
                code === 'SALON_ADMIN' ||
                code === 'CUSTOMER' ||
                code === 'CLIENT' ||
                code.startsWith('SUPER_') ||
                code.startsWith('SUPER') ||
                code.startsWith('PLATFORM_')) {
                return true;
            }
            if (r.permissions && Array.isArray(r.permissions)) {
                return r.permissions.some((p) => p.permission?.module === 'PLATFORM');
            }
            return false;
        };
        if (scope.toUpperCase() === 'PLATFORM') {
            return roles.filter((r) => isPlatformOrExcluded(r));
        }
        if (scope.toUpperCase() === 'TENANT') {
            return roles.filter((r) => !isPlatformOrExcluded(r));
        }
        return roles;
    }
    async getRoleById(id, tenantId) {
        const role = await roleRepository.findRoleById(id);
        if (!role) {
            throw new NotFoundError('Role not found');
        }
        if (tenantId && !role.isSystem && role.tenantId && role.tenantId !== tenantId) {
            throw new ForbiddenError('Access denied to role belonging to another tenant');
        }
        return role;
    }
    async createRole(data) {
        const code = data.code.toUpperCase().trim();
        const existing = await roleRepository.findRoleByCode(code, data.tenantId);
        if (existing) {
            throw new ConflictError(`A role with code '${code}' already exists`);
        }
        const isSystem = !data.tenantId;
        return roleRepository.createRole({
            name: data.name,
            code,
            description: data.description,
            permissionCodes: data.permissionCodes,
            tenantId: data.tenantId,
            roleType: isSystem ? 'SYSTEM' : 'CUSTOM',
            isSystem,
        });
    }
    async updateRole(id, data, tenantId) {
        const role = await roleRepository.findRoleById(id);
        if (!role) {
            throw new NotFoundError('Role not found');
        }
        if (role.isSystem) {
            throw new ConflictError('System roles are predefined and protected and cannot be modified');
        }
        if (tenantId && role.tenantId && role.tenantId !== tenantId) {
            throw new ForbiddenError('Access denied: Cannot modify role belonging to another tenant');
        }
        const updated = await roleRepository.updateRole(id, data);
        // Invalidate affected users' access caches
        const affectedUserIds = await roleRepository.findUsersWithRole(id);
        for (const userId of affectedUserIds) {
            await identityReadStore.invalidateUserAccess(userId);
        }
        return updated;
    }
    async deleteRole(id, tenantId) {
        const role = await roleRepository.findRoleById(id);
        if (!role) {
            throw new NotFoundError('Role not found');
        }
        if (role.isSystem) {
            throw new ConflictError('System roles are predefined and protected and cannot be deleted');
        }
        if (tenantId && role.tenantId && role.tenantId !== tenantId) {
            throw new ForbiddenError('Access denied: Cannot delete role belonging to another tenant');
        }
        const affectedUserIds = await roleRepository.findUsersWithRole(id);
        await roleRepository.deleteRole(id);
        // Invalidate affected users' access caches
        for (const userId of affectedUserIds) {
            await identityReadStore.invalidateUserAccess(userId);
        }
    }
    async listPermissions() {
        return roleRepository.listPermissions();
    }
    async assignRolePermissions(roleId, permissionCodes, tenantId) {
        const role = await roleRepository.findRoleById(roleId);
        if (!role) {
            throw new NotFoundError('Role not found');
        }
        if (role.isSystem) {
            throw new ConflictError('System role permissions are fixed by platform template and cannot be altered');
        }
        if (tenantId && role.tenantId && role.tenantId !== tenantId) {
            throw new ForbiddenError('Access denied: Cannot alter permissions of another tenant role');
        }
        await roleRepository.assignRolePermissions(roleId, permissionCodes);
        // Invalidate affected users' access caches
        const affectedUserIds = await roleRepository.findUsersWithRole(roleId);
        for (const userId of affectedUserIds) {
            await identityReadStore.invalidateUserAccess(userId);
        }
    }
    async assignUserRoles(userId, roleIds) {
        await roleRepository.assignUserRoles(userId, roleIds);
        // Invalidate user access cache
        await identityReadStore.invalidateUserAccess(userId);
    }
    async removeUserRole(userId, roleId) {
        await roleRepository.removeUserRole(userId, roleId);
        // Invalidate user access cache
        await identityReadStore.invalidateUserAccess(userId);
    }
    async getEffectiveAccess(userId) {
        return identityReadStore.getEffectiveAccess(userId, () => roleRepository.getEffectiveAccessForUser(userId));
    }
}
export const roleService = new RoleService();
