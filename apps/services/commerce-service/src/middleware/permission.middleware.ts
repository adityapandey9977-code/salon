import { ForbiddenError, UnauthorizedError } from '@salon-spa-saas/common-types';
import type { NextFunction, Request, Response } from 'express';

export function requirePermission(requiredPermission: string) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.auth) {
      throw new UnauthorizedError('Authentication context required');
    }

    if (
      req.auth.principalType === 'TENANT' ||
      req.auth.roles?.includes('TENANT_ADMIN') ||
      req.auth.roles?.includes('SALON_ADMIN') ||
      req.auth.roles?.includes('SUPER_ADMIN') ||
      req.auth.roles?.includes('FRANCHISE_OWNER') ||
      req.auth.roles?.includes('FRANCHISE_PARTNER') ||
      req.auth.roles?.includes('FRANCHISE_MANAGER')
    ) {
      return next();
    }

    const rolesUpper = (req.auth.roles || []).map((r: string) =>
      String(r).toUpperCase().replace(/[\s-]+/g, '_'),
    );
    const roleUpper = String((req.auth as any).role || '').toUpperCase().replace(/[\s-]+/g, '_');
    const hasBranchScope = Boolean(req.auth.branchIds && req.auth.branchIds.length > 0);
    const isBranchManager =
      rolesUpper.includes('BRANCH_MANAGER') ||
      roleUpper === 'BRANCH_MANAGER' ||
      hasBranchScope;

    const isReadOperation =
      requiredPermission.endsWith('.read') ||
      requiredPermission.endsWith('.list') ||
      requiredPermission.endsWith('.get') ||
      req.method === 'GET';

    if (
      isBranchManager &&
      (isReadOperation ||
        requiredPermission.startsWith('service.') ||
        requiredPermission.startsWith('commerce.'))
    ) {
      return next();
    }

    const permissions = (req.auth.permissions || []).map((p: string) => p.toLowerCase().trim());
    console.log(`[Permission Check] User: ${req.auth.userId}, Role: ${roleUpper}, Required: ${requiredPermission}, User Perms:`, permissions);
    const reqPermLower = requiredPermission.toLowerCase().trim();
    const mappedPerm = reqPermLower.startsWith('service.')
      ? reqPermLower.replace('service.', 'commerce.')
      : reqPermLower.startsWith('commerce.')
        ? reqPermLower.replace('commerce.', 'service.')
        : reqPermLower;

    if (
      permissions.includes('*') ||
      permissions.includes(reqPermLower) ||
      permissions.includes(mappedPerm) ||
      (reqPermLower.startsWith('service.') &&
        (permissions.includes('commerce.read') || permissions.includes('commerce.manage'))) ||
      (reqPermLower.startsWith('commerce.') &&
        (permissions.includes('service.read') || permissions.includes('service.manage'))) ||
      (isReadOperation &&
        (permissions.includes('panel.branch.access') ||
          permissions.includes('branch.read') ||
          permissions.includes('commerce.read')))
    ) {
      return next();
    }

    throw new ForbiddenError(`Missing required permission: ${requiredPermission}`);
  };
}
