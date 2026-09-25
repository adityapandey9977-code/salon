import { prisma } from '../prisma/client';
export class RosterRepository {
    toDto(item) {
        return {
            id: item.id,
            tenantId: item.tenantId,
            employeeId: item.employeeId,
            branchId: item.branchId,
            shiftId: item.shiftId,
            rosterDate: item.rosterDate.toISOString().split('T')[0],
            startAt: item.startAt.toISOString(),
            endAt: item.endAt.toISOString(),
            status: item.status,
        };
    }
    async findRosterByEmployeeAndDate(tenantId, employeeId, date) {
        const record = await prisma.rosterAssignment.findUnique({
            where: {
                tenantId_employeeId_rosterDate: {
                    tenantId,
                    employeeId,
                    rosterDate: date,
                },
            },
        });
        return record ? this.toDto(record) : null;
    }
    async findRosterById(tenantId, id) {
        const record = await prisma.rosterAssignment.findFirst({
            where: { id, tenantId },
        });
        return record ? this.toDto(record) : null;
    }
    async queryRoster(params) {
        const where = {
            tenantId: params.tenantId,
        };
        if (params.branchId)
            where.branchId = params.branchId;
        if (params.employeeId)
            where.employeeId = params.employeeId;
        if (params.date)
            where.rosterDate = params.date;
        else if (params.startDate && params.endDate) {
            where.rosterDate = {
                gte: params.startDate,
                lte: params.endDate,
            };
        }
        else if (params.startDate) {
            where.rosterDate = { gte: params.startDate };
        }
        const records = await prisma.rosterAssignment.findMany({
            where,
            orderBy: [{ rosterDate: 'asc' }, { startAt: 'asc' }],
        });
        return records.map((r) => this.toDto(r));
    }
    async createRoster(data) {
        const record = await prisma.rosterAssignment.upsert({
            where: {
                tenantId_employeeId_rosterDate: {
                    tenantId: data.tenantId,
                    employeeId: data.employeeId,
                    rosterDate: data.rosterDate,
                },
            },
            create: {
                tenantId: data.tenantId,
                employeeId: data.employeeId,
                branchId: data.branchId,
                shiftId: data.shiftId || null,
                rosterDate: data.rosterDate,
                startAt: data.startAt,
                endAt: data.endAt,
                status: data.status || 'SCHEDULED',
            },
            update: {
                branchId: data.branchId,
                shiftId: data.shiftId || null,
                startAt: data.startAt,
                endAt: data.endAt,
                status: data.status || 'SCHEDULED',
            },
        });
        return this.toDto(record);
    }
    async updateRoster(tenantId, id, data) {
        const updated = await prisma.rosterAssignment.update({
            where: { id, tenantId },
            data: {
                ...(data.shiftId !== undefined ? { shiftId: data.shiftId } : {}),
                ...(data.startAt !== undefined ? { startAt: data.startAt } : {}),
                ...(data.endAt !== undefined ? { endAt: data.endAt } : {}),
                ...(data.status !== undefined ? { status: data.status } : {}),
            },
        });
        return this.toDto(updated);
    }
    async deleteRoster(tenantId, id) {
        const deleted = await prisma.rosterAssignment.delete({
            where: { id, tenantId },
        });
        return this.toDto(deleted);
    }
}
export const rosterRepository = new RosterRepository();
