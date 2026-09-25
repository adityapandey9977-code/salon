import { UnauthorizedError } from '@salon-spa-saas/common-types';
import {
  CreateCustomerCautionRequestSchema,
  UpdateCustomerCautionRequestSchema,
} from '@salon-spa-saas/contracts';
import type { Request, Response } from 'express';
import { cautionService } from '../../application/services/caution.service';

export class CautionController {
  public async getCautions(req: Request, res: Response): Promise<void> {
    const tenantId = req.auth?.tenantId || (req.headers['x-tenant-id'] as string);
    if (!tenantId) throw new UnauthorizedError('Tenant context required');

    const result = await cautionService.getCautions(tenantId, req.params.id as string);

    res.json({
      success: true,
      data: result,
      meta: { correlationId: req.headers['x-correlation-id'] },
    });
  }

  public async addCaution(req: Request, res: Response): Promise<void> {
    const tenantId = req.auth?.tenantId || (req.headers['x-tenant-id'] as string);
    if (!tenantId) throw new UnauthorizedError('Tenant context required');

    const body = CreateCustomerCautionRequestSchema.parse(req.body);
    const result = await cautionService.addCaution(tenantId, req.params.id as string, body);

    res.status(201).json({
      success: true,
      data: result,
      meta: { correlationId: req.headers['x-correlation-id'] },
    });
  }

  public async updateCaution(req: Request, res: Response): Promise<void> {
    const tenantId = req.auth?.tenantId || (req.headers['x-tenant-id'] as string);
    if (!tenantId) throw new UnauthorizedError('Tenant context required');

    const body = UpdateCustomerCautionRequestSchema.parse(req.body);
    const result = await cautionService.updateCaution(
      tenantId,
      req.params.cautionId as string,
      body,
    );

    res.json({
      success: true,
      data: result,
      meta: { correlationId: req.headers['x-correlation-id'] },
    });
  }
}

export const cautionController = new CautionController();
