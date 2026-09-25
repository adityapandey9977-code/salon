import { Request, Response, NextFunction } from 'express';
export declare class InternalController {
    static getEffectiveEntitlements(req: Request, res: Response, next: NextFunction): Promise<void>;
    static resolveDomain(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getSubscription(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=internal.controller.d.ts.map