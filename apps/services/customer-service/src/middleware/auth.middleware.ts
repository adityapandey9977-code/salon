import { ForbiddenError, UnauthorizedError } from '@salon-spa-saas/common-types';
import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';

declare global {
  namespace Express {
    interface Request {
      auth?: {
        principalType: 'USER' | 'TENANT';
        userId?: string | null;
        tenantId: string;
        roles?: string[];
        permissions?: string[];
        franchiseId?: string | null;
        branchIds?: string[];
      };
    }
  }
}

export function authMiddleware(req: Request, _res: Response, next: NextFunction): void {
  // 1. Check Gateway Headers
  const gwTenantId = (req.headers['x-tenant-id'] as string) || (req.query?.tenantId as string);
  const gwUserId = req.headers['x-user-id'] as string;
  const gwPrincipalType = req.headers['x-principal-type'] as 'USER' | 'TENANT' | undefined;
  const gwPermissions = req.headers['x-permissions'] as string;
  const gwRoles = req.headers['x-roles'] as string;
  const gwFranchiseId = (req.headers['x-franchise-id'] as string) || (req.query?.franchiseId as string);
  const gwBranchId = (req.headers['x-branch-id'] as string) || (req.query?.branchId as string);

  if (gwTenantId) {
    req.auth = {
      tenantId: gwTenantId,
      userId: gwUserId || null,
      principalType: gwPrincipalType || (gwUserId ? 'USER' : 'TENANT'),
      roles: gwRoles ? gwRoles.split(',') : [],
      permissions: gwPermissions ? gwPermissions.split(',') : [],
      franchiseId: gwFranchiseId || null,
      branchIds: gwBranchId ? [gwBranchId] : [],
    };
    return next();
  }

  // 2. Direct Authorization Bearer Token
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    if (process.env.NODE_ENV === 'development' || !process.env.NODE_ENV) {
      req.auth = {
        tenantId: gwTenantId || '00000000-0000-0000-0000-000000000001',
        userId: gwUserId || null,
        principalType: 'TENANT',
        roles: ['TENANT_ADMIN'],
        permissions: ['*'],
        franchiseId: gwFranchiseId || null,
        branchIds: gwBranchId ? [gwBranchId] : [],
      };
      return next();
    }
    throw new UnauthorizedError('Missing or invalid Authorization header');
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, config.JWT_SECRET) as any;

    if (!decoded.tenantId) {
      throw new ForbiddenError('Token missing tenantId claim');
    }

    req.auth = {
      tenantId: decoded.tenantId,
      userId: decoded.userId || decoded.sub || null,
      principalType: decoded.principalType || (decoded.userId ? 'USER' : 'TENANT'),
      roles: decoded.roles || [],
      permissions: decoded.permissions || [],
      franchiseId: decoded.franchiseId || gwFranchiseId || null,
      branchIds: decoded.branchIds || (gwBranchId ? [gwBranchId] : []),
    };

    next();
  } catch (err) {
    if (err instanceof ForbiddenError || err instanceof UnauthorizedError) throw err;
    throw new UnauthorizedError('Invalid or expired authentication token');
  }
}
