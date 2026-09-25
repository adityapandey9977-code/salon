import type { NextFunction, Request, Response } from 'express';
export declare class SuperAdminAuthController {
    login(req: Request, res: Response, next: NextFunction): Promise<void>;
    refreshToken(req: Request, res: Response, next: NextFunction): Promise<void>;
    logout(req: Request, res: Response, next: NextFunction): Promise<void>;
    getMe(req: Request, res: Response, next: NextFunction): Promise<void>;
}
export declare const superAdminAuthController: SuperAdminAuthController;
//# sourceMappingURL=super-admin-auth.controller.d.ts.map