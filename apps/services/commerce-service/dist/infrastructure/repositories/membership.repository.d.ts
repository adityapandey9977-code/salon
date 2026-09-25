import type { MembershipMasterDto } from '../../domain/entities/commerce.dto';
import { Prisma } from '../prisma/generated-client';
export declare class MembershipRepository {
    private toDto;
    findById(tenantId: string, id: string): Promise<MembershipMasterDto | null>;
    list(tenantId: string): Promise<MembershipMasterDto[]>;
    create(data: {
        tenantId: string;
        name: string;
        description?: string | null;
        price: number;
        billingPeriod?: string;
        discountPercentage?: number;
        benefitsJson?: any;
        isActive?: boolean;
        pointsMultiplier?: number | null;
        membersCount?: number;
        perksText?: string | null;
    }): Promise<MembershipMasterDto>;
    update(tenantId: string, id: string, data: {
        name?: string;
        description?: string | null;
        price?: number;
        billingPeriod?: string;
        discountPercentage?: number;
        benefitsJson?: any;
        isActive?: boolean;
        pointsMultiplier?: number | null;
        membersCount?: number;
        perksText?: string | null;
    }): Promise<MembershipMasterDto>;
    createCustomerMembership(data: {
        tenantId: string;
        customerId: string;
        membershipPlanId: string;
        durationMonths?: number;
    }): Promise<{
        tenantId: string;
        status: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        customerId: string;
        startsAt: Date;
        membershipPlanId: string;
        expiresAt: Date | null;
    }>;
    listMembershipBenefits(tenantId: string): Promise<any[]>;
    createMembershipBenefit(data: {
        tenantId: string;
        membershipPlanId?: string;
        perkName: string;
        category?: string;
        discountValue: string;
        applicableScope?: string;
        usageLimit?: string;
        status?: string;
    }): Promise<{
        id: string;
        perkName: string;
        tierName: string;
        category: string;
        discountValue: string;
        applicableScope: string;
        usageLimit: string;
        status: string;
    }>;
    listRenewals(tenantId: string): Promise<{
        id: string;
        memberCode: string;
        clientName: string;
        tierName: string;
        expiresAt: string;
        daysRemaining: number;
        status: string;
        lastRenewedAmount: number;
        autoRenewal: boolean;
    }[]>;
    renewMembership(data: {
        tenantId: string;
        customerMembershipId: string;
        renewalMonths?: number;
    }): Promise<({
        membership: {
            tenantId: string;
            id: string;
            name: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            isActive: boolean;
            price: Prisma.Decimal;
            billingPeriod: string;
            discountPercentage: Prisma.Decimal;
            benefitsJson: Prisma.JsonValue | null;
            pointsMultiplier: Prisma.Decimal | null;
            membersCount: number;
            perksText: string | null;
        };
    } & {
        tenantId: string;
        status: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        customerId: string;
        startsAt: Date;
        membershipPlanId: string;
        expiresAt: Date | null;
    }) | {
        id: string;
        status: string;
        renewedAt: string;
    }>;
}
export declare const membershipRepository: MembershipRepository;
//# sourceMappingURL=membership.repository.d.ts.map