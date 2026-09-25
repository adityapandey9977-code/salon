import type { CachedEffectiveAccess } from '../../domain/entities/auth.dto';
import type { Permission, Role } from '../../infrastructure/prisma/generated-client';
export declare class RoleService {
    listRoles(scope?: string, tenantId?: string | null, showOnFrontend?: boolean, panel?: string): Promise<Role[]>;
    getRoleById(id: string, tenantId?: string | null): Promise<Role>;
    createRole(data: {
        name: string;
        code: string;
        description?: string | null;
        permissionCodes?: string[];
        tenantId?: string | null;
    }): Promise<Role>;
    updateRole(id: string, data: {
        name?: string;
        description?: string | null;
    }, tenantId?: string | null): Promise<Role>;
    deleteRole(id: string, tenantId?: string | null): Promise<void>;
    listPermissions(): Promise<Permission[]>;
    assignRolePermissions(roleId: string, permissionCodes: string[], tenantId?: string | null): Promise<void>;
    assignUserRoles(userId: string, roleIds: string[]): Promise<void>;
    removeUserRole(userId: string, roleId: string): Promise<void>;
    getEffectiveAccess(userId: string): Promise<CachedEffectiveAccess>;
}
export declare const roleService: RoleService;
//# sourceMappingURL=role.service.d.ts.map