import type { NextFunction, Request, Response } from 'express';
export declare class TenantController {
    static getDnsInfo(req: Request, res: Response, next: NextFunction): Promise<void>;
    static listTenants(_req: Request, res: Response, next: NextFunction): Promise<void>;
    static getTenantById(req: Request, res: Response, next: NextFunction): Promise<void>;
    static createTenant(req: Request, res: Response, next: NextFunction): Promise<void>;
    static updateTenant(req: Request, res: Response, next: NextFunction): Promise<void>;
    static deleteTenant(req: Request, res: Response, next: NextFunction): Promise<void>;
    static reprovisionCredentials(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getInternalTenant(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=tenant.controller.d.ts.map