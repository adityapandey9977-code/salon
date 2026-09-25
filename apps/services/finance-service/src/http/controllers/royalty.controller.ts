import { Request, Response, NextFunction } from 'express';
import { RoyaltyService } from '../../application/services/royalty.service';

const royaltyService = new RoyaltyService();

export class RoyaltyController {
  private static getTenantId(req: Request): string {
    const tenantId = (req as any).user?.tenantId || (req as any).auth?.tenantId || (req.headers['x-tenant-id'] as string);
    if (!tenantId) {
      throw new Error('Tenant ID required');
    }
    return tenantId;
  }

  static async createRoyaltyRule(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = RoyaltyController.getTenantId(req);
      const rule = await royaltyService.createRule({ tenantId, ...req.body });
      res.status(201).json({ success: true, data: rule });
    } catch (err) {
      next(err);
    }
  }

  static async getPartnerRoyalties(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = RoyaltyController.getTenantId(req);
      const franchiseId = req.query.franchiseId as string | undefined;
      const rules = await royaltyService.listRules(tenantId, franchiseId);
      res.json({ success: true, data: rules });
    } catch (err) {
      next(err);
    }
  }

  static async listSettlements(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = RoyaltyController.getTenantId(req);
      const franchiseId = req.query.franchiseId as string | undefined;
      const settlements = await royaltyService.listSettlements(tenantId, franchiseId);
      res.json({ success: true, data: settlements });
    } catch (err) {
      next(err);
    }
  }

  static async generateSettlement(req: Request, res: Response, next: NextFunction) {
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
    } catch (err) {
      next(err);
    }
  }

  static async paySettlement(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = RoyaltyController.getTenantId(req);
      const paid = await royaltyService.markSettlementPaid(tenantId, req.params.id as string, req.body.paymentReferenceId);
      res.json({ success: true, data: paid });
    } catch (err) {
      next(err);
    }
  }
}
