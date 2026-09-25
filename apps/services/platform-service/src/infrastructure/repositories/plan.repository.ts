import type {
  FeatureDefinitionDto,
  PlanFeatureDto,
  SubscriptionPlanDto,
} from '../../domain/entities/platform.dto';
import { prisma } from '../prisma/client';
import { Prisma } from '../prisma/generated-client';

export class PlanRepository {
  private toPlanDto(p: any): SubscriptionPlanDto {
    return {
      id: p.id,
      code: p.code,
      name: p.name,
      description: p.description,
      billingInterval: p.billingInterval,
      basePrice: Number(p.basePrice),
      currency: p.currency,
      trialDays: p.trialDays,
      maxBranches: p.maxBranches,
      maxStaff: p.maxStaff,
      maxCustomers: p.maxCustomers,
      isActive: p.isActive,
      isPublic: p.isPublic,
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
      features: p.planFeatures?.map((pf: any) => ({
        id: pf.id,
        planId: pf.planId,
        featureId: pf.featureId,
        featureKey: pf.feature?.key,
        featureName: pf.feature?.name,
        enabled: pf.enabled,
        limitValue: pf.limitValue,
        configJson: pf.configJson,
      })),
    };
  }

  public async findAllPlans(includeInactive = false): Promise<SubscriptionPlanDto[]> {
    const plans = await prisma.subscriptionPlan.findMany({
      where: includeInactive ? {} : { isActive: true },
      include: {
        planFeatures: {
          include: { feature: true },
        },
      },
      orderBy: { basePrice: 'asc' },
    });
    return plans.map((p) => this.toPlanDto(p));
  }

  public async listPlans(filter?: { isActive?: boolean; isPublic?: boolean }): Promise<SubscriptionPlanDto[]> {
    const where: Prisma.SubscriptionPlanWhereInput = {};
    if (filter?.isActive !== undefined) where.isActive = filter.isActive;
    if (filter?.isPublic !== undefined) where.isPublic = filter.isPublic;

    const plans = await prisma.subscriptionPlan.findMany({
      where,
      include: {
        planFeatures: {
          include: { feature: true },
        },
      },
      orderBy: { basePrice: 'asc' },
    });
    return plans.map((p) => this.toPlanDto(p));
  }

  public async findPlanById(id: string): Promise<SubscriptionPlanDto | null> {
    const plan = await prisma.subscriptionPlan.findUnique({
      where: { id },
      include: {
        planFeatures: {
          include: { feature: true },
        },
      },
    });
    return plan ? this.toPlanDto(plan) : null;
  }

  public async findPlanByCode(code: string): Promise<SubscriptionPlanDto | null> {
    const plan = await prisma.subscriptionPlan.findUnique({
      where: { code: code.toUpperCase() },
      include: {
        planFeatures: {
          include: { feature: true },
        },
      },
    });
    return plan ? this.toPlanDto(plan) : null;
  }

  public async listFeatures(filter?: { isActive?: boolean; category?: string }): Promise<FeatureDefinitionDto[]> {
    const where: Prisma.FeatureDefinitionWhereInput = {};
    if (filter?.isActive !== undefined) where.isActive = filter.isActive;
    if (filter?.category !== undefined) where.category = filter.category;

    const features = await prisma.featureDefinition.findMany({
      where,
      orderBy: { key: 'asc' },
    });
    return features.map((f) => ({
      id: f.id,
      key: f.key,
      name: f.name,
      description: f.description,
      category: f.category,
      isActive: f.isActive,
      createdAt: f.createdAt.toISOString(),
      updatedAt: f.updatedAt.toISOString(),
    }));
  }

  public async findFeatureById(id: string): Promise<FeatureDefinitionDto | null> {
    const f = await prisma.featureDefinition.findUnique({
      where: { id },
    });
    if (!f) return null;
    return {
      id: f.id,
      key: f.key,
      name: f.name,
      description: f.description,
      category: f.category,
      isActive: f.isActive,
      createdAt: f.createdAt.toISOString(),
      updatedAt: f.updatedAt.toISOString(),
    };
  }

  public async findFeatureByKey(key: string): Promise<FeatureDefinitionDto | null> {
    const f = await prisma.featureDefinition.findUnique({
      where: { key: key.toUpperCase() },
    });
    if (!f) return null;
    return {
      id: f.id,
      key: f.key,
      name: f.name,
      description: f.description,
      category: f.category,
      isActive: f.isActive,
      createdAt: f.createdAt.toISOString(),
      updatedAt: f.updatedAt.toISOString(),
    };
  }

