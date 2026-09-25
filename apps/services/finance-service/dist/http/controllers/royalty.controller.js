import { RoyaltyService } from '../../application/services/royalty.service';
const royaltyService = new RoyaltyService();
export class RoyaltyController {
    static getTenantId(req) {
        const tenantId = req.user?.tenantId || req.auth?.tenantId || req.headers['x-tenant-id'];
        if (!tenantId) {
            throw new Error('Tenant ID required');
        }
        return tenantId;
    }
    static async createRoyaltyRule(req, res, next) {
        try {
            const tenantId = RoyaltyController.getTenantId(req);
            const rule = await royaltyService.createRule({ tenantId, ...req.body });
            res.status(201).json({ success: true, data: rule });
        }
        catch (err) {
            next(err);
        }
    }
    static async getPartnerRoyalties(req, res, next) {
        try {
            const tenantId = RoyaltyController.getTenantId(req);
            const franchiseId = req.query.franchiseId;
            const rules = await royaltyService.listRules(tenantId, franchiseId);
            res.json({ success: true, data: rules });
        }
        catch (err) {
            next(err);
        }
    }
    static async listSettlements(req, res, next) {
        try {
            const tenantId = RoyaltyController.getTenantId(req);
            const franchiseId = req.query.franchiseId;
            const settlements = await royaltyService.listSettlements(tenantId, franchiseId);
            res.json({ success: true, data: settlements });
        }
        catch (err) {
            next(err);
        }
    }
    static async generateSettlement(req, res, next) {
        try {
            const tenantId = RoyaltyController.getTenantId(req);
            const settlement = await royaltyService.generateSettlement(tenantId, {
                franchiseId: req.body.franchiseId,
                periodStart: new Date(req.body.periodStart),
                periodEnd: new Date(req.body.periodEnd),
                adjustmentAmount: req.body.adjustmentAmount,
                dueAt: req.body.dueAt ? new Date(req.body.dueAt) : undefined,
            });
            res.status(201).json({ success: true, data: settlement });
        }
        catch (err) {
            next(err);
        }
    }
    static async paySettlement(req, res, next) {
        try {
            const tenantId = RoyaltyController.getTenantId(req);
            const paid = await royaltyService.markSettlementPaid(tenantId, req.params.id, req.body.paymentReferenceId);
            res.json({ success: true, data: paid });
        }
        catch (err) {
            next(err);
        }
    }
}
