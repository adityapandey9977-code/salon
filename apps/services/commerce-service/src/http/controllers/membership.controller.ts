import { UnauthorizedError } from '@salon-spa-saas/common-types';
import { CreateMembershipRequestSchema } from '@salon-spa-saas/contracts';
import type { Request, Response } from 'express';
import { membershipService } from '../../application/services/membership.service';

export class MembershipController {
  public async listMemberships(req: Request, res: Response): Promise<void> {
    const tenantId = req.auth?.tenantId || (req.headers['x-tenant-id'] as string);
    if (!tenantId) throw new UnauthorizedError('Tenant context required');

    const result = await membershipService.listMemberships(tenantId);
    res.json({
      success: true,
      data: result,
      meta: { correlationId: req.headers['x-correlation-id'] },
    });
  }

  public async getMembershipById(req: Request, res: Response): Promise<void> {
    const tenantId = req.auth?.tenantId || (req.headers['x-tenant-id'] as string);
    if (!tenantId) throw new UnauthorizedError('Tenant context required');

    const result = await membershipService.getMembershipById(tenantId, req.params.id as string);
    res.json({
      success: true,
      data: result,
      meta: { correlationId: req.headers['x-correlation-id'] },
    });
  }

  public async createMembership(req: Request, res: Response): Promise<void> {
    const tenantId = req.auth?.tenantId || (req.headers['x-tenant-id'] as string);
    if (!tenantId) throw new UnauthorizedError('Tenant context required');

    const body = CreateMembershipRequestSchema.parse(req.body);
    const userId = req.auth?.userId || null;
    const correlationId = req.headers['x-correlation-id'] as string | undefined;

    const result = await membershipService.createMembership(tenantId, body, userId, correlationId);
    res.status(201).json({
      success: true,
      data: result,
      meta: { correlationId },
    });
  }

  public async updateMembership(req: Request, res: Response): Promise<void> {
    const tenantId = req.auth?.tenantId || (req.headers['x-tenant-id'] as string);
    if (!tenantId) throw new UnauthorizedError('Tenant context required');

    const result = await membershipService.updateMembership(
      tenantId,
      req.params.id as string,
      req.body,
    );
    res.json({
      success: true,
      data: result,
      meta: { correlationId: req.headers['x-correlation-id'] },
    });
  }

  public async listBenefits(req: Request, res: Response): Promise<void> {
    const tenantId = req.auth?.tenantId || (req.headers['x-tenant-id'] as string);
    if (!tenantId) throw new UnauthorizedError('Tenant context required');

    const result = await membershipService.listBenefits(tenantId);
    res.json({
      success: true,
      data: result,
      meta: { correlationId: req.headers['x-correlation-id'] },
    });
  }

  public async createBenefit(req: Request, res: Response): Promise<void> {
    const tenantId = req.auth?.tenantId || (req.headers['x-tenant-id'] as string);
    if (!tenantId) throw new UnauthorizedError('Tenant context required');

    const result = await membershipService.createBenefit(tenantId, req.body);
    res.status(201).json({
      success: true,
      data: result,
      meta: { correlationId: req.headers['x-correlation-id'] },
    });
  }

  public async listRenewals(req: Request, res: Response): Promise<void> {
    const tenantId = req.auth?.tenantId || (req.headers['x-tenant-id'] as string);
    if (!tenantId) throw new UnauthorizedError('Tenant context required');

    const result = await membershipService.listRenewals(tenantId);
    res.json({
      success: true,
      data: result,
      meta: { correlationId: req.headers['x-correlation-id'] },
    });
  }

  public async renewMembership(req: Request, res: Response): Promise<void> {
    const tenantId = req.auth?.tenantId || (req.headers['x-tenant-id'] as string);
    if (!tenantId) throw new UnauthorizedError('Tenant context required');

    const result = await membershipService.renewMembership(
      tenantId,
      req.params.id as string,
      req.body?.renewalMonths,
    );
    res.json({
      success: true,
      data: result,
      meta: { correlationId: req.headers['x-correlation-id'] },
    });
  }
}

export const membershipController = new MembershipController();
