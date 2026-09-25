import { StocktakeService } from '../../application/services/stocktake.service';
import { StockService } from '../../application/services/stock.service';
const stocktakeService = new StocktakeService();
const stockService = new StockService();
export class StocktakeController {
    static getTenantId(req) {
        const tenantId = req.user?.tenantId || req.auth?.tenantId || req.headers['x-tenant-id'];
        if (!tenantId) {
            throw new Error('Tenant ID required');
        }
        return tenantId;
    }
    static async listStocktakes(req, res, next) {
        try {
            const tenantId = StocktakeController.getTenantId(req);
            const branchId = req.query.branchId;
            const list = await stocktakeService.listStocktakes(tenantId, branchId);
            res.json({ success: true, data: list });
        }
        catch (err) {
            next(err);
        }
    }
    static async getStocktakeById(req, res, next) {
        try {
            const tenantId = StocktakeController.getTenantId(req);
            const stocktake = await stocktakeService.getStocktakeById(tenantId, req.params.id);
            res.json({ success: true, data: stocktake });
        }
        catch (err) {
            next(err);
        }
    }
    static async createStocktake(req, res, next) {
        try {
            const tenantId = StocktakeController.getTenantId(req);
            const createdByUserId = req.user?.id || req.auth?.userId;
            const stocktake = await stocktakeService.createStocktake(tenantId, {
                ...req.body,
                createdByUserId,
            });
            res.status(201).json({ success: true, data: stocktake });
        }
        catch (err) {
            next(err);
        }
    }
    static async completeStocktake(req, res, next) {
        try {
            const tenantId = StocktakeController.getTenantId(req);
            const actorUserId = req.user?.id || req.auth?.userId;
            const completed = await stocktakeService.completeAndAdjust(tenantId, req.params.id, actorUserId);
            res.json({ success: true, data: completed });
        }
        catch (err) {
            next(err);
        }
    }
    static async adjustStock(req, res, next) {
        try {
            const tenantId = StocktakeController.getTenantId(req);
            const actorUserId = req.user?.id || req.auth?.userId;
            const actorPrincipalType = req.auth?.principalType || 'USER';
            const result = await stockService.adjustStock(tenantId, {
                ...req.body,
                actorUserId,
                actorPrincipalType,
            });
            res.json({ success: true, data: result });
        }
        catch (err) {
            next(err);
        }
    }
}
