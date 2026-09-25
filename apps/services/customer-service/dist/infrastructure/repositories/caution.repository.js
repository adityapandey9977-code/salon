import { NotFoundError } from '@salon-spa-saas/common-types';
import { prisma } from '../prisma/client';
export class CautionRepository {
    toDto(item) {
        return {
            id: item.id,
            tenantId: item.tenantId,
            customerId: item.customerId,
            type: item.type,
            title: item.title,
            description: item.description,
            severity: item.severity,
            active: item.active,
            createdAt: item.createdAt.toISOString(),
            updatedAt: item.updatedAt.toISOString(),
        };
    }
    async findByCustomerId(tenantId, customerId) {
        const records = await prisma.customerCaution.findMany({
            where: { tenantId, customerId },
            orderBy: { createdAt: 'desc' },
        });
        return records.map((r) => this.toDto(r));
    }
    async create(data) {
        const record = await prisma.customerCaution.create({
            data: {
                tenantId: data.tenantId,
                customerId: data.customerId,
                type: data.type,
                title: data.title,
                description: data.description,
                severity: data.severity || 'MEDIUM',
                active: data.active !== undefined ? data.active : true,
            },
        });
        return this.toDto(record);
    }
    async update(tenantId, id, data) {
        const existing = await prisma.customerCaution.findFirst({
            where: { id, tenantId },
        });
        if (!existing)
            throw new NotFoundError('Customer caution not found');
        const updated = await prisma.customerCaution.update({
            where: { id },
            data,
        });
        return this.toDto(updated);
    }
}
export const cautionRepository = new CautionRepository();
