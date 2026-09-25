import { UnauthorizedError } from '@salon-spa-saas/common-types';
import { WalletTopupRequestSchema } from '@salon-spa-saas/contracts';
import type { Request, Response } from 'express';
import { walletService } from '../../application/services/wallet.service';

export class WalletController {
  public async getBalance(req: Request, res: Response): Promise<void> {
    const tenantId = req.auth?.tenantId || (req.headers['x-tenant-id'] as string);
    if (!tenantId) throw new UnauthorizedError('Tenant context required');

    const customerId = (req.query.customerId as string) || (req.params.customerId as string);
    if (!customerId) throw new UnauthorizedError('Customer ID required');

    const balance = await walletService.getBalance(tenantId, customerId);
    res.json({
      success: true,
      data: { customerId, balance },
      meta: { correlationId: req.headers['x-correlation-id'] },
    });
  }

  public async topup(req: Request, res: Response): Promise<void> {
    const tenantId = req.auth?.tenantId || (req.headers['x-tenant-id'] as string);
    if (!tenantId) throw new UnauthorizedError('Tenant context required');

    const body = WalletTopupRequestSchema.parse(req.body);
    const userId = req.auth?.userId || null;
    const correlationId = req.headers['x-correlation-id'] as string | undefined;

    const result = await walletService.topup(tenantId, body, userId, correlationId);
    res.json({
      success: true,
      data: result,
      meta: { correlationId },
    });
  }
}

export const walletController = new WalletController();
