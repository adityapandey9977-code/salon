import { UnauthorizedError } from '@salon-spa-saas/common-types';
import jwt from 'jsonwebtoken';
import { config } from '../config';
export function authMiddleware(req, _res, next) {
    const gwTenantId = req.headers['x-tenant-id'];
    const gwUserId = req.headers['x-user-id'];
    const gwPrincipalType = req.headers['x-principal-type'];
    const gwPermissions = req.headers['x-permissions'];
    const gwRoles = (req.headers['x-roles'] || req.headers['x-role']);
    // 1. Direct or Gateway Authorization Bearer Token verification
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        let decoded = null;
        try {
            decoded = jwt.verify(token, config.JWT_SECRET);
        }
        catch {
            decoded = jwt.decode(token);
        }
        if (decoded && (decoded.tenantId || gwTenantId)) {
            const tenantId = decoded.tenantId || gwTenantId;
            const extractedRoles = decoded.roles && decoded.roles.length > 0
                ? decoded.roles
                : decoded.role
                    ? [decoded.role]
                    : gwRoles
                        ? gwRoles.split(',')
                        : [];
            req.auth = {
                tenantId,
                userId: decoded.userId || decoded.sub || gwUserId || null,
                principalType: decoded.principalType || gwPrincipalType || (decoded.userId ? 'USER' : 'TENANT'),
                roles: extractedRoles,
                permissions: decoded.permissions && decoded.permissions.length > 0
                    ? decoded.permissions
                    : gwPermissions
                        ? gwPermissions.split(',')
                        : [],
                franchiseId: decoded.franchiseId || req.headers['x-franchise-id'] || null,
                branchIds: decoded.branchIds ||
                    (req.headers['x-branch-ids']
                        ? req.headers['x-branch-ids'].split(',')
                        : []),
            };
            req.auth.role = decoded.role || (extractedRoles[0] ?? null);
            return next();
        }
    }
    // 2. Gateway Headers fallback
    if (gwTenantId) {
        req.auth = {
            tenantId: gwTenantId,
            userId: gwUserId || null,
            principalType: gwPrincipalType || (gwUserId ? 'USER' : 'TENANT'),
            roles: gwRoles ? gwRoles.split(',') : [],
            permissions: gwPermissions ? gwPermissions.split(',') : [],
            franchiseId: req.headers['x-franchise-id'] || null,
            branchIds: req.headers['x-branch-ids']
                ? req.headers['x-branch-ids'].split(',')
                : [],
        };
        return next();
    }
    throw new UnauthorizedError('Missing or invalid Authorization header');
}
