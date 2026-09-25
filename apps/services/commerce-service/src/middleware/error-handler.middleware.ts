import { AppError } from '@salon-spa-saas/common-types';
import { createLogger } from '@salon-spa-saas/logger';
import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';

const logger = createLogger('commerce-error-handler');

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
): void {
  const correlationId = (req.headers['x-correlation-id'] as string) || 'unknown';

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
        details: err.details || [],
        requestId: correlationId,
      },
    });
    return;
  }

  if (err instanceof ZodError) {
    res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid request payload',
        details: err.errors.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
        })),
        requestId: correlationId,
      },
    });
    return;
  }

  logger.error({ err, correlationId, url: req.originalUrl }, 'Unhandled internal server error');

  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred. Please try again later.',
      requestId: correlationId,
    },
  });
}
