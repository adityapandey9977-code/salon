import { DOMAIN_EVENTS } from '@salon-spa-saas/events';
import { normalizeEmail, normalizePhoneNumber } from '../../domain/normalization/phone-email';
import { customerEventPublisher } from '../../infrastructure/messaging/publisher';
import { leadRepository } from '../../infrastructure/repositories/lead.repository';
import { customerService } from './customer.service';
export class LeadService {
    async getLeadById(tenantId, id) {
        return leadRepository.findById(tenantId, id);
    }
    async listLeads(tenantId, filters) {
        return leadRepository.list(tenantId, filters);
    }
    async createLead(tenantId, input, userId = null, correlationId) {
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
    async updateLeadStatus(tenantId, id, input, userId = null, correlationId) {
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
    async convertLead(tenantId, id, input, userId = null, correlationId) {
        const lead = await leadRepository.findById(tenantId, id);
        if (!lead)
            throw new Error('Lead not found');
        // Create Customer
        const customer = await customerService.createCustomer(tenantId, {
            firstName: lead.firstName,
            lastName: lead.lastName,
            mobilePhone: lead.mobilePhone,
            email: lead.email,
            gender: 'UNSPECIFIED',
            status: 'ACTIVE',
            source: lead.source,
            preferredBranchId: input.preferredBranchId || lead.preferredBranchId,
            notes: input.notes || lead.inquiryNotes,
        }, userId, correlationId);
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
