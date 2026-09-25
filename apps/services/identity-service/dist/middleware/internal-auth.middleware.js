import { UnauthorizedError } from '@salon-spa-saas/common-types';
import { config } from '../config';
export function internalAuthMiddleware(req, _res, next) {
    const serviceSecret = req.headers['x-service-secret'] || req.headers['x-internal-secret'];
    if (!serviceSecret || serviceSecret !== config.SERVICE_INTERNAL_SECRET) {
        throw new UnauthorizedError('Unauthorized internal service call');
    }
    next();
}
