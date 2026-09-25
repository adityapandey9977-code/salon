import {
  AssignUserRolesRequestSchema,
  CreateUserRequestSchema,
  CreateUserScopeRequestSchema,
  UpdateUserRequestSchema,
} from '@salon-spa-saas/contracts';
import type { NextFunction, Request, Response } from 'express';
import { roleService } from '../../application/services/role.service';
import { scopeService } from '../../application/services/scope.service';
import { userService } from '../../application/services/user.service';

export class UserController {
  public async listUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = req.query.page ? Number(req.query.page) : 1;
      const limit = req.query.limit ? Number(req.query.limit) : 20;
      const userType = req.query.userType as any;
      const status = req.query.status as any;
      const search = req.query.search as string;

      const result = await userService.listUsers({ page, limit, userType, status, search });

      res.status(200).json({
        success: true,
        data: result.items,
        pagination: {
          page: result.page,
          limit: result.limit,
          total: result.total,
          totalPages: Math.ceil(result.total / result.limit),
        },
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      next(err);
    }
  }

  public async getUserById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const tenantId = (req.headers['x-tenant-id'] as string) || null;
      const user = await userService.getUserById(id, tenantId);

      res.status(200).json({
        success: true,
        data: user,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      next(err);
    }
  }

  public async createUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const body = CreateUserRequestSchema.parse(req.body);
      const user = await userService.createUser({
        email: body.email,
        password: body.password,
        fullName: body.fullName,
        mobilePhone: body.mobilePhone,
        userType: body.userType,
        roleIds: body.roles,
      });

      res.status(201).json({
        success: true,
        data: user,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      next(err);
    }
  }

  public async updateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const body = UpdateUserRequestSchema.parse(req.body);
      const user = await userService.updateUser(id, body);

      res.status(200).json({
        success: true,
        data: user,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      next(err);
    }
  }

  public async suspendUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const user = await userService.suspendUser(id);

      res.status(200).json({
        success: true,
        data: user,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      next(err);
    }
  }

  public async activateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const user = await userService.activateUser(id);

      res.status(200).json({
        success: true,
        data: user,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      next(err);
    }
  }

  public async assignRoles(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.params.id as string;
      const body = AssignUserRolesRequestSchema.parse(req.body);
      await roleService.assignUserRoles(userId, body.roleIds);

      res.status(200).json({
        success: true,
        data: { message: 'Roles assigned successfully' },
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      next(err);
    }
  }

  public async removeRole(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.params.id as string;
      const roleId = req.params.roleId as string;
      await roleService.removeUserRole(userId, roleId);

      res.status(200).json({
        success: true,
        data: { message: 'Role removed successfully' },
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      next(err);
    }
  }

  public async getEffectiveAccess(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.params.id as string;
      const access = await roleService.getEffectiveAccess(userId);

      res.status(200).json({
        success: true,
        data: access,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      next(err);
    }
  }

  public async getScopes(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.params.id as string;
      const scopes = await scopeService.listUserScopes(userId);

      res.status(200).json({
        success: true,
        data: scopes,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      next(err);
    }
  }

  public async createScope(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.params.id as string;
      const body = CreateUserScopeRequestSchema.parse(req.body);
      const scope = await scopeService.createScope({
        userId,
        scopeType: body.scopeType,
        tenantId: body.tenantId,
        franchiseId: body.franchiseId,
        branchId: body.branchId,
      });

      res.status(201).json({
        success: true,
        data: scope,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      next(err);
    }
  }

  public async deleteScope(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.params.id as string;
      const scopeId = req.params.scopeId as string;
      await scopeService.deleteScope(scopeId, userId);

      res.status(200).json({
        success: true,
        data: { message: 'Scope deleted successfully' },
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      next(err);
    }
  }
}

export const userController = new UserController();
