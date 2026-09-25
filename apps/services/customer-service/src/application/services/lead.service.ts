import type {
  ConvertLeadRequest,
  CreateLeadRequest,
  UpdateLeadStatusRequest,
} from '@salon-spa-saas/contracts';
import { DOMAIN_EVENTS } from '@salon-spa-saas/events';
import type { LeadDto } from '../../domain/entities/customer.dto';
import { normalizeEmail, normalizePhoneNumber } from '../../domain/normalization/phone-email';
import { customerEventPublisher } from '../../infrastructure/messaging/publisher';
import { leadRepository } from '../../infrastructure/repositories/lead.repository';
import { customerService } from './customer.service';

export class LeadService {
  public async getLeadById(tenantId: string, id: string): Promise<LeadDto | null> {
    return leadRepository.findById(tenantId, id);
  }

  public async listLeads(
    tenantId: string,
    filters: { status?: any; branchId?: string; page: number; limit: number },
  ): Promise<{ items: LeadDto[]; total: number; page: number; limit: number }> {
    return leadRepository.list(tenantId, filters);
  }

  public async createLead(
    tenantId: string,
    input: CreateLeadRequest,
    userId: string | null = null,
    correlationId?: string,
  ): Promise<LeadDto> {
    const normalizedMobile = normalizePhoneNumber(input.mobilePhone);
    const normalizedEmail = normalizeEmail(input.email);

    const lead = await leadRepository.create({
      tenantId,
      firstName: input.firstName,
      lastName: input.lastName,
      mobilePhone: input.mobilePhone,
      normalizedMobile,
      email: input.email,
      normalizedEmail,
      source: input.source,
      preferredBranchId: input.preferredBranchId,
      interestedServiceId: input.interestedServiceId,
      assignedIdentityUserId: input.assignedIdentityUserId,
      inquiryNotes: input.inquiryNotes,
    });

    await customerEventPublisher.publish({
      eventType: DOMAIN_EVENTS.LEAD_CREATED,
      aggregateType: 'Lead',
      aggregateId: lead.id,
      tenantId,
      userId,
      correlationId,
      payload: {
        tenantId,
        leadId: lead.id,
        firstName: lead.firstName,
        mobilePhone: lead.mobilePhone,
        status: lead.status,
      },
    });

    return lead;
  }

  public async updateLeadStatus(
    tenantId: string,
    id: string,
    input: UpdateLeadStatusRequest,
    userId: string | null = null,
    correlationId?: string,
  ): Promise<LeadDto> {
    const updated = await leadRepository.updateStatus(tenantId, id, input.status, input.notes);

    await customerEventPublisher.publish({
      eventType: DOMAIN_EVENTS.LEAD_STATUS_CHANGED,
      aggregateType: 'Lead',
      aggregateId: id,
      tenantId,
      userId,
      correlationId,
      payload: {
        tenantId,
        leadId: id,
        status: updated.status,
        notes: input.notes,
      },
    });

    return updated;
  }

  public async convertLead(
    tenantId: string,
    id: string,
    input: ConvertLeadRequest,
    userId: string | null = null,
    correlationId?: string,
  ): Promise<{ lead: LeadDto; customer: any }> {
    const lead = await leadRepository.findById(tenantId, id);
    if (!lead) throw new Error('Lead not found');

    // Create Customer
    const customer = await customerService.createCustomer(
      tenantId,
      {
        firstName: lead.firstName,
        lastName: lead.lastName,
        mobilePhone: lead.mobilePhone,
        email: lead.email,
        gender: 'UNSPECIFIED',
        status: 'ACTIVE',
        source: lead.source,
        preferredBranchId: input.preferredBranchId || lead.preferredBranchId,
        notes: input.notes || lead.inquiryNotes,
      },
      userId,
      correlationId,
    );

    // Update Lead to Converted
    const updatedLead = await leadRepository.markConverted(tenantId, id, customer.id);

    await customerEventPublisher.publish({
      eventType: DOMAIN_EVENTS.LEAD_CONVERTED,
      aggregateType: 'Lead',
      aggregateId: id,
      tenantId,
      userId,
      correlationId,
      payload: {
        tenantId,
        leadId: id,
        clientId: customer.id,
        convertedAt: new Date().toISOString(),
      },
    });

    return { lead: updatedLead, customer };
  }
}

export const leadService = new LeadService();
