import { prisma } from '../prisma/client';
import { SubscriptionStatus } from '../prisma/generated-client';
export class SubscriptionRepository {
    async findByTenantId(tenantId) {
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
    async findById(id) {
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
    async list(filter) {
        const where = {};
        if (filter?.status)
            where.status = filter.status;
        if (filter?.planId)
            where.planId = filter.planId;
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
    async create(data) {
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
    async update(tenantId, data) {
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
    async findOverridesByTenantId(tenantId) {
        return prisma.tenantFeatureOverride.findMany({
            where: { tenantId },
            include: {
                feature: true,
            },
            orderBy: { createdAt: 'asc' },
        });
    }
    async findOverride(tenantId, featureId) {
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
    async upsertOverride(data) {
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
    async deleteOverride(tenantId, featureId) {
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
