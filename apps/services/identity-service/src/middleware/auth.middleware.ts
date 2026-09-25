import { AuthenticationError, UnauthorizedError } from '@salon-spa-saas/common-types';
import type { NextFunction, Request, Response } from 'express';
import { TokenService } from '../infrastructure/security/token.service';

export interface AuthenticatedUserContext {
  principalType: 'USER' | 'TENANT';
  userId?: string;
  tenantCredentialId?: string;
  tenantId?: string | null;
  sessionId: string;
  role: string;
  scopeType: string;
  userType?: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUserContext;
    }
  }
}

export function authMiddleware(req: Request, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AuthenticationError('Missing or invalid Authorization header');
  }

  const token = authHeader.substring(7).trim();
  try {
    const payload = TokenService.verifyAccessToken(token);

    if (payload.principalType === 'TENANT') {
      req.user = {
        principalType: 'TENANT',
        tenantCredentialId: payload.sub,
        tenantId: payload.tenantId || null,
        sessionId: payload.sid,
        role: payload.role || 'TENANT_ADMIN',
        scopeType: payload.scopeType || 'TENANT',
      };
    } else {
      req.user = {
        principalType: 'USER',
        userId: payload.sub,
        sessionId: payload.sid,
        role: payload.role || 'USER',
        scopeType: payload.scopeType || 'PLATFORM',
        tenantId: payload.tenantId || null,
        userType: payload.userType,
      };
    }

    next();
  } catch (err: any) {
    throw new UnauthorizedError('Token is invalid or expired');
  }
}

