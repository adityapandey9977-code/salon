import { prisma } from '../prisma/client';
export class TenantCredentialRepository {
    async findByNormalizedEmail(normalizedEmail) {
        return prisma.tenantCredential.findUnique({
            where: { normalizedEmail: normalizedEmail.toLowerCase().trim() },
        });
    }
    async findById(id) {
        return prisma.tenantCredential.findUnique({
            where: { id },
        });
    }
    async findByTenantId(tenantId) {
        return prisma.tenantCredential.findFirst({
            where: { tenantId },
        });
    }
    async create(data) {
        return prisma.tenantCredential.create({
            data: {
                tenantId: data.tenantId,
                loginEmail: data.loginEmail.trim(),
                normalizedEmail: data.normalizedEmail.toLowerCase().trim(),
                passwordHash: data.passwordHash,
                mobilePhone: data.mobilePhone || null,
                status: data.status || 'ACTIVE',
            },
        });
    }
    /**
     * Upsert by normalizedEmail:
     * - If no credential exists → create a new one.
     * - If one exists → UPDATE tenantId + passwordHash + mobilePhone so the
     *   credential always points to the LATEST tenant for that email address.
     */
    async upsertByEmail(data) {
        const normalizedEmail = data.normalizedEmail.toLowerCase().trim();
        const existing = await prisma.tenantCredential.findUnique({
            where: { normalizedEmail },
        });
        if (existing) {
            const updated = await prisma.tenantCredential.update({
                where: { normalizedEmail },
                data: {
                    tenantId: data.tenantId,
                    loginEmail: data.loginEmail.trim(),
                    passwordHash: data.passwordHash,
                    mobilePhone: data.mobilePhone || existing.mobilePhone,
                    failedLoginAttempts: 0,
                    lockedUntil: null,
                    status: 'ACTIVE',
                },
            });
            return { credential: updated, created: false };
        }
        const created = await prisma.tenantCredential.create({
            data: {
                tenantId: data.tenantId,
                loginEmail: data.loginEmail.trim(),
                normalizedEmail,
                passwordHash: data.passwordHash,
                mobilePhone: data.mobilePhone || null,
                status: 'ACTIVE',
            },
        });
        return { credential: created, created: true };
    }
    async handleFailedLogin(credential) {
        const attempts = credential.failedLoginAttempts + 1;
        const isLocked = attempts >= 5;
        const lockedUntil = isLocked ? new Date(Date.now() + 15 * 60 * 1000) : null;
        await prisma.tenantCredential.update({
            where: { id: credential.id },
            data: {
                failedLoginAttempts: attempts,
                lockedUntil,
            },
        });
        return { isLocked, attempts };
    }
    async handleSuccessfulLogin(credentialId) {
        await prisma.tenantCredential.update({
            where: { id: credentialId },
            data: {
                failedLoginAttempts: 0,
                lockedUntil: null,
                lastLoginAt: new Date(),
            },
        });
    }
    async updatePassword(credentialId, passwordHash) {
        await prisma.tenantCredential.update({
            where: { id: credentialId },
            data: {
                passwordHash,
                failedLoginAttempts: 0,
                lockedUntil: null,
            },
        });
    }
    async updateStatus(credentialId, status) {
        return prisma.tenantCredential.update({
            where: { id: credentialId },
            data: { status },
        });
    }
}
export const tenantCredentialRepository = new TenantCredentialRepository();
