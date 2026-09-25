import type { CachedUserProfile } from '../../domain/entities/auth.dto';
import { prisma } from '../prisma/client';
import type { Prisma, User, UserStatus, UserType } from '../prisma/generated-client';

export class UserRepository {
  private toSafeProfile(user: any): CachedUserProfile {
    const roles =
      user.roles && Array.isArray(user.roles)
        ? user.roles.map((r: any) => ({
          id: r.role?.id || r.roleId || r.id,
          name: r.role?.name || r.name || 'Platform Role',
          code: r.role?.code || r.code || 'OPERATOR',
        }))
        : [];

    return {
      id: user.id,
      userType: user.userType,
      fullName: user.fullName,
      email: user.email,
      mobilePhone: user.mobilePhone,
      status: user.status,
      isMfaRequired: user.isMfaRequired,
      isMfaEnabled: user.isMfaEnabled,
      role: roles.length > 0 ? roles[0].name || roles[0].code : undefined,
      roles,
      lastLoginAt: user.lastLoginAt
        ? typeof user.lastLoginAt === 'string'
          ? user.lastLoginAt
          : user.lastLoginAt.toISOString()
        : null,
      createdAt:
        typeof user.createdAt === 'string' ? user.createdAt : user.createdAt.toISOString(),
    };
  }

  public async findById(id: string): Promise<CachedUserProfile | null> {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    });
    return user ? this.toSafeProfile(user) : null;
  }

  public async findRawById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  public async findByNormalizedEmail(email: string): Promise<CachedUserProfile | null> {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    });
    return user ? this.toSafeProfile(user) : null;
  }

  public async listUsers(params: {
    page?: number;
    limit?: number;
    userType?: UserType;
    status?: UserStatus;
    search?: string;
  }): Promise<{ items: CachedUserProfile[]; total: number; page: number; limit: number }> {
    const page = params.page || 1;
    const limit = Math.min(params.limit || 20, 100);
    const skip = (page - 1) * limit;

    const where: Prisma.UserWhereInput = {};
    if (params.userType) where.userType = params.userType;
    if (params.status) where.status = params.status;
    if (params.search) {
      where.OR = [
        { fullName: { contains: params.search, mode: 'insensitive' } },
        { email: { contains: params.search, mode: 'insensitive' } },
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          roles: {
            include: {
              role: true,
            },
          },
        },
      }),
      prisma.user.count({ where }),
    ]);

    return {
      items: users.map((u) => this.toSafeProfile(u)),
      total,
      page,
      limit,
    };
  }

  public async createUser(data: {
    email: string;
    passwordHash: string;
    fullName: string;
    mobilePhone?: string | null;
    userType?: UserType;
    isMfaRequired?: boolean;
    isMfaEnabled?: boolean;
    roleIds?: string[];
  }): Promise<CachedUserProfile> {
    const created = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: data.email.toLowerCase().trim(),
          passwordHash: data.passwordHash,
          fullName: data.fullName,
          mobilePhone: data.mobilePhone || null,
          userType: data.userType || 'TENANT',
          isMfaRequired: data.isMfaRequired ?? false,
          isMfaEnabled: data.isMfaEnabled ?? false,
          status: 'ACTIVE',
        },
      });

      let assignedRolesCount = 0;
      if (data.roleIds && data.roleIds.length > 0) {
        const validUuidRoleIds = data.roleIds.filter((r) =>
          /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(r),
        );
        const roleCodes = data.roleIds.map((r) => r.toUpperCase().replace(/\s+/g, '_'));

        const orConditions: Prisma.RoleWhereInput[] = [
          { code: { in: roleCodes } },
          { name: { in: data.roleIds } },
        ];
        if (validUuidRoleIds.length > 0) {
          orConditions.push({ id: { in: validUuidRoleIds } });
        }

        const roles = await tx.role.findMany({
          where: {
            OR: orConditions,
          },
        });
        if (roles.length > 0) {
          await tx.userRole.createMany({
            data: roles.map((r) => ({
              userId: user.id,
              roleId: r.id,
            })),
            skipDuplicates: true,
          });
          assignedRolesCount = roles.length;
        }
      }

      if (data.userType === 'PLATFORM') {
        // If no role matched or provided for platform user, default to SUPER_ADMIN
        if (assignedRolesCount === 0) {
          const defaultPlatformRole = await tx.role.findFirst({
            where: {
              OR: [{ code: 'SUPER_ADMIN' }, { code: 'SUPPORT_OPERATOR' }],
            },
          });
          if (defaultPlatformRole) {
            await tx.userRole.create({
              data: {
                userId: user.id,
                roleId: defaultPlatformRole.id,
              },
            });
          }
        }

        await tx.userScopeAssignment.create({
          data: {
            userId: user.id,
            scopeType: 'PLATFORM',
          },
        });
      }

      return tx.user.findUnique({
        where: { id: user.id },
        include: {
          roles: {
            include: {
              role: true,
            },
          },
        },
      });
    });

    if (!created) {
      throw new Error('Failed to create user record');
    }

    return this.toSafeProfile(created);
  }

  public async updateUser(
    id: string,
    data: {
      fullName?: string;
      email?: string;
      mobilePhone?: string | null;
      isMfaRequired?: boolean;
      isMfaEnabled?: boolean;
      status?: UserStatus;
      roles?: string[];
    },
  ): Promise<CachedUserProfile> {
    const updated = await prisma.$transaction(async (tx) => {
      // 1. Update user direct fields
      await tx.user.update({
        where: { id },
        data: {
          ...(data.fullName !== undefined ? { fullName: data.fullName } : {}),
          ...(data.email !== undefined ? { email: data.email.toLowerCase().trim() } : {}),
          ...(data.mobilePhone !== undefined ? { mobilePhone: data.mobilePhone } : {}),
          ...(data.isMfaRequired !== undefined ? { isMfaRequired: data.isMfaRequired } : {}),
          ...(data.isMfaEnabled !== undefined ? { isMfaEnabled: data.isMfaEnabled } : {}),
          ...(data.status !== undefined ? { status: data.status } : {}),
        },
      });

      // 2. Update roles if specified
      if (data.roles !== undefined) {
        const matchingRoles = await tx.role.findMany({
          where: {
            OR: [
              { id: { in: data.roles.filter((r) => /^[0-9a-fA-F-]{36}$/.test(r)) } },
              { code: { in: data.roles.map((r) => r.toUpperCase().replace(/\s+/g, '_')) } },
              { name: { in: data.roles } },
            ],
          },
        });

        await tx.userRole.deleteMany({
          where: { userId: id },
        });

        if (matchingRoles.length > 0) {
          await tx.userRole.createMany({
            data: matchingRoles.map((r) => ({
              userId: id,
              roleId: r.id,
            })),
            skipDuplicates: true,
          });
        }
      }

      // Fetch fresh record with relations
      return tx.user.findUnique({
        where: { id },
        include: {
          roles: {
            include: {
              role: true,
            },
          },
        },
      });
    });

    if (!updated) {
      throw new Error('User not found after update');
    }

    return this.toSafeProfile(updated);
  }

  public async setStatus(id: string, status: UserStatus): Promise<CachedUserProfile> {
    const updated = await prisma.user.update({
      where: { id },
      data: { status },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    });
    return this.toSafeProfile(updated);
  }

  public async updatePassword(id: string, passwordHash: string): Promise<void> {
    await prisma.user.update({
      where: { id },
      data: { passwordHash },
    });
  }
}

export const userRepository = new UserRepository();
