import type { FeatureDefinitionDto, SubscriptionPlanDto } from '../../domain/entities/platform.dto';
export declare class PlanRepository {
    private toPlanDto;
    findAllPlans(includeInactive?: boolean): Promise<SubscriptionPlanDto[]>;
    listPlans(filter?: {
        isActive?: boolean;
        isPublic?: boolean;
    }): Promise<SubscriptionPlanDto[]>;
    findPlanById(id: string): Promise<SubscriptionPlanDto | null>;
    findPlanByCode(code: string): Promise<SubscriptionPlanDto | null>;
    listFeatures(filter?: {
        isActive?: boolean;
        category?: string;
    }): Promise<FeatureDefinitionDto[]>;
    findFeatureById(id: string): Promise<FeatureDefinitionDto | null>;
    findFeatureByKey(key: string): Promise<FeatureDefinitionDto | null>;
    createPlan(data: {
        code: string;
        name: string;
        description?: string;
        billingInterval?: 'MONTHLY' | 'QUARTERLY' | 'YEARLY' | 'CUSTOM';
        basePrice: number;
        currency?: string;
        trialDays?: number;
        maxBranches?: number;
        maxStaff?: number;
        maxCustomers?: number;
        isPublic?: boolean;
        featureIds?: string[];
    }): Promise<SubscriptionPlanDto>;
    updatePlan(id: string, data: {
        name?: string;
        description?: string;
        basePrice?: number;
        trialDays?: number;
        maxBranches?: number;
        maxStaff?: number;
        maxCustomers?: number;
        isActive?: boolean;
        isPublic?: boolean;
    }): Promise<SubscriptionPlanDto>;
    deletePlan(id: string): Promise<void>;
    findAllFeatures(): Promise<FeatureDefinitionDto[]>;
    createFeature(data: {
        key: string;
        name: string;
        description?: string;
        category?: string;
    }): Promise<FeatureDefinitionDto>;
    updateFeature(id: string, data: {
        name?: string;
        description?: string;
        isActive?: boolean;
    }): Promise<FeatureDefinitionDto>;
}
export declare const planRepository: PlanRepository;
//# sourceMappingURL=plan.repository.d.ts.map