import { PlanRepository } from '../../infrastructure/repositories/plan.repository';
import { PlatformReadStore } from '../../infrastructure/redis/platform-read.store';
import { NotFoundError, ConflictError } from '@salon-spa-saas/common-types';
import { BillingInterval } from '../../infrastructure/prisma/generated-client';

export class PlanService {
  constructor(
    private planRepo: PlanRepository = new PlanRepository(),
    private cache: PlatformReadStore = new PlatformReadStore()
  ) {}

  async listPlans(filter?: { isActive?: boolean; isPublic?: boolean }) {
    return this.planRepo.listPlans(filter);
  }

  async getPlanById(id: string) {
    const cached = await this.cache.getPlan(id);
    if (cached) return cached;

    const plan = await this.planRepo.findPlanById(id);
    if (!plan) throw new NotFoundError(`Subscription plan with id ${id} not found`);

    await this.cache.setPlan(id, plan);
    return plan;
  }

  async getPlanByCode(code: string) {
    const plan = await this.planRepo.findPlanByCode(code);
    if (!plan) throw new NotFoundError(`Subscription plan with code ${code} not found`);
    return plan;
  }

  async createPlan(data: {
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
    features?: Array<{ featureId: string; enabled?: boolean; limitValue?: number; configJson?: any }>;
  }) {
    const existing = await this.planRepo.findPlanByCode(data.code);
    if (existing) throw new ConflictError(`Plan code ${data.code} already exists`);

    const plan = await this.planRepo.createPlan(data);
    await this.cache.invalidatePlan(plan.id);
    return plan;
  }

  async updatePlan(
    id: string,
    data: {
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
      features?: Array<{ featureId: string; enabled?: boolean; limitValue?: number; configJson?: any }>;
    }
  ) {
    await this.getPlanById(id);
    const updated = await this.planRepo.updatePlan(id, data);
    await this.cache.invalidatePlan(id);
    return updated;
  }

  async deletePlan(id: string) {
    await this.getPlanById(id);
    const deleted = await this.planRepo.deletePlan(id);
    await this.cache.invalidatePlan(id);
    return deleted;
  }

  // Feature Definitions
  async listFeatures(filter?: { isActive?: boolean; category?: string }) {
    return this.planRepo.listFeatures(filter);
  }

  async getFeatureById(id: string) {
    const feature = await this.planRepo.findFeatureById(id);
    if (!feature) throw new NotFoundError(`Feature definition with id ${id} not found`);
    return feature;
  }

  async createFeature(data: {
    key: string;
    name: string;
    description?: string;
    category?: string;
    isActive?: boolean;
  }) {
    const existing = await this.planRepo.findFeatureByKey(data.key);
    if (existing) throw new ConflictError(`Feature key ${data.key} already exists`);
    return this.planRepo.createFeature(data);
  }

  async updateFeature(
    id: string,
    data: {
      name?: string;
      description?: string;
      category?: string;
      isActive?: boolean;
    }
  ) {
    await this.getFeatureById(id);
    return this.planRepo.updateFeature(id, data);
  }
}
