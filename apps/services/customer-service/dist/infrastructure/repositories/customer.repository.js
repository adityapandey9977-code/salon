import { ConflictError, NotFoundError } from '@salon-spa-saas/common-types';
import { prisma } from '../prisma/client';
import { Prisma, } from '../prisma/generated-client';
export class CustomerRepository {
    toDto(item) {
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
            avatarUrl: item.avatarUrl || null,
            segment: item.segment || 'New Client',
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
    toSummaryDto(item) {
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
            avatarUrl: item.avatarUrl || null,
            segment: item.segment || 'New Client',
            totalVisits: item.totalVisits,
            totalSpent: Number(item.totalSpent),
            lastVisitAt: item.lastVisitAt ? item.lastVisitAt.toISOString() : null,
            firstVisitAt: item.firstVisitAt ? item.firstVisitAt.toISOString() : null,
            createdAt: item.createdAt.toISOString(),
        };
    }
    async findById(tenantId, id) {
        const record = await prisma.customer.findFirst({
            where: { id, tenantId, deletedAt: null },
            include: {
                addresses: true,
                preferences: true,
                cautions: { where: { active: true } },
                tagMappings: { include: { tag: true } },
            },
        });
        if (!record)
            return null;
        return this.toDto(record);
    }
    async findByNormalizedMobile(tenantId, normalizedMobile) {
        const record = await prisma.customer.findFirst({
            where: { tenantId, normalizedMobile, deletedAt: null },
            include: {
                addresses: true,
                preferences: true,
            },
        });
        if (!record)
            return null;
        return this.toDto(record);
    }
    async findByNormalizedEmail(tenantId, normalizedEmail) {
        const record = await prisma.customer.findFirst({
            where: { tenantId, normalizedEmail, deletedAt: null },
            include: {
                addresses: true,
                preferences: true,
            },
        });
        if (!record)
            return null;
        return this.toDto(record);
    }
    async list(tenantId, filters) {
        const where = {
            tenantId,
            deletedAt: null,
        };
        if (filters.status)
            where.status = filters.status;
        if (filters.branchId)
            where.preferredBranchId = filters.branchId;
        if (filters.franchiseId) {
            where.franchiseId = filters.franchiseId;
        }
        else if (filters.hasFranchise) {
            where.franchiseId = { not: null };
        }
        if (filters.source)
            where.source = filters.source;
        if (filters.mobilePhone)
            where.normalizedMobile = { contains: filters.mobilePhone };
        if (filters.email)
            where.normalizedEmail = { contains: filters.email.toLowerCase() };
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
    async create(data) {
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
                    segment: data.segment || 'New Client',
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
                                appointmentReminderEnabled: data.preferences.appointmentReminderEnabled !== undefined
                                    ? data.preferences.appointmentReminderEnabled
                                    : true,
                                marketingConsent: data.preferences.marketingConsent !== undefined ? data.preferences.marketingConsent : true,
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
        }
        catch (err) {
            if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
                throw new ConflictError('Customer with this code or mobile number already exists');
            }
            throw err;
        }
    }
    async update(tenantId, id, data) {
        const existing = await prisma.customer.findFirst({
            where: { id, tenantId, deletedAt: null },
        });
        if (!existing)
            throw new NotFoundError('Customer not found');
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
    async recordVisit(tenantId, id, amount, visitDate = new Date()) {
        const existing = await prisma.customer.findFirst({
            where: { id, tenantId, deletedAt: null },
        });
        if (!existing)
            throw new NotFoundError('Customer not found');
        const nextVisits = (existing.totalVisits || 0) + 1;
        let nextSegment = existing.segment;
        if (!nextSegment || nextSegment === 'New Client') {
            if (nextVisits > 15)
                nextSegment = 'VIP High Value';
            else if (nextVisits > 5)
                nextSegment = 'Frequent Visitor';
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
    async upsertAddress(tenantId, customerId, address) {
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
        }
        else if (address.addressLine1 || address.city) {
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
    async softDelete(tenantId, id, userId, reason) {
        const existing = await prisma.customer.findFirst({
            where: { id, tenantId, deletedAt: null },
        });
        if (!existing)
            throw new NotFoundError('Customer not found');
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
    async findDormant(tenantId, daysThreshold = 90) {
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
