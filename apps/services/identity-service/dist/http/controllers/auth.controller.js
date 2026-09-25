import { AuthenticationError, ValidationError, } from '@salon-spa-saas/common-types';
import { ForgotPasswordRequestSchema, LoginRequestSchema, MfaVerifyRequestSchema, RefreshTokenRequestSchema, ResetPasswordRequestSchema, } from '@salon-spa-saas/contracts';
import { authService } from '../../application/services/auth.service';
import { tenantAuthService } from '../../application/services/tenant-auth.service';
import { prisma } from '../../infrastructure/prisma/client';
import { PasswordService } from '../../infrastructure/security/password.service';
import { sessionRepository } from '../../infrastructure/repositories/session.repository';
import { tenantCredentialRepository } from '../../infrastructure/repositories/tenant-credential.repository';
import { userRepository } from '../../infrastructure/repositories/user.repository';
export class AuthController {
    async login(req, res, next) {
        try {
            const body = LoginRequestSchema.parse(req.body);
            const normalizedEmail = body.email.toLowerCase().trim();
            const cleanPassword = body.password.trim();
            const cleanTenantId = body.tenantId ? body.tenantId.trim() : undefined;
            const portal = req.query.portal?.toLowerCase();
            let isTenantLogin = false;
            if (portal === 'salon' || portal === 'tenant') {
                isTenantLogin = true;
            }
            else if (portal === 'franchise' || portal === 'platform' || portal === 'admin' || portal === 'team') {
                isTenantLogin = false;
            }
            else {
                // Fallback to auto-detect
                const cred = await tenantCredentialRepository.findByNormalizedEmail(normalizedEmail);
                isTenantLogin = !!cred;
            }
            if (isTenantLogin) {
                const tenantCred = await tenantCredentialRepository.findByNormalizedEmail(normalizedEmail);
                if (!tenantCred) {
                    throw new AuthenticationError('Invalid email or password');
                }
                const tenantResult = await tenantAuthService.login({
                    email: normalizedEmail,
                    password: cleanPassword,
                    tenantCode: undefined,
                    ipAddress: req.ip || req.headers['x-forwarded-for'],
                    userAgent: req.headers['user-agent'],
                });
                if (tenantResult.requiresMfa) {
                    res.status(200).json({
                        success: true,
                        data: tenantResult,
                        timestamp: new Date().toISOString(),
                    });
                    return;
                }
                const userPayload = {
                    id: tenantResult.principal?.credentialId || tenantCred.id,
                    email: tenantResult.principal?.loginEmail || tenantCred.loginEmail,
                    fullName: tenantResult.principal?.salonName || 'Salon Owner',
                    userType: 'TENANT',
                    status: 'ACTIVE',
                    isMfaEnabled: false,
                    roles: ['TENANT_ADMIN', 'SALON_ADMIN'],
                    permissions: tenantResult.principal?.permissions || [],
                    tenantId: tenantResult.principal?.tenantId || tenantCred.tenantId,
                    branchIds: [],
                };
                res.status(200).json({
                    success: true,
                    data: {
                        accessToken: tenantResult.accessToken,
                        refreshToken: tenantResult.refreshToken,
                        expiresIn: tenantResult.expiresIn,
                        requiresMfa: false,
                        principal: tenantResult.principal,
                        user: userPayload,
                    },
                    timestamp: new Date().toISOString(),
                });
                return;
            }
            const result = await authService.login({
                email: normalizedEmail,
                password: cleanPassword,
                tenantId: cleanTenantId,
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
            if (req.user?.principalType === 'TENANT' && req.user.tenantCredentialId) {
                await tenantAuthService.logout(req.user.tenantCredentialId, req.user.sessionId);
            }
            else if (req.user?.userId) {
                await authService.logout(req.user.userId, req.user.sessionId);
            }
            res.status(200).json({
                success: true,
                data: { message: 'Logged out successfully' },
                timestamp: new Date().toISOString(),
            });
        }
        catch (err) {
            next(err);
        }
    }
    async getMe(req, res, next) {
        try {
            if (req.user?.principalType === 'TENANT' || req.user?.tenantCredentialId) {
                const tenantId = req.user.tenantId || req.headers['x-tenant-id'];
                const tenantCredentialId = req.user.tenantCredentialId || null;
                if (!tenantId) {
                    res.status(400).json({
                        success: false,
                        error: { code: 'VALIDATION_ERROR', message: 'Tenant ID is required' },
                        timestamp: new Date().toISOString(),
                    });
                    return;
                }
                const result = await tenantAuthService.getMe(tenantId, tenantCredentialId);
                const createdAtStr = typeof result.profile.createdAt === 'string'
                    ? result.profile.createdAt
                    : new Date().toISOString();
                const userCompatible = {
                    id: result.profile.credentialId,
                    email: result.profile.loginEmail,
                    fullName: result.profile.salonName || 'Salon Owner',
                    userType: 'TENANT',
                    status: result.profile.status || 'ACTIVE',
                    isMfaRequired: Boolean(result.profile.isMfaRequired),
                    isMfaEnabled: Boolean(result.profile.isMfaEnabled),
                    tenantId: result.profile.tenantId,
                    roles: [
                        { id: 'TENANT_ADMIN', code: 'TENANT_ADMIN', name: 'Tenant Administrator' },
                        { id: 'SALON_ADMIN', code: 'SALON_ADMIN', name: 'Salon Administrator' },
                    ],
                    permissions: result.effectiveAccess?.permissions || [],
                    scopes: [
                        {
                            id: result.profile.tenantId,
                            userId: result.profile.credentialId,
                            scopeType: 'TENANT',
                            tenantId: result.profile.tenantId,
                            createdAt: createdAtStr,
                        },
                    ],
                    createdAt: createdAtStr,
                    updatedAt: createdAtStr,
                };
                res.status(200).json({
                    success: true,
                    data: {
                        principal: {
                            type: 'TENANT',
                            tenantId: result.profile.tenantId,
                            credentialId: result.profile.credentialId,
                            loginEmail: result.profile.loginEmail,
                            salonName: result.profile.salonName,
                            tenantCode: result.profile.tenantCode,
                            status: result.profile.status,
                            role: result.effectiveAccess.role,
                            scopeType: result.effectiveAccess.scopeType,
                            permissions: result.effectiveAccess.permissions,
                        },
                        profile: result.profile,
                        effectiveAccess: {
                            roles: ['TENANT_ADMIN', 'SALON_ADMIN'],
                            permissions: result.effectiveAccess.permissions,
                        },
                        user: userCompatible,
                        ...userCompatible,
                    },
                    timestamp: new Date().toISOString(),
                });
                return;
            }
            const userId = req.user?.userId;
            if (!userId) {
                res.status(401).json({ success: false, message: 'Unauthorized' });
                return;
            }
            const tenantId = req.headers['x-tenant-id'] || req.user?.tenantId || null;
            const result = await authService.getMe(userId, tenantId);
            res.status(200).json({
                success: true,
                data: {
                    user: result.user,
                    effectiveAccess: result.effectiveAccess,
                    id: result.user.id,
                    email: result.user.email,
                    fullName: result.user.fullName,
                    userType: result.user.userType,
                    status: result.user.status,
                    roles: (result.effectiveAccess?.roles || []).map((r) => ({
                        id: r,
                        code: r,
                        name: r,
                    })),
                    permissions: result.effectiveAccess?.permissions || [],
                    tenantId: result.user.id ? tenantId : null,
                },
                timestamp: new Date().toISOString(),
            });
        }
        catch (err) {
            console.error('[Identity AuthController.getMe] ERROR:', err);
            next(err);
        }
    }
    async verifyMfa(req, res, next) {
        try {
            const body = MfaVerifyRequestSchema.parse(req.body);
            const result = await authService.verifyMfa({
                challengeId: body.challengeId,
                code: body.code,
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
    async forgotPassword(req, res, next) {
        try {
            const body = ForgotPasswordRequestSchema.parse(req.body);
            const portal = req.query.portal?.toLowerCase();
            let isTenantLogin = false;
            if (portal === 'salon' || portal === 'tenant') {
                isTenantLogin = true;
            }
            else if (portal === 'franchise' || portal === 'platform' || portal === 'admin' || portal === 'team') {
                isTenantLogin = false;
            }
            else {
                const cred = await tenantCredentialRepository.findByNormalizedEmail(body.email.toLowerCase().trim());
                isTenantLogin = !!cred;
            }
            const result = isTenantLogin
                ? await tenantAuthService.forgotPassword(body.email)
                : await authService.forgotPassword(body.email);
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
    async resetPassword(req, res, next) {
        try {
            const body = ResetPasswordRequestSchema.parse(req.body);
            const result = await authService.resetPassword(body.token, body.newPassword);
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
    async getSessions(req, res, next) {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                res.status(401).json({ success: false, message: 'Unauthorized' });
                return;
            }
            const sessions = await sessionRepository.listUserSessions(userId);
            res.status(200).json({
                success: true,
                data: sessions,
                timestamp: new Date().toISOString(),
            });
        }
        catch (err) {
            next(err);
        }
    }
    async revokeSession(req, res, next) {
        try {
            const sessionId = req.params.id;
            const userId = req.user?.userId;
            if (!userId) {
                res.status(401).json({ success: false, message: 'Unauthorized' });
                return;
            }
            await sessionRepository.revokeSession(sessionId);
            await authService.logout(userId, sessionId);
            res.status(200).json({
                success: true,
                data: { message: 'Session revoked successfully' },
                timestamp: new Date().toISOString(),
            });
        }
        catch (err) {
            next(err);
        }
    }
    async changePassword(req, res, next) {
        try {
            const { email, currentPassword, newPassword } = req.body;
            const userEmail = (email ||
                req.user?.email ||
                req.user?.loginEmail ||
                '')
                .toLowerCase()
                .trim();
            const cleanNewPassword = (newPassword || '').trim();
            const cleanCurrentPassword = (currentPassword || '').trim();
            if (!userEmail) {
                throw new ValidationError('Email address is required to update security password');
            }
            if (!cleanCurrentPassword) {
                throw new ValidationError('Current security password is required');
            }
            if (!cleanNewPassword || cleanNewPassword.length < 6) {
                throw new ValidationError('New password must be at least 6 characters long');
            }
            // 1. Check if user is a tenant credential (franchise owner / tenant)
            const tenantCred = await tenantCredentialRepository.findByNormalizedEmail(userEmail);
            if (tenantCred) {
                if (tenantCred.passwordHash) {
                    const isValid = await PasswordService.verify(cleanCurrentPassword, tenantCred.passwordHash);
                    if (!isValid) {
                        throw new AuthenticationError('Current security password is incorrect');
                    }
                }
                const newHash = await PasswordService.hash(cleanNewPassword);
                await tenantCredentialRepository.updatePassword(tenantCred.id, newHash);
                res.status(200).json({
                    success: true,
                    data: { message: 'Security password changed successfully' },
                    timestamp: new Date().toISOString(),
                });
                return;
            }
            // 2. Check if user is a staff user
            const rawUser = await prisma.user.findUnique({
                where: { email: userEmail },
            });
            if (rawUser) {
                if (rawUser.passwordHash) {
                    const isValid = await PasswordService.verify(cleanCurrentPassword, rawUser.passwordHash);
                    if (!isValid) {
                        throw new AuthenticationError('Current security password is incorrect');
                    }
                }
                const newHash = await PasswordService.hash(cleanNewPassword);
                await userRepository.updatePassword(rawUser.id, newHash);
                res.status(200).json({
                    success: true,
                    data: { message: 'Security password changed successfully' },
                    timestamp: new Date().toISOString(),
                });
                return;
            }
            // 3. Fallback: Upsert tenant credential so credential exists in DB with new hash
            const newHash = await PasswordService.hash(cleanNewPassword);
            const firstCred = await prisma.tenantCredential.findFirst();
            const tenantId = firstCred?.tenantId || '00000000-0000-0000-0000-000000000001';
            await tenantCredentialRepository.upsertByEmail({
                tenantId,
                loginEmail: userEmail,
                normalizedEmail: userEmail,
                passwordHash: newHash,
            });
            res.status(200).json({
                success: true,
                data: { message: 'Security password changed successfully' },
                timestamp: new Date().toISOString(),
            });
        }
        catch (err) {
            next(err);
        }
    }
}
export const authController = new AuthController();
