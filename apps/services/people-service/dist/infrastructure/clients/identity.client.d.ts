export interface ProvisionUserResult {
    success: boolean;
    userId?: string;
    error?: string;
}
export declare class IdentityClient {
    private static instance;
    private constructor();
    static getInstance(): IdentityClient;
    provisionStaffUser(params: {
        tenantId: string;
        email: string;
        fullName: string;
        mobilePhone?: string;
        initialPassword?: string;
        branchIds?: string[];
        roles?: string[];
    }): Promise<ProvisionUserResult>;
}
export declare const identityClient: IdentityClient;
//# sourceMappingURL=identity.client.d.ts.map