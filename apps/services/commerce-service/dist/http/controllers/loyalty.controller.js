import { UnauthorizedError } from '@salon-spa-saas/common-types';
import { LoyaltyRedeemRequestSchema } from '@salon-spa-saas/contracts';
import { loyaltyService } from '../../application/services/loyalty.service';
export class LoyaltyController {
    async getRewards(req, res) {
        const tenantId = req.auth?.tenantId || req.headers['x-tenant-id'];
        if (!tenantId)
            throw new UnauthorizedError('Tenant context required');
        const customerId = req.query.customerId || req.params.customerId;
        if (!customerId)
            throw new UnauthorizedError('Customer ID required');
        const result = await loyaltyService.getPoints(tenantId, customerId);
        res.json({
            success: true,
            data: { customerId, ...result },
            meta: { correlationId: req.headers['x-correlation-id'] },
        });
    }
    async redeem(req, res) {
        const tenantId = req.auth?.tenantId || req.headers['x-tenant-id'];
        if (!tenantId)
            throw new UnauthorizedError('Tenant context required');
        const body = LoyaltyRedeemRequestSchema.parse(req.body);
        const userId = req.auth?.userId || null;
        const correlationId = req.headers['x-correlation-id'];
        const result = await loyaltyService.redeemPoints(tenantId, body, userId, correlationId);
        res.json({
            success: true,
            data: result,
            meta: { correlationId },
        });
    }
}
export const loyaltyController = new LoyaltyController();
