import { ConflictError, NotFoundError } from '@salon-spa-saas/common-types';
import { prisma } from '../prisma/client';
import { Prisma } from '../prisma/generated-client';
export class SegmentRepository {
    toDto(item) {
        return {
            id: item.id,
            tenantId: item.tenantId,
            name: item.name,
            description: item.description,
            segmentType: item.segmentType,
            isDynamic: item.isDynamic,
            criteriaJson: item.criteriaJson,
            memberCount: item.members?.length,
            createdAt: item.createdAt.toISOString(),
            updatedAt: item.updatedAt.toISOString(),
        };
    }
    async findById(tenantId, id) {
        const record = await prisma.customerSegment.findFirst({
            where: { id, tenantId },
            include: { members: true },
        });
        if (!record)
            return null;
        return this.toDto(record);
    }
    async list(tenantId) {
        const records = await prisma.customerSegment.findMany({
            where: { tenantId },
            include: { members: true },
            orderBy: { createdAt: 'desc' },
        });
        return records.map((r) => this.toDto(r));
    }
    async create(data) {
        try {
            const record = await prisma.customerSegment.create({
                data: {
                    tenantId: data.tenantId,
                    name: data.name,
                    description: data.description,
                    segmentType: data.segmentType || 'STATIC',
                    isDynamic: data.isDynamic || false,
                    criteriaJson: data.criteriaJson,
                },
            });
            return this.toDto(record);
        }
        catch (err) {
            if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
                throw new ConflictError('A segment with this name already exists');
            }
            throw err;
        }
    }
    async addMember(tenantId, segmentId, customerId) {
        const segment = await prisma.customerSegment.findFirst({
            where: { id: segmentId, tenantId },
        });
        if (!segment)
            throw new NotFoundError('Segment not found');
        await prisma.customerSegmentMember.upsert({
            where: {
                segmentId_customerId: {
                    segmentId,
                    customerId,
                },
            },
            update: {},
            create: {
                tenantId,
                segmentId,
                customerId,
            },
        });
    }
    async removeMember(tenantId, segmentId, customerId) {
        await prisma.customerSegmentMember.deleteMany({
            where: {
                tenantId,
                segmentId,
                customerId,
            },
        });
    }
}
export const segmentRepository = new SegmentRepository();
