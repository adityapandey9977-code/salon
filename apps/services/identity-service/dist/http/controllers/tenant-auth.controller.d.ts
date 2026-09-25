import type { NextFunction, Request, Response } from 'express';
export declare class TenantAuthController {
    login(req: Request, res: Response, next: NextFunction): Promise<void>;
    refreshToken(req: Request, res: Response, next: NextFunction): Promise<void>;
    logout(req: Request, res: Response, next: NextFunction): Promise<void>;
    getMe(req: Request, res: Response, next: NextFunction): Promise<void>;
    forgotPassword(req: Request, res: Response, next: NextFunction): Promise<void>;
    resetPassword(req: Request, res: Response, next: NextFunction): Promise<void>;
    getSessions(req: Request, res: Response, next: NextFunction): Promise<void>;
}
export declare const tenantAuthController: TenantAuthController;
//# sourceMappingURL=tenant-auth.controller.d.ts.map