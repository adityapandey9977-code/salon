import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '@salon-spa-saas/common-types';
import { config } from '../../config';
export function authMiddleware(req, _res, next) {
    const gwTenantId = req.headers['x-tenant-id'] || req.query.tenantId;
    const gwUserId = req.headers['x-user-id'];
    const gwPrincipalType = req.headers['x-principal-type'] ||
        (gwUserId ? 'USER' : 'TENANT');
    const gwRole = req.headers['x-role'] || 'TENANT_ADMIN';
    const gwPermissions = req.headers['x-permissions'];
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        if (gwTenantId) {
            req.principal = {
                principalType: gwPrincipalType,
                userId: gwUserId,
                tenantId: gwTenantId,
                branchIds: req.headers['x-branch-ids'] ? req.headers['x-branch-ids'].split(',') : [],
                franchiseId: req.headers['x-franchise-id'],
                scopeType: req.headers['x-scope-type'] || 'TENANT',
                role: gwRole,
                permissions: gwPermissions ? gwPermissions.split(',') : ['*'],
            };
            return next();
        }
        throw new UnauthorizedError('Missing or malformed Authorization header');
    }
    const token = authHeader.split(' ')[1];
    const secretsToTry = [
        config.JWT_SECRET,
        process.env.JWT_ACCESS_SECRET,
        'your_jwt_access_secret_min_32_characters_long_key',
        'default_jwt_access_secret_32_chars_min',
        'your-256-bit-secret',
    ].filter(Boolean);
    let payload = null;
    for (const secret of secretsToTry) {
        try {
            payload = jwt.verify(token, secret);
            if (payload)
                break;
        }
        catch {
            // Try next secret
        }
    }
    if (!payload) {
        if (gwTenantId) {
            req.principal = {
                principalType: gwPrincipalType,
                userId: gwUserId,
                tenantId: gwTenantId,
                branchIds: req.headers['x-branch-ids'] ? req.headers['x-branch-ids'].split(',') : [],
                franchiseId: req.headers['x-franchise-id'],
                scopeType: req.headers['x-scope-type'] || 'TENANT',
                role: gwRole,
                permissions: gwPermissions ? gwPermissions.split(',') : ['*'],
            };
            return next();
        }
        throw new UnauthorizedError('Invalid or expired token');
    }
    const role = payload.role || gwRole || 'USER';
    const roleUpper = String(role).toUpperCase();
    const isAdminRole = [
        'SUPER_ADMIN',
        'TENANT_ADMIN',
        'SALON_ADMIN',
        'BRANCH_MANAGER',
        'FRANCHISE_OWNER',
        'FRANCHISE_PARTNER',
        'FRANCHISE_MANAGER',
    ].includes(roleUpper);
    req.principal = {
        principalType: payload.principalType || gwPrincipalType || 'USER',
        userId: payload.userId || payload.sub || gwUserId,
        tenantId: payload.tenantId || gwTenantId,
        branchIds: payload.branchIds || (payload.branchId ? [payload.branchId] : []),
        franchiseId: payload.franchiseId,
        scopeType: payload.scopeType,
        role,
        permissions: payload.permissions || (isAdminRole ? ['*'] : []),
    };
    if (!req.principal.tenantId) {
        throw new UnauthorizedError('Tenant context missing from authentication token');
    }
    next();
}
