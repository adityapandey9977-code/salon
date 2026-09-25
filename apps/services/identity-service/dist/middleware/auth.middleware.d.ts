import type { NextFunction, Request, Response } from 'express';
export interface AuthenticatedUserContext {
    principalType: 'USER' | 'TENANT';
    userId?: string;
    tenantCredentialId?: string;
    tenantId?: string | null;
    sessionId: string;
    role: string;
    scopeType: string;
    userType?: string;
}
declare global {
    namespace Express {
        interface Request {
            user?: AuthenticatedUserContext;
        }
    }
}
export declare function authMiddleware(req: Request, _res: Response, next: NextFunction): void;
//# sourceMappingURL=auth.middleware.d.ts.map