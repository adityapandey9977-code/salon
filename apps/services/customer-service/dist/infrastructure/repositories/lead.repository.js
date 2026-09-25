import { NotFoundError } from '@salon-spa-saas/common-types';
import { prisma } from '../prisma/client';
export class LeadRepository {
    toDto(item) {
        return {
            id: item.id,
            tenantId: item.tenantId,
            firstName: item.firstName,
            lastName: item.lastName,
            mobilePhone: item.mobilePhone,
            email: item.email,
            source: item.source,
            status: item.status,
            preferredBranchId: item.preferredBranchId,
            interestedServiceId: item.interestedServiceId,
            assignedIdentityUserId: item.assignedIdentityUserId,
            inquiryNotes: item.inquiryNotes,
            convertedCustomerId: item.convertedCustomerId,
            convertedAt: item.convertedAt ? item.convertedAt.toISOString() : null,
            createdAt: item.createdAt.toISOString(),
            updatedAt: item.updatedAt.toISOString(),
        };
    }
    async findById(tenantId, id) {
        const record = await prisma.lead.findFirst({
            where: { id, tenantId },
        });
        if (!record)
            return null;
        return this.toDto(record);
    }
    async list(tenantId, filters) {
        const where = { tenantId };
        if (filters.status)
            where.status = filters.status;
        if (filters.branchId)
            where.preferredBranchId = filters.branchId;
        const skip = (filters.page - 1) * filters.limit;
        const [total, records] = await Promise.all([
            prisma.lead.count({ where }),
            prisma.lead.findMany({
                where,
                skip,
                take: filters.limit,
                orderBy: { createdAt: 'desc' },
            }),
        ]);
        return {
            items: records.map((r) => this.toDto(r)),
            total,
            page: filters.page,
            limit: filters.limit,
        };
    }
    async create(data) {
        const record = await prisma.lead.create({
            data: {
                tenantId: data.tenantId,
                firstName: data.firstName,
                lastName: data.lastName,
                mobilePhone: data.mobilePhone,
                normalizedMobile: data.normalizedMobile,
                email: data.email,
                normalizedEmail: data.normalizedEmail,
                source: data.source || 'WALK_IN',
                status: 'NEW',
                preferredBranchId: data.preferredBranchId,
                interestedServiceId: data.interestedServiceId,
                assignedIdentityUserId: data.assignedIdentityUserId,
                inquiryNotes: data.inquiryNotes,
            },
        });
        return this.toDto(record);
    }
    async updateStatus(tenantId, id, status, notes) {
        const existing = await prisma.lead.findFirst({ where: { id, tenantId } });
        if (!existing)
            throw new NotFoundError('Lead not found');
        const updated = await prisma.lead.update({
            where: { id },
            data: {
                status,
                inquiryNotes: notes !== undefined ? notes : existing.inquiryNotes,
            },
        });
        return this.toDto(updated);
    }
    async markConverted(tenantId, id, customerId) {
        const existing = await prisma.lead.findFirst({ where: { id, tenantId } });
        if (!existing)
            throw new NotFoundError('Lead not found');
        const updated = await prisma.lead.update({
            where: { id },
            data: {
                status: 'CONVERTED',
                convertedCustomerId: customerId,
                convertedAt: new Date(),
            },
        });
        return this.toDto(updated);
    }
}
export const leadRepository = new LeadRepository();
