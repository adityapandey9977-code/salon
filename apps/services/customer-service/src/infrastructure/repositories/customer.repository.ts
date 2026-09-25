import { ConflictError, NotFoundError } from '@salon-spa-saas/common-types';
import type { CachedCustomer, CustomerSummaryDto } from '../../domain/entities/customer.dto';
import { prisma } from '../prisma/client';
import {
  Prisma,
  type Customer,
  type CustomerAddress,
  type CustomerCaution,
  type CustomerNote,
  type CustomerPreference,
  type CustomerStatus,
  type CustomerTag,
  type CustomerTagMapping,
} from '../prisma/generated-client';

type CustomerWithRelations = Customer & {
  addresses?: CustomerAddress[];
  preferences?: CustomerPreference | null;
  cautions?: CustomerCaution[];
  notesList?: CustomerNote[];
  tagMappings?: (CustomerTagMapping & { tag: CustomerTag })[];
};

export class CustomerRepository {
  private toDto(item: CustomerWithRelations): CachedCustomer {
    return {
      id: item.id,
      tenantId: item.tenantId,
      customerCode: item.customerCode,
      firstName: item.firstName,
      lastName: item.lastName,
      displayName: item.displayName,
      email: item.email,
      mobilePhone: item.mobilePhone,
      alternatePhone: item.alternatePhone,
      gender: item.gender,
      dateOfBirth: item.dateOfBirth ? item.dateOfBirth.toISOString().split('T')[0] : null,
      status: item.status,
      preferredBranchId: item.preferredBranchId,
      franchiseId: item.franchiseId || null,
      source: item.source,
      notes: item.notes,
      avatarUrl: (item as any).avatarUrl || null,
      segment: (item as any).segment || 'New Client',
      totalVisits: item.totalVisits,
      totalSpent: Number(item.totalSpent),
      lastVisitAt: item.lastVisitAt ? item.lastVisitAt.toISOString() : null,
      firstVisitAt: item.firstVisitAt ? item.firstVisitAt.toISOString() : null,
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
      addresses: item.addresses?.map((a) => ({
        id: a.id,
        type: a.type,
        addressLine1: a.addressLine1,
        addressLine2: a.addressLine2,
        city: a.city,
        state: a.state,
        postalCode: a.postalCode,
        country: a.country,
        isDefault: a.isDefault,
      })),
      preferences: item.preferences
        ? {
            preferredBranchId: item.preferences.preferredBranchId,
            preferredStaffId: item.preferences.preferredStaffId,
            preferredCommunicationChannel: item.preferences.preferredCommunicationChannel,
            language: item.preferences.language,
            appointmentReminderEnabled: item.preferences.appointmentReminderEnabled,
            marketingConsent: item.preferences.marketingConsent,
          }
        : null,
      tags: item.tagMappings?.map((tm) => tm.tag.name),
    };
  }

  private toSummaryDto(item: Customer): CustomerSummaryDto {
    return {
      id: item.id,
      tenantId: item.tenantId,
      customerCode: item.customerCode,
      firstName: item.firstName,
      lastName: item.lastName,
      displayName: item.displayName,
      mobilePhone: item.mobilePhone,
      email: item.email,
      dateOfBirth: item.dateOfBirth ? item.dateOfBirth.toISOString().split('T')[0] : null,
      gender: item.gender,
      status: item.status,
      preferredBranchId: item.preferredBranchId,
      franchiseId: item.franchiseId || null,
      avatarUrl: (item as any).avatarUrl || null,
      segment: (item as any).segment || 'New Client',
      totalVisits: item.totalVisits,
      totalSpent: Number(item.totalSpent),
      lastVisitAt: item.lastVisitAt ? item.lastVisitAt.toISOString() : null,
      firstVisitAt: item.firstVisitAt ? item.firstVisitAt.toISOString() : null,
      createdAt: item.createdAt.toISOString(),
    };
  }

  public async findById(tenantId: string, id: string): Promise<CachedCustomer | null> {
    const record = await prisma.customer.findFirst({
      where: { id, tenantId, deletedAt: null },
      include: {
        addresses: true,
        preferences: true,
        cautions: { where: { active: true } },
        tagMappings: { include: { tag: true } },
      },
    });

    if (!record) return null;
    return this.toDto(record);
  }

  public async findByNormalizedMobile(tenantId: string, normalizedMobile: string): Promise<CachedCustomer | null> {
    const record = await prisma.customer.findFirst({
      where: { tenantId, normalizedMobile, deletedAt: null },
      include: {
        addresses: true,
        preferences: true,
      },
    });

    if (!record) return null;
    return this.toDto(record);
  }

  public async findByNormalizedEmail(tenantId: string, normalizedEmail: string): Promise<CachedCustomer | null> {
    const record = await prisma.customer.findFirst({
      where: { tenantId, normalizedEmail, deletedAt: null },
      include: {
        addresses: true,
        preferences: true,
      },
    });

    if (!record) return null;
    return this.toDto(record);
  }

