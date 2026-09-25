import { Request, Response, NextFunction } from 'express';
import { CampaignService } from '../../application/services/campaign.service';

const campaignService = new CampaignService();

export class CampaignController {
  private static getTenantId(req: Request): string {
    const tenantId = (req as any).user?.tenantId || (req as any).auth?.tenantId || (req.headers['x-tenant-id'] as string);
    if (!tenantId) {
      throw new Error('Tenant ID required');
    }
    return tenantId;
  }

  static async listCampaigns(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = CampaignController.getTenantId(req);
      const campaigns = await campaignService.listCampaigns(tenantId, req.query.status as any);
      res.json({ success: true, data: campaigns });
    } catch (err) {
      next(err);
    }
  }

  static async createCampaign(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = CampaignController.getTenantId(req);
      const createdByUserId = (req as any).user?.id || (req as any).auth?.userId;
      const campaign = await campaignService.createCampaign(tenantId, {
        ...req.body,
        createdByUserId,
      });
      res.status(201).json({ success: true, data: campaign });
    } catch (err) {
      next(err);
    }
  }

  static async sendWinbackOffer(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = CampaignController.getTenantId(req);
      const result = await campaignService.sendWinbackOffer(tenantId, req.body);
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }
}
