import { AccountLockedError, AuthenticationError, NotFoundError, UnauthorizedError, ValidationError, } from '@salon-spa-saas/common-types';
import { createLogger } from '@salon-spa-saas/logger';
import { config } from '../../config';
import { identityReadStore } from '../../infrastructure/redis/identity-read.store';
import { authRepository } from '../../infrastructure/repositories/auth.repository';
import { sessionRepository } from '../../infrastructure/repositories/session.repository';
import { tenantCredentialRepository } from '../../infrastructure/repositories/tenant-credential.repository';
import { PasswordService } from '../../infrastructure/security/password.service';
import { TokenService } from '../../infrastructure/security/token.service';
import { emailService } from '../../infrastructure/email/email.service';
import { authService } from './auth.service';
const logger = createLogger('tenant-auth-service');
const TENANT_ADMIN_PERMISSIONS = [
    'tenant.read',
    'tenant.manage',
    'branch.read',
    'branch.manage',
    'staff.read',
    'staff.manage',
    'customer.read',
    'customer.manage',
    'appointment.read',
    'appointment.create',
    'appointment.update',
    'appointment.cancel',
    'commerce.read',
    'commerce.manage',
    'payment.read',
    'payment.manage',
    'inventory.read',
    'inventory.manage',
    'finance.read',
    'finance.manage',
    'report.read',
    'audit.read',
    'settings.read',
    'settings.manage',
    'role.read',
    'user.read',
    'user.create',
    'user.update',
    'user.suspend',
];
export class TenantAuthService {
    /**
     * Validate Tenant Business Status from Organization Service (internal API)
     */
    async validateOrganizationTenantStatus(tenantId) {
        try {
            const orgServiceUrl = process.env.ORGANIZATION_SERVICE_URL || 'http://localhost:5002';
            const response = await fetch(`${orgServiceUrl}/internal/v1/tenants/${tenantId}`, {
                headers: {
                    'x-service-secret': config.SERVICE_INTERNAL_SECRET,
                },
            });
            if (!response.ok) {
                if (response.status === 404) {
                    return { isValid: false, status: 'NOT_FOUND' };
                }
                // Fallback gracefully if org service is starting up or in testing
                return { isValid: true, status: 'ACTIVE' };
            }
            const json = (await response.json());
            const tenant = json.data;
            if (tenant.status === 'SUSPENDED' || tenant.status === 'ARCHIVED') {
                return {
                    isValid: false,
                    status: tenant.status,
                    salonName: tenant.salonName || tenant.tradeName,
                    tenantCode: tenant.code,
                };
            }
            return {
                isValid: true,
                status: tenant.status,
                salonName: tenant.salonName || tenant.tradeName,
                tenantCode: tenant.code,
            };
        }
        catch (err) {
            logger.warn({ error: err.message, tenantId }, 'Could not reach Organization Service to verify tenant status, continuing with credential status');
            return { isValid: true, status: 'ACTIVE' };
        }
    }
    async login(params) {
        const normalizedEmail = params.email.toLowerCase().trim();
        // 1. Authoritative DB fetch for TenantCredential (NEVER cached)
        const credential = await tenantCredentialRepository.findByNormalizedEmail(normalizedEmail);
        if (!credential) {
            await authRepository.recordLoginAttempt({
                email: normalizedEmail,
                ipAddress: params.ipAddress,
                userAgent: params.userAgent,
                isSuccess: false,
                failureReason: 'TENANT_CREDENTIAL_NOT_FOUND',
            });
            throw new AuthenticationError('Invalid email or password');
        }
        // 2. Check Credential Lockout state
        if (credential.lockedUntil && new Date(credential.lockedUntil) > new Date()) {
            await authRepository.recordLoginAttempt({
                email: normalizedEmail,
                ipAddress: params.ipAddress,
                userAgent: params.userAgent,
                isSuccess: false,
                failureReason: 'TENANT_ACCOUNT_LOCKED',
            });
            throw new AccountLockedError('Tenant account is temporarily locked due to consecutive failed attempts.');
        }
        // 3. Check Credential Status
        if (credential.status === 'SUSPENDED' ||
            credential.status === 'DISABLED') {
            throw new UnauthorizedError('Tenant account is suspended or disabled. Contact platform support.');
        }
        // 4. Verify Password
        const isPasswordValid = await PasswordService.verify(params.password, credential.passwordHash);
        if (!isPasswordValid) {
            const { isLocked } = await tenantCredentialRepository.handleFailedLogin(credential);
            await authRepository.recordLoginAttempt({
                email: normalizedEmail,
                ipAddress: params.ipAddress,
                userAgent: params.userAgent,
                isSuccess: false,
                failureReason: 'INVALID_PASSWORD',
            });
            if (isLocked) {
                throw new AccountLockedError('Tenant account has been locked due to consecutive failed login attempts.');
            }
            throw new AuthenticationError('Invalid email or password');
        }
        // 5. Verify Tenant Business Status with Organization Service
        const orgCheck = await this.validateOrganizationTenantStatus(credential.tenantId);
        if (!orgCheck.isValid) {
            await authRepository.recordLoginAttempt({
                email: normalizedEmail,
                ipAddress: params.ipAddress,
                userAgent: params.userAgent,
                isSuccess: false,
                failureReason: `ORGANIZATION_TENANT_${orgCheck.status}`,
            });
            throw new UnauthorizedError(`Salon organization is ${orgCheck.status || 'inactive'}. Please contact support.`);
        }
        // 6. Successful login update
        await tenantCredentialRepository.handleSuccessfulLogin(credential.id);
        await authRepository.recordLoginAttempt({
            email: normalizedEmail,
            ipAddress: params.ipAddress,
            userAgent: params.userAgent,
            isSuccess: true,
        });
        // 7. MFA Check
        if (credential.isMfaRequired || credential.isMfaEnabled) {
            const challengeId = TokenService.generateMfaChallengeId();
            await identityReadStore.setMfaChallenge({
                challengeId,
                principalType: 'TENANT',
                tenantCredentialId: credential.id,
                attempts: 0,
                expiresAt: Date.now() + 300 * 1000,
            });
            return {
                requiresMfa: true,
                mfaChallengeId: challengeId,
            };
        }
        // 8. Authoritative Session creation
        const sessionExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        const { session } = await sessionRepository.createSession({
            principalType: 'TENANT',
            tenantCredentialId: credential.id,
            expiresAt: sessionExpiresAt,
            ipAddress: params.ipAddress,
            userAgent: params.userAgent,
        });
        // 9. Generate Tokens
        const { rawToken: refreshToken, tokenHash, expiresAt: refreshExpiresAt, } = TokenService.generateRefreshToken(7);
        await sessionRepository.saveRefreshToken({
            sessionId: session.id,
            tokenHash,
            expiresAt: refreshExpiresAt,
        });
        const accessToken = TokenService.createTenantAccessToken({
            tenantCredentialId: credential.id,
            sessionId: session.id,
            tenantId: credential.tenantId,
        });
        // 10. Cache safe Tenant profile in Redis
        const safeProfile = {
            credentialId: credential.id,
            tenantId: credential.tenantId,
            loginEmail: credential.loginEmail,
            mobilePhone: credential.mobilePhone,
            status: credential.status,
            salonName: orgCheck.salonName,
            tenantCode: orgCheck.tenantCode,
            isMfaRequired: credential.isMfaRequired,
            isMfaEnabled: credential.isMfaEnabled,
            lastLoginAt: new Date().toISOString(),
            createdAt: credential.createdAt.toISOString(),
        };
        await identityReadStore.getTenantAuthProfile(credential.tenantId, async () => safeProfile);
        return {
            requiresMfa: false,
            accessToken,
            refreshToken,
            expiresIn: 900,
            principal: {
                type: 'TENANT',
                tenantId: credential.tenantId,
                credentialId: credential.id,
                loginEmail: credential.loginEmail,
                salonName: orgCheck.salonName,
                tenantCode: orgCheck.tenantCode,
                status: credential.status,
                role: 'TENANT_ADMIN',
                scopeType: 'TENANT',
                permissions: TENANT_ADMIN_PERMISSIONS,
            },
        };
    }
    async refreshToken(rawRefreshToken) {
        return authService.refreshToken(rawRefreshToken);
    }
    async logout(tenantCredentialId, sessionId) {
        await sessionRepository.revokeSession(sessionId);
        await identityReadStore.invalidateTenantSession(tenantCredentialId, sessionId);
    }
    async getMe(tenantId, tenantCredentialId) {
        const profile = await identityReadStore.getTenantAuthProfile(tenantId, async () => {
            const cred = tenantCredentialId
                ? await tenantCredentialRepository.findById(tenantCredentialId)
                : await tenantCredentialRepository.findByTenantId(tenantId);
            if (!cred)
                return null;
            return {
                credentialId: cred.id,
                tenantId: cred.tenantId,
                loginEmail: cred.loginEmail,
                mobilePhone: cred.mobilePhone,
                status: cred.status,
                isMfaRequired: cred.isMfaRequired,
                isMfaEnabled: cred.isMfaEnabled,
                lastLoginAt: cred.lastLoginAt ? cred.lastLoginAt.toISOString() : null,
                createdAt: cred.createdAt.toISOString(),
            };
        });
        if (!profile) {
            throw new NotFoundError('Tenant profile not found');
        }
        const effectiveAccess = await identityReadStore.getTenantEffectiveAccess(tenantId, async () => ({
            tenantId,
            credentialId: profile.credentialId,
            role: 'TENANT_ADMIN',
            scopeType: 'TENANT',
            permissions: TENANT_ADMIN_PERMISSIONS,
        }));
        return { profile, effectiveAccess };
    }
    async forgotPassword(email) {
        const normalized = email.toLowerCase().trim();
        const credential = await tenantCredentialRepository.findByNormalizedEmail(normalized);
        if (credential) {
            const { rawToken, tokenHash } = TokenService.generateResetToken();
            const resetKey = `identity:tenant-pwd-reset:${tokenHash}`;
            const redis = identityReadStore.redis;
            try {
                await redis.set(resetKey, credential.id, 'EX', 900);
                logger.info({ credentialId: credential.id, tenantId: credential.tenantId }, 'Generated tenant password reset token');
                // Dispatch email
                const emailSent = await emailService.sendPasswordResetEmail({
                    toEmail: credential.loginEmail,
                    token: rawToken,
                    userType: 'TENANT',
                });
                if (!emailSent) {
                    logger.error({ credentialId: credential.id }, 'Failed to dispatch tenant password reset email');
                }
            }
            catch (err) {
                logger.warn({ error: err.message }, 'Failed to cache tenant reset token or send email');
            }
        }
        return {
            message: 'If a salon account with that email exists, password reset instructions have been sent.',
        };
    }
    async resetPassword(token, newPassword) {
        const tokenHash = TokenService.hashToken(token);
        const resetKey = `identity:tenant-pwd-reset:${tokenHash}`;
        const redis = identityReadStore.redis;
        const credentialId = await redis.get(resetKey);
        if (!credentialId) {
            throw new ValidationError('Invalid or expired password reset token');
        }
        const newPasswordHash = await PasswordService.hash(newPassword);
        await tenantCredentialRepository.updatePassword(credentialId, newPasswordHash);
        await redis.del(resetKey);
        // Invalidate all active sessions for this tenant credential
        await sessionRepository.revokeAllTenantSessions(credentialId);
        await identityReadStore.invalidateAllTenantSessions(credentialId);
        const credential = await tenantCredentialRepository.findById(credentialId);
        if (credential) {
            await identityReadStore.invalidateTenant(credential.tenantId);
        }
        return {
            message: 'Salon password has been reset successfully. Please login with your new password.',
        };
    }
}
export const tenantAuthService = new TenantAuthService();
export { TENANT_ADMIN_PERMISSIONS };
