import { UnauthorizedError } from '@salon-spa-saas/common-types';
import { CreateCustomerSegmentRequestSchema } from '@salon-spa-saas/contracts';
import type { Request, Response } from 'express';
import { segmentService } from '../../application/services/segment.service';

export class SegmentController {
  public async listSegments(req: Request, res: Response): Promise<void> {
    const tenantId = req.auth?.tenantId || (req.headers['x-tenant-id'] as string);
    if (!tenantId) throw new UnauthorizedError('Tenant context required');

    const result = await segmentService.getSegments(tenantId);

    res.json({
      success: true,
      data: result,
      meta: { correlationId: req.headers['x-correlation-id'] },
    });
  }

  public async getSegmentById(req: Request, res: Response): Promise<void> {
    const tenantId = req.auth?.tenantId || (req.headers['x-tenant-id'] as string);
    if (!tenantId) throw new UnauthorizedError('Tenant context required');

    const result = await segmentService.getSegmentById(tenantId, req.params.id as string);

    res.json({
      success: true,
      data: result,
      meta: { correlationId: req.headers['x-correlation-id'] },
    });
  }

  public async createSegment(req: Request, res: Response): Promise<void> {
    const tenantId = req.auth?.tenantId || (req.headers['x-tenant-id'] as string);
    if (!tenantId) throw new UnauthorizedError('Tenant context required');

    const body = CreateCustomerSegmentRequestSchema.parse(req.body);
    const userId = req.auth?.userId || null;
    const correlationId = req.headers['x-correlation-id'] as string | undefined;

    const result = await segmentService.createSegment(tenantId, body, userId, correlationId);

    res.status(201).json({
      success: true,
      data: result,
      meta: { correlationId },
    });
  }

  public async addMember(req: Request, res: Response): Promise<void> {
    const tenantId = req.auth?.tenantId || (req.headers['x-tenant-id'] as string);
    if (!tenantId) throw new UnauthorizedError('Tenant context required');

    const customerId = req.body.customerId as string;
    await segmentService.addMember(tenantId, req.params.id as string, customerId);

    res.json({
      success: true,
      data: { message: 'Member added to segment' },
      meta: { correlationId: req.headers['x-correlation-id'] },
    });
  }

  public async removeMember(req: Request, res: Response): Promise<void> {
    const tenantId = req.auth?.tenantId || (req.headers['x-tenant-id'] as string);
    if (!tenantId) throw new UnauthorizedError('Tenant context required');

    await segmentService.removeMember(
      tenantId,
      req.params.id as string,
      req.params.customerId as string,
    );

    res.json({
      success: true,
      data: { message: 'Member removed from segment' },
      meta: { correlationId: req.headers['x-correlation-id'] },
    });
  }
}

export const segmentController = new SegmentController();
