import { Request, Response, NextFunction } from 'express';
export declare class RoyaltyController {
    private static getTenantId;
    static createRoyaltyRule(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getPartnerRoyalties(req: Request, res: Response, next: NextFunction): Promise<void>;
    static listSettlements(req: Request, res: Response, next: NextFunction): Promise<void>;
    static generateSettlement(req: Request, res: Response, next: NextFunction): Promise<void>;
    static paySettlement(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=royalty.controller.d.ts.map