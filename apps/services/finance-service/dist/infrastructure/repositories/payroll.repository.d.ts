import { Prisma } from '../prisma/generated-client';
export declare class PayrollRepository {
    listRuns(tenantId: string): Promise<({
        employees: {
            tenantId: string;
            status: string;
            id: string;
            employeeId: string;
            commissionAmount: Prisma.Decimal;
            payrollRunId: string;
            baseSalary: Prisma.Decimal;
            attendanceAdjustment: Prisma.Decimal;
            overtimeAmount: Prisma.Decimal;
            tipAmount: Prisma.Decimal;
            bonusAmount: Prisma.Decimal;
            deductionAmount: Prisma.Decimal;
            grossPay: Prisma.Decimal;
            netPay: Prisma.Decimal;
        }[];
    } & {
        tenantId: string;
        status: import("../prisma/generated-client").$Enums.PayrollStatus;
        id: string;
        createdAt: Date;
        periodStart: Date;
        periodEnd: Date;
        createdByUserId: string | null;
        approvedByUserId: string | null;
        grossTotal: Prisma.Decimal;
        deductionTotal: Prisma.Decimal;
        netTotal: Prisma.Decimal;
        completedAt: Date | null;
    })[]>;
    findById(tenantId: string, id: string): Promise<({
        employees: {
            tenantId: string;
            status: string;
            id: string;
            employeeId: string;
            commissionAmount: Prisma.Decimal;
            payrollRunId: string;
            baseSalary: Prisma.Decimal;
            attendanceAdjustment: Prisma.Decimal;
            overtimeAmount: Prisma.Decimal;
            tipAmount: Prisma.Decimal;
            bonusAmount: Prisma.Decimal;
            deductionAmount: Prisma.Decimal;
            grossPay: Prisma.Decimal;
            netPay: Prisma.Decimal;
        }[];
    } & {
        tenantId: string;
        status: import("../prisma/generated-client").$Enums.PayrollStatus;
        id: string;
        createdAt: Date;
        periodStart: Date;
        periodEnd: Date;
        createdByUserId: string | null;
        approvedByUserId: string | null;
        grossTotal: Prisma.Decimal;
        deductionTotal: Prisma.Decimal;
        netTotal: Prisma.Decimal;
        completedAt: Date | null;
    }) | null>;
    createRun(tenantId: string, data: {
        periodStart: Date;
        periodEnd: Date;
        createdByUserId?: string;
        employees: Array<{
            employeeId: string;
            baseSalary: number;
            attendanceAdjustment?: number;
            overtimeAmount?: number;
            commissionAmount?: number;
            tipAmount?: number;
            bonusAmount?: number;
            deductionAmount?: number;
        }>;
    }): Promise<{
        employees: {
            tenantId: string;
            status: string;
            id: string;
            employeeId: string;
            commissionAmount: Prisma.Decimal;
            payrollRunId: string;
            baseSalary: Prisma.Decimal;
            attendanceAdjustment: Prisma.Decimal;
            overtimeAmount: Prisma.Decimal;
            tipAmount: Prisma.Decimal;
            bonusAmount: Prisma.Decimal;
            deductionAmount: Prisma.Decimal;
            grossPay: Prisma.Decimal;
            netPay: Prisma.Decimal;
        }[];
    } & {
        tenantId: string;
        status: import("../prisma/generated-client").$Enums.PayrollStatus;
        id: string;
        createdAt: Date;
        periodStart: Date;
        periodEnd: Date;
        createdByUserId: string | null;
        approvedByUserId: string | null;
        grossTotal: Prisma.Decimal;
        deductionTotal: Prisma.Decimal;
        netTotal: Prisma.Decimal;
        completedAt: Date | null;
    }>;
    approveRun(tenantId: string, id: string, approvedByUserId?: string): Promise<{
        employees: {
            tenantId: string;
            status: string;
            id: string;
            employeeId: string;
            commissionAmount: Prisma.Decimal;
            payrollRunId: string;
            baseSalary: Prisma.Decimal;
            attendanceAdjustment: Prisma.Decimal;
            overtimeAmount: Prisma.Decimal;
            tipAmount: Prisma.Decimal;
            bonusAmount: Prisma.Decimal;
            deductionAmount: Prisma.Decimal;
            grossPay: Prisma.Decimal;
            netPay: Prisma.Decimal;
        }[];
    } & {
        tenantId: string;
        status: import("../prisma/generated-client").$Enums.PayrollStatus;
        id: string;
        createdAt: Date;
        periodStart: Date;
        periodEnd: Date;
        createdByUserId: string | null;
        approvedByUserId: string | null;
        grossTotal: Prisma.Decimal;
        deductionTotal: Prisma.Decimal;
        netTotal: Prisma.Decimal;
        completedAt: Date | null;
    }>;
}
//# sourceMappingURL=payroll.repository.d.ts.map