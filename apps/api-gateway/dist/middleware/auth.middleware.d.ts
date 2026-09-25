import type { NextFunction, Request, Response } from 'express';
export interface GatewayAuthContext {
    principalType: 'USER' | 'TENANT';
    userId?: string;
    tenantCredentialId?: string;
    sessionId: string;
    userType?: string;
    status: string;
    role: string;
    roles: string[];
    permissions: string[];
    tenantId?: string | null;
    franchiseId?: string | null;
    branchIds: string[];
    scopeType: string;
    scopes: any[];
}
declare global {
    namespace Express {
        interface Request {
            user?: GatewayAuthContext;
        }
    }
}
export declare function gatewayAuthMiddleware(req: Request, res: Response, next: NextFunction): Promise<void>;
//# sourceMappingURL=auth.middleware.d.ts.map