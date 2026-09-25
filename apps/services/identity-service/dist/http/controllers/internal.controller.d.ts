import type { NextFunction, Request, Response } from 'express';
export declare class InternalController {
    getAuthContext(req: Request, res: Response, next: NextFunction): Promise<void>;
    createTenantCredential(req: Request, res: Response, next: NextFunction): Promise<void>;
    resetTenantCredentialPassword(req: Request, res: Response, next: NextFunction): Promise<void>;
    createStaffUser(req: Request, res: Response, next: NextFunction): Promise<void>;
    assignStaffBranchScope(req: Request, res: Response, next: NextFunction): Promise<void>;
}
export declare const internalController: InternalController;
//# sourceMappingURL=internal.controller.d.ts.map