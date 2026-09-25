import { AppError } from '@salon-spa-saas/common-types';
import { createLogger } from '@salon-spa-saas/logger';
import { ZodError } from 'zod';
const logger = createLogger('people-error-handler');
export function errorHandler(err, req, res, _next) {
    const requestId = req.headers['x-request-id'] || 'unknown';
    if (err instanceof ZodError) {
        res.status(400).json({
            success: false,
            error: {
                code: 'VALIDATION_ERROR',
                message: 'Invalid request input',
                details: err.issues.map((i) => ({ path: i.path.join('.'), message: i.message })),
                requestId,
            },
        });
        return;
    }
    if (err instanceof AppError) {
        res.status(err.statusCode).json({
            success: false,
            error: {
                code: err.code,
                message: err.message,
                details: err.details,
                requestId,
            },
        });
        return;
    }
    logger.error({
        err: { message: err.message, stack: err.stack },
        url: req.originalUrl,
        method: req.method,
        requestId,
    }, 'Unhandled server exception');
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        success: false,
        error: {
            code: 'INTERNAL_ERROR',
            message: 'Internal server error occurred',
            requestId,
        },
    });
}
