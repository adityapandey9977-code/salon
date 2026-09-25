import { AuthenticationError, UnauthorizedError } from '@salon-spa-saas/common-types';
import { createLogger } from '@salon-spa-saas/logger';
import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { gatewayConfig } from '../config';

const logger = createLogger('gateway-auth-middleware');

export interface GatewayAuthContext {
  principalType: 'USER' | 'TENANT';
  userId?: string;
  tenantCredentialId?: string;
  sessionId: string;
  userType?: string;
  status: string;
  role: string;
  roles: string[];
  permissions: string[];
  tenantId?: string | null;
  franchiseId?: string | null;
  branchIds: string[];
  scopeType: string;
  scopes: any[];
}

declare global {
  namespace Express {
    interface Request {
      user?: GatewayAuthContext;
    }
  }
}

export async function gatewayAuthMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AuthenticationError('Missing or invalid Authorization header');
  }

  const token = authHeader.substring(7).trim();
  let payload: any;

  try {
    payload = jwt.verify(token, gatewayConfig.JWT_ACCESS_SECRET);
  } catch (err: any) {
    throw new UnauthorizedError('Token is invalid or expired');
  }

  const principalType = payload.principalType || 'USER';
  const sub = payload.sub;
  const sessionId = payload.sid;

  try {
    // Build Identity Service internal context query depending on principalType
    let contextUrl = `${gatewayConfig.IDENTITY_SERVICE_URL}/internal/v1/auth/context?principalType=${principalType}&sessionId=${sessionId}`;
    if (principalType === 'TENANT') {
      contextUrl += `&tenantId=${payload.tenantId || ''}&tenantCredentialId=${sub}`;
    } else {
      contextUrl += `&userId=${sub}`;
    }

    const response = await fetch(contextUrl, {
      method: 'GET',
      headers: {
        'x-service-secret': gatewayConfig.SERVICE_INTERNAL_SECRET,
        'x-correlation-id': (req.headers['x-correlation-id'] as string) || '',
      },
    });

    if (!response.ok) {
      throw new UnauthorizedError(
        'Failed to resolve authorization context from Identity Service',
      );
    }

    const json = (await response.json()) as any;
    const context: GatewayAuthContext = json.data;

    if (context.status !== 'ACTIVE') {
      throw new UnauthorizedError('Account is not active');
    }

    req.user = context;

    // Inject identity headers into outgoing request for downstream services
    req.headers['x-principal-type'] = context.principalType;
    req.headers['x-session-id'] = context.sessionId;
    req.headers['x-role'] = context.role;
    req.headers['x-roles'] = (context.roles && context.roles.length > 0 ? context.roles : [context.role]).filter(Boolean).join(',');
    if (context.permissions && Array.isArray(context.permissions)) {
      req.headers['x-permissions'] = context.permissions.join(',');
    }
    req.headers['x-scope-type'] = context.scopeType;

    if (context.userId) req.headers['x-user-id'] = context.userId;
    if (context.tenantCredentialId) req.headers['x-tenant-credential-id'] = context.tenantCredentialId;
    if (context.userType) req.headers['x-user-type'] = context.userType;
    if (context.tenantId) req.headers['x-tenant-id'] = context.tenantId;
    if (context.franchiseId) req.headers['x-franchise-id'] = context.franchiseId;
    if (context.branchIds && context.branchIds.length > 0) {
      req.headers['x-branch-ids'] = context.branchIds.join(',');
    }

    next();
  } catch (err: any) {
    if (err instanceof UnauthorizedError || err instanceof AuthenticationError) {
      return next(err);
    }
    logger.error(
      { error: err.message, sub, principalType },
      'Error communicating with Identity Service for auth context',
    );
    next(new UnauthorizedError('Authentication verification failed'));
  }
}

