import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '@salon-spa-saas/common-types';
import { config } from '../../config';
export function authMiddleware(req, _res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new UnauthorizedError('Missing or malformed Authorization header');
    }
    const token = authHeader.split(' ')[1];
    try {
        const payload = jwt.verify(token, config.JWT_SECRET);
        req.principal = {
            principalType: payload.principalType || 'USER',
            userId: payload.userId || payload.sub,
            tenantId: payload.tenantId,
            branchIds: payload.branchIds || (payload.branchId ? [payload.branchId] : []),
            franchiseId: payload.franchiseId,
            scopeType: payload.scopeType,
            permissions: payload.permissions || [],
        };
        next();
    }
    catch {
        throw new UnauthorizedError('Invalid or expired token');
    }
}
