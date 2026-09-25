import { prisma } from '../prisma/client';
export class WaitlistRepository {
    toDto(record) {
        return {
            id: record.id,
            tenantId: record.tenantId,
            branchId: record.branchId,
            customerId: record.customerId,
            serviceId: record.serviceId,
            preferredStaffId: record.preferredStaffId,
            preferredDate: record.preferredDate.toISOString().split('T')[0],
            preferredStartTime: record.preferredStartTime,
            preferredEndTime: record.preferredEndTime,
            status: record.status,
            createdAt: record.createdAt.toISOString(),
            updatedAt: record.updatedAt.toISOString(),
        };
    }
    async list(tenantId, filter) {
        const records = await prisma.waitlistEntry.findMany({
            where: {
                tenantId,
                ...(filter.branchId ? { branchId: filter.branchId } : {}),
                ...(filter.status ? { status: filter.status } : {}),
                ...(filter.preferredDate
                    ? {
                        preferredDate: new Date(filter.preferredDate),
                    }
                    : {}),
            },
            orderBy: { createdAt: 'asc' },
        });
        return records.map((r) => this.toDto(r));
    }
    async create(data) {
        const record = await prisma.waitlistEntry.create({
            data: {
                tenantId: data.tenantId,
                branchId: data.branchId,
                customerId: data.customerId,
                serviceId: data.serviceId,
                preferredStaffId: data.preferredStaffId,
                preferredDate: new Date(data.preferredDate),
                preferredStartTime: data.preferredStartTime,
                preferredEndTime: data.preferredEndTime,
                status: 'WAITING',
            },
        });
        return this.toDto(record);
    }
    async updateStatus(tenantId, id, status) {
        const record = await prisma.waitlistEntry.update({
            where: { id },
            data: { status },
        });
        return this.toDto(record);
    }
}
export const waitlistRepository = new WaitlistRepository();
