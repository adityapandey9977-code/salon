import { UnauthorizedError } from '@salon-spa-saas/common-types';
import { config } from '../config';
export function internalAuthMiddleware(req, _res, next) {
    const secret = req.headers['x-internal-secret'];
    if (!secret || secret !== config.SERVICE_INTERNAL_SECRET) {
        throw new UnauthorizedError('Unauthorized internal service call');
    }
    next();
}
