import { UnauthorizedError } from '@salon-spa-saas/common-types';
import type { Request, Response } from 'express';
import { availabilityService } from '../../application/services/availability.service';

export class InternalController {
  public async getStaffAvailabilityContext(req: Request, res: Response): Promise<void> {
    const tenantId = (req.headers['x-tenant-id'] as string) || (req.query.tenantId as string);
    if (!tenantId) {
      throw new UnauthorizedError('Tenant ID header/query parameter required');
    }

    const date = req.query.date as string | undefined;
    const result = await availabilityService.getStaffAvailabilityContext(
      tenantId,
      req.params.id as string,
      date,
    );

    res.json({
      success: true,
      data: result,
      meta: { correlationId: req.headers['x-correlation-id'] },
    });
  }

  public async getBookableStaffForBranch(req: Request, res: Response): Promise<void> {
    const tenantId = (req.headers['x-tenant-id'] as string) || (req.query.tenantId as string);
    if (!tenantId) {
      throw new UnauthorizedError('Tenant ID header/query parameter required');
    }

    const date = req.query.date as string | undefined;
    const serviceId = req.query.serviceId as string | undefined;

    const result = await availabilityService.getBookableStaffForBranch(
      tenantId,
      req.params.branchId as string,
      date,
      serviceId,
    );

    res.json({
      success: true,
      data: result,
      meta: { correlationId: req.headers['x-correlation-id'] },
    });
  }
}

export const internalController = new InternalController();
