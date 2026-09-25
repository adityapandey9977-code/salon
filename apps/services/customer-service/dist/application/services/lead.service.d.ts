import type { ConvertLeadRequest, CreateLeadRequest, UpdateLeadStatusRequest } from '@salon-spa-saas/contracts';
import type { LeadDto } from '../../domain/entities/customer.dto';
export declare class LeadService {
    getLeadById(tenantId: string, id: string): Promise<LeadDto | null>;
    listLeads(tenantId: string, filters: {
        status?: any;
        branchId?: string;
        page: number;
        limit: number;
    }): Promise<{
        items: LeadDto[];
        total: number;
        page: number;
        limit: number;
    }>;
    createLead(tenantId: string, input: CreateLeadRequest, userId?: string | null, correlationId?: string): Promise<LeadDto>;
    updateLeadStatus(tenantId: string, id: string, input: UpdateLeadStatusRequest, userId?: string | null, correlationId?: string): Promise<LeadDto>;
    convertLead(tenantId: string, id: string, input: ConvertLeadRequest, userId?: string | null, correlationId?: string): Promise<{
        lead: LeadDto;
        customer: any;
    }>;
}
export declare const leadService: LeadService;
//# sourceMappingURL=lead.service.d.ts.map