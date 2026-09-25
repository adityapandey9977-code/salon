import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '@salon-spa-saas/common-types';
import { config } from '../../config';

export interface AuthenticatedPrincipal {
  principalType: 'PLATFORM' | 'TENANT' | 'USER' | 'CUSTOMER';
  userId?: string;
  tenantId: string;
  branchIds?: string[];
  franchiseId?: string;
  scopeType?: string;
  permissions?: string[];
}

declare global {
  namespace Express {
    interface Request {
      principal?: AuthenticatedPrincipal;
      correlationId?: string;
    }
  }
}

export function authMiddleware(req: Request, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthorizedError('Missing or malformed Authorization header');
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, config.JWT_SECRET) as any;

    req.principal = {
      principalType: payload.principalType || 'USER',
      userId: payload.userId || payload.sub,
      tenantId: payload.tenantId,
      branchIds: payload.branchIds || (payload.branchId ? [payload.branchId] : []),
      franchiseId: payload.franchiseId,
      scopeType: payload.scopeType,
      permissions: payload.permissions || [],
    };

    next();
  } catch {
    throw new UnauthorizedError('Invalid or expired token');
  }
}
