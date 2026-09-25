import { UnauthorizedError } from '@salon-spa-saas/common-types';
import {
  ClockInRequestSchema,
  ClockOutRequestSchema,
  ManualAttendanceRequestSchema,
  QueryAttendanceRequestSchema,
} from '@salon-spa-saas/contracts';
import type { Request, Response } from 'express';
import { attendanceService } from '../../application/services/attendance.service';
import { staffService } from '../../application/services/staff.service';

export class AttendanceController {
  public async clockIn(req: Request, res: Response): Promise<void> {
    const tenantId = req.auth?.tenantId || (req.headers['x-tenant-id'] as string);
    if (!tenantId) throw new UnauthorizedError('Tenant context required');

    const body = ClockInRequestSchema.parse(req.body);
    let targetEmployeeId = body.employeeId;

    if (!targetEmployeeId) {
      const userId = req.auth?.userId;
      if (!userId) {
        throw new UnauthorizedError('Employee ID or staff user authentication required to clock in');
      }
      const staffMe = await staffService.getStaffMe(userId, tenantId);
      targetEmployeeId = staffMe.id;
    }

    const userId = req.auth?.userId || null;
    const result = await attendanceService.clockIn(tenantId, targetEmployeeId, body, userId);

    res.status(201).json({
      success: true,
      data: result,
      meta: { correlationId: req.headers['x-correlation-id'] },
    });
  }

  public async clockOut(req: Request, res: Response): Promise<void> {
    const tenantId = req.auth?.tenantId || (req.headers['x-tenant-id'] as string);
    if (!tenantId) throw new UnauthorizedError('Tenant context required');

    const body = ClockOutRequestSchema.parse(req.body);
    let targetEmployeeId = body.employeeId;

    if (!targetEmployeeId) {
      const userId = req.auth?.userId;
      if (!userId) {
        throw new UnauthorizedError('Employee ID or staff user authentication required to clock out');
      }
      const staffMe = await staffService.getStaffMe(userId, tenantId);
      targetEmployeeId = staffMe.id;
    }

    const userId = req.auth?.userId || null;
    const result = await attendanceService.clockOut(tenantId, targetEmployeeId, body, userId);

    res.json({
      success: true,
      data: result,
      meta: { correlationId: req.headers['x-correlation-id'] },
    });
  }

  public async recordManualAttendance(req: Request, res: Response): Promise<void> {
    const tenantId = req.auth?.tenantId || (req.headers['x-tenant-id'] as string);
    if (!tenantId) throw new UnauthorizedError('Tenant context required');

    const body = ManualAttendanceRequestSchema.parse(req.body);
    const userId = req.auth?.userId || null;
    const result = await attendanceService.recordManualAttendance(tenantId, body, userId);

    res.status(201).json({
      success: true,
      data: result,
      meta: { correlationId: req.headers['x-correlation-id'] },
    });
  }

  public async queryAttendanceLog(req: Request, res: Response): Promise<void> {
    const tenantId = req.auth?.tenantId || (req.headers['x-tenant-id'] as string);
    if (!tenantId) throw new UnauthorizedError('Tenant context required');

    const query = QueryAttendanceRequestSchema.parse(req.query);
    const result = await attendanceService.queryAttendance(tenantId, query);

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

  public async getEmployeeAttendance(req: Request, res: Response): Promise<void> {
    const tenantId = req.auth?.tenantId || (req.headers['x-tenant-id'] as string);
    if (!tenantId) throw new UnauthorizedError('Tenant context required');

    const date = req.query.date as string | undefined;
    const result = await attendanceService.getAttendanceForEmployee(
      tenantId,
      req.params.employeeId as string,
      date,
    );

    res.json({
      success: true,
      data: result,
      meta: { correlationId: req.headers['x-correlation-id'] },
    });
  }

  public async punchAttendance(req: Request, res: Response): Promise<void> {
    const tenantId = req.auth?.tenantId || (req.headers['x-tenant-id'] as string) || '11111111-1111-1111-1111-111111111111';
    const { employeeId, type } = req.body || {};
    const userId = req.auth?.userId || null;
    const branchId = (req.body?.branchId as string) || (req.headers['x-branch-ids'] as string)?.split(',')[0] || '22222222-2222-2222-2222-222222222222';

    let result: any;
    if (type === 'CHECK_OUT') {
      result = await attendanceService.clockOut(tenantId, employeeId, { branchId, method: 'WEB' } as any, userId);
    } else {
      result = await attendanceService.clockIn(tenantId, employeeId, { branchId, method: 'WEB' } as any, userId);
    }

    res.json({
      success: true,
      data: result,
      meta: { correlationId: req.headers['x-correlation-id'] },
    });
  }
}

export const attendanceController = new AttendanceController();
