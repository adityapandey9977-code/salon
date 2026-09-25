export interface BranchValidationResult {
    isValid: boolean;
    branchName?: string;
    isActive?: boolean;
    reason?: string;
}
export declare class OrganizationClient {
    private static instance;
    private constructor();
    static getInstance(): OrganizationClient;
    validateBranch(tenantId: string, branchId: string): Promise<BranchValidationResult>;
}
export declare const organizationClient: OrganizationClient;
//# sourceMappingURL=organization.client.d.ts.map