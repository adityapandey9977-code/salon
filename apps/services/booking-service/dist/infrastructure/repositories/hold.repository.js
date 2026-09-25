import { prisma } from '../prisma/client';
export class HoldRepository {
    toDto(record) {
        return {
            id: record.id,
            tenantId: record.tenantId,
            branchId: record.branchId,
            holdToken: record.holdToken,
            customerId: record.customerId,
            startsAt: record.startsAt.toISOString(),
            endsAt: record.endsAt.toISOString(),
            expiresAt: record.expiresAt.toISOString(),
            status: record.status,
            createdAt: record.createdAt.toISOString(),
        };
    }
    async findByToken(token) {
        const record = await prisma.bookingHold.findUnique({
            where: { holdToken: token },
        });
        if (!record)
            return null;
        return this.toDto(record);
    }
    async createHold(data) {
        const ttl = data.ttlMinutes || 10;
        const expiresAt = new Date(Date.now() + ttl * 60 * 1000);
        const record = await prisma.bookingHold.create({
            data: {
                tenantId: data.tenantId,
                branchId: data.branchId,
                holdToken: data.holdToken,
                customerId: data.customerId,
                startsAt: data.startsAt,
                endsAt: data.endsAt,
                expiresAt,
                status: 'ACTIVE',
            },
        });
        return this.toDto(record);
    }
    async releaseHold(holdToken) {
        await prisma.bookingHold.updateMany({
            where: { holdToken },
            data: { status: 'RELEASED' },
        });
    }
    async checkActiveHolds(tenantId, branchId, startsAt, endsAt) {
        const now = new Date();
        const count = await prisma.bookingHold.count({
            where: {
                tenantId,
                branchId,
                status: 'ACTIVE',
                expiresAt: { gt: now },
                AND: [{ startsAt: { lt: endsAt } }, { endsAt: { gt: startsAt } }],
            },
        });
        return count > 0;
    }
}
export const holdRepository = new HoldRepository();
