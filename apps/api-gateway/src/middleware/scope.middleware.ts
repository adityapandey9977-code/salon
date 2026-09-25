import { ForbiddenError, UnauthorizedError } from '@salon-spa-saas/common-types';
import type { NextFunction, Request, Response } from 'express';

export function requireGatewayPermission(...requiredPermissions: string[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new UnauthorizedError('Authentication required');
    }

    if (req.user.scopeType === 'PLATFORM' || req.user.userType === 'PLATFORM') {
      next();
      return;
    }

    const hasPermission = requiredPermissions.some((perm) =>
      req.user!.permissions.includes(perm),
    );

    if (!hasPermission) {
      throw new ForbiddenError(
        `Forbidden: Missing permission ${requiredPermissions.join(' or ')}`,
      );
    }

    next();
  };
}

export function enforceTenantScope(req: Request, _res: Response, next: NextFunction): void {
  if (!req.user) {
    throw new UnauthorizedError('Authentication required');
  }

  if (req.user.scopeType === 'PLATFORM' || req.user.userType === 'PLATFORM') {
    next();
    return;
  }

  const requestedTenantId =
    req.params.tenantId || req.query.tenantId || req.headers['x-tenant-id'];

  if (requestedTenantId && requestedTenantId !== req.user.tenantId) {
    throw new ForbiddenError('Tenant scope violation: Access denied to requested tenant');
  }

  next();
}

export function enforceBranchScope(req: Request, _res: Response, next: NextFunction): void {
  if (!req.user) {
    throw new UnauthorizedError('Authentication required');
  }

  // Super Admin / Platform scope or Tenant principal has access across all tenant branches
  if (
    req.user.scopeType === 'PLATFORM' ||
    req.user.userType === 'PLATFORM' ||
    req.user.principalType === 'TENANT' ||
    req.user.role === 'TENANT_ADMIN' ||
    req.user.roles.includes('SALON_ADMIN')
  ) {
    next();
    return;
  }

  const requestedBranchId = (req.params.branchId ||
    req.query.branchId ||
    req.headers['x-branch-id']) as string;

  if (requestedBranchId && !req.user.branchIds.includes(requestedBranchId)) {
    throw new ForbiddenError('Branch scope violation: Access denied to requested branch');
  }

  next();
}

