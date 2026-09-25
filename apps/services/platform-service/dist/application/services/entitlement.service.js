import { SubscriptionRepository } from '../../infrastructure/repositories/subscription.repository';
import { PlanRepository } from '../../infrastructure/repositories/plan.repository';
import { PlatformReadStore } from '../../infrastructure/redis/platform-read.store';
import { SubscriptionStatus } from '../../infrastructure/prisma/generated-client';
export class EntitlementService {
    subscriptionRepo;
    planRepo;
    cache;
    constructor(subscriptionRepo = new SubscriptionRepository(), planRepo = new PlanRepository(), cache = new PlatformReadStore()) {
        this.subscriptionRepo = subscriptionRepo;
        this.planRepo = planRepo;
        this.cache = cache;
    }
    async getEffectiveEntitlements(tenantId) {
        // 1. Check Redis cache first
        const cached = await this.cache.getEntitlements(tenantId);
        if (cached)
            return cached;
        // 2. Fetch Subscription and Plan Features
        const subscription = await this.subscriptionRepo.findByTenantId(tenantId);
        const overrides = await this.subscriptionRepo.findOverridesByTenantId(tenantId);
        const allFeatures = await this.planRepo.listFeatures({ isActive: true });
        // If tenant has no subscription, return default un-entitled state
        if (!subscription) {
            const defaultEntitlements = {
                tenantId,
                subscriptionStatus: 'EXPIRED',
                planCode: 'NONE',
                features: {},
                limits: {
                    maxBranches: 0,
                    maxStaff: 0,
                    maxCustomers: null,
                },
            };
            await this.cache.setEntitlements(tenantId, defaultEntitlements, 60);
            return defaultEntitlements;
        }
        const plan = subscription.plan;
        const planFeatureMap = new Map();
        if (plan && plan.planFeatures) {
            for (const pf of plan.planFeatures) {
                planFeatureMap.set(pf.featureId, {
                    enabled: pf.enabled,
                    limitValue: pf.limitValue,
                    configJson: pf.configJson,
                });
            }
        }
        const overrideMap = new Map();
        const now = new Date();
        for (const ov of overrides) {
            const fromValid = !ov.effectiveFrom || ov.effectiveFrom <= now;
            const toValid = !ov.effectiveTo || ov.effectiveTo >= now;
            if (fromValid && toValid) {
                overrideMap.set(ov.featureId, {
                    enabled: ov.enabled,
                    limitValue: ov.limitValue,
                    configJson: ov.configJson,
                    effectiveFrom: ov.effectiveFrom,
                    effectiveTo: ov.effectiveTo,
                });
            }
        }
        // Resolve 3-tier: Tenant Override -> Plan Feature -> Platform Default (false)
        const features = {};
        for (const feat of allFeatures) {
            let isEnabled = false;
            let limitValue = undefined;
            let configJson = undefined;
            const planFeat = planFeatureMap.get(feat.id);
            if (planFeat) {
                isEnabled = planFeat.enabled;
                limitValue = planFeat.limitValue ?? undefined;
                configJson = planFeat.configJson;
            }
            const override = overrideMap.get(feat.id);
            if (override) {
                if (override.enabled !== undefined && override.enabled !== null) {
                    isEnabled = override.enabled;
                }
                if (override.limitValue !== undefined && override.limitValue !== null) {
                    limitValue = override.limitValue;
                }
                if (override.configJson !== undefined) {
                    configJson = override.configJson;
                }
            }
            // If subscription is SUSPENDED, CANCELLED, or EXPIRED, block non-essential features
            const isSubActive = subscription.status === SubscriptionStatus.ACTIVE || subscription.status === SubscriptionStatus.TRIALING;
            if (!isSubActive) {
                isEnabled = false;
            }
            features[feat.key] = {
                enabled: isEnabled,
                limitValue,
                config: configJson,
            };
        }
        const result = {
            tenantId,
            subscriptionStatus: subscription.status,
            planCode: plan ? plan.code : 'UNKNOWN',
            features,
            limits: {
                maxBranches: plan?.maxBranches ?? 1,
                maxStaff: plan?.maxStaff ?? 5,
                maxCustomers: plan?.maxCustomers ?? null,
            },
        };
        // Cache safe read projection (300s TTL)
        await this.cache.setEntitlements(tenantId, result, 300);
        return result;
    }
    async invalidateEntitlements(tenantId) {
        await this.cache.invalidateEntitlements(tenantId);
    }
}
