import { UnauthorizedError } from '@salon-spa-saas/common-types';
import {
  CreateRosterRequestSchema,
  QueryRosterRequestSchema,
  UpdateRosterRequestSchema,
} from '@salon-spa-saas/contracts';
import type { Request, Response } from 'express';
import { rosterService } from '../../application/services/roster.service';

export class RosterController {
  public async getRoster(req: Request, res: Response): Promise<void> {
    const tenantId = req.auth?.tenantId || (req.headers['x-tenant-id'] as string);
    if (!tenantId) throw new UnauthorizedError('Tenant context required');

    const query = QueryRosterRequestSchema.parse(req.query);
    const result = await rosterService.queryRoster(tenantId, query);

    res.json({
      success: true,
      data: result,
      meta: { correlationId: req.headers['x-correlation-id'] },
    });
  }

  public async createRoster(req: Request, res: Response): Promise<void> {
    const tenantId = req.auth?.tenantId || (req.headers['x-tenant-id'] as string);
    if (!tenantId) throw new UnauthorizedError('Tenant context required');

    const body = CreateRosterRequestSchema.parse(req.body);
    const userId = req.auth?.userId || null;
    const result = await rosterService.createRoster(tenantId, body, userId);

    res.status(201).json({
      success: true,
      data: result,
      meta: { correlationId: req.headers['x-correlation-id'] },
    });
  }

  public async updateRoster(req: Request, res: Response): Promise<void> {
    const tenantId = req.auth?.tenantId || (req.headers['x-tenant-id'] as string);
    if (!tenantId) throw new UnauthorizedError('Tenant context required');

    const body = UpdateRosterRequestSchema.parse(req.body);
    const userId = req.auth?.userId || null;
    const result = await rosterService.updateRoster(tenantId, req.params.id as string, body, userId);

    res.json({
      success: true,
      data: result,
      meta: { correlationId: req.headers['x-correlation-id'] },
    });
  }

  public async deleteRoster(req: Request, res: Response): Promise<void> {
    const tenantId = req.auth?.tenantId || (req.headers['x-tenant-id'] as string);
    if (!tenantId) throw new UnauthorizedError('Tenant context required');

    const result = await rosterService.deleteRoster(tenantId, req.params.id as string);

    res.json({
      success: true,
      data: result,
      meta: { correlationId: req.headers['x-correlation-id'] },
    });
  }
}

export const rosterController = new RosterController();
