import { NotFoundError } from '@salon-spa-saas/common-types';
import type { LeadDto } from '../../domain/entities/customer.dto';
import { prisma } from '../prisma/client';
import type { Lead, LeadStatus, Prisma } from '../prisma/generated-client';

export class LeadRepository {
  private toDto(item: Lead): LeadDto {
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

  public async findById(tenantId: string, id: string): Promise<LeadDto | null> {
    const record = await prisma.lead.findFirst({
      where: { id, tenantId },
    });
    if (!record) return null;
    return this.toDto(record);
  }

  public async list(
    tenantId: string,
    filters: {
      status?: LeadStatus;
      branchId?: string;
      page: number;
      limit: number;
    },
  ): Promise<{ items: LeadDto[]; total: number; page: number; limit: number }> {
    const where: Prisma.LeadWhereInput = { tenantId };
    if (filters.status) where.status = filters.status;
    if (filters.branchId) where.preferredBranchId = filters.branchId;

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

  public async create(data: {
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
  }): Promise<LeadDto> {
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

  public async updateStatus(
    tenantId: string,
    id: string,
    status: LeadStatus,
    notes?: string | null,
  ): Promise<LeadDto> {
    const existing = await prisma.lead.findFirst({ where: { id, tenantId } });
    if (!existing) throw new NotFoundError('Lead not found');

    const updated = await prisma.lead.update({
      where: { id },
      data: {
        status,
        inquiryNotes: notes !== undefined ? notes : existing.inquiryNotes,
      },
    });

    return this.toDto(updated);
  }

  public async markConverted(
    tenantId: string,
    id: string,
    customerId: string,
  ): Promise<LeadDto> {
    const existing = await prisma.lead.findFirst({ where: { id, tenantId } });
    if (!existing) throw new NotFoundError('Lead not found');

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
