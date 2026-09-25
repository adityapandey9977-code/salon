import { ConflictError, ForbiddenError, NotFoundError } from '@salon-spa-saas/common-types';
import type { CachedEffectiveAccess } from '../../domain/entities/auth.dto';
import type { Permission, Role } from '../../infrastructure/prisma/generated-client';
import { identityReadStore } from '../../infrastructure/redis/identity-read.store';
import { roleRepository } from '../../infrastructure/repositories/role.repository';

export class RoleService {
  public async listRoles(scope?: string, tenantId?: string | null, showOnFrontend?: boolean, panel?: string): Promise<Role[]> {
    const roles = await roleRepository.listRoles(tenantId, showOnFrontend, panel);
    if (!scope) return roles;

    const isPlatformOrExcluded = (r: Role & { permissions?: any[] }) => {
      const code = (r.code || '').toUpperCase();
      if (
        code === 'SUPER' ||
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
        code.startsWith('PLATFORM_')
      ) {
        return true;
      }
      if (r.permissions && Array.isArray(r.permissions)) {
        return r.permissions.some((p: any) => p.permission?.module === 'PLATFORM');
      }
      return false;
    };

    if (scope.toUpperCase() === 'PLATFORM') {
      return roles.filter((r) => isPlatformOrExcluded(r as any));
    }
    if (scope.toUpperCase() === 'TENANT') {
      return roles.filter((r) => !isPlatformOrExcluded(r as any));
    }
    return roles;
  }

  public async getRoleById(id: string, tenantId?: string | null): Promise<Role> {
    const role = await roleRepository.findRoleById(id);
    if (!role) {
      throw new NotFoundError('Role not found');
    }
    if (tenantId && !role.isSystem && role.tenantId && role.tenantId !== tenantId) {
      throw new ForbiddenError('Access denied to role belonging to another tenant');
    }
    return role;
  }

  public async createRole(data: {
    name: string;
    code: string;
    description?: string | null;
    permissionCodes?: string[];
    tenantId?: string | null;
  }): Promise<Role> {
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

  public async updateRole(
    id: string,
    data: { name?: string; description?: string | null },
    tenantId?: string | null,
  ): Promise<Role> {
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

  public async deleteRole(id: string, tenantId?: string | null): Promise<void> {
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

  public async listPermissions(): Promise<Permission[]> {
    return roleRepository.listPermissions();
  }

  public async assignRolePermissions(
    roleId: string,
    permissionCodes: string[],
    tenantId?: string | null,
  ): Promise<void> {
    const role = await roleRepository.findRoleById(roleId);
    if (!role) {
      throw new NotFoundError('Role not found');
    }

    if (role.isSystem) {
      throw new ConflictError(
        'System role permissions are fixed by platform template and cannot be altered',
      );
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

  public async assignUserRoles(userId: string, roleIds: string[]): Promise<void> {
    await roleRepository.assignUserRoles(userId, roleIds);

    // Invalidate user access cache
    await identityReadStore.invalidateUserAccess(userId);
  }

  public async removeUserRole(userId: string, roleId: string): Promise<void> {
    await roleRepository.removeUserRole(userId, roleId);

    // Invalidate user access cache
    await identityReadStore.invalidateUserAccess(userId);
  }

  public async getEffectiveAccess(userId: string): Promise<CachedEffectiveAccess> {
    return identityReadStore.getEffectiveAccess(userId, () =>
      roleRepository.getEffectiveAccessForUser(userId),
    );
  }
}

export const roleService = new RoleService();
