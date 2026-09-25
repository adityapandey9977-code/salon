import type { CachedEffectiveAccess } from '../../domain/entities/auth.dto';
import type { Permission, Role } from '../prisma/generated-client';
export declare class RoleRepository {
    listRoles(tenantId?: string | null, showOnFrontend?: boolean, panel?: string): Promise<Role[]>;
    findRoleById(id: string): Promise<(Role & {
        permissions: {
            permission: Permission;
        }[];
    }) | null>;
    findRoleByCode(code: string, tenantId?: string | null): Promise<Role | null>;
    createRole(data: {
        name: string;
        code: string;
        description?: string | null;
        permissionCodes?: string[];
        tenantId?: string | null;
        roleType?: 'SYSTEM' | 'CUSTOM';
        isSystem?: boolean;
    }): Promise<Role>;
    updateRole(id: string, data: {
        name?: string;
        description?: string | null;
    }): Promise<Role>;
    listPermissions(): Promise<Permission[]>;
    assignRolePermissions(roleId: string, permissionCodes: string[]): Promise<void>;
    assignUserRoles(userId: string, roleIds: string[]): Promise<void>;
    removeUserRole(userId: string, roleId: string): Promise<void>;
    getEffectiveRolesForUser(userId: string): Promise<string[]>;
    getEffectivePermissionsForUser(userId: string): Promise<string[]>;
    getEffectiveAccessForUser(userId: string): Promise<CachedEffectiveAccess>;
    findUsersWithRole(roleId: string): Promise<string[]>;
    deleteRole(id: string): Promise<void>;
}
export declare const roleRepository: RoleRepository;
//# sourceMappingURL=role.repository.d.ts.map