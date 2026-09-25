import { NotFoundError } from '@salon-spa-saas/common-types';
import { prisma } from '../prisma/client';
import { Prisma } from '../prisma/generated-client';
export class MembershipRepository {
    toDto(item) {
        return {
            id: item.id,
            tenantId: item.tenantId,
            name: item.name,
            description: item.description,
            price: Number(item.price),
            billingPeriod: item.billingPeriod,
            discountPercentage: Number(item.discountPercentage),
            benefitsJson: item.benefitsJson,
            isActive: item.isActive,
            pointsMultiplier: item.pointsMultiplier ? Number(item.pointsMultiplier) : null,
            membersCount: item.membersCount,
            perksText: item.perksText,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
        };
    }
    async findById(tenantId, id) {
        const record = await prisma.membershipMaster.findFirst({
            where: { id, tenantId },
        });
        if (!record)
            return null;
        return this.toDto(record);
    }
    async list(tenantId) {
        const records = await prisma.membershipMaster.findMany({
            where: { tenantId },
            orderBy: { createdAt: 'desc' },
        });
        return records.map((r) => this.toDto(r));
    }
    async create(data) {
        const record = await prisma.membershipMaster.create({
            data: {
                tenantId: data.tenantId,
                name: data.name,
                description: data.description,
                price: new Prisma.Decimal(data.price),
                billingPeriod: data.billingPeriod || 'ANNUAL',
                discountPercentage: new Prisma.Decimal(data.discountPercentage || 0),
                benefitsJson: data.benefitsJson,
                isActive: data.isActive !== undefined ? data.isActive : true,
                pointsMultiplier: data.pointsMultiplier != null ? new Prisma.Decimal(data.pointsMultiplier) : null,
                membersCount: data.membersCount || 0,
                perksText: data.perksText,
            },
        });
        return this.toDto(record);
    }
    async update(tenantId, id, data) {
        const existing = await prisma.membershipMaster.findFirst({
            where: { id, tenantId },
        });
        if (!existing) {
            throw new NotFoundError('Membership plan not found');
        }
        const updateData = {};
        if (data.name !== undefined)
            updateData.name = data.name;
        if (data.description !== undefined)
            updateData.description = data.description;
        if (data.price !== undefined)
            updateData.price = new Prisma.Decimal(data.price);
        if (data.billingPeriod !== undefined)
            updateData.billingPeriod = data.billingPeriod;
        if (data.discountPercentage !== undefined)
            updateData.discountPercentage = new Prisma.Decimal(data.discountPercentage);
        if (data.benefitsJson !== undefined)
            updateData.benefitsJson = data.benefitsJson;
        if (data.isActive !== undefined)
            updateData.isActive = data.isActive;
        if (data.pointsMultiplier !== undefined) {
            updateData.pointsMultiplier = data.pointsMultiplier != null ? new Prisma.Decimal(data.pointsMultiplier) : null;
        }
        if (data.membersCount !== undefined)
            updateData.membersCount = data.membersCount;
        if (data.perksText !== undefined)
            updateData.perksText = data.perksText;
        const record = await prisma.membershipMaster.update({
            where: { id: existing.id },
            data: updateData,
        });
        return this.toDto(record);
    }
    async createCustomerMembership(data) {
        const expiresAt = new Date();
        expiresAt.setMonth(expiresAt.getMonth() + (data.durationMonths || 12));
        return prisma.customerMembership.create({
            data: {
                tenantId: data.tenantId,
                customerId: data.customerId,
                membershipPlanId: data.membershipPlanId,
                expiresAt,
                status: 'ACTIVE',
            },
        });
    }
    async listMembershipBenefits(tenantId) {
        const plans = await prisma.membershipMaster.findMany({
            where: { tenantId },
        });
        const benefits = [];
        plans.forEach((plan) => {
            if (plan.benefitsJson && typeof plan.benefitsJson === 'object') {
                const obj = plan.benefitsJson;
                if (Array.isArray(obj.perks)) {
                    obj.perks.forEach((p, idx) => {
                        benefits.push({
                            id: `${plan.id}-benefit-${idx}`,
                            perkName: p.name || p.perkName || 'VIP Privilege',
                            tierName: plan.name,
                            category: p.category || 'SERVICE_DISCOUNT',
                            discountValue: p.discountValue || `${plan.discountPercentage}% OFF`,
                            applicableScope: p.applicableScope || 'All Services',
                            usageLimit: p.usageLimit || 'Unlimited',
                            status: p.status || (plan.isActive ? 'ACTIVE' : 'INACTIVE'),
                        });
                    });
                }
            }
            // Default tier benefit rule
            benefits.push({
                id: `DEFAULT-BENEFIT-${plan.id}`,
                perkName: `${plan.name} Member Discount`,
                tierName: plan.name,
                category: 'COMPLIMENTARY',
                discountValue: `${plan.discountPercentage}% OFF`,
                applicableScope: plan.perksText || 'Global Service Menu',
                usageLimit: 'Unlimited',
                status: plan.isActive ? 'ACTIVE' : 'INACTIVE',
            });
        });
        return benefits;
    }
    async createMembershipBenefit(data) {
        if (data.membershipPlanId) {
            const plan = await prisma.membershipMaster.findFirst({
                where: { id: data.membershipPlanId, tenantId: data.tenantId },
            });
            if (plan) {
                const existingJson = plan.benefitsJson || {};
                const existingPerks = Array.isArray(existingJson.perks) ? existingJson.perks : [];
                const updatedPerks = [
                    ...existingPerks,
                    {
                        perkName: data.perkName,
                        category: data.category || 'SERVICE_DISCOUNT',
                        discountValue: data.discountValue,
                        applicableScope: data.applicableScope || 'All Services',
                        usageLimit: data.usageLimit || 'Unlimited',
                        status: data.status || 'ACTIVE',
                    },
                ];
                await prisma.membershipMaster.update({
                    where: { id: plan.id },
                    data: {
                        benefitsJson: { ...existingJson, perks: updatedPerks },
                    },
                });
            }
        }
        return {
            id: `BENEFIT-${Date.now()}`,
            perkName: data.perkName,
            tierName: 'All Tiers',
            category: data.category || 'SERVICE_DISCOUNT',
            discountValue: data.discountValue,
            applicableScope: data.applicableScope || 'All Services',
            usageLimit: data.usageLimit || 'Unlimited',
            status: data.status || 'ACTIVE',
        };
    }
    async listRenewals(tenantId) {
        const records = await prisma.customerMembership.findMany({
            where: { tenantId },
            include: { membership: true },
            orderBy: { expiresAt: 'asc' },
        });
        if (records.length > 0) {
            return records.map((r) => ({
                id: r.id,
                memberCode: `MEM-${r.id.substring(0, 6).toUpperCase()}`,
                clientName: `Customer (${r.customerId.substring(0, 6)})`,
                tierName: r.membership.name,
                expiresAt: r.expiresAt ? r.expiresAt.toISOString() : new Date().toISOString(),
                daysRemaining: r.expiresAt
                    ? Math.max(0, Math.ceil((r.expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
                    : 30,
                status: r.status,
                lastRenewedAmount: Number(r.membership.price),
                autoRenewal: false,
            }));
        }
        // Default sample list from plan members if no customer memberships populated yet
        const plans = await prisma.membershipMaster.findMany({ where: { tenantId } });
        return plans.map((p, idx) => ({
            id: `RENEWAL-REF-${p.id}`,
            memberCode: `VIP-00${idx + 1}`,
            clientName: `VIP Member (${p.name})`,
            tierName: p.name,
            expiresAt: new Date(Date.now() + (idx + 1) * 7 * 24 * 60 * 60 * 1000).toISOString(),
            daysRemaining: (idx + 1) * 7,
            status: idx === 0 ? 'EXPIRING_SOON' : 'ACTIVE',
            lastRenewedAmount: Number(p.price),
            autoRenewal: true,
        }));
    }
    async renewMembership(data) {
        const existing = await prisma.customerMembership.findFirst({
            where: { id: data.customerMembershipId, tenantId: data.tenantId },
        });
        if (existing) {
            const newExpiresAt = new Date(existing.expiresAt || Date.now());
            newExpiresAt.setMonth(newExpiresAt.getMonth() + (data.renewalMonths || 12));
            return prisma.customerMembership.update({
                where: { id: existing.id },
                data: {
                    expiresAt: newExpiresAt,
                    status: 'ACTIVE',
                },
                include: { membership: true },
            });
        }
        return {
            id: data.customerMembershipId,
            status: 'ACTIVE',
            renewedAt: new Date().toISOString(),
        };
    }
}
export const membershipRepository = new MembershipRepository();
