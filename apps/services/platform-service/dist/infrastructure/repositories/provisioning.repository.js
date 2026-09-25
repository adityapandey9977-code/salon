import { prisma } from '../prisma/client';
import { ProvisioningStatus } from '../prisma/generated-client';
export class ProvisioningRepository {
    async findById(id) {
        return prisma.tenantProvisioningRequest.findUnique({
            where: { id },
            include: {
                plan: true,
            },
        });
    }
    async list(filter) {
        const where = {};
        if (filter?.status)
            where.status = filter.status;
        const [items, total] = await Promise.all([
            prisma.tenantProvisioningRequest.findMany({
                where,
                include: {
                    plan: true,
                },
                skip: filter?.skip || 0,
                take: filter?.take || 50,
                orderBy: { createdAt: 'desc' },
            }),
            prisma.tenantProvisioningRequest.count({ where }),
        ]);
        return { items, total };
    }
    async create(data) {
        return prisma.tenantProvisioningRequest.create({
            data: {
                requestedByUserId: data.requestedByUserId,
                planId: data.planId,
                salonName: data.salonName,
                loginEmail: data.loginEmail.toLowerCase().trim(),
                subdomain: data.subdomain?.toLowerCase().trim(),
                ownerPhone: data.ownerPhone,
                status: ProvisioningStatus.PENDING,
            },
            include: {
                plan: true,
            },
        });
    }
    async updateStatus(id, data) {
        return prisma.tenantProvisioningRequest.update({
            where: { id },
            data,
            include: {
                plan: true,
            },
        });
    }
}
