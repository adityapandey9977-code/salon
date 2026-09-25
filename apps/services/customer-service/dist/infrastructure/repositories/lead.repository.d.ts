import type { LeadDto } from '../../domain/entities/customer.dto';
import type { LeadStatus } from '../prisma/generated-client';
export declare class LeadRepository {
    private toDto;
    findById(tenantId: string, id: string): Promise<LeadDto | null>;
    list(tenantId: string, filters: {
        status?: LeadStatus;
        branchId?: string;
        page: number;
        limit: number;
    }): Promise<{
        items: LeadDto[];
        total: number;
        page: number;
        limit: number;
    }>;
    create(data: {
        tenantId: string;
        firstName: string;
        lastName?: string | null;
        mobilePhone: string;
        normalizedMobile: string;
        email?: string | null;
        normalizedEmail?: string | null;
        source?: any;
        preferredBranchId?: string | null;
        interestedServiceId?: string | null;
        assignedIdentityUserId?: string | null;
        inquiryNotes?: string | null;
    }): Promise<LeadDto>;
    updateStatus(tenantId: string, id: string, status: LeadStatus, notes?: string | null): Promise<LeadDto>;
    markConverted(tenantId: string, id: string, customerId: string): Promise<LeadDto>;
}
export declare const leadRepository: LeadRepository;
//# sourceMappingURL=lead.repository.d.ts.map