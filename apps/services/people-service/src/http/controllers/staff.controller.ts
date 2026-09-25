import { UnauthorizedError } from '@salon-spa-saas/common-types';
import {
  CreateEmployeeRequestSchema,
  ListStaffQuerySchema,
  UpdateEmployeeRequestSchema,
} from '@salon-spa-saas/contracts';
import type { Request, Response } from 'express';
import { staffService } from '../../application/services/staff.service';

const DEFAULT_TENANT_ID = process.env.DEFAULT_TENANT_ID || 'f1b473ba-4bcf-42a7-9017-c8488536dbe6';

export class StaffController {
  private getTenantId(req: Request): string {
    const id =
      req.auth?.tenantId ||
      (req.headers['x-tenant-id'] as string) ||
      (req.query?.tenantId as string) ||
      (req.body?.tenantId as string);
    return id || DEFAULT_TENANT_ID;
  }

  public async listStaff(req: Request, res: Response): Promise<void> {
    const tenantId = this.getTenantId(req);
    const query = ListStaffQuerySchema.parse(req.query);
    const result = await staffService.listStaff(tenantId, query);

    res.json({
      success: true,
      data: result.items,
      meta: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: Math.ceil(result.total / result.limit),
        correlationId: req.headers['x-correlation-id'],
      },
    });
  }

  public async getStaffById(req: Request, res: Response): Promise<void> {
    const tenantId = this.getTenantId(req);
    const result = await staffService.getStaffDetail(tenantId, req.params.id as string);

    res.json({
      success: true,
      data: result,
      meta: { correlationId: req.headers['x-correlation-id'] },
    });
  }

  public async getStaffMe(req: Request, res: Response): Promise<void> {
    const userId = req.auth?.userId || (req.headers['x-user-id'] as string);
    if (!userId) {
      res.json({
        success: true,
        data: null,
        meta: { correlationId: req.headers['x-correlation-id'] },
      });
      return;
    }

    const tenantId = this.getTenantId(req);
    try {
      const result = await staffService.getStaffMe(userId, tenantId);
      res.json({
        success: true,
        data: result,
        meta: { correlationId: req.headers['x-correlation-id'] },
      });
    } catch (err: any) {
      if (err.name === 'NotFoundError' || err.statusCode === 404 || err.message?.includes('No linked employee')) {
        res.json({
          success: true,
          data: null,
          meta: { correlationId: req.headers['x-correlation-id'] },
        });
        return;
      }
      throw err;
    }
  }

  public async createStaff(req: Request, res: Response): Promise<void> {
    const tenantId = this.getTenantId(req);
    const body = CreateEmployeeRequestSchema.parse(req.body);
    const userId = req.auth?.userId || null;
    const result = await staffService.createStaff(tenantId, body, userId);

    res.status(201).json({
      success: true,
      data: result,
      meta: { correlationId: req.headers['x-correlation-id'] },
    });
  }

  public async updateStaff(req: Request, res: Response): Promise<void> {
    const tenantId = this.getTenantId(req);
    const body = UpdateEmployeeRequestSchema.parse(req.body);
    const userId = req.auth?.userId || null;
    const result = await staffService.updateStaff(tenantId, req.params.id as string, body, userId);

    res.json({
      success: true,
      data: result,
      meta: { correlationId: req.headers['x-correlation-id'] },
    });
  }

  public async deleteStaff(req: Request, res: Response): Promise<void> {
    const tenantId = this.getTenantId(req);
    const userId = req.auth?.userId || null;
    const deleteReason = req.body?.reason as string | undefined;
    const result = await staffService.softDeleteStaff(tenantId, req.params.id as string, userId, deleteReason);

    res.json({
      success: true,
      data: result,
      meta: { correlationId: req.headers['x-correlation-id'] },
    });
  }

  public async getBranchTeam(req: Request, res: Response): Promise<void> {
    const tenantId = this.getTenantId(req);
    const branchId = (req.query.branchId as string) || (req.params.branchId as string);
    if (!branchId) throw new UnauthorizedError('Branch ID required');

    const result = await staffService.getBranchTeam(tenantId, branchId);

    res.json({
      success: true,
      data: result,
      meta: { correlationId: req.headers['x-correlation-id'] },
    });
  }
}

export const staffController = new StaffController();
