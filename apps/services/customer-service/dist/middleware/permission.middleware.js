import { ForbiddenError, UnauthorizedError } from '@salon-spa-saas/common-types';
export function requirePermission(requiredPermission) {
    return (req, _res, next) => {
        if (!req.auth) {
            // In development, allow proceed
            if (process.env.NODE_ENV === 'development')
                return next();
            throw new UnauthorizedError('Authentication context required');
        }
        // Tenant Principal or administrative/franchise/branch manager roles bypass fine-grained checks
        if (req.auth.principalType === 'TENANT' ||
            req.auth.roles?.includes('TENANT_ADMIN') ||
            req.auth.roles?.includes('SALON_ADMIN') ||
            req.auth.roles?.includes('BRANCH_MANAGER') ||
            req.auth.roles?.includes('FRANCHISE_OWNER') ||
            req.auth.roles?.includes('FRANCHISE_PARTNER')) {
            return next();
        }
        const permissions = req.auth.permissions || [];
        if (permissions.includes('*') || permissions.includes(requiredPermission)) {
            return next();
        }
        throw new ForbiddenError(`Missing required permission: ${requiredPermission}`);
    };
}
