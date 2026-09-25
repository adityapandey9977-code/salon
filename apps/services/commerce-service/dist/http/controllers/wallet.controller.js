import { UnauthorizedError } from '@salon-spa-saas/common-types';
import { WalletTopupRequestSchema } from '@salon-spa-saas/contracts';
import { walletService } from '../../application/services/wallet.service';
export class WalletController {
    async getBalance(req, res) {
        const tenantId = req.auth?.tenantId || req.headers['x-tenant-id'];
        if (!tenantId)
            throw new UnauthorizedError('Tenant context required');
        const customerId = req.query.customerId || req.params.customerId;
        if (!customerId)
            throw new UnauthorizedError('Customer ID required');
        const balance = await walletService.getBalance(tenantId, customerId);
        res.json({
            success: true,
            data: { customerId, balance },
            meta: { correlationId: req.headers['x-correlation-id'] },
        });
    }
    async topup(req, res) {
        const tenantId = req.auth?.tenantId || req.headers['x-tenant-id'];
        if (!tenantId)
            throw new UnauthorizedError('Tenant context required');
        const body = WalletTopupRequestSchema.parse(req.body);
        const userId = req.auth?.userId || null;
        const correlationId = req.headers['x-correlation-id'];
        const result = await walletService.topup(tenantId, body, userId, correlationId);
        res.json({
            success: true,
            data: result,
            meta: { correlationId },
        });
    }
}
export const walletController = new WalletController();
