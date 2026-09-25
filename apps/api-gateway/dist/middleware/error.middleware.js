import { AppError } from '@salon-spa-saas/common-types';
import { createLogger } from '@salon-spa-saas/logger';
const logger = createLogger('gateway-error-handler');
export function gatewayErrorHandler(err, req, res, _next) {
    const correlationId = req.headers['x-correlation-id'] || '';
    if (err instanceof AppError) {
        logger.warn({
            code: err.code,
            message: err.message,
            statusCode: err.statusCode,
            correlationId,
            path: req.path,
        }, 'Gateway application error');
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
    logger.error({
        err: err.message,
        stack: err.stack,
        correlationId,
        path: req.path,
    }, 'Unhandled Gateway error');
    res.status(500).json({
        success: false,
        error: {
            code: 'GATEWAY_ERROR',
            message: 'Gateway encountered an error processing request',
        },
        timestamp: new Date().toISOString(),
    });
}
