import { ProvisioningStatus, Prisma } from '../prisma/generated-client';
export declare class ProvisioningRepository {
    findById(id: string): Promise<({
        plan: {
            code: string;
            id: string;
            name: string;
            description: string | null;
            billingInterval: import("../prisma/generated-client").$Enums.BillingInterval;
            basePrice: Prisma.Decimal;
            currency: string;
            trialDays: number;
            maxBranches: number;
            maxStaff: number;
            maxCustomers: number | null;
            isActive: boolean;
            isPublic: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        status: import("../prisma/generated-client").$Enums.ProvisioningStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        planId: string;
        requestedByUserId: string | null;
        salonName: string;
        loginEmail: string;
        subdomain: string | null;
        ownerPhone: string | null;
        organizationTenantId: string | null;
        failureStep: string | null;
        failureReason: string | null;
        completedAt: Date | null;
    }) | null>;
    list(filter?: {
        status?: ProvisioningStatus;
        skip?: number;
        take?: number;
    }): Promise<{
        items: ({
            plan: {
                code: string;
                id: string;
                name: string;
                description: string | null;
                billingInterval: import("../prisma/generated-client").$Enums.BillingInterval;
                basePrice: Prisma.Decimal;
                currency: string;
                trialDays: number;
                maxBranches: number;
                maxStaff: number;
                maxCustomers: number | null;
                isActive: boolean;
                isPublic: boolean;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            status: import("../prisma/generated-client").$Enums.ProvisioningStatus;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            planId: string;
            requestedByUserId: string | null;
            salonName: string;
            loginEmail: string;
            subdomain: string | null;
            ownerPhone: string | null;
            organizationTenantId: string | null;
            failureStep: string | null;
            failureReason: string | null;
            completedAt: Date | null;
        })[];
        total: number;
    }>;
    create(data: {
        requestedByUserId?: string;
        planId: string;
        salonName: string;
        loginEmail: string;
        subdomain?: string;
        ownerPhone?: string;
    }): Promise<{
        plan: {
            code: string;
            id: string;
            name: string;
            description: string | null;
            billingInterval: import("../prisma/generated-client").$Enums.BillingInterval;
            basePrice: Prisma.Decimal;
            currency: string;
            trialDays: number;
            maxBranches: number;
            maxStaff: number;
            maxCustomers: number | null;
            isActive: boolean;
            isPublic: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        status: import("../prisma/generated-client").$Enums.ProvisioningStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        planId: string;
        requestedByUserId: string | null;
        salonName: string;
        loginEmail: string;
        subdomain: string | null;
        ownerPhone: string | null;
        organizationTenantId: string | null;
        failureStep: string | null;
        failureReason: string | null;
        completedAt: Date | null;
    }>;
    updateStatus(id: string, data: {
        status: ProvisioningStatus;
        organizationTenantId?: string;
        failureStep?: string;
        failureReason?: string;
        completedAt?: Date;
    }): Promise<{
        plan: {
            code: string;
            id: string;
            name: string;
            description: string | null;
            billingInterval: import("../prisma/generated-client").$Enums.BillingInterval;
            basePrice: Prisma.Decimal;
            currency: string;
            trialDays: number;
            maxBranches: number;
            maxStaff: number;
            maxCustomers: number | null;
            isActive: boolean;
            isPublic: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        status: import("../prisma/generated-client").$Enums.ProvisioningStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        planId: string;
        requestedByUserId: string | null;
        salonName: string;
        loginEmail: string;
        subdomain: string | null;
        ownerPhone: string | null;
        organizationTenantId: string | null;
        failureStep: string | null;
        failureReason: string | null;
        completedAt: Date | null;
    }>;
}
//# sourceMappingURL=provisioning.repository.d.ts.map