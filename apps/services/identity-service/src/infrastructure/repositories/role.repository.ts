import type { CachedEffectiveAccess } from '../../domain/entities/auth.dto';
import { prisma } from '../prisma/client';
import type { Permission, Role } from '../prisma/generated-client';

export class RoleRepository {
  public async listRoles(tenantId?: string | null, showOnFrontend?: boolean, panel?: string): Promise<Role[]> {
    return prisma.role.findMany({
      where: {
        AND: [
          {
            OR: [
              { isSystem: true },
              { tenantId: null },
              ...(tenantId ? [{ tenantId }] : []),
            ],
          },
          ...(showOnFrontend !== undefined ? [{ showOnFrontend }] : []),
          ...(panel ? [{
            OR: [
              { allowedPanels: { has: panel } },
              { allowedPanels: { equals: [] } }
            ]
          }] : []),
        ],
      },
      orderBy: { name: 'asc' },
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
        users: true,
      },
    });
  }

  public async findRoleById(
    id: string,
  ): Promise<(Role & { permissions: { permission: Permission }[] }) | null> {
    return prisma.role.findUnique({
      where: { id },
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
      },
    });
  }

  public async findRoleByCode(code: string, tenantId?: string | null): Promise<Role | null> {
    return prisma.role.findFirst({
      where: {
        code,
        OR: [
          { isSystem: true },
          { tenantId: null },
          ...(tenantId ? [{ tenantId }] : []),
        ],
      },
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
      },
    });
  }

  public async createRole(data: {
    name: string;
    code: string;
    description?: string | null;
    permissionCodes?: string[];
    tenantId?: string | null;
    roleType?: 'SYSTEM' | 'CUSTOM';
    isSystem?: boolean;
  }): Promise<Role> {
    const isSystemRole = data.isSystem ?? (data.roleType === 'SYSTEM' || !data.tenantId);
    return prisma.$transaction(async (tx) => {
      const role = await tx.role.create({
        data: {
          name: data.name,
          code: data.code.toUpperCase().trim(),
          description: data.description || null,
          roleType: isSystemRole ? 'SYSTEM' : 'CUSTOM',
          tenantId: isSystemRole ? null : data.tenantId,
          isSystem: isSystemRole,
        },
      });

      if (data.permissionCodes && data.permissionCodes.length > 0) {
        const perms = await tx.permission.findMany({
          where: { code: { in: data.permissionCodes } },
        });

        const existingCodes = new Set(perms.map((p) => p.code));
        const missingCodes = data.permissionCodes.filter((c) => !existingCodes.has(c));

        if (missingCodes.length > 0) {
          for (const code of missingCodes) {
            const parts = code.split('.');
            const moduleName = (parts[1] || parts[0] || 'PLATFORM').toUpperCase();
            const created = await tx.permission.create({
              data: {
                code,
                name: code.replace(/[._]/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
                module: moduleName,
                description: `System permission for ${code}`,
              },
            });
            perms.push(created);
          }
        }

        if (perms.length > 0) {
          await tx.rolePermission.createMany({
            data: perms.map((p) => ({
              roleId: role.id,
              permissionId: p.id,
            })),
            skipDuplicates: true,
          });
        }
      }

      return role;
    });
  }

  public async updateRole(
    id: string,
    data: { name?: string; description?: string | null },
  ): Promise<Role> {
    return prisma.role.update({
      where: { id },
      data: {
        ...(data.name !== undefined ? { name: data.name } : {}),
        ...(data.description !== undefined ? { description: data.description } : {}),
      },
    });
  }

  public async listPermissions(): Promise<Permission[]> {
    return prisma.permission.findMany({
      orderBy: [{ module: 'asc' }, { code: 'asc' }],
    });
  }

  public async assignRolePermissions(roleId: string, permissionCodes: string[]): Promise<void> {
    await prisma.$transaction(async (tx) => {
      // Clear existing role permissions
      await tx.rolePermission.deleteMany({
        where: { roleId },
      });

      if (permissionCodes.length > 0) {
        // Find existing permission records
        const existingPerms = await tx.permission.findMany({
          where: { code: { in: permissionCodes } },
        });

        const existingCodes = new Set(existingPerms.map((p) => p.code));
        const missingCodes = permissionCodes.filter((c) => !existingCodes.has(c));

        if (missingCodes.length > 0) {
          for (const code of missingCodes) {
            const parts = code.split('.');
            const moduleName = (parts[1] || parts[0] || 'PLATFORM').toUpperCase();
            const created = await tx.permission.create({
              data: {
                code,
                name: code.replace(/[._]/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
                module: moduleName,
                description: `System permission for ${code}`,
              },
            });
            existingPerms.push(created);
          }
        }

        if (existingPerms.length > 0) {
          await tx.rolePermission.createMany({
            data: existingPerms.map((p) => ({
              roleId,
              permissionId: p.id,
            })),
            skipDuplicates: true,
          });
        }
      }
    });
  }

  public async assignUserRoles(userId: string, roleIds: string[]): Promise<void> {
    await prisma.$transaction(async (tx) => {
      await tx.userRole.deleteMany({
        where: { userId },
      });

      if (roleIds.length > 0) {
        await tx.userRole.createMany({
          data: roleIds.map((roleId) => ({
            userId,
            roleId,
          })),
        });
      }
    });
  }

  public async removeUserRole(userId: string, roleId: string): Promise<void> {
    await prisma.userRole.deleteMany({
      where: { userId, roleId },
    });
  }

  public async getEffectiveRolesForUser(userId: string): Promise<string[]> {
    const userRoles = await prisma.userRole.findMany({
      where: { userId },
      include: { role: true },
    });
    return userRoles.map((ur) => ur.role.code);
  }

  public async getEffectivePermissionsForUser(userId: string): Promise<string[]> {
    const userRoles = await prisma.userRole.findMany({
      where: { userId },
      include: {
        role: {
          include: {
            permissions: {
              include: {
                permission: true,
              },
            },
          },
        },
      },
    });

    const permissionSet = new Set<string>();
    for (const ur of userRoles) {
      for (const rp of ur.role.permissions) {
        permissionSet.add(rp.permission.code);
      }
    }
    return Array.from(permissionSet);
  }

  public async getEffectiveAccessForUser(userId: string): Promise<CachedEffectiveAccess> {
    const [roles, permissions, scopes, userRecord] = await Promise.all([
      this.getEffectiveRolesForUser(userId),
      this.getEffectivePermissionsForUser(userId),
      prisma.userScopeAssignment.findMany({ where: { userId } }),
      prisma.user.findUnique({ where: { id: userId }, select: { tenantId: true } }),
    ]);

    let primaryTenantId: string | null = userRecord?.tenantId || null;
    let primaryFranchiseId: string | null = null;
    const branchIds: string[] = [];
    const scopeTypes = new Set<any>();

    for (const s of scopes) {
      scopeTypes.add(s.scopeType);
      if (s.tenantId && !primaryTenantId) primaryTenantId = s.tenantId;
      if (s.franchiseId && !primaryFranchiseId) primaryFranchiseId = s.franchiseId;
      if (s.branchId && !branchIds.includes(s.branchId)) branchIds.push(s.branchId);
    }

    return {
      userId,
      roles,
      permissions,
      tenantId: primaryTenantId,
      franchiseId: primaryFranchiseId,
      branchIds,
      scopeTypes: Array.from(scopeTypes),
    };
  }

  public async findUsersWithRole(roleId: string): Promise<string[]> {
    const userRoles = await prisma.userRole.findMany({
      where: { roleId },
      select: { userId: true },
    });
    return userRoles.map((ur) => ur.userId);
  }

  public async deleteRole(id: string): Promise<void> {
    await prisma.role.delete({
      where: { id },
    });
  }
}

export const roleRepository = new RoleRepository();

