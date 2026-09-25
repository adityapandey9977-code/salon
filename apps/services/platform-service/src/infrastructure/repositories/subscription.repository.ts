import { prisma } from '../prisma/client';
import { SubscriptionStatus, Prisma } from '../prisma/generated-client';

export class SubscriptionRepository {
  async findByTenantId(tenantId: string) {
    return prisma.tenantSubscription.findUnique({
      where: { tenantId },
      include: {
        plan: {
          include: {
            planFeatures: {
              include: {
                feature: true,
              },
            },
          },
        },
      },
    });
  }

  async findById(id: string) {
    return prisma.tenantSubscription.findUnique({
      where: { id },
      include: {
        plan: {
          include: {
            planFeatures: {
              include: {
                feature: true,
              },
            },
          },
        },
      },
    });
  }

  async list(filter?: { status?: SubscriptionStatus; planId?: string; skip?: number; take?: number }) {
    const where: Prisma.TenantSubscriptionWhereInput = {};
    if (filter?.status) where.status = filter.status;
    if (filter?.planId) where.planId = filter.planId;

    const [items, total] = await Promise.all([
      prisma.tenantSubscription.findMany({
        where,
        include: {
          plan: true,
        },
        skip: filter?.skip || 0,
        take: filter?.take || 50,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.tenantSubscription.count({ where }),
    ]);

    return { items, total };
  }

  async create(data: {
    tenantId: string;
    planId: string;
    status?: SubscriptionStatus;
    startsAt?: Date;
    trialEndsAt?: Date;
    currentPeriodStart: Date;
    currentPeriodEnd: Date;
    provider?: string;
    providerSubscriptionId?: string;
  }) {
    return prisma.tenantSubscription.create({
      data: {
        tenantId: data.tenantId,
        planId: data.planId,
        status: data.status || SubscriptionStatus.TRIALING,
        startsAt: data.startsAt || new Date(),
        trialEndsAt: data.trialEndsAt,
        currentPeriodStart: data.currentPeriodStart,
        currentPeriodEnd: data.currentPeriodEnd,
        provider: data.provider,
        providerSubscriptionId: data.providerSubscriptionId,
      },
      include: {
        plan: {
          include: {
            planFeatures: {
              include: {
                feature: true,
              },
            },
          },
        },
      },
    });
  }

  async update(
    tenantId: string,
    data: {
      planId?: string;
      status?: SubscriptionStatus;
      trialEndsAt?: Date | null;
      currentPeriodStart?: Date;
      currentPeriodEnd?: Date;
      cancelAtPeriodEnd?: boolean;
      cancelledAt?: Date | null;
      provider?: string;
      providerSubscriptionId?: string;
    }
  ) {
    return prisma.tenantSubscription.update({
      where: { tenantId },
      data,
      include: {
        plan: {
          include: {
            planFeatures: {
              include: {
                feature: true,
              },
            },
          },
        },
      },
    });
  }

  // Feature Overrides
  async findOverridesByTenantId(tenantId: string) {
    return prisma.tenantFeatureOverride.findMany({
      where: { tenantId },
      include: {
        feature: true,
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async findOverride(tenantId: string, featureId: string) {
    return prisma.tenantFeatureOverride.findUnique({
      where: {
        tenantId_featureId: {
          tenantId,
          featureId,
        },
      },
      include: {
        feature: true,
      },
    });
  }

  async upsertOverride(data: {
    tenantId: string;
    featureId: string;
    enabled?: boolean;
    limitValue?: number;
    configJson?: any;
    reason?: string;
    effectiveFrom?: Date;
    effectiveTo?: Date;
  }) {
    return prisma.tenantFeatureOverride.upsert({
      where: {
        tenantId_featureId: {
          tenantId: data.tenantId,
          featureId: data.featureId,
        },
      },
      create: {
        tenantId: data.tenantId,
        featureId: data.featureId,
        enabled: data.enabled,
        limitValue: data.limitValue,
        configJson: data.configJson,
        reason: data.reason,
        effectiveFrom: data.effectiveFrom || new Date(),
        effectiveTo: data.effectiveTo,
      },
      update: {
        enabled: data.enabled,
        limitValue: data.limitValue,
        configJson: data.configJson,
        reason: data.reason,
        effectiveFrom: data.effectiveFrom,
        effectiveTo: data.effectiveTo,
      },
      include: {
        feature: true,
      },
    });
  }

  async deleteOverride(tenantId: string, featureId: string) {
    return prisma.tenantFeatureOverride.delete({
      where: {
        tenantId_featureId: {
          tenantId,
          featureId,
        },
      },
    });
  }
}
