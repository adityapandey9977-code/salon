import { ForbiddenError, UnauthorizedError } from '@salon-spa-saas/common-types';
import { roleService } from '../application/services/role.service';
export function requirePermission(...requiredPermissions) {
    return async (req, _res, next) => {
        try {
            if (!req.user) {
                throw new UnauthorizedError('Authentication required');
            }
            const role = (req.user.role || '').toUpperCase();
            const userType = (req.user.userType || '').toUpperCase();
            // Platform super admin, tenant principals, and salon administration roles have full administrative access
            if (req.user.principalType === 'TENANT' ||
                userType === 'PLATFORM' ||
                userType === 'TENANT' ||
                role === 'TENANT_ADMIN' ||
                role === 'SALON_ADMIN' ||
                role === 'ADMIN' ||
                role === 'SUPER_ADMIN' ||
                role === 'SUPER_ADMINISTRATOR' ||
                role === 'OWNER' ||
                role === 'SALON_OWNER' ||
                role === 'BRAND_OWNER' ||
                role === 'BRAND_ADMIN' ||
                role === 'BRANCH_MANAGER' ||
                role === 'MANAGER' ||
                role === 'FRANCHISE_OWNER' ||
                role === 'FRANCHISE_PARTNER' ||
                role === 'FRANCHISE_MANAGER') {
                next();
                return;
            }
            if (req.user.userId) {
                try {
                    const effectiveAccess = await roleService.getEffectiveAccess(req.user.userId);
                    const hasPermission = requiredPermissions.some((perm) => effectiveAccess.permissions?.includes(perm));
                    if (hasPermission) {
                        next();
                        return;
                    }
                    // Also check if any assigned user roles match administrative roles
                    const hasAdminRole = effectiveAccess.roles?.some((r) => {
                        const code = (r || '').toUpperCase();
                        return (code === 'TENANT_ADMIN' ||
                            code === 'SALON_ADMIN' ||
                            code === 'ADMIN' ||
                            code === 'SUPER_ADMIN' ||
                            code === 'SUPER_ADMINISTRATOR' ||
                            code === 'OWNER' ||
                            code === 'SALON_OWNER' ||
                            code === 'BRAND_OWNER' ||
                            code === 'BRAND_ADMIN' ||
                            code === 'BRANCH_MANAGER' ||
                            code === 'MANAGER' ||
                            code === 'FRANCHISE_OWNER' ||
                            code === 'FRANCHISE_PARTNER' ||
                            code === 'FRANCHISE_MANAGER');
                    });
                    if (hasAdminRole) {
                        next();
                        return;
                    }
                }
                catch {
                    // If effective access lookup fails, permit manager/admin roles
                    if (role === 'ADMIN' ||
                        role === 'BRANCH_MANAGER' ||
                        role === 'TENANT_ADMIN' ||
                        role === 'SALON_ADMIN' ||
                        role === 'OWNER' ||
                        role === 'SALON_OWNER') {
                        next();
                        return;
                    }
                }
                throw new ForbiddenError(`Missing required permission: ${requiredPermissions.join(' or ')}`);
            }
            next();
        }
        catch (err) {
            next(err);
        }
    };
}
