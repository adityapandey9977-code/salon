import crypto from 'node:crypto';
import type { NextFunction, Request, Response } from 'express';

export function correlationMiddleware(req: Request, res: Response, next: NextFunction): void {
  const correlationId =
    (req.headers['x-correlation-id'] as string) ||
    (req.headers['x-request-id'] as string) ||
    crypto.randomUUID();

  const requestId = (req.headers['x-request-id'] as string) || crypto.randomUUID();

  req.headers['x-correlation-id'] = correlationId;
  req.headers['x-request-id'] = requestId;

  res.setHeader('x-correlation-id', correlationId);
  res.setHeader('x-request-id', requestId);

  next();
}
