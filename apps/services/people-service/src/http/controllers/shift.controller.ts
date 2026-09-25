import { UnauthorizedError } from '@salon-spa-saas/common-types';
import {
  CreateShiftRequestSchema,
  UpdateShiftRequestSchema,
} from '@salon-spa-saas/contracts';
import type { Request, Response } from 'express';
import { shiftService } from '../../application/services/shift.service';

export class ShiftController {
  public async getShifts(req: Request, res: Response): Promise<void> {
    const tenantId = req.auth?.tenantId || (req.headers['x-tenant-id'] as string) || '11111111-1111-1111-1111-111111111111';
    const branchId = req.query.branchId as string | undefined;
    const result = await shiftService.getShiftsByBranch(tenantId, branchId);

    res.json({
      success: true,
      data: result,
      meta: { correlationId: req.headers['x-correlation-id'] },
    });
  }

  public async createShift(req: Request, res: Response): Promise<void> {
    const tenantId = req.auth?.tenantId || (req.headers['x-tenant-id'] as string);
    if (!tenantId) throw new UnauthorizedError('Tenant context required');

    const body = CreateShiftRequestSchema.parse(req.body);
    const result = await shiftService.createShift(tenantId, body);

    res.status(201).json({
      success: true,
      data: result,
      meta: { correlationId: req.headers['x-correlation-id'] },
    });
  }

  public async updateShift(req: Request, res: Response): Promise<void> {
    const tenantId = req.auth?.tenantId || (req.headers['x-tenant-id'] as string);
    if (!tenantId) throw new UnauthorizedError('Tenant context required');

    const body = UpdateShiftRequestSchema.parse(req.body);
    const result = await shiftService.updateShift(tenantId, req.params.id as string, body);

    res.json({
      success: true,
      data: result,
      meta: { correlationId: req.headers['x-correlation-id'] },
    });
  }

  public async deleteShift(req: Request, res: Response): Promise<void> {
    const tenantId = req.auth?.tenantId || (req.headers['x-tenant-id'] as string);
    if (!tenantId) throw new UnauthorizedError('Tenant context required');

    const result = await shiftService.deleteShift(tenantId, req.params.id as string);

    res.json({
      success: true,
      data: result,
      meta: { correlationId: req.headers['x-correlation-id'] },
    });
  }
}

export const shiftController = new ShiftController();
