import { AuthenticationError, UnauthorizedError } from '@salon-spa-saas/common-types';
import { TokenService } from '../infrastructure/security/token.service';
export function authMiddleware(req, _res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new AuthenticationError('Missing or invalid Authorization header');
    }
    const token = authHeader.substring(7).trim();
    try {
        const payload = TokenService.verifyAccessToken(token);
        if (payload.principalType === 'TENANT') {
            req.user = {
                principalType: 'TENANT',
                tenantCredentialId: payload.sub,
                tenantId: payload.tenantId || null,
                sessionId: payload.sid,
                role: payload.role || 'TENANT_ADMIN',
                scopeType: payload.scopeType || 'TENANT',
            };
        }
        else {
            req.user = {
                principalType: 'USER',
                userId: payload.sub,
                sessionId: payload.sid,
                role: payload.role || 'USER',
                scopeType: payload.scopeType || 'PLATFORM',
                tenantId: payload.tenantId || null,
                userType: payload.userType,
            };
        }
        next();
    }
    catch (err) {
        throw new UnauthorizedError('Token is invalid or expired');
    }
}
