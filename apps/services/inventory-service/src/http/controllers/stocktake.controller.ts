import { Request, Response, NextFunction } from 'express';
import { StocktakeService } from '../../application/services/stocktake.service';
import { StockService } from '../../application/services/stock.service';

const stocktakeService = new StocktakeService();
const stockService = new StockService();

export class StocktakeController {
  private static getTenantId(req: Request): string {
    const tenantId = (req as any).user?.tenantId || (req as any).auth?.tenantId || (req.headers['x-tenant-id'] as string);
    if (!tenantId) {
      throw new Error('Tenant ID required');
    }
    return tenantId;
  }

  static async listStocktakes(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = StocktakeController.getTenantId(req);
      const branchId = req.query.branchId as string | undefined;
      const list = await stocktakeService.listStocktakes(tenantId, branchId);
      res.json({ success: true, data: list });
    } catch (err) {
      next(err);
    }
  }

  static async getStocktakeById(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = StocktakeController.getTenantId(req);
      const stocktake = await stocktakeService.getStocktakeById(tenantId, req.params.id as string);
      res.json({ success: true, data: stocktake });
    } catch (err) {
      next(err);
    }
  }

  static async createStocktake(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = StocktakeController.getTenantId(req);
      const createdByUserId = (req as any).user?.id || (req as any).auth?.userId;
      const stocktake = await stocktakeService.createStocktake(tenantId, {
        ...req.body,
        createdByUserId,
      });
      res.status(201).json({ success: true, data: stocktake });
    } catch (err) {
      next(err);
    }
  }

  static async completeStocktake(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = StocktakeController.getTenantId(req);
      const actorUserId = (req as any).user?.id || (req as any).auth?.userId;
      const completed = await stocktakeService.completeAndAdjust(tenantId, req.params.id as string, actorUserId);
      res.json({ success: true, data: completed });
    } catch (err) {
      next(err);
    }
  }

  static async adjustStock(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = StocktakeController.getTenantId(req);
      const actorUserId = (req as any).user?.id || (req as any).auth?.userId;
      const actorPrincipalType = (req as any).auth?.principalType || 'USER';

      const result = await stockService.adjustStock(tenantId, {
        ...req.body,
        actorUserId,
        actorPrincipalType,
      });
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }
}
