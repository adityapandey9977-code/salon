import { PayrollRepository } from '../../infrastructure/repositories/payroll.repository';
import { CommissionRepository } from '../../infrastructure/repositories/commission.repository';
export declare class PayrollService {
    private payrollRepo;
    private commRepo;
    constructor(payrollRepo?: PayrollRepository, commRepo?: CommissionRepository);
    listRuns(tenantId: string): Promise<({
        employees: {
            tenantId: string;
            status: string;
            id: string;
            employeeId: string;
            commissionAmount: import("../../infrastructure/prisma/generated-client/runtime/library").Decimal;
            payrollRunId: string;
            baseSalary: import("../../infrastructure/prisma/generated-client/runtime/library").Decimal;
            attendanceAdjustment: import("../../infrastructure/prisma/generated-client/runtime/library").Decimal;
            overtimeAmount: import("../../infrastructure/prisma/generated-client/runtime/library").Decimal;
            tipAmount: import("../../infrastructure/prisma/generated-client/runtime/library").Decimal;
            bonusAmount: import("../../infrastructure/prisma/generated-client/runtime/library").Decimal;
            deductionAmount: import("../../infrastructure/prisma/generated-client/runtime/library").Decimal;
            grossPay: import("../../infrastructure/prisma/generated-client/runtime/library").Decimal;
            netPay: import("../../infrastructure/prisma/generated-client/runtime/library").Decimal;
        }[];
    } & {
        tenantId: string;
        status: import("../../infrastructure/prisma/generated-client").$Enums.PayrollStatus;
        id: string;
        createdAt: Date;
        periodStart: Date;
        periodEnd: Date;
        createdByUserId: string | null;
        approvedByUserId: string | null;
        grossTotal: import("../../infrastructure/prisma/generated-client/runtime/library").Decimal;
        deductionTotal: import("../../infrastructure/prisma/generated-client/runtime/library").Decimal;
        netTotal: import("../../infrastructure/prisma/generated-client/runtime/library").Decimal;
        completedAt: Date | null;
    })[]>;
    getRunById(tenantId: string, id: string): Promise<{
        employees: {
            tenantId: string;
            status: string;
            id: string;
            employeeId: string;
            commissionAmount: import("../../infrastructure/prisma/generated-client/runtime/library").Decimal;
            payrollRunId: string;
            baseSalary: import("../../infrastructure/prisma/generated-client/runtime/library").Decimal;
            attendanceAdjustment: import("../../infrastructure/prisma/generated-client/runtime/library").Decimal;
            overtimeAmount: import("../../infrastructure/prisma/generated-client/runtime/library").Decimal;
            tipAmount: import("../../infrastructure/prisma/generated-client/runtime/library").Decimal;
            bonusAmount: import("../../infrastructure/prisma/generated-client/runtime/library").Decimal;
            deductionAmount: import("../../infrastructure/prisma/generated-client/runtime/library").Decimal;
            grossPay: import("../../infrastructure/prisma/generated-client/runtime/library").Decimal;
            netPay: import("../../infrastructure/prisma/generated-client/runtime/library").Decimal;
        }[];
    } & {
        tenantId: string;
        status: import("../../infrastructure/prisma/generated-client").$Enums.PayrollStatus;
        id: string;
        createdAt: Date;
        periodStart: Date;
        periodEnd: Date;
        createdByUserId: string | null;
        approvedByUserId: string | null;
        grossTotal: import("../../infrastructure/prisma/generated-client/runtime/library").Decimal;
        deductionTotal: import("../../infrastructure/prisma/generated-client/runtime/library").Decimal;
        netTotal: import("../../infrastructure/prisma/generated-client/runtime/library").Decimal;
        completedAt: Date | null;
    }>;
    executePayrollRun(tenantId: string, data: {
        periodStart: Date;
        periodEnd: Date;
        createdByUserId?: string;
        employeeInputs: Array<{
            employeeId: string;
            baseSalary: number;
            attendanceDays?: number;
            totalWorkingDays?: number;
            overtimeHours?: number;
            bonusAmount?: number;
            deductionAmount?: number;
        }>;
    }): Promise<{
        employees: {
            tenantId: string;
            status: string;
            id: string;
            employeeId: string;
            commissionAmount: import("../../infrastructure/prisma/generated-client/runtime/library").Decimal;
            payrollRunId: string;
            baseSalary: import("../../infrastructure/prisma/generated-client/runtime/library").Decimal;
            attendanceAdjustment: import("../../infrastructure/prisma/generated-client/runtime/library").Decimal;
            overtimeAmount: import("../../infrastructure/prisma/generated-client/runtime/library").Decimal;
            tipAmount: import("../../infrastructure/prisma/generated-client/runtime/library").Decimal;
            bonusAmount: import("../../infrastructure/prisma/generated-client/runtime/library").Decimal;
            deductionAmount: import("../../infrastructure/prisma/generated-client/runtime/library").Decimal;
            grossPay: import("../../infrastructure/prisma/generated-client/runtime/library").Decimal;
            netPay: import("../../infrastructure/prisma/generated-client/runtime/library").Decimal;
        }[];
    } & {
        tenantId: string;
        status: import("../../infrastructure/prisma/generated-client").$Enums.PayrollStatus;
        id: string;
        createdAt: Date;
        periodStart: Date;
        periodEnd: Date;
        createdByUserId: string | null;
        approvedByUserId: string | null;
        grossTotal: import("../../infrastructure/prisma/generated-client/runtime/library").Decimal;
        deductionTotal: import("../../infrastructure/prisma/generated-client/runtime/library").Decimal;
        netTotal: import("../../infrastructure/prisma/generated-client/runtime/library").Decimal;
        completedAt: Date | null;
    }>;
    approvePayrollRun(tenantId: string, id: string, approvedByUserId?: string): Promise<{
        employees: {
            tenantId: string;
            status: string;
            id: string;
            employeeId: string;
            commissionAmount: import("../../infrastructure/prisma/generated-client/runtime/library").Decimal;
            payrollRunId: string;
            baseSalary: import("../../infrastructure/prisma/generated-client/runtime/library").Decimal;
            attendanceAdjustment: import("../../infrastructure/prisma/generated-client/runtime/library").Decimal;
            overtimeAmount: import("../../infrastructure/prisma/generated-client/runtime/library").Decimal;
            tipAmount: import("../../infrastructure/prisma/generated-client/runtime/library").Decimal;
            bonusAmount: import("../../infrastructure/prisma/generated-client/runtime/library").Decimal;
            deductionAmount: import("../../infrastructure/prisma/generated-client/runtime/library").Decimal;
            grossPay: import("../../infrastructure/prisma/generated-client/runtime/library").Decimal;
            netPay: import("../../infrastructure/prisma/generated-client/runtime/library").Decimal;
        }[];
    } & {
        tenantId: string;
        status: import("../../infrastructure/prisma/generated-client").$Enums.PayrollStatus;
        id: string;
        createdAt: Date;
        periodStart: Date;
        periodEnd: Date;
        createdByUserId: string | null;
        approvedByUserId: string | null;
        grossTotal: import("../../infrastructure/prisma/generated-client/runtime/library").Decimal;
        deductionTotal: import("../../infrastructure/prisma/generated-client/runtime/library").Decimal;
        netTotal: import("../../infrastructure/prisma/generated-client/runtime/library").Decimal;
        completedAt: Date | null;
    }>;
}
//# sourceMappingURL=payroll.service.d.ts.map