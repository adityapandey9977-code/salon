import { PlanRepository } from '../../infrastructure/repositories/plan.repository';
import { PlatformReadStore } from '../../infrastructure/redis/platform-read.store';
import { NotFoundError, ConflictError } from '@salon-spa-saas/common-types';
export class PlanService {
    planRepo;
    cache;
    constructor(planRepo = new PlanRepository(), cache = new PlatformReadStore()) {
        this.planRepo = planRepo;
        this.cache = cache;
    }
    async listPlans(filter) {
        return this.planRepo.listPlans(filter);
    }
    async getPlanById(id) {
        const cached = await this.cache.getPlan(id);
        if (cached)
            return cached;
        const plan = await this.planRepo.findPlanById(id);
        if (!plan)
            throw new NotFoundError(`Subscription plan with id ${id} not found`);
        await this.cache.setPlan(id, plan);
        return plan;
    }
    async getPlanByCode(code) {
        const plan = await this.planRepo.findPlanByCode(code);
        if (!plan)
            throw new NotFoundError(`Subscription plan with code ${code} not found`);
        return plan;
    }
    async createPlan(data) {
        const existing = await this.planRepo.findPlanByCode(data.code);
        if (existing)
            throw new ConflictError(`Plan code ${data.code} already exists`);
        const plan = await this.planRepo.createPlan(data);
        await this.cache.invalidatePlan(plan.id);
        return plan;
    }
    async updatePlan(id, data) {
        await this.getPlanById(id);
        const updated = await this.planRepo.updatePlan(id, data);
        await this.cache.invalidatePlan(id);
        return updated;
    }
    async deletePlan(id) {
        await this.getPlanById(id);
        const deleted = await this.planRepo.deletePlan(id);
        await this.cache.invalidatePlan(id);
        return deleted;
    }
    // Feature Definitions
    async listFeatures(filter) {
        return this.planRepo.listFeatures(filter);
    }
    async getFeatureById(id) {
        const feature = await this.planRepo.findFeatureById(id);
        if (!feature)
            throw new NotFoundError(`Feature definition with id ${id} not found`);
        return feature;
    }
    async createFeature(data) {
        const existing = await this.planRepo.findFeatureByKey(data.key);
        if (existing)
            throw new ConflictError(`Feature key ${data.key} already exists`);
        return this.planRepo.createFeature(data);
    }
    async updateFeature(id, data) {
        await this.getFeatureById(id);
        return this.planRepo.updateFeature(id, data);
    }
}
