import { ForbiddenError, UnauthorizedError } from '@salon-spa-saas/common-types';
export function requirePermission(permission) {
    return (req, _res, next) => {
        const principal = req.principal;
        if (!principal) {
            throw new UnauthorizedError('Unauthenticated request');
        }
        const roleUpper = String(principal.role || '').toUpperCase();
        // Platform Super Admin, Salon Tenant Owner, Tenant/Branch Admin, or Franchise roles bypass specific permission strings
        if (principal.principalType === 'PLATFORM' ||
            principal.principalType === 'TENANT' ||
            roleUpper === 'SALON_ADMIN' ||
            roleUpper === 'TENANT_ADMIN' ||
            roleUpper === 'SUPER_ADMIN' ||
            roleUpper === 'BRANCH_MANAGER' ||
            roleUpper === 'FRANCHISE_OWNER' ||
            roleUpper === 'FRANCHISE_PARTNER' ||
            roleUpper === 'FRANCHISE_MANAGER' ||
            principal.permissions?.includes('*') ||
            principal.permissions?.includes('appointment.*')) {
            return next();
        }
        if (!principal.permissions || !principal.permissions.includes(permission)) {
            throw new ForbiddenError(`Missing required permission: ${permission}`);
        }
        next();
    };
}
