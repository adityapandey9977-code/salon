import { UnauthorizedError } from '@salon-spa-saas/common-types';
import {
  ConvertLeadRequestSchema,
  CreateLeadRequestSchema,
  UpdateLeadStatusRequestSchema,
} from '@salon-spa-saas/contracts';
import type { Request, Response } from 'express';
import { leadService } from '../../application/services/lead.service';

export class LeadController {
  public async listLeads(req: Request, res: Response): Promise<void> {
    const tenantId = req.auth?.tenantId || (req.headers['x-tenant-id'] as string);
    if (!tenantId) throw new UnauthorizedError('Tenant context required');

    const status = req.query.status as any;
    const branchId = req.query.branchId as string | undefined;
    const page = req.query.page ? Number(req.query.page) : 1;
    const limit = req.query.limit ? Number(req.query.limit) : 20;

    const result = await leadService.listLeads(tenantId, { status, branchId, page, limit });

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

  public async getLeadById(req: Request, res: Response): Promise<void> {
    const tenantId = req.auth?.tenantId || (req.headers['x-tenant-id'] as string);
    if (!tenantId) throw new UnauthorizedError('Tenant context required');

    const result = await leadService.getLeadById(tenantId, req.params.id as string);

    res.json({
      success: true,
      data: result,
      meta: { correlationId: req.headers['x-correlation-id'] },
    });
  }

  public async createLead(req: Request, res: Response): Promise<void> {
    const tenantId = req.auth?.tenantId || (req.headers['x-tenant-id'] as string);
    if (!tenantId) throw new UnauthorizedError('Tenant context required');

    const body = CreateLeadRequestSchema.parse(req.body);
    const userId = req.auth?.userId || null;
    const correlationId = req.headers['x-correlation-id'] as string | undefined;

    const result = await leadService.createLead(tenantId, body, userId, correlationId);

    res.status(201).json({
      success: true,
      data: result,
      meta: { correlationId },
    });
  }

  public async updateStatus(req: Request, res: Response): Promise<void> {
    const tenantId = req.auth?.tenantId || (req.headers['x-tenant-id'] as string);
    if (!tenantId) throw new UnauthorizedError('Tenant context required');

    const body = UpdateLeadStatusRequestSchema.parse(req.body);
    const userId = req.auth?.userId || null;
    const correlationId = req.headers['x-correlation-id'] as string | undefined;

    const result = await leadService.updateLeadStatus(
      tenantId,
      req.params.id as string,
      body,
      userId,
      correlationId,
    );

    res.json({
      success: true,
      data: result,
      meta: { correlationId },
    });
  }

  public async convertLead(req: Request, res: Response): Promise<void> {
    const tenantId = req.auth?.tenantId || (req.headers['x-tenant-id'] as string);
    if (!tenantId) throw new UnauthorizedError('Tenant context required');

    const body = ConvertLeadRequestSchema.parse(req.body || {});
    const userId = req.auth?.userId || null;
    const correlationId = req.headers['x-correlation-id'] as string | undefined;

    const result = await leadService.convertLead(
      tenantId,
      req.params.id as string,
      body,
      userId,
      correlationId,
    );

    res.json({
      success: true,
      data: result,
      meta: { correlationId },
    });
  }
}

export const leadController = new LeadController();
