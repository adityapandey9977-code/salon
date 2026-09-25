import type { NextFunction, Request, Response } from 'express';
import { ForbiddenError, UnauthorizedError } from '@salon-spa-saas/common-types';

export function requirePermission(permission: string) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const principal = req.principal;
    if (!principal) {
      throw new UnauthorizedError('Unauthenticated request');
    }

    if (principal.principalType === 'PLATFORM' || principal.principalType === 'TENANT') {
      return next();
    }

    if (!principal.permissions || !principal.permissions.includes(permission)) {
      throw new ForbiddenError(`Missing required permission: ${permission}`);
    }

    next();
  };
}
