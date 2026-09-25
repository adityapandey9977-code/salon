import { SubscriptionRepository } from '../../infrastructure/repositories/subscription.repository';
import { PlanRepository } from '../../infrastructure/repositories/plan.repository';
import { PlatformReadStore } from '../../infrastructure/redis/platform-read.store';
import { eventBus } from '../../infrastructure/messaging/publisher';
import { NotFoundError, BadRequestError } from '@salon-spa-saas/common-types';
import { createEventEnvelope } from '@salon-spa-saas/events';
import { SubscriptionStatus } from '../../infrastructure/prisma/generated-client';

export class SubscriptionService {
  constructor(
    private subRepo: SubscriptionRepository = new SubscriptionRepository(),
    private planRepo: PlanRepository = new PlanRepository(),
    private cache: PlatformReadStore = new PlatformReadStore()
  ) {}

  async getSubscriptionByTenantId(tenantId: string) {
    const cached = await this.cache.getSubscription(tenantId);
    if (cached) return cached;

    const sub = await this.subRepo.findByTenantId(tenantId);
    if (!sub) throw new NotFoundError(`Subscription for tenant ${tenantId} not found`);

    await this.cache.setSubscription(tenantId, sub);
    return sub;
  }

  async listSubscriptions(filter?: { status?: SubscriptionStatus; planId?: string; skip?: number; take?: number }) {
    return this.subRepo.list(filter);
  }

  async updateSubscription(
    tenantId: string,
    data: {
      planId?: string;
      status?: SubscriptionStatus;
      trialEndsAt?: Date | null;
      currentPeriodStart?: Date;
      currentPeriodEnd?: Date;
      cancelAtPeriodEnd?: boolean;
    }
  ) {
    const existing = await this.getSubscriptionByTenantId(tenantId);

    if (data.planId) {
      const plan = await this.planRepo.findPlanById(data.planId);
      if (!plan) throw new NotFoundError(`Plan ${data.planId} not found`);
    }

    const updated = await this.subRepo.update(tenantId, data);

    // Invalidate Redis caches
    await this.cache.invalidateSubscription(tenantId);
    await this.cache.invalidateEntitlements(tenantId);

    // Publish event
    let eventType = 'SUBSCRIPTION_CHANGED.v1';
    if (data.status === SubscriptionStatus.SUSPENDED) {
      eventType = 'SUBSCRIPTION_SUSPENDED.v1';
    } else if (data.status === SubscriptionStatus.CANCELLED) {
      eventType = 'SUBSCRIPTION_CANCELLED.v1';
    }

    const event = createEventEnvelope({
      eventType,
      aggregateType: 'TenantSubscription',
      aggregateId: updated.id,
      tenantId,
      payload: {
        subscriptionId: updated.id,
        tenantId,
        planId: updated.planId,
        status: updated.status,
        currentPeriodStart: updated.currentPeriodStart,
        currentPeriodEnd: updated.currentPeriodEnd,
      },
    });
    await eventBus.publish(event);

    return updated;
  }

  // Feature Overrides
  async getOverrides(tenantId: string) {
    return this.subRepo.findOverridesByTenantId(tenantId);
  }

  async setOverride(
    tenantId: string,
    data: {
      featureId: string;
      enabled?: boolean;
      limitValue?: number;
      configJson?: any;
      reason?: string;
      effectiveFrom?: Date;
      effectiveTo?: Date;
    }
  ) {
    const feature = await this.planRepo.findFeatureById(data.featureId);
    if (!feature) throw new NotFoundError(`Feature ${data.featureId} not found`);

    const override = await this.subRepo.upsertOverride({
      tenantId,
      featureId: data.featureId,
      enabled: data.enabled,
      limitValue: data.limitValue,
      configJson: data.configJson,
      reason: data.reason,
      effectiveFrom: data.effectiveFrom,
      effectiveTo: data.effectiveTo,
    });

    // Invalidate entitlements cache
    await this.cache.invalidateEntitlements(tenantId);

    // Publish event
    const event = createEventEnvelope({
      eventType: 'FEATURE_OVERRIDE_CHANGED.v1',
      aggregateType: 'TenantFeatureOverride',
      aggregateId: override.id,
      tenantId,
      payload: {
        overrideId: override.id,
        tenantId,
        featureId: data.featureId,
        featureKey: feature.key,
        enabled: override.enabled,
        limitValue: override.limitValue,
      },
    });
    await eventBus.publish(event);

    return override;
  }

  async removeOverride(tenantId: string, featureId: string) {
    const deleted = await this.subRepo.deleteOverride(tenantId, featureId);
    await this.cache.invalidateEntitlements(tenantId);

    const event = createEventEnvelope({
      eventType: 'FEATURE_OVERRIDE_CHANGED.v1',
      aggregateType: 'TenantFeatureOverride',
      aggregateId: deleted.id,
      tenantId,
      payload: {
        overrideId: deleted.id,
        tenantId,
        featureId,
        deleted: true,
      },
    });
    await eventBus.publish(event);

    return deleted;
  }
}
