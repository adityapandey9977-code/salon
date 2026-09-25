import { NotFoundError } from '@salon-spa-saas/common-types';
import { DOMAIN_EVENTS } from '@salon-spa-saas/events';
import { commerceEventPublisher } from '../../infrastructure/messaging/publisher';
import { membershipRepository } from '../../infrastructure/repositories/membership.repository';
export class MembershipService {
    async listMemberships(tenantId) {
        return membershipRepository.list(tenantId);
    }
    async getMembershipById(tenantId, id) {
        const record = await membershipRepository.findById(tenantId, id);
        if (!record)
            throw new NotFoundError('Membership plan not found');
        return record;
    }
    async createMembership(tenantId, input, userId = null, correlationId) {
        const created = await membershipRepository.create({
            tenantId,
            name: input.name,
            description: input.description,
            price: input.price,
            billingPeriod: input.billingPeriod,
            discountPercentage: input.discountPercentage,
            benefitsJson: input.benefitsJson,
            isActive: input.isActive,
            pointsMultiplier: input.pointsMultiplier,
            membersCount: input.membersCount,
            perksText: input.perksText,
        });
        await commerceEventPublisher.publish({
            eventType: DOMAIN_EVENTS.MEMBERSHIP_ACTIVATED,
            aggregateType: 'MembershipPlan',
            aggregateId: created.id,
            tenantId,
            userId,
            correlationId,
            payload: {
                tenantId,
                membershipId: created.id,
                planName: created.name,
                price: created.price,
            },
        });
        return created;
    }
    async updateMembership(tenantId, id, input) {
        return membershipRepository.update(tenantId, id, {
            name: input.name,
            description: input.description,
            price: input.price,
            billingPeriod: input.billingPeriod,
            discountPercentage: input.discountPercentage,
            benefitsJson: input.benefitsJson,
            isActive: input.isActive,
            pointsMultiplier: input.pointsMultiplier,
            membersCount: input.membersCount,
            perksText: input.perksText,
        });
    }
    async listBenefits(tenantId) {
        return membershipRepository.listMembershipBenefits(tenantId);
    }
    async createBenefit(tenantId, input) {
        return membershipRepository.createMembershipBenefit({
            tenantId,
            ...input,
        });
    }
    async listRenewals(tenantId) {
        return membershipRepository.listRenewals(tenantId);
    }
    async renewMembership(tenantId, customerMembershipId, renewalMonths) {
        return membershipRepository.renewMembership({
            tenantId,
            customerMembershipId,
            renewalMonths,
        });
    }
}
export const membershipService = new MembershipService();
