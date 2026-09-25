import type { TenantCredential, TenantCredentialStatus } from '../prisma/generated-client';
export declare class TenantCredentialRepository {
    findByNormalizedEmail(normalizedEmail: string): Promise<TenantCredential | null>;
    findById(id: string): Promise<TenantCredential | null>;
    findByTenantId(tenantId: string): Promise<TenantCredential | null>;
    create(data: {
        tenantId: string;
        loginEmail: string;
        normalizedEmail: string;
        passwordHash: string;
        mobilePhone?: string | null;
        status?: TenantCredentialStatus;
    }): Promise<TenantCredential>;
    /**
     * Upsert by normalizedEmail:
     * - If no credential exists → create a new one.
     * - If one exists → UPDATE tenantId + passwordHash + mobilePhone so the
     *   credential always points to the LATEST tenant for that email address.
     */
    upsertByEmail(data: {
        tenantId: string;
        loginEmail: string;
        normalizedEmail: string;
        passwordHash: string;
        mobilePhone?: string | null;
    }): Promise<{
        credential: TenantCredential;
        created: boolean;
    }>;
    handleFailedLogin(credential: TenantCredential): Promise<{
        isLocked: boolean;
        attempts: number;
    }>;
    handleSuccessfulLogin(credentialId: string): Promise<void>;
    updatePassword(credentialId: string, passwordHash: string): Promise<void>;
    updateStatus(credentialId: string, status: TenantCredentialStatus): Promise<TenantCredential>;
}
export declare const tenantCredentialRepository: TenantCredentialRepository;
//# sourceMappingURL=tenant-credential.repository.d.ts.map