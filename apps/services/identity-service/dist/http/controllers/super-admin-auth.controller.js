import { RefreshTokenRequestSchema, SuperAdminLoginRequestSchema, } from '@salon-spa-saas/contracts';
import { authService } from '../../application/services/auth.service';
export class SuperAdminAuthController {
    async login(req, res, next) {
        try {
            const body = SuperAdminLoginRequestSchema.parse(req.body);
            const result = await authService.loginSuperAdmin({
                email: body.email.toLowerCase().trim(),
                password: body.password.trim(),
                ipAddress: req.ip || req.headers['x-forwarded-for'],
                userAgent: req.headers['user-agent'],
            });
            res.status(200).json({
                success: true,
                data: result,
                timestamp: new Date().toISOString(),
            });
        }
        catch (err) {
            next(err);
        }
    }
    async refreshToken(req, res, next) {
        try {
            const body = RefreshTokenRequestSchema.parse(req.body);
            const result = await authService.refreshToken(body.refreshToken);
            res.status(200).json({
                success: true,
                data: result,
                timestamp: new Date().toISOString(),
            });
        }
        catch (err) {
            next(err);
        }
    }
    async logout(req, res, next) {
        try {
            if (req.user?.userId) {
                await authService.logout(req.user.userId, req.user.sessionId);
            }
            res.status(200).json({
                success: true,
                data: { message: 'Super admin logged out successfully' },
                timestamp: new Date().toISOString(),
            });
        }
        catch (err) {
            next(err);
        }
    }
    async getMe(req, res, next) {
        try {
            if (req.user?.principalType !== 'USER' || req.user?.userType !== 'PLATFORM') {
                res.status(403).json({
                    success: false,
                    error: { code: 'FORBIDDEN', message: 'Access denied: Caller is not a platform operator.' },
                    timestamp: new Date().toISOString(),
                });
                return;
            }
            const userId = req.user.userId;
            const result = await authService.getMe(userId, null);
            if (!result.effectiveAccess.roles.includes('SUPER_ADMIN') && result.user.userType !== 'PLATFORM') {
                res.status(403).json({
                    success: false,
                    error: { code: 'FORBIDDEN', message: 'Access denied: Caller is not authorized as Super Administrator.' },
                    timestamp: new Date().toISOString(),
                });
                return;
            }
            res.status(200).json({
                success: true,
                data: {
                    principal: {
                        type: 'USER',
                        userType: 'PLATFORM',
                        userId: result.user.id,
                        email: result.user.email,
                        fullName: result.user.fullName,
                        status: result.user.status,
                        role: 'SUPER_ADMIN',
                        roles: result.effectiveAccess.roles,
                        permissions: result.effectiveAccess.permissions,
                        scopeType: 'PLATFORM',
                    },
                    user: result.user,
                    effectiveAccess: result.effectiveAccess,
                },
                timestamp: new Date().toISOString(),
            });
        }
        catch (err) {
            next(err);
        }
    }
}
export const superAdminAuthController = new SuperAdminAuthController();
