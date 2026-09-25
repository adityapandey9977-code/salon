import { UnauthorizedError } from '@salon-spa-saas/common-types';
import { LoyaltyRedeemRequestSchema } from '@salon-spa-saas/contracts';
import type { Request, Response } from 'express';
import { loyaltyService } from '../../application/services/loyalty.service';

export class LoyaltyController {
  public async getRewards(req: Request, res: Response): Promise<void> {
    const tenantId = req.auth?.tenantId || (req.headers['x-tenant-id'] as string);
    if (!tenantId) throw new UnauthorizedError('Tenant context required');

    const customerId = (req.query.customerId as string) || (req.params.customerId as string);
    if (!customerId) throw new UnauthorizedError('Customer ID required');

    const result = await loyaltyService.getPoints(tenantId, customerId);
    res.json({
      success: true,
      data: { customerId, ...result },
      meta: { correlationId: req.headers['x-correlation-id'] },
    });
  }

  public async redeem(req: Request, res: Response): Promise<void> {
    const tenantId = req.auth?.tenantId || (req.headers['x-tenant-id'] as string);
    if (!tenantId) throw new UnauthorizedError('Tenant context required');

    const body = LoyaltyRedeemRequestSchema.parse(req.body);
    const userId = req.auth?.userId || null;
    const correlationId = req.headers['x-correlation-id'] as string | undefined;

    const result = await loyaltyService.redeemPoints(tenantId, body, userId, correlationId);
    res.json({
      success: true,
      data: result,
      meta: { correlationId },
    });
  }
}

export const loyaltyController = new LoyaltyController();
