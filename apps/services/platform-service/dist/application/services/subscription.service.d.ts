import { SubscriptionRepository } from '../../infrastructure/repositories/subscription.repository';
import { PlanRepository } from '../../infrastructure/repositories/plan.repository';
import { PlatformReadStore } from '../../infrastructure/redis/platform-read.store';
import { SubscriptionStatus } from '../../infrastructure/prisma/generated-client';
export declare class SubscriptionService {
    private subRepo;
    private planRepo;
    private cache;
    constructor(subRepo?: SubscriptionRepository, planRepo?: PlanRepository, cache?: PlatformReadStore);
    getSubscriptionByTenantId(tenantId: string): Promise<any>;
    listSubscriptions(filter?: {
        status?: SubscriptionStatus;
        planId?: string;
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
        })[];
        total: number;
    }>;
    updateSubscription(tenantId: string, data: {
        planId?: string;
        status?: SubscriptionStatus;
        trialEndsAt?: Date | null;
        currentPeriodStart?: Date;
        currentPeriodEnd?: Date;
        cancelAtPeriodEnd?: boolean;
    }): Promise<{
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
    }>;
    getOverrides(tenantId: string): Promise<({
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
        tenantId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        featureId: string;
        enabled: boolean | null;
        limitValue: number | null;
        configJson: import("../../infrastructure/prisma/generated-client/runtime/library").JsonValue | null;
        reason: string | null;
        effectiveFrom: Date;
        effectiveTo: Date | null;
    })[]>;
    setOverride(tenantId: string, data: {
        featureId: string;
        enabled?: boolean;
        limitValue?: number;
        configJson?: any;
        reason?: string;
        effectiveFrom?: Date;
        effectiveTo?: Date;
    }): Promise<{
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
        tenantId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        featureId: string;
        enabled: boolean | null;
        limitValue: number | null;
        configJson: import("../../infrastructure/prisma/generated-client/runtime/library").JsonValue | null;
        reason: string | null;
        effectiveFrom: Date;
        effectiveTo: Date | null;
    }>;
    removeOverride(tenantId: string, featureId: string): Promise<{
        tenantId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        featureId: string;
        enabled: boolean | null;
        limitValue: number | null;
        configJson: import("../../infrastructure/prisma/generated-client/runtime/library").JsonValue | null;
        reason: string | null;
        effectiveFrom: Date;
        effectiveTo: Date | null;
    }>;
}
//# sourceMappingURL=subscription.service.d.ts.map