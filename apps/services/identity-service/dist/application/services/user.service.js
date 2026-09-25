import { ConflictError, NotFoundError } from '@salon-spa-saas/common-types';
import { identityReadStore } from '../../infrastructure/redis/identity-read.store';
import { sessionRepository } from '../../infrastructure/repositories/session.repository';
import { userRepository } from '../../infrastructure/repositories/user.repository';
import { tenantCredentialRepository } from '../../infrastructure/repositories/tenant-credential.repository';
import { emailService } from '../../infrastructure/email/email.service';
import { PasswordService } from '../../infrastructure/security/password.service';
export class UserService {
    async listUsers(params) {
        // List queries query PostgreSQL directly because arbitrary filters are volatile
        return userRepository.listUsers(params);
    }
    async getUserById(userId, tenantId) {
        const user = await identityReadStore.getUserProfile(userId, () => userRepository.findById(userId), tenantId);
        if (!user) {
            throw new NotFoundError('User not found');
        }
        return user;
    }
    async createUser(data) {
        const normalizedEmail = data.email.toLowerCase().trim();
        const existing = await userRepository.findByNormalizedEmail(normalizedEmail);
        if (existing) {
            throw new ConflictError('A user with this email already exists');
        }
        const existingTenant = await tenantCredentialRepository.findByNormalizedEmail(normalizedEmail);
        if (existingTenant) {
            throw new ConflictError('This email is already registered as a Franchise or Salon Owner');
        }
        const passwordHash = await PasswordService.hash(data.password);
        const user = await userRepository.createUser({
            email: normalizedEmail,
            passwordHash,
            fullName: data.fullName,
            mobilePhone: data.mobilePhone,
            userType: data.userType,
            isMfaRequired: data.isMfaRequired,
            roleIds: data.roleIds,
        });
        // Invalidate/warm up user cache
        await identityReadStore.invalidateUser(user.id, { newEmail: normalizedEmail });
        // Send auto-generated secure credentials directly to the user's email via SMTP
        try {
            await emailService.sendUserCredentialsEmail({
                toEmail: normalizedEmail,
                fullName: data.fullName,
                userType: data.userType,
                roleName: data.roleName,
                generatedPassword: data.password,
            });
        }
        catch (emailErr) {
            console.error('[UserService] Failed to dispatch credentials email:', emailErr);
        }
        return user;
    }
    async updateUser(userId, data) {
        const existing = await userRepository.findById(userId);
        if (!existing) {
            throw new NotFoundError('User not found');
        }
        if (data.email && data.email.toLowerCase().trim() !== existing.email.toLowerCase().trim()) {
            const emailTaken = await userRepository.findByNormalizedEmail(data.email);
            if (emailTaken && emailTaken.id !== userId) {
                throw new ConflictError('A user with this email already exists');
            }
            const existingTenant = await tenantCredentialRepository.findByNormalizedEmail(data.email);
            if (existingTenant) {
                throw new ConflictError('This email is already registered as a Franchise or Salon Owner');
            }
        }
        const resolvedRoles = data.roles || (data.role ? [data.role] : undefined);
        const updated = await userRepository.updateUser(userId, {
            fullName: data.fullName,
            email: data.email,
            mobilePhone: data.mobilePhone,
            isMfaRequired: data.isMfaRequired,
            isMfaEnabled: data.isMfaEnabled,
            status: data.status,
            roles: resolvedRoles,
        });
        // Invalidate Redis cache after PostgreSQL commit
        await identityReadStore.invalidateUser(userId, {
            oldEmail: existing.email,
            newEmail: updated.email,
        });
        await identityReadStore.invalidateUserAccess(userId);
        return updated;
    }
    async suspendUser(userId) {
        const existing = await userRepository.findById(userId);
        if (!existing) {
            throw new NotFoundError('User not found');
        }
        const updated = await userRepository.setStatus(userId, 'LOCKED');
        // Revoke all active sessions and purge caches
        await sessionRepository.revokeAllUserSessions(userId);
        await identityReadStore.invalidateAllUserSessions(userId);
        await identityReadStore.invalidateUser(userId);
        await identityReadStore.invalidateUserAccess(userId);
        return updated;
    }
    async activateUser(userId) {
        const existing = await userRepository.findById(userId);
        if (!existing) {
            throw new NotFoundError('User not found');
        }
        const updated = await userRepository.setStatus(userId, 'ACTIVE');
        // Invalidate Redis cache
        await identityReadStore.invalidateUser(userId);
        return updated;
    }
}
export const userService = new UserService();
