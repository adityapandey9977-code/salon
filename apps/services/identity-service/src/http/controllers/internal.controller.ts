import { ConflictError, NotFoundError, ValidationError } from '@salon-spa-saas/common-types';
import { CreateTenantCredentialRequestSchema } from '@salon-spa-saas/contracts';
import type { NextFunction, Request, Response } from 'express';
import { roleService } from '../../application/services/role.service';
import { scopeService } from '../../application/services/scope.service';
import {
  TENANT_ADMIN_PERMISSIONS,
  tenantAuthService,
} from '../../application/services/tenant-auth.service';
import { userService } from '../../application/services/user.service';
import { prisma } from '../../infrastructure/prisma/client';
import { identityReadStore } from '../../infrastructure/redis/identity-read.store';
import { tenantCredentialRepository } from '../../infrastructure/repositories/tenant-credential.repository';
import { userRepository } from '../../infrastructure/repositories/user.repository';
import { PasswordService } from '../../infrastructure/security/password.service';

export class InternalController {
  public async getAuthContext(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const principalType =
        (req.query.principalType as string) || (req.headers['x-principal-type'] as string);
      const userId = (req.query.userId as string) || (req.headers['x-user-id'] as string);
      const tenantCredentialId =
        (req.query.tenantCredentialId as string) ||
        (req.headers['x-tenant-credential-id'] as string);
      const tenantId = (req.query.tenantId as string) || (req.headers['x-tenant-id'] as string);
      const sessionId = (req.query.sessionId as string) || (req.headers['x-session-id'] as string);

      if (principalType === 'TENANT' || tenantCredentialId || (tenantId && !userId)) {
        // Resolve TENANT principal context
        const resolvedTenantId = tenantId;
        const tenantMe = await tenantAuthService.getMe(resolvedTenantId, tenantCredentialId);

        res.status(200).json({
          success: true,
          data: {
            principalType: 'TENANT',
            tenantId: tenantMe.profile.tenantId,
            tenantCredentialId: tenantMe.profile.credentialId,
            sessionId: sessionId || null,
            status: tenantMe.profile.status,
            role: 'TENANT_ADMIN',
            roles: ['TENANT_ADMIN'],
            permissions: tenantMe.effectiveAccess.permissions,
            scopeType: 'TENANT',
            branchIds: [],
            scopes: [],
          },
          timestamp: new Date().toISOString(),
        });
        return;
      }

      // Default to USER principal context
      if (!userId) {
        throw new ValidationError('userId query parameter or x-user-id header is required');
      }

      const [user, effectiveAccess, scopes] = await Promise.all([
        userService.getUserById(userId),
        roleService.getEffectiveAccess(userId),
        scopeService.listUserScopes(userId),
      ]);

      if (!user) {
        throw new NotFoundError('User not found');
      }

      const primaryRole =
        effectiveAccess.roles[0] || (user.userType === 'PLATFORM' ? 'SUPER_ADMIN' : 'USER');
      const primaryScope =
        user.userType === 'PLATFORM'
          ? 'PLATFORM'
          : effectiveAccess.tenantId
            ? 'TENANT'
            : 'PLATFORM';

      res.status(200).json({
        success: true,
        data: {
          principalType: 'USER',
          userId: user.id,
          sessionId: sessionId || null,
          userType: user.userType,
          status: user.status,
          role: primaryRole,
          roles: effectiveAccess.roles,
          permissions: effectiveAccess.permissions,
          scopeType: primaryScope,
          tenantId: effectiveAccess.tenantId,
          franchiseId: effectiveAccess.franchiseId,
          branchIds: effectiveAccess.branchIds,
          scopes,
        },
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      next(err);
    }
  }

  public async createTenantCredential(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const body = CreateTenantCredentialRequestSchema.parse(req.body);
      const normalizedEmail = body.loginEmail.toLowerCase().trim();

      const existingUser = await userRepository.findByNormalizedEmail(normalizedEmail);
      if (existingUser) {
        throw new ConflictError('This email is already registered as a Staff or Admin user');
      }

      const passwordHash = await PasswordService.hash(body.initialPassword);
      const { credential, created } = await tenantCredentialRepository.upsertByEmail({
        tenantId: body.tenantId,
        loginEmail: body.loginEmail,
        normalizedEmail,
        mobilePhone: body.mobilePhone,
        passwordHash,
      });

      res.status(created ? 201 : 200).json({
        success: true,
        data: {
          id: credential.id,
          tenantId: credential.tenantId,
          loginEmail: credential.loginEmail,
          status: credential.status,
          created,
          createdAt: credential.createdAt,
        },
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      next(err);
    }
  }
  public async resetTenantCredentialPassword(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { loginEmail, newPassword } = req.body as { loginEmail: string; newPassword: string };
      if (!loginEmail || !newPassword) {
        throw new ValidationError('loginEmail and newPassword are required');
      }
      const normalizedEmail = loginEmail.toLowerCase().trim();
      const credential = await tenantCredentialRepository.findByNormalizedEmail(normalizedEmail);
      if (!credential) {
        throw new NotFoundError('Tenant credential not found');
      }
      const newHash = await PasswordService.hash(newPassword);
      await tenantCredentialRepository.updatePassword(credential.id, newHash);

      res.status(200).json({
        success: true,
        data: { message: 'Tenant credential password reset successfully' },
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      next(err);
    }
  }

  public async createStaffUser(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const {
        tenantId,
        fullName,
        email,
        mobilePhone,
        password,
        roleId,
        roleCode,
        branchId,
        franchiseId,
      } = req.body as {
        tenantId: string;
        fullName: string;
        email: string;
        mobilePhone?: string;
        password?: string;
        roleId?: string;
        roleCode?: string;
        branchId?: string;
        franchiseId?: string;
      };

      if (!email || !fullName || !tenantId) {
        throw new ValidationError('tenantId, fullName, and email are required');
      }

      const normalizedEmail = email.toLowerCase().trim();

      const existingTenant = await tenantCredentialRepository.findByNormalizedEmail(normalizedEmail);
      if (existingTenant) {
        throw new ConflictError('This email is already registered as a Franchise or Salon Owner');
      }

      const passwordHash = password
        ? await PasswordService.hash(password)
        : await PasswordService.hash(' @123!');

      // Check if user already exists
      let user = await prisma.user.findUnique({
        where: { email: normalizedEmail },
      });

      if (user) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: {
            fullName,
            mobilePhone: mobilePhone || user.mobilePhone,
            passwordHash: password ? passwordHash : user.passwordHash,
            tenantId: tenantId || user.tenantId,
            status: 'ACTIVE',
          },
        });
      } else {
        user = await prisma.user.create({
          data: {
            fullName,
            email: normalizedEmail,
            mobilePhone: mobilePhone || null,
            passwordHash,
            tenantId,
            userType: 'TENANT',
            status: 'ACTIVE',
          },
        });
      }

      // Assign Role if provided
      const roleIdentifier = roleId || roleCode;
      if (roleIdentifier) {
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(roleIdentifier);
        let role = await prisma.role.findFirst({
          where: isUuid
            ? { OR: [{ id: roleIdentifier }, { code: roleIdentifier.toUpperCase() }] }
            : { code: roleIdentifier.toUpperCase() },
        });

        // For tenant staff, prevent assigning platform operator roles
        const platformRoles = ['SUPER_ADMIN', 'SUPPORT_OPERATOR', 'BILLING_SPECIALIST', 'SECURITY_AUDITOR'];
        if (role && platformRoles.includes(role.code.toUpperCase())) {
          role = null;
        }

        if (!role) {
          role = await prisma.role.findUnique({
            where: { code: 'BRANCH_MANAGER' },
          });
        }

        if (role) {
          // Remove any platform operator roles mistakenly assigned to this tenant staff
          const platformRoleRecords = await prisma.role.findMany({
            where: { code: { in: platformRoles } },
          });
          if (platformRoleRecords.length > 0) {
            await prisma.userRole.deleteMany({
              where: {
                userId: user.id,
                roleId: { in: platformRoleRecords.map((pr) => pr.id) },
              },
            });
          }

          await prisma.userRole.upsert({
            where: {
              userId_roleId: {
                userId: user.id,
                roleId: role.id,
              },
            },
            create: {
              userId: user.id,
              roleId: role.id,
            },
            update: {},
          });
        }
      }

      // Assign Scopes: Tenant Scope
      const existingTenantScope = await prisma.userScopeAssignment.findFirst({
        where: {
          userId: user.id,
          scopeType: 'TENANT',
          tenantId,
        },
      });
      if (!existingTenantScope) {
        await prisma.userScopeAssignment.create({
          data: {
            userId: user.id,
            scopeType: 'TENANT',
            tenantId,
          },
        });
      }

      // Assign Branch Scope if branchId provided
      if (branchId) {
        const existingBranchScope = await prisma.userScopeAssignment.findFirst({
          where: {
            userId: user.id,
            scopeType: 'BRANCH',
            branchId,
          },
        });
        if (!existingBranchScope) {
          await prisma.userScopeAssignment.create({
            data: {
              userId: user.id,
              scopeType: 'BRANCH',
              tenantId,
              branchId,
            },
          });
        }
      }

      // Assign Franchise Scope if franchiseId provided
      if (franchiseId) {
        const existingFranchiseScope = await prisma.userScopeAssignment.findFirst({
          where: {
            userId: user.id,
            scopeType: 'FRANCHISE',
            franchiseId,
          },
        });
        if (!existingFranchiseScope) {
          await prisma.userScopeAssignment.create({
            data: {
              userId: user.id,
              scopeType: 'FRANCHISE',
              tenantId,
              franchiseId,
            },
          });
        }
      }

      // Invalidate Redis cache
      await identityReadStore.invalidateUserAccess(user.id);

      res.status(201).json({
        success: true,
        data: {
          userId: user.id,
          email: user.email,
          fullName: user.fullName,
        },
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      next(err);
    }
  }

  public async assignStaffBranchScope(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { userId, tenantId, branchId, roleCode } = req.body as {
        userId: string;
        tenantId: string;
        branchId: string;
        roleCode?: string;
      };

      if (!userId || !branchId) {
        throw new ValidationError('userId and branchId are required');
      }

      const existingScope = await prisma.userScopeAssignment.findFirst({
        where: {
          userId,
          scopeType: 'BRANCH',
          branchId,
        },
      });

      if (!existingScope) {
        await prisma.userScopeAssignment.create({
          data: {
            userId,
            scopeType: 'BRANCH',
            tenantId: tenantId || null,
            branchId,
          },
        });
      }

      if (roleCode) {
        const role = await prisma.role.findFirst({
          where: { code: roleCode.toUpperCase() },
        });
        if (role) {
          await prisma.userRole.upsert({
            where: {
              userId_roleId: {
                userId,
                roleId: role.id,
              },
            },
            create: {
              userId,
              roleId: role.id,
            },
            update: {},
          });
        }
      }

      await identityReadStore.invalidateUserAccess(userId);

      res.status(200).json({
        success: true,
        data: { message: 'Branch scope assigned successfully' },
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      next(err);
    }
  }
}

export const internalController = new InternalController();

