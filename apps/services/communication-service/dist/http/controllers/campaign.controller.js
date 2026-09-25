import { CampaignService } from '../../application/services/campaign.service';
const campaignService = new CampaignService();
export class CampaignController {
    static getTenantId(req) {
        const tenantId = req.user?.tenantId || req.auth?.tenantId || req.headers['x-tenant-id'];
        if (!tenantId) {
            throw new Error('Tenant ID required');
        }
        return tenantId;
    }
    static async listCampaigns(req, res, next) {
        try {
            const tenantId = CampaignController.getTenantId(req);
            const campaigns = await campaignService.listCampaigns(tenantId, req.query.status);
            res.json({ success: true, data: campaigns });
        }
        catch (err) {
            next(err);
        }
    }
    static async createCampaign(req, res, next) {
        try {
            const tenantId = CampaignController.getTenantId(req);
            const createdByUserId = req.user?.id || req.auth?.userId;
            const campaign = await campaignService.createCampaign(tenantId, {
                ...req.body,
                createdByUserId,
            });
            res.status(201).json({ success: true, data: campaign });
        }
        catch (err) {
            next(err);
        }
    }
    static async sendWinbackOffer(req, res, next) {
        try {
            const tenantId = CampaignController.getTenantId(req);
            const result = await campaignService.sendWinbackOffer(tenantId, req.body);
            res.json({ success: true, data: result });
        }
        catch (err) {
            next(err);
        }
    }
}
