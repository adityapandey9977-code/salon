import { PlanRepository } from '../../infrastructure/repositories/plan.repository';
import { PlatformReadStore } from '../../infrastructure/redis/platform-read.store';
import { BillingInterval } from '../../infrastructure/prisma/generated-client';
export declare class PlanService {
    private planRepo;
    private cache;
    constructor(planRepo?: PlanRepository, cache?: PlatformReadStore);
    listPlans(filter?: {
        isActive?: boolean;
        isPublic?: boolean;
    }): Promise<import("../../domain/entities/platform.dto").SubscriptionPlanDto[]>;
    getPlanById(id: string): Promise<any>;
    getPlanByCode(code: string): Promise<import("../../domain/entities/platform.dto").SubscriptionPlanDto>;
    createPlan(data: {
        code: string;
        name: string;
        description?: string;
        billingInterval?: BillingInterval;
        basePrice: number;
        currency?: string;
        trialDays?: number;
        maxBranches?: number;
        maxStaff?: number;
        maxCustomers?: number;
        isActive?: boolean;
        isPublic?: boolean;
        features?: Array<{
            featureId: string;
            enabled?: boolean;
            limitValue?: number;
            configJson?: any;
        }>;
    }): Promise<import("../../domain/entities/platform.dto").SubscriptionPlanDto>;
    updatePlan(id: string, data: {
        name?: string;
        description?: string;
        billingInterval?: BillingInterval;
        basePrice?: number;
        currency?: string;
        trialDays?: number;
        maxBranches?: number;
        maxStaff?: number;
        maxCustomers?: number;
        isActive?: boolean;
        isPublic?: boolean;
        features?: Array<{
            featureId: string;
            enabled?: boolean;
            limitValue?: number;
            configJson?: any;
        }>;
    }): Promise<import("../../domain/entities/platform.dto").SubscriptionPlanDto>;
    deletePlan(id: string): Promise<void>;
    listFeatures(filter?: {
        isActive?: boolean;
        category?: string;
    }): Promise<import("../../domain/entities/platform.dto").FeatureDefinitionDto[]>;
    getFeatureById(id: string): Promise<import("../../domain/entities/platform.dto").FeatureDefinitionDto>;
    createFeature(data: {
        key: string;
        name: string;
        description?: string;
        category?: string;
        isActive?: boolean;
    }): Promise<import("../../domain/entities/platform.dto").FeatureDefinitionDto>;
    updateFeature(id: string, data: {
        name?: string;
        description?: string;
        category?: string;
        isActive?: boolean;
    }): Promise<import("../../domain/entities/platform.dto").FeatureDefinitionDto>;
}
//# sourceMappingURL=plan.service.d.ts.map