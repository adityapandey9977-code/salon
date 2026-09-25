import type { NextFunction, Request, Response } from 'express';
export interface AuthenticatedPrincipal {
    principalType: 'USER' | 'TENANT';
    userId?: string;
    tenantCredentialId?: string;
    tenantId?: string | null;
    sessionId?: string;
    role: string;
    roles?: string[];
    permissions: string[];
    scopeType: string;
    userType?: string;
    branchIds?: string[];
}
declare global {
    namespace Express {
        interface Request {
            auth?: AuthenticatedPrincipal;
            user?: AuthenticatedPrincipal;
        }
    }
}
export declare function authMiddleware(req: Request, _res: Response, next: NextFunction): void;
//# sourceMappingURL=auth.middleware.d.ts.map