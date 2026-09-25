import { NotFoundError } from '@salon-spa-saas/common-types';
import type { CreateMembershipRequest } from '@salon-spa-saas/contracts';
import { DOMAIN_EVENTS } from '@salon-spa-saas/events';
import type { MembershipMasterDto } from '../../domain/entities/commerce.dto';
import { commerceEventPublisher } from '../../infrastructure/messaging/publisher';
import { membershipRepository } from '../../infrastructure/repositories/membership.repository';

export class MembershipService {
  public async listMemberships(tenantId: string): Promise<MembershipMasterDto[]> {
    return membershipRepository.list(tenantId);
  }

  public async getMembershipById(tenantId: string, id: string): Promise<MembershipMasterDto> {
    const record = await membershipRepository.findById(tenantId, id);
    if (!record) throw new NotFoundError('Membership plan not found');
    return record;
  }

  public async createMembership(
    tenantId: string,
    input: CreateMembershipRequest,
    userId: string | null = null,
    correlationId?: string,
  ): Promise<MembershipMasterDto> {
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

  public async updateMembership(
    tenantId: string,
    id: string,
    input: Partial<CreateMembershipRequest>,
  ): Promise<MembershipMasterDto> {
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

  public async listBenefits(tenantId: string) {
    return membershipRepository.listMembershipBenefits(tenantId);
  }

  public async createBenefit(
    tenantId: string,
    input: {
      membershipPlanId?: string;
      perkName: string;
      category?: string;
      discountValue: string;
      applicableScope?: string;
      usageLimit?: string;
      status?: string;
    },
  ) {
    return membershipRepository.createMembershipBenefit({
      tenantId,
      ...input,
    });
  }

  public async listRenewals(tenantId: string) {
    return membershipRepository.listRenewals(tenantId);
  }

  public async renewMembership(
    tenantId: string,
    customerMembershipId: string,
    renewalMonths?: number,
  ) {
    return membershipRepository.renewMembership({
      tenantId,
      customerMembershipId,
      renewalMonths,
    });
  }
}

export const membershipService = new MembershipService();
