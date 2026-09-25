import { ForbiddenError, UnauthorizedError } from '@salon-spa-saas/common-types';
import jwt from 'jsonwebtoken';
import { config } from '../config';
export function authMiddleware(req, _res, next) {
    // 1. Check Gateway Headers
    const gwTenantId = req.headers['x-tenant-id'] || req.query?.tenantId;
    const gwUserId = req.headers['x-user-id'];
    const gwPrincipalType = req.headers['x-principal-type'];
    const gwPermissions = req.headers['x-permissions'];
    const gwRoles = req.headers['x-roles'];
    const gwFranchiseId = req.headers['x-franchise-id'] || req.query?.franchiseId;
    const gwBranchId = req.headers['x-branch-id'] || req.query?.branchId;
    if (gwTenantId) {
        req.auth = {
            tenantId: gwTenantId,
            userId: gwUserId || null,
            principalType: gwPrincipalType || (gwUserId ? 'USER' : 'TENANT'),
            roles: gwRoles ? gwRoles.split(',') : [],
            permissions: gwPermissions ? gwPermissions.split(',') : [],
            franchiseId: gwFranchiseId || null,
            branchIds: gwBranchId ? [gwBranchId] : [],
        };
        return next();
    }
    // 2. Direct Authorization Bearer Token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        if (process.env.NODE_ENV === 'development' || !process.env.NODE_ENV) {
            req.auth = {
                tenantId: gwTenantId || '00000000-0000-0000-0000-000000000001',
                userId: gwUserId || null,
                principalType: 'TENANT',
                roles: ['TENANT_ADMIN'],
                permissions: ['*'],
                franchiseId: gwFranchiseId || null,
                branchIds: gwBranchId ? [gwBranchId] : [],
            };
            return next();
        }
        throw new UnauthorizedError('Missing or invalid Authorization header');
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, config.JWT_SECRET);
        if (!decoded.tenantId) {
            throw new ForbiddenError('Token missing tenantId claim');
        }
        req.auth = {
            tenantId: decoded.tenantId,
            userId: decoded.userId || decoded.sub || null,
            principalType: decoded.principalType || (decoded.userId ? 'USER' : 'TENANT'),
            roles: decoded.roles || [],
            permissions: decoded.permissions || [],
            franchiseId: decoded.franchiseId || gwFranchiseId || null,
            branchIds: decoded.branchIds || (gwBranchId ? [gwBranchId] : []),
        };
        next();
    }
    catch (err) {
        if (err instanceof ForbiddenError || err instanceof UnauthorizedError)
            throw err;
        throw new UnauthorizedError('Invalid or expired authentication token');
    }
}
