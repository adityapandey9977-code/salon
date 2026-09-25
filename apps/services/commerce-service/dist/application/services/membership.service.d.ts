import type { CreateMembershipRequest } from '@salon-spa-saas/contracts';
import type { MembershipMasterDto } from '../../domain/entities/commerce.dto';
export declare class MembershipService {
    listMemberships(tenantId: string): Promise<MembershipMasterDto[]>;
    getMembershipById(tenantId: string, id: string): Promise<MembershipMasterDto>;
    createMembership(tenantId: string, input: CreateMembershipRequest, userId?: string | null, correlationId?: string): Promise<MembershipMasterDto>;
    updateMembership(tenantId: string, id: string, input: Partial<CreateMembershipRequest>): Promise<MembershipMasterDto>;
    listBenefits(tenantId: string): Promise<any[]>;
    createBenefit(tenantId: string, input: {
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
    renewMembership(tenantId: string, customerMembershipId: string, renewalMonths?: number): Promise<({
        membership: {
            tenantId: string;
            id: string;
            name: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            isActive: boolean;
            price: import("../../infrastructure/prisma/generated-client/runtime/library").Decimal;
            billingPeriod: string;
            discountPercentage: import("../../infrastructure/prisma/generated-client/runtime/library").Decimal;
            benefitsJson: import("../../infrastructure/prisma/generated-client/runtime/library").JsonValue | null;
            pointsMultiplier: import("../../infrastructure/prisma/generated-client/runtime/library").Decimal | null;
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
export declare const membershipService: MembershipService;
//# sourceMappingURL=membership.service.d.ts.map