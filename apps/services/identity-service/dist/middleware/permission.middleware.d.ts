import type { NextFunction, Request, Response } from 'express';
export declare function requirePermission(...requiredPermissions: string[]): (req: Request, _res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=permission.middleware.d.ts.map