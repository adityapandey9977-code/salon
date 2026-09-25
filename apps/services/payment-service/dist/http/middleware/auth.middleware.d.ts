import type { NextFunction, Request, Response } from 'express';
export interface AuthenticatedPrincipal {
    principalType: 'PLATFORM' | 'TENANT' | 'USER' | 'CUSTOMER';
    userId?: string;
    tenantId: string;
    branchIds?: string[];
    franchiseId?: string;
    scopeType?: string;
    permissions?: string[];
}
declare global {
    namespace Express {
        interface Request {
            principal?: AuthenticatedPrincipal;
            correlationId?: string;
        }
    }
}
export declare function authMiddleware(req: Request, _res: Response, next: NextFunction): void;
//# sourceMappingURL=auth.middleware.d.ts.map