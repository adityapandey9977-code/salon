import { UnauthorizedError } from '@salon-spa-saas/common-types';
import type { Request, Response } from 'express';
import { catalogueService } from '../../application/services/catalogue.service';

export class InternalController {
  public async getServiceBookingContext(req: Request, res: Response): Promise<void> {
    const tenantId = (req.headers['x-tenant-id'] as string) || (req.query.tenantId as string);
    if (!tenantId) throw new UnauthorizedError('Tenant ID header/query parameter required');

    const service = await catalogueService.getServiceDetail(tenantId, req.params.id as string);

    res.json({
      success: true,
      data: {
        id: service.id,
        tenantId: service.tenantId,
        code: service.code,
        name: service.name,
        durationMinutes: service.durationMinutes,
        bufferBeforeMinutes: service.bufferBeforeMinutes,
        bufferAfterMinutes: service.bufferAfterMinutes,
        basePrice: service.basePrice,
        gstRate: service.gstRate,
        requiresConsultation: service.requiresConsultation,
        requiresPatchTest: service.requiresPatchTest,
        isActive: service.isActive,
        isBookableOnline: service.isBookableOnline,
      },
      meta: { correlationId: req.headers['x-correlation-id'] },
    });
  }

  public async getBranchServicePrice(req: Request, res: Response): Promise<void> {
    const tenantId = (req.headers['x-tenant-id'] as string) || (req.query.tenantId as string);
    if (!tenantId) throw new UnauthorizedError('Tenant ID header/query parameter required');

    const result = await catalogueService.getBranchServicePrice(
      tenantId,
      req.params.serviceId as string,
      req.params.branchId as string,
    );

    res.json({
      success: true,
      data: result,
      meta: { correlationId: req.headers['x-correlation-id'] },
    });
  }
}

export const internalController = new InternalController();
