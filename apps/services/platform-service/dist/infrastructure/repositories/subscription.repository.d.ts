import { SubscriptionStatus, Prisma } from '../prisma/generated-client';
export declare class SubscriptionRepository {
    findByTenantId(tenantId: string): Promise<({
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
                configJson: Prisma.JsonValue | null;
            })[];
        } & {
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
        tenantId: string;
        status: import("../prisma/generated-client").$Enums.SubscriptionStatus;
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
    }) | null>;
    findById(id: string): Promise<({
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
                configJson: Prisma.JsonValue | null;
            })[];
        } & {
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
        tenantId: string;
        status: import("../prisma/generated-client").$Enums.SubscriptionStatus;
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
    }) | null>;
    list(filter?: {
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
            tenantId: string;
            status: import("../prisma/generated-client").$Enums.SubscriptionStatus;
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
    create(data: {
        tenantId: string;
        planId: string;
        status?: SubscriptionStatus;
        startsAt?: Date;
        trialEndsAt?: Date;
        currentPeriodStart: Date;
        currentPeriodEnd: Date;
        provider?: string;
        providerSubscriptionId?: string;
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
                configJson: Prisma.JsonValue | null;
            })[];
        } & {
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
        tenantId: string;
        status: import("../prisma/generated-client").$Enums.SubscriptionStatus;
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
    update(tenantId: string, data: {
        planId?: string;
        status?: SubscriptionStatus;
        trialEndsAt?: Date | null;
        currentPeriodStart?: Date;
        currentPeriodEnd?: Date;
        cancelAtPeriodEnd?: boolean;
        cancelledAt?: Date | null;
        provider?: string;
        providerSubscriptionId?: string;
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
                configJson: Prisma.JsonValue | null;
            })[];
        } & {
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
        tenantId: string;
        status: import("../prisma/generated-client").$Enums.SubscriptionStatus;
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
    findOverridesByTenantId(tenantId: string): Promise<({
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
        configJson: Prisma.JsonValue | null;
        reason: string | null;
        effectiveFrom: Date;
        effectiveTo: Date | null;
    })[]>;
    findOverride(tenantId: string, featureId: string): Promise<({
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
        configJson: Prisma.JsonValue | null;
        reason: string | null;
        effectiveFrom: Date;
        effectiveTo: Date | null;
    }) | null>;
    upsertOverride(data: {
        tenantId: string;
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
        configJson: Prisma.JsonValue | null;
        reason: string | null;
        effectiveFrom: Date;
        effectiveTo: Date | null;
    }>;
    deleteOverride(tenantId: string, featureId: string): Promise<{
        tenantId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        featureId: string;
        enabled: boolean | null;
        limitValue: number | null;
        configJson: Prisma.JsonValue | null;
        reason: string | null;
        effectiveFrom: Date;
        effectiveTo: Date | null;
    }>;
}
//# sourceMappingURL=subscription.repository.d.ts.map