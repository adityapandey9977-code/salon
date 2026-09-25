import { prisma } from '../prisma/client';
export class StaffBranchRepository {
    toDto(item) {
        return {
            id: item.id,
            employeeId: item.employeeId,
            tenantId: item.tenantId,
            branchId: item.branchId,
            isPrimary: item.isPrimary,
            effectiveFrom: item.effectiveFrom.toISOString(),
            effectiveTo: item.effectiveTo ? item.effectiveTo.toISOString() : null,
            status: item.status,
        };
    }
    async findAssignmentsByEmployee(tenantId, employeeId) {
        const records = await prisma.staffBranchAssignment.findMany({
            where: {
                tenantId,
                employeeId,
            },
            orderBy: { effectiveFrom: 'desc' },
        });
        return records.map((r) => this.toDto(r));
    }
    async findAssignment(tenantId, employeeId, branchId) {
        const record = await prisma.staffBranchAssignment.findUnique({
            where: {
                tenantId_employeeId_branchId: {
                    tenantId,
                    employeeId,
                    branchId,
                },
            },
        });
        return record ? this.toDto(record) : null;
    }
    async findAssignmentById(tenantId, id) {
        const record = await prisma.staffBranchAssignment.findFirst({
            where: {
                id,
                tenantId,
            },
        });
        return record ? this.toDto(record) : null;
    }
    async assignBranch(data) {
        const result = await prisma.$transaction(async (tx) => {
            // If marking as primary, reset other primary flags for this employee
            if (data.isPrimary) {
                await tx.staffBranchAssignment.updateMany({
                    where: {
                        tenantId: data.tenantId,
                        employeeId: data.employeeId,
                        isPrimary: true,
                    },
                    data: { isPrimary: false },
                });
                await tx.employee.update({
                    where: { id: data.employeeId },
                    data: { primaryBranchId: data.branchId },
                });
            }
            return tx.staffBranchAssignment.upsert({
                where: {
                    tenantId_employeeId_branchId: {
                        tenantId: data.tenantId,
                        employeeId: data.employeeId,
                        branchId: data.branchId,
                    },
                },
                create: {
                    tenantId: data.tenantId,
                    employeeId: data.employeeId,
                    branchId: data.branchId,
                    isPrimary: data.isPrimary ?? false,
                    effectiveFrom: data.effectiveFrom || new Date(),
                    effectiveTo: data.effectiveTo || null,
                    status: data.status || 'ACTIVE',
                },
                update: {
                    isPrimary: data.isPrimary ?? false,
                    effectiveFrom: data.effectiveFrom || new Date(),
                    effectiveTo: data.effectiveTo || null,
                    status: data.status || 'ACTIVE',
                },
            });
        });
        return this.toDto(result);
    }
    async updateAssignment(tenantId, id, data) {
        const result = await prisma.$transaction(async (tx) => {
            const existing = await tx.staffBranchAssignment.findFirstOrThrow({
                where: { id, tenantId },
            });
            if (data.isPrimary && !existing.isPrimary) {
                await tx.staffBranchAssignment.updateMany({
                    where: {
                        tenantId,
                        employeeId: existing.employeeId,
                        isPrimary: true,
                    },
                    data: { isPrimary: false },
                });
                await tx.employee.update({
                    where: { id: existing.employeeId },
                    data: { primaryBranchId: existing.branchId },
                });
            }
            return tx.staffBranchAssignment.update({
                where: { id },
                data: {
                    ...(data.isPrimary !== undefined ? { isPrimary: data.isPrimary } : {}),
                    ...(data.effectiveTo !== undefined ? { effectiveTo: data.effectiveTo } : {}),
                    ...(data.status !== undefined ? { status: data.status } : {}),
                },
            });
        });
        return this.toDto(result);
    }
    async removeAssignment(tenantId, id) {
        const deleted = await prisma.staffBranchAssignment.delete({
            where: { id, tenantId },
        });
        return this.toDto(deleted);
    }
    async findEmployeesByBranch(tenantId, branchId) {
        const assignments = await prisma.staffBranchAssignment.findMany({
            where: {
                tenantId,
                branchId,
                status: 'ACTIVE',
            },
            select: { employeeId: true },
        });
        return assignments.map((a) => a.employeeId);
    }
}
export const staffBranchRepository = new StaffBranchRepository();
