import { ForbiddenError, UnauthorizedError } from '@salon-spa-saas/common-types';
import type { NextFunction, Request, Response } from 'express';

export function requirePermission(...requiredPermissions: string[]) {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      const principal = req.auth || req.user;
      if (!principal) {
        throw new UnauthorizedError('Authentication required');
      }

      // Platform super admin bypasses permission checks
      if (principal.userType === 'PLATFORM' || principal.role === 'SUPER_ADMIN') {
        return next();
      }

      // Tenant Admin, Salon Admin, Branch Manager, Franchise Owner, Partner, and Manager have full domain authority
      const roleUpper = String(principal.role || '').toUpperCase();
      const rolesUpper = (principal.roles || []).map((r) => String(r).toUpperCase());

      if (
        principal.principalType === 'TENANT' ||
        principal.scopeType === 'FRANCHISE' ||
        roleUpper.includes('ADMIN') ||
        roleUpper.includes('MANAGER') ||
        roleUpper.includes('FRANCHISE') ||
        roleUpper.includes('PARTNER') ||
        roleUpper.includes('OWNER') ||
        rolesUpper.some(
          (r) =>
            r.includes('ADMIN') ||
            r.includes('MANAGER') ||
            r.includes('FRANCHISE') ||
            r.includes('PARTNER') ||
            r.includes('OWNER'),
        )
      ) {
        return next();
      }

      // Check wildcard '*' or specific permissions
      const perms = principal.permissions || [];
      const hasPermission =
        perms.includes('*') ||
        requiredPermissions.some(
          (perm) =>
            perms.includes(perm) ||
            perms.includes(perm.split('.')[0] + '.*'),
        );

      if (!hasPermission) {
        throw new ForbiddenError(
          `Missing required permission: ${requiredPermissions.join(' or ')}`,
        );
      }

      next();
    } catch (err) {
      next(err);
    }
  };
}
