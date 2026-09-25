import type { NextFunction, Request, Response } from 'express';
export declare function requireGatewayPermission(...requiredPermissions: string[]): (req: Request, _res: Response, next: NextFunction) => void;
export declare function enforceTenantScope(req: Request, _res: Response, next: NextFunction): void;
export declare function enforceBranchScope(req: Request, _res: Response, next: NextFunction): void;
//# sourceMappingURL=scope.middleware.d.ts.map