  public async createPlan(data: {
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
  }): Promise<SubscriptionPlanDto> {
    const plan = await prisma.$transaction(async (tx) => {
      const created = await tx.subscriptionPlan.create({
        data: {
          code: data.code.toUpperCase(),
          name: data.name,
          description: data.description,
          billingInterval: data.billingInterval || 'MONTHLY',
          basePrice: new Prisma.Decimal(data.basePrice),
          currency: data.currency || 'INR',
          trialDays: data.trialDays ?? 14,
          maxBranches: data.maxBranches ?? 1,
          maxStaff: data.maxStaff ?? 5,
          maxCustomers: data.maxCustomers,
          isPublic: data.isPublic ?? true,
        },
      });

      if (data.featureIds && data.featureIds.length > 0) {
        await tx.planFeature.createMany({
          data: data.featureIds.map((featureId) => ({
            planId: created.id,
            featureId,
            enabled: true,
          })),
        });
      }

      return tx.subscriptionPlan.findUniqueOrThrow({
        where: { id: created.id },
        include: { planFeatures: { include: { feature: true } } },
      });
    });

    return this.toPlanDto(plan);
  }

  public async updatePlan(
    id: string,
    data: {
      name?: string;
      description?: string;
      basePrice?: number;
      trialDays?: number;
      maxBranches?: number;
      maxStaff?: number;
      maxCustomers?: number;
      isActive?: boolean;
      isPublic?: boolean;
    },
  ): Promise<SubscriptionPlanDto> {
    const plan = await prisma.subscriptionPlan.update({
      where: { id },
      data: {
        ...(data.name ? { name: data.name } : {}),
        ...(data.description !== undefined ? { description: data.description } : {}),
        ...(data.basePrice !== undefined ? { basePrice: new Prisma.Decimal(data.basePrice) } : {}),
        ...(data.trialDays !== undefined ? { trialDays: data.trialDays } : {}),
        ...(data.maxBranches !== undefined ? { maxBranches: data.maxBranches } : {}),
        ...(data.maxStaff !== undefined ? { maxStaff: data.maxStaff } : {}),
        ...(data.maxCustomers !== undefined ? { maxCustomers: data.maxCustomers } : {}),
        ...(data.isActive !== undefined ? { isActive: data.isActive } : {}),
        ...(data.isPublic !== undefined ? { isPublic: data.isPublic } : {}),
      },
      include: {
        planFeatures: {
          include: { feature: true },
        },
      },
    });
    return this.toPlanDto(plan);
  }

  public async deletePlan(id: string): Promise<void> {
    await prisma.subscriptionPlan.update({
      where: { id },
      data: { isActive: false },
    });
  }

  // Feature Definitions
  public async findAllFeatures(): Promise<FeatureDefinitionDto[]> {
    const features = await prisma.featureDefinition.findMany({
      orderBy: { key: 'asc' },
    });
    return features.map((f) => ({
      id: f.id,
      key: f.key,
      name: f.name,
      description: f.description,
      category: f.category,
      isActive: f.isActive,
      createdAt: f.createdAt.toISOString(),
      updatedAt: f.updatedAt.toISOString(),
    }));
  }

  public async createFeature(data: {
    key: string;
    name: string;
    description?: string;
    category?: string;
  }): Promise<FeatureDefinitionDto> {
    const f = await prisma.featureDefinition.create({
      data: {
        key: data.key.toUpperCase(),
        name: data.name,
        description: data.description,
        category: data.category || 'CORE',
      },
    });
    return {
      id: f.id,
      key: f.key,
      name: f.name,
      description: f.description,
      category: f.category,
      isActive: f.isActive,
      createdAt: f.createdAt.toISOString(),
      updatedAt: f.updatedAt.toISOString(),
    };
  }

  public async updateFeature(
    id: string,
    data: { name?: string; description?: string; isActive?: boolean },
  ): Promise<FeatureDefinitionDto> {
    const f = await prisma.featureDefinition.update({
      where: { id },
      data,
    });
    return {
      id: f.id,
      key: f.key,
      name: f.name,
      description: f.description,
      category: f.category,
      isActive: f.isActive,
      createdAt: f.createdAt.toISOString(),
      updatedAt: f.updatedAt.toISOString(),
    };
  }
}

export const planRepository = new PlanRepository();
