import {
  AssignRolePermissionsRequestSchema,
  CreateRoleRequestSchema,
  UpdateRoleRequestSchema,
} from '@salon-spa-saas/contracts';
import type { NextFunction, Request, Response } from 'express';
import { roleService } from '../../application/services/role.service';

export class RoleController {
  public async listRoles(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const scope =
        (req.query.scope as string) || (req.user?.userType === 'TENANT' ? 'TENANT' : undefined);
      const tenantId =
        (req.headers['x-tenant-id'] as string) ||
        req.user?.tenantId ||
        (req.query.tenantId as string) ||
        null;
      const showOnFrontend = req.query.showOnFrontend === 'true' ? true : req.query.showOnFrontend === 'false' ? false : undefined;
      const panel = req.query.panel as string | undefined;

      const roles = await roleService.listRoles(scope, tenantId, showOnFrontend, panel);
      res.status(200).json({
        success: true,
        data: roles,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      next(err);
    }
  }

  public async getRoleById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const tenantId =
        (req.headers['x-tenant-id'] as string) || req.user?.tenantId || null;
      const role = await roleService.getRoleById(id, tenantId);
      res.status(200).json({
        success: true,
        data: role,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      next(err);
    }
  }

  public async createRole(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const body = CreateRoleRequestSchema.parse(req.body);
      const tenantId =
        (req.headers['x-tenant-id'] as string) ||
        req.user?.tenantId ||
        (req.body.tenantId as string) ||
        null;
      const role = await roleService.createRole({
        name: body.name,
        code: body.code,
        description: body.description,
        permissionCodes: body.permissions,
        tenantId: tenantId || undefined,
      });

      res.status(201).json({
        success: true,
        data: role,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      next(err);
    }
  }

  public async updateRole(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const body = UpdateRoleRequestSchema.parse(req.body);
      const tenantId =
        (req.headers['x-tenant-id'] as string) || req.user?.tenantId || null;
      const role = await roleService.updateRole(id, body, tenantId);

      res.status(200).json({
        success: true,
        data: role,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      next(err);
    }
  }

  public async deleteRole(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const tenantId =
        (req.headers['x-tenant-id'] as string) || req.user?.tenantId || null;
      await roleService.deleteRole(id, tenantId);
      res.status(200).json({
        success: true,
        data: { message: 'Role deleted successfully' },
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      next(err);
    }
  }

  public async assignPermissions(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const body = AssignRolePermissionsRequestSchema.parse(req.body);
      const tenantId =
        (req.headers['x-tenant-id'] as string) || req.user?.tenantId || null;
      await roleService.assignRolePermissions(id, body.permissions, tenantId);

      res.status(200).json({
        success: true,
        data: { message: 'Permissions assigned successfully' },
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      next(err);
    }
  }

  public async listPermissions(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const permissions = await roleService.listPermissions();
      res.status(200).json({
        success: true,
        data: permissions,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      next(err);
    }
  }
}

export const roleController = new RoleController();
