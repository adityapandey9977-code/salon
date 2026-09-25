import { prisma } from '../prisma/client';
import { PayrollStatus, Prisma } from '../prisma/generated-client';
export class PayrollRepository {
    async listRuns(tenantId) {
        return prisma.payrollRun.findMany({
            where: { tenantId },
            include: {
                employees: true,
            },
            orderBy: { periodEnd: 'desc' },
        });
    }
    async findById(tenantId, id) {
        return prisma.payrollRun.findFirst({
            where: { id, tenantId },
            include: {
                employees: true,
            },
        });
    }
    async createRun(tenantId, data) {
        let grossTotal = 0;
        let deductionTotal = 0;
        let netTotal = 0;
        const employeeData = data.employees.map((e) => {
            const base = e.baseSalary || 0;
            const attAdj = e.attendanceAdjustment || 0;
            const ot = e.overtimeAmount || 0;
            const comm = e.commissionAmount || 0;
            const tip = e.tipAmount || 0;
            const bonus = e.bonusAmount || 0;
            const ded = e.deductionAmount || 0;
            const gross = base + attAdj + ot + comm + tip + bonus;
            const net = gross - ded;
            grossTotal += gross;
            deductionTotal += ded;
            netTotal += net;
            return {
                tenantId,
                employeeId: e.employeeId,
                baseSalary: new Prisma.Decimal(base),
                attendanceAdjustment: new Prisma.Decimal(attAdj),
                overtimeAmount: new Prisma.Decimal(ot),
                commissionAmount: new Prisma.Decimal(comm),
                tipAmount: new Prisma.Decimal(tip),
                bonusAmount: new Prisma.Decimal(bonus),
                deductionAmount: new Prisma.Decimal(ded),
                grossPay: new Prisma.Decimal(gross),
                netPay: new Prisma.Decimal(net),
            };
        });
        return prisma.payrollRun.create({
            data: {
                tenantId,
                periodStart: data.periodStart,
                periodEnd: data.periodEnd,
                status: PayrollStatus.DRAFT,
                createdByUserId: data.createdByUserId,
                grossTotal: new Prisma.Decimal(grossTotal),
                deductionTotal: new Prisma.Decimal(deductionTotal),
                netTotal: new Prisma.Decimal(netTotal),
                employees: {
                    create: employeeData,
                },
            },
            include: {
                employees: true,
            },
        });
    }
    async approveRun(tenantId, id, approvedByUserId) {
        return prisma.payrollRun.update({
            where: { id },
            data: {
                status: PayrollStatus.APPROVED,
                approvedByUserId,
                completedAt: new Date(),
            },
            include: {
                employees: true,
            },
        });
    }
}
