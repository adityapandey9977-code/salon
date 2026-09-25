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
  const gwTenantId = req.headers['x-tenant-id'] as string;
  const gwUserId = req.headers['x-user-id'] as string;
  const gwPrincipalType = req.headers['x-principal-type'] as 'USER' | 'TENANT' | undefined;
  const gwPermissions = req.headers['x-permissions'] as string;
  const gwRoles = (req.headers['x-roles'] || req.headers['x-role']) as string;

  // 1. Direct or Gateway Authorization Bearer Token verification
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    let decoded: any = null;
    try {
      decoded = jwt.verify(token, config.JWT_SECRET) as any;
    } catch {
      decoded = jwt.decode(token) as any;
    }

    if (decoded && (decoded.tenantId || gwTenantId)) {
      const tenantId = decoded.tenantId || gwTenantId;
      const extractedRoles =
        decoded.roles && decoded.roles.length > 0
          ? decoded.roles
          : decoded.role
            ? [decoded.role]
            : gwRoles
              ? gwRoles.split(',')
              : [];

      req.auth = {
        tenantId,
        userId: decoded.userId || decoded.sub || gwUserId || null,
        principalType: decoded.principalType || gwPrincipalType || (decoded.userId ? 'USER' : 'TENANT'),
        roles: extractedRoles,
        permissions:
          decoded.permissions && decoded.permissions.length > 0
            ? decoded.permissions
            : gwPermissions
              ? gwPermissions.split(',')
              : [],
        franchiseId: decoded.franchiseId || (req.headers['x-franchise-id'] as string) || null,
        branchIds:
          decoded.branchIds ||
          (req.headers['x-branch-ids']
            ? (req.headers['x-branch-ids'] as string).split(',')
            : []),
      };
      (req.auth as any).role = decoded.role || (extractedRoles[0] ?? null);

      return next();
    }
  }

  // 2. Gateway Headers fallback
  if (gwTenantId) {
    req.auth = {
      tenantId: gwTenantId,
      userId: gwUserId || null,
      principalType: gwPrincipalType || (gwUserId ? 'USER' : 'TENANT'),
      roles: gwRoles ? gwRoles.split(',') : [],
      permissions: gwPermissions ? gwPermissions.split(',') : [],
      franchiseId: (req.headers['x-franchise-id'] as string) || null,
      branchIds: req.headers['x-branch-ids']
        ? (req.headers['x-branch-ids'] as string).split(',')
        : [],
    };
    return next();
  }

  throw new UnauthorizedError('Missing or invalid Authorization header');
}
