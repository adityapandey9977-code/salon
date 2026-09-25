import { Request, Response, NextFunction } from 'express';
export declare class CampaignController {
    private static getTenantId;
    static listCampaigns(req: Request, res: Response, next: NextFunction): Promise<void>;
    static createCampaign(req: Request, res: Response, next: NextFunction): Promise<void>;
    static sendWinbackOffer(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=campaign.controller.d.ts.map