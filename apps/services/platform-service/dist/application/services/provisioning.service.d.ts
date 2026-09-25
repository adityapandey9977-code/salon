import { ProvisioningRepository } from '../../infrastructure/repositories/provisioning.repository';
import { PlanRepository } from '../../infrastructure/repositories/plan.repository';
import { SubscriptionRepository } from '../../infrastructure/repositories/subscription.repository';
import { DomainRepository } from '../../infrastructure/repositories/domain.repository';
import { PlatformReadStore } from '../../infrastructure/redis/platform-read.store';
import { ProvisioningStatus } from '../../infrastructure/prisma/generated-client';
export declare class ProvisioningService {
    private provRepo;
    private planRepo;
    private subRepo;
    private domainRepo;
    private cache;
    constructor(provRepo?: ProvisioningRepository, planRepo?: PlanRepository, subRepo?: SubscriptionRepository, domainRepo?: DomainRepository, cache?: PlatformReadStore);
    listRequests(filter?: {
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
                billingInterval: import("../../infrastructure/prisma/generated-client").$Enums.BillingInterval;
                basePrice: import("../../infrastructure/prisma/generated-client/runtime/library").Decimal;
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
            status: import("../../infrastructure/prisma/generated-client").$Enums.ProvisioningStatus;
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
    getRequestById(id: string): Promise<{
        plan: {
            code: string;
            id: string;
            name: string;
            description: string | null;
            billingInterval: import("../../infrastructure/prisma/generated-client").$Enums.BillingInterval;
            basePrice: import("../../infrastructure/prisma/generated-client/runtime/library").Decimal;
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
        status: import("../../infrastructure/prisma/generated-client").$Enums.ProvisioningStatus;
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
    provisionTenant(data: {
        requestedByUserId?: string;
        planId: string;
        salonName: string;
        loginEmail: string;
        loginPassword?: string;
        subdomain?: string;
        ownerPhone?: string;
    }): Promise<{
        provisioningRequestId: string;
        tenantId: string;
        salonName: string;
        loginEmail: string;
        status: "COMPLETED";
        subscription: {
            plan: {
                planFeatures: ({
                    feature: {
                        id: string;
                        name: string;
                        description: string | null;
                        isActive: boolean;
                        createdAt: Date;
                        updatedAt: Date;
                        key: string;
                        category: string | null;
                    };
                } & {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    planId: string;
                    featureId: string;
                    enabled: boolean;
                    limitValue: number | null;
                    configJson: import("../../infrastructure/prisma/generated-client/runtime/library").JsonValue | null;
                })[];
            } & {
                code: string;
                id: string;
                name: string;
                description: string | null;
                billingInterval: import("../../infrastructure/prisma/generated-client").$Enums.BillingInterval;
                basePrice: import("../../infrastructure/prisma/generated-client/runtime/library").Decimal;
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
            tenantId: string;
            status: import("../../infrastructure/prisma/generated-client").$Enums.SubscriptionStatus;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            planId: string;
            startsAt: Date;
            trialEndsAt: Date | null;
            currentPeriodStart: Date;
            currentPeriodEnd: Date;
            cancelAtPeriodEnd: boolean;
            cancelledAt: Date | null;
            provider: string | null;
            providerSubscriptionId: string | null;
        };
    }>;
}
//# sourceMappingURL=provisioning.service.d.ts.map