import { Request, Response, NextFunction } from 'express';
export declare class SuperAdminController {
    static listProvisioningRequests(req: Request, res: Response, next: NextFunction): Promise<void>;
    static provisionTenant(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getTenantDetails(req: Request, res: Response, next: NextFunction): Promise<void>;
    static listSubscriptions(req: Request, res: Response, next: NextFunction): Promise<void>;
    static updateTenantSubscription(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getSettings(req: Request, res: Response, next: NextFunction): Promise<void>;
    static updateSettings(req: Request, res: Response, next: NextFunction): Promise<void>;
    static listDomains(req: Request, res: Response, next: NextFunction): Promise<void>;
    static addDomain(req: Request, res: Response, next: NextFunction): Promise<void>;
    static deleteDomain(req: Request, res: Response, next: NextFunction): Promise<void>;
    static setCname(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getBranding(req: Request, res: Response, next: NextFunction): Promise<void>;
    static updateBranding(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getOverrides(req: Request, res: Response, next: NextFunction): Promise<void>;
    static setOverride(req: Request, res: Response, next: NextFunction): Promise<void>;
    static deleteOverride(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=super-admin.controller.d.ts.map