  public async list(
    tenantId: string,
    filters: {
      search?: string;
      mobilePhone?: string;
      email?: string;
      status?: CustomerStatus;
      branchId?: string;
      franchiseId?: string;
      hasFranchise?: boolean;
      source?: any;
      page: number;
      limit: number;
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
    },
  ): Promise<{ items: CustomerSummaryDto[]; total: number; page: number; limit: number }> {
    const where: Prisma.CustomerWhereInput = {
      tenantId,
      deletedAt: null,
    };

    if (filters.status) where.status = filters.status;
    if (filters.branchId) where.preferredBranchId = filters.branchId;
    if (filters.franchiseId) {
      where.franchiseId = filters.franchiseId;
    } else if (filters.hasFranchise) {
      where.franchiseId = { not: null };
    }
    if (filters.source) where.source = filters.source;
    if (filters.mobilePhone) where.normalizedMobile = { contains: filters.mobilePhone };
    if (filters.email) where.normalizedEmail = { contains: filters.email.toLowerCase() };

    if (filters.search) {
      where.OR = [
        { displayName: { contains: filters.search, mode: 'insensitive' } },
        { customerCode: { contains: filters.search, mode: 'insensitive' } },
        { normalizedMobile: { contains: filters.search } },
        { email: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    const skip = (filters.page - 1) * filters.limit;
    const [total, records] = await Promise.all([
      prisma.customer.count({ where }),
      prisma.customer.findMany({
        where,
        skip,
        take: filters.limit,
        orderBy: { [filters.sortBy || 'createdAt']: filters.sortOrder || 'desc' },
      }),
    ]);

    return {
      items: records.map((r) => this.toSummaryDto(r)),
      total,
      page: filters.page,
      limit: filters.limit,
    };
  }

  public async create(data: {
    tenantId: string;
    customerCode: string;
    firstName: string;
    lastName?: string | null;
    displayName: string;
    mobilePhone: string;
    normalizedMobile: string;
    email?: string | null;
    normalizedEmail?: string | null;
    alternatePhone?: string | null;
    gender?: any;
    dateOfBirth?: Date | null;
    status?: any;
    preferredBranchId?: string | null;
    franchiseId?: string | null;
    source?: any;
    notes?: string | null;
    avatarUrl?: string | null;
    segment?: string | null;
    address?: {
      type: string;
      addressLine1: string;
      addressLine2?: string | null;
      city: string;
      state: string;
      postalCode: string;
      country?: string;
      isDefault?: boolean;
    };
    preferences?: {
      preferredStaffId?: string | null;
      preferredCommunicationChannel?: string;
      language?: string;
      appointmentReminderEnabled?: boolean;
      marketingConsent?: boolean;
    };
    cautions?: Array<{
      type: string;
      title: string;
      description?: string | null;
      severity?: any;
    }>;
  }): Promise<CachedCustomer> {
    try {
      const record = await prisma.customer.create({
        data: {
          tenantId: data.tenantId,
          customerCode: data.customerCode,
          firstName: data.firstName,
          lastName: data.lastName,
          displayName: data.displayName,
          mobilePhone: data.mobilePhone,
          normalizedMobile: data.normalizedMobile,
          email: data.email,
          normalizedEmail: data.normalizedEmail,
          alternatePhone: data.alternatePhone,
          gender: data.gender || 'UNSPECIFIED',
          dateOfBirth: data.dateOfBirth,
          status: data.status || 'ACTIVE',
          preferredBranchId: data.preferredBranchId,
          franchiseId: data.franchiseId,
          source: data.source || 'WALK_IN',
          notes: data.notes,
          avatarUrl: data.avatarUrl || null,
          segment: (data as any).segment || 'New Client',
          addresses: data.address
            ? {
                create: {
                  tenantId: data.tenantId,
                  type: data.address.type || 'HOME',
                  addressLine1: data.address.addressLine1,
                  addressLine2: data.address.addressLine2,
                  city: data.address.city,
                  state: data.address.state,
                  postalCode: data.address.postalCode,
                  country: data.address.country || 'IN',
                  isDefault: data.address.isDefault !== undefined ? data.address.isDefault : true,
                },
              }
            : undefined,
          preferences: data.preferences
            ? {
                create: {
                  tenantId: data.tenantId,
                  preferredStaffId: data.preferences.preferredStaffId,
                  preferredCommunicationChannel: data.preferences.preferredCommunicationChannel || 'WHATSAPP',
                  language: data.preferences.language || 'en',
                  appointmentReminderEnabled:
                    data.preferences.appointmentReminderEnabled !== undefined
                      ? data.preferences.appointmentReminderEnabled
                      : true,
                  marketingConsent:
                    data.preferences.marketingConsent !== undefined ? data.preferences.marketingConsent : true,
                },
              }
            : undefined,
          cautions: data.cautions?.length
            ? {
                createMany: {
                  data: data.cautions.map((c) => ({
                    tenantId: data.tenantId,
                    type: c.type,
                    title: c.title,
                    description: c.description,
                    severity: c.severity || 'MEDIUM',
                  })),
                },
              }
            : undefined,
        },
        include: {
          addresses: true,
          preferences: true,
          cautions: true,
        },
      });

      return this.toDto(record);
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
        throw new ConflictError('Customer with this code or mobile number already exists');
      }
      throw err;
    }
  }

  public async update(
    tenantId: string,
    id: string,
    data: Prisma.CustomerUpdateInput,
  ): Promise<CachedCustomer> {
    const existing = await prisma.customer.findFirst({
      where: { id, tenantId, deletedAt: null },
    });
    if (!existing) throw new NotFoundError('Customer not found');

    const updated = await prisma.customer.update({
      where: { id },
      data,
      include: {
        addresses: true,
        preferences: true,
        cautions: { where: { active: true } },
        tagMappings: { include: { tag: true } },
      },
    });

    return this.toDto(updated);
  }

  public async recordVisit(
    tenantId: string,
    id: string,
    amount: number,
    visitDate: Date = new Date(),
  ): Promise<CachedCustomer> {
    const existing = await prisma.customer.findFirst({
      where: { id, tenantId, deletedAt: null },
    });
    if (!existing) throw new NotFoundError('Customer not found');

    const nextVisits = (existing.totalVisits || 0) + 1;
    let nextSegment = (existing as any).segment;
    if (!nextSegment || nextSegment === 'New Client') {
      if (nextVisits > 15) nextSegment = 'VIP High Value';
      else if (nextVisits > 5) nextSegment = 'Frequent Visitor';
    }

    const updated = await prisma.customer.update({
      where: { id },
      data: {
        totalVisits: { increment: 1 },
        totalSpent: { increment: amount },
        lastVisitAt: visitDate,
        firstVisitAt: existing.firstVisitAt || visitDate,
        status: existing.status === 'INACTIVE' || existing.status === 'DORMANT' ? 'ACTIVE' : existing.status,
        ...(nextSegment ? { segment: nextSegment } : {}),
      },
      include: {
        addresses: true,
        preferences: true,
        cautions: { where: { active: true } },
        tagMappings: { include: { tag: true } },
      },
    });

    return this.toDto(updated);
  }

  public async upsertAddress(
    tenantId: string,
    customerId: string,
    address: {
      type?: string;
      addressLine1?: string | null;
      addressLine2?: string | null;
      city?: string | null;
      state?: string | null;
      postalCode?: string | null;
      country?: string | null;
      isDefault?: boolean;
    },
  ) {
    const existing = await prisma.customerAddress.findFirst({
      where: { customerId, tenantId },
    });
    if (existing) {
      return prisma.customerAddress.update({
        where: { id: existing.id },
        data: {
          addressLine1: address.addressLine1 ?? existing.addressLine1,
          addressLine2: address.addressLine2 !== undefined ? address.addressLine2 : existing.addressLine2,
          city: address.city ?? existing.city,
          state: address.state ?? existing.state,
          postalCode: address.postalCode ?? existing.postalCode,
          country: address.country ?? existing.country,
        },
      });
    } else if (address.addressLine1 || address.city) {
      return prisma.customerAddress.create({
        data: {
          tenantId,
          customerId,
          type: address.type || 'HOME',
          addressLine1: address.addressLine1 || 'Central',
          addressLine2: address.addressLine2 || null,
          city: address.city || '',
          state: address.state || '',
          postalCode: address.postalCode || '000000',
          country: address.country || 'IN',
          isDefault: address.isDefault !== undefined ? address.isDefault : true,
        },
      });
    }
  }

  public async softDelete(
    tenantId: string,
    id: string,
    userId: string | null,
    reason?: string,
  ): Promise<void> {
    const existing = await prisma.customer.findFirst({
      where: { id, tenantId, deletedAt: null },
    });
    if (!existing) throw new NotFoundError('Customer not found');

    await prisma.customer.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        deletedByIdentityUserId: userId,
        deleteReason: reason,
        status: 'ARCHIVED',
      },
    });
  }

  public async findDormant(tenantId: string, daysThreshold = 90): Promise<CustomerSummaryDto[]> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysThreshold);

    const records = await prisma.customer.findMany({
      where: {
        tenantId,
        deletedAt: null,
        status: 'ACTIVE',
        OR: [
          { lastVisitAt: { lt: cutoffDate } },
          { lastVisitAt: null, createdAt: { lt: cutoffDate } },
        ],
      },
      take: 100,
      orderBy: { lastVisitAt: 'asc' },
    });

    return records.map((r) => this.toSummaryDto(r));
  }
}

export const customerRepository = new CustomerRepository();
