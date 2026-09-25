export interface SubscriptionPlanDto {
    id: string;
    code: string;
    name: string;
    description?: string | null;
    billingInterval: 'MONTHLY' | 'QUARTERLY' | 'YEARLY' | 'CUSTOM';
    basePrice: number;
    currency: string;
    trialDays: number;
    maxBranches: number;
    maxStaff: number;
    maxCustomers?: number | null;
    isActive: boolean;
    isPublic: boolean;
    createdAt: string;
    updatedAt: string;
    features?: PlanFeatureDto[];
}
export interface FeatureDefinitionDto {
    id: string;
    key: string;
    name: string;
    description?: string | null;
    category?: string | null;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}
export interface PlanFeatureDto {
    id: string;
    planId: string;
    featureId: string;
    featureKey?: string;
    featureName?: string;
    enabled: boolean;
    limitValue?: number | null;
    configJson?: any;
}
export interface TenantSubscriptionDto {
    id: string;
    tenantId: string;
    planId: string;
    planCode?: string;
    planName?: string;
    status: 'TRIALING' | 'ACTIVE' | 'PAST_DUE' | 'SUSPENDED' | 'CANCELLED' | 'EXPIRED';
    startsAt: string;
    trialEndsAt?: string | null;
    currentPeriodStart: string;
    currentPeriodEnd: string;
    cancelAtPeriodEnd: boolean;
    cancelledAt?: string | null;
    provider?: string | null;
    providerSubscriptionId?: string | null;
    createdAt: string;
    updatedAt: string;
}
export interface FeatureEntitlement {
    enabled: boolean;
    limitValue?: number | null;
    config?: any;
}
export interface EffectiveEntitlementsDto {
    tenantId: string;
    subscriptionStatus: string;
    planCode: string;
    planName?: string;
    features: Record<string, FeatureEntitlement>;
    limits: {
        maxBranches: number;
        maxStaff: number;
        maxCustomers?: number | null;
    };
    cachedAt?: string;
}
export interface CustomDomainDto {
    id: string;
    tenantId: string;
    hostname: string;
    domainType: 'ADMIN' | 'CUSTOMER' | 'PUBLIC' | 'BOOKING';
    isPrimary: boolean;
    status: 'PENDING' | 'VERIFYING' | 'ACTIVE' | 'FAILED' | 'DISABLED';
    verificationToken?: string | null;
    verificationMethod?: string | null;
    verifiedAt?: string | null;
    sslStatus: 'PENDING' | 'ISSUED' | 'FAILED' | 'EXPIRED';
    createdAt: string;
    updatedAt: string;
}
export interface TenantBrandingDto {
    id: string;
    tenantId: string;
    brandName?: string | null;
    primaryColor: string;
    secondaryColor: string;
    logoObjectKey?: string | null;
    faviconObjectKey?: string | null;
    appTitle: string;
    customCss?: string | null;
    createdAt: string;
    updatedAt: string;
}
export interface TenantProvisioningRequestDto {
    id: string;
    requestedByUserId?: string | null;
    planId: string;
    salonName: string;
    loginEmail: string;
    subdomain?: string | null;
    ownerPhone?: string | null;
    status: 'PENDING' | 'CREATING_ORGANIZATION' | 'CREATING_CREDENTIAL' | 'CREATING_SUBSCRIPTION' | 'CONFIGURING_ENTITLEMENTS' | 'COMPLETED' | 'FAILED';
    organizationTenantId?: string | null;
    failureStep?: string | null;
    failureReason?: string | null;
    createdAt: string;
    updatedAt: string;
    completedAt?: string | null;
}
//# sourceMappingURL=platform.dto.d.ts.map