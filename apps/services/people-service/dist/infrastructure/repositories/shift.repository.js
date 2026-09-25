import { prisma } from '../prisma/client';
export class ShiftRepository {
    toDto(item) {
        return {
            id: item.id,
            tenantId: item.tenantId,
            branchId: item.branchId,
            name: item.name,
            startTime: item.startTime,
            endTime: item.endTime,
            breakMinutes: item.breakMinutes,
            graceMinutes: item.graceMinutes,
            isActive: item.isActive,
        };
    }
    async findShiftsByBranch(tenantId, branchId) {
        const shifts = await prisma.shift.findMany({
            where: {
                tenantId,
                ...(branchId ? { branchId } : {}),
            },
            orderBy: { startTime: 'asc' },
        });
        return shifts.map((s) => this.toDto(s));
    }
    async findShiftById(tenantId, id) {
        const shift = await prisma.shift.findFirst({
            where: { id, tenantId },
        });
        return shift ? this.toDto(shift) : null;
    }
    async createShift(data) {
        const shift = await prisma.shift.create({
            data: {
                tenantId: data.tenantId,
                branchId: data.branchId,
                name: data.name,
                startTime: data.startTime,
                endTime: data.endTime,
                breakMinutes: data.breakMinutes ?? 0,
                graceMinutes: data.graceMinutes ?? 15,
                isActive: data.isActive ?? true,
            },
        });
        return this.toDto(shift);
    }
    async updateShift(tenantId, id, data) {
        const updated = await prisma.shift.update({
            where: { id, tenantId },
            data: {
                ...(data.name !== undefined ? { name: data.name } : {}),
                ...(data.startTime !== undefined ? { startTime: data.startTime } : {}),
                ...(data.endTime !== undefined ? { endTime: data.endTime } : {}),
                ...(data.breakMinutes !== undefined ? { breakMinutes: data.breakMinutes } : {}),
                ...(data.graceMinutes !== undefined ? { graceMinutes: data.graceMinutes } : {}),
                ...(data.isActive !== undefined ? { isActive: data.isActive } : {}),
            },
        });
        return this.toDto(updated);
    }
    async deleteShift(tenantId, id) {
        const deleted = await prisma.shift.delete({
            where: { id, tenantId },
        });
        return this.toDto(deleted);
    }
}
export const shiftRepository = new ShiftRepository();
