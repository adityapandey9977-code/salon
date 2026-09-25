import type { NextFunction, Request, Response } from 'express';
import { UnauthorizedError } from '@salon-spa-saas/common-types';
import { config } from '../../config';

export function internalAuthMiddleware(req: Request, _res: Response, next: NextFunction): void {
  const secret = req.headers['x-internal-service-secret'];
  if (!secret || secret !== config.SERVICE_INTERNAL_SECRET) {
    throw new UnauthorizedError('Unauthorized internal service call');
  }

  const tenantId = req.headers['x-tenant-id'] as string;
  if (!tenantId) {
    throw new UnauthorizedError('Missing x-tenant-id header on internal service call');
  }

  req.principal = {
    principalType: 'PLATFORM',
    tenantId,
    permissions: ['*'],
  };

  next();
}
