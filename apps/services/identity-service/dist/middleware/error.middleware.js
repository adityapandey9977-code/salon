import { AppError } from '@salon-spa-saas/common-types';
import { createLogger } from '@salon-spa-saas/logger';
import { ZodError } from 'zod';
const logger = createLogger('identity-error-handler');
export function errorHandler(err, req, res, _next) {
    const correlationId = req.headers['x-correlation-id'] || '';
    if (err instanceof AppError) {
        logger.warn({
            code: err.code,
            message: err.message,
            statusCode: err.statusCode,
            correlationId,
            path: req.path,
        }, 'Application error occurred');
        res.status(err.statusCode).json({
            success: false,
            error: {
                code: err.code,
                message: err.message,
                details: err.details,
            },
            timestamp: new Date().toISOString(),
        });
        return;
    }
    if (err instanceof ZodError) {
        logger.warn({
            code: 'VALIDATION_ERROR',
            issues: err.issues,
            correlationId,
            path: req.path,
        }, 'Request validation error');
        res.status(400).json({
            success: false,
            error: {
                code: 'VALIDATION_ERROR',
                message: 'Invalid request payload',
                details: err.flatten(),
            },
            timestamp: new Date().toISOString(),
        });
        return;
    }
    logger.error({
        err: err.message,
        stack: err.stack,
        correlationId,
        path: req.path,
    }, 'Unhandled server error');
    res.status(500).json({
        success: false,
        error: {
            code: 'INTERNAL_ERROR',
            message: 'An unexpected error occurred',
        },
        timestamp: new Date().toISOString(),
    });
}
