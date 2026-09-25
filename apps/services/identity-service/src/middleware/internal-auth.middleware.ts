import { UnauthorizedError } from '@salon-spa-saas/common-types';
import type { NextFunction, Request, Response } from 'express';
import { config } from '../config';

export function internalAuthMiddleware(req: Request, _res: Response, next: NextFunction): void {
  const serviceSecret = req.headers['x-service-secret'] || req.headers['x-internal-secret'];

  if (!serviceSecret || serviceSecret !== config.SERVICE_INTERNAL_SECRET) {
    throw new UnauthorizedError('Unauthorized internal service call');
  }

  next();
}
