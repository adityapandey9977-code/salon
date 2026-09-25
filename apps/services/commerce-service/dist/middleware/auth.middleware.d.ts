import type { NextFunction, Request, Response } from 'express';
declare global {
    namespace Express {
        interface Request {
            auth?: {
                principalType: 'USER' | 'TENANT';
                userId?: string | null;
                tenantId: string;
                roles?: string[];
                permissions?: string[];
                franchiseId?: string | null;
                branchIds?: string[];
            };
        }
    }
}
export declare function authMiddleware(req: Request, _res: Response, next: NextFunction): void;
//# sourceMappingURL=auth.middleware.d.ts.map