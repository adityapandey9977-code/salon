import { UnauthorizedError } from '@salon-spa-saas/common-types';
import {
  AdjustLeaveBalanceRequestSchema,
  CreateLeaveRequestSchema,
  ReviewLeaveDecisionSchema,
  UpdateLeaveRequestSchema,
} from '@salon-spa-saas/contracts';
import type { Request, Response } from 'express';
import { leaveService } from '../../application/services/leave.service';
import { staffService } from '../../application/services/staff.service';

export class LeaveController {
  public async queryLeave(req: Request, res: Response): Promise<void> {
    const tenantId = req.auth?.tenantId || (req.headers['x-tenant-id'] as string);
    if (!tenantId) throw new UnauthorizedError('Tenant context required');

    const result = await leaveService.queryLeave({
      tenantId,
      employeeId: req.query.employeeId as string | undefined,
      status: req.query.status as any,
      startDate: req.query.startDate as string | undefined,
      endDate: req.query.endDate as string | undefined,
      page: req.query.page ? Number(req.query.page) : 1,
      limit: req.query.limit ? Number(req.query.limit) : 20,
    });

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

  public async getLeaveById(req: Request, res: Response): Promise<void> {
    const tenantId = req.auth?.tenantId || (req.headers['x-tenant-id'] as string);
    if (!tenantId) throw new UnauthorizedError('Tenant context required');

    const result = await leaveService.getLeaveRequestById(tenantId, req.params.id as string);

    res.json({
      success: true,
      data: result,
      meta: { correlationId: req.headers['x-correlation-id'] },
    });
  }

  public async createLeaveRequest(req: Request, res: Response): Promise<void> {
    const tenantId = req.auth?.tenantId || (req.headers['x-tenant-id'] as string);
    if (!tenantId) throw new UnauthorizedError('Tenant context required');

    const body = CreateLeaveRequestSchema.parse(req.body);
    let targetEmployeeId = body.employeeId;

    if (!targetEmployeeId) {
      const userId = req.auth?.userId;
      if (!userId) {
        throw new UnauthorizedError('Employee ID or staff user authentication required to request leave');
      }
      const staffMe = await staffService.getStaffMe(userId, tenantId);
      targetEmployeeId = staffMe.id;
    }

    const result = await leaveService.createLeaveRequest(tenantId, targetEmployeeId, body);

    res.status(201).json({
      success: true,
      data: result,
      meta: { correlationId: req.headers['x-correlation-id'] },
    });
  }

  public async updateLeaveRequest(req: Request, res: Response): Promise<void> {
    const tenantId = req.auth?.tenantId || (req.headers['x-tenant-id'] as string);
    if (!tenantId) throw new UnauthorizedError('Tenant context required');

    const body = UpdateLeaveRequestSchema.parse(req.body);
    const result = await leaveService.updateLeaveRequest(tenantId, req.params.id as string, body);

    res.json({
      success: true,
      data: result,
      meta: { correlationId: req.headers['x-correlation-id'] },
    });
  }

  public async approveLeave(req: Request, res: Response): Promise<void> {
    const tenantId = req.auth?.tenantId || (req.headers['x-tenant-id'] as string);
    if (!tenantId) throw new UnauthorizedError('Tenant context required');

    const body = ReviewLeaveDecisionSchema.parse(req.body || {});
    const approverUserId = req.auth?.userId || null;
    const result = await leaveService.approveLeave(
      tenantId,
      req.params.id as string,
      approverUserId,
      body.reviewNote,
    );

    res.json({
      success: true,
      data: result,
      meta: { correlationId: req.headers['x-correlation-id'] },
    });
  }

  public async rejectLeave(req: Request, res: Response): Promise<void> {
    const tenantId = req.auth?.tenantId || (req.headers['x-tenant-id'] as string);
    if (!tenantId) throw new UnauthorizedError('Tenant context required');

    const body = ReviewLeaveDecisionSchema.parse(req.body || {});
    const rejecterUserId = req.auth?.userId || null;
    const result = await leaveService.rejectLeave(
      tenantId,
      req.params.id as string,
      rejecterUserId,
      body.reviewNote,
    );

    res.json({
      success: true,
      data: result,
      meta: { correlationId: req.headers['x-correlation-id'] },
    });
  }

  public async cancelLeave(req: Request, res: Response): Promise<void> {
    const tenantId = req.auth?.tenantId || (req.headers['x-tenant-id'] as string);
    if (!tenantId) throw new UnauthorizedError('Tenant context required');

    const result = await leaveService.cancelLeave(tenantId, req.params.id as string);

    res.json({
      success: true,
      data: result,
      meta: { correlationId: req.headers['x-correlation-id'] },
    });
  }

  public async getLeaveBalances(req: Request, res: Response): Promise<void> {
    const tenantId = req.auth?.tenantId || (req.headers['x-tenant-id'] as string);
    if (!tenantId) throw new UnauthorizedError('Tenant context required');

    const year = req.query.year ? Number(req.query.year) : undefined;
    const result = await leaveService.getLeaveBalances(tenantId, req.params.id as string, year);

    res.json({
      success: true,
      data: result,
      meta: { correlationId: req.headers['x-correlation-id'] },
    });
  }

  public async adjustLeaveBalance(req: Request, res: Response): Promise<void> {
    const tenantId = req.auth?.tenantId || (req.headers['x-tenant-id'] as string);
    if (!tenantId) throw new UnauthorizedError('Tenant context required');

    const body = AdjustLeaveBalanceRequestSchema.parse(req.body);
    const userId = req.auth?.userId || null;
    const result = await leaveService.adjustLeaveBalance(
      tenantId,
      req.params.id as string,
      body,
      userId,
    );

    res.json({
      success: true,
      data: result,
      meta: { correlationId: req.headers['x-correlation-id'] },
    });
  }
}

export const leaveController = new LeaveController();
