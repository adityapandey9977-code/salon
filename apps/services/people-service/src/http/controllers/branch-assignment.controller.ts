import { UnauthorizedError } from '@salon-spa-saas/common-types';
import {
  AssignStaffBranchRequestSchema,
  UpdateStaffBranchAssignmentRequestSchema,
} from '@salon-spa-saas/contracts';
import type { Request, Response } from 'express';
import { staffBranchService } from '../../application/services/staff-branch.service';

export class BranchAssignmentController {
  public async getStaffBranches(req: Request, res: Response): Promise<void> {
    const tenantId = req.auth?.tenantId || (req.headers['x-tenant-id'] as string);
    if (!tenantId) throw new UnauthorizedError('Tenant context required');

    const result = await staffBranchService.getStaffBranches(tenantId, req.params.id as string);

    res.json({
      success: true,
      data: result,
      meta: { correlationId: req.headers['x-correlation-id'] },
    });
  }

  public async assignBranch(req: Request, res: Response): Promise<void> {
    const tenantId = req.auth?.tenantId || (req.headers['x-tenant-id'] as string);
    if (!tenantId) throw new UnauthorizedError('Tenant context required');

    const body = AssignStaffBranchRequestSchema.parse(req.body);
    const userId = req.auth?.userId || null;
    const result = await staffBranchService.assignBranch(tenantId, req.params.id as string, body, userId);

    res.status(201).json({
      success: true,
      data: result,
      meta: { correlationId: req.headers['x-correlation-id'] },
    });
  }

  public async updateAssignment(req: Request, res: Response): Promise<void> {
    const tenantId = req.auth?.tenantId || (req.headers['x-tenant-id'] as string);
    if (!tenantId) throw new UnauthorizedError('Tenant context required');

    const body = UpdateStaffBranchAssignmentRequestSchema.parse(req.body);
    const result = await staffBranchService.updateAssignment(
      tenantId,
      req.params.id as string,
      req.params.assignmentId as string,
      body,
    );

    res.json({
      success: true,
      data: result,
      meta: { correlationId: req.headers['x-correlation-id'] },
    });
  }

  public async removeAssignment(req: Request, res: Response): Promise<void> {
    const tenantId = req.auth?.tenantId || (req.headers['x-tenant-id'] as string);
    if (!tenantId) throw new UnauthorizedError('Tenant context required');

    const userId = req.auth?.userId || null;
    const result = await staffBranchService.removeAssignment(
      tenantId,
      req.params.id as string,
      req.params.assignmentId as string,
      userId,
    );

    res.json({
      success: true,
      data: result,
      meta: { correlationId: req.headers['x-correlation-id'] },
    });
  }
}

export const branchAssignmentController = new BranchAssignmentController();
