import { PayrollRepository } from '../../infrastructure/repositories/payroll.repository';
import { CommissionRepository } from '../../infrastructure/repositories/commission.repository';
import { eventBus } from '../../infrastructure/messaging/publisher';
import { NotFoundError, BadRequestError } from '@salon-spa-saas/common-types';
import { PayrollStatus } from '../../infrastructure/prisma/generated-client';

export class PayrollService {
  constructor(
    private payrollRepo: PayrollRepository = new PayrollRepository(),
    private commRepo: CommissionRepository = new CommissionRepository()
  ) {}

  async listRuns(tenantId: string) {
    return this.payrollRepo.listRuns(tenantId);
  }

  async getRunById(tenantId: string, id: string) {
    const run = await this.payrollRepo.findById(tenantId, id);
    if (!run) throw new NotFoundError(`Payroll run ${id} not found`);
    return run;
  }

  async executePayrollRun(tenantId: string, data: {
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
  }) {
    if (!data.employeeInputs || data.employeeInputs.length === 0) {
      throw new BadRequestError('Payroll run must contain at least one employee input');
    }

    // 1. Fetch pending/approved commissions for tenant during this period
    const commissionTransactions = await this.commRepo.listTransactions(tenantId);

    // Group commissions by employeeId
    const commByEmp: Record<string, number> = {};
    for (const ct of commissionTransactions) {
      const earnedDate = new Date(ct.earnedAt);
      if (earnedDate >= data.periodStart && earnedDate <= data.periodEnd) {
        commByEmp[ct.employeeId] = (commByEmp[ct.employeeId] || 0) + Number(ct.commissionAmount);
      }
    }

    // 2. Compute monetary adjustments
    const employees = data.employeeInputs.map((emp) => {
      const base = emp.baseSalary || 0;
      let attendanceAdjustment = 0;

      if (emp.totalWorkingDays && emp.attendanceDays !== undefined && emp.attendanceDays < emp.totalWorkingDays) {
        const perDay = base / emp.totalWorkingDays;
        const missed = emp.totalWorkingDays - emp.attendanceDays;
        attendanceAdjustment = -Math.round(perDay * missed * 100) / 100;
      }

      const overtimeAmount = emp.overtimeHours ? emp.overtimeHours * 200 : 0; // 200/hr OT
      const commissionAmount = commByEmp[emp.employeeId] || 0;
      const bonusAmount = emp.bonusAmount || 0;
      const deductionAmount = emp.deductionAmount || 0;

      return {
        employeeId: emp.employeeId,
        baseSalary: base,
        attendanceAdjustment,
        overtimeAmount,
        commissionAmount,
        tipAmount: 0,
        bonusAmount,
        deductionAmount,
      };
    });

    // 3. Persist PayrollRun & Employees
    const run = await this.payrollRepo.createRun(tenantId, {
      periodStart: data.periodStart,
      periodEnd: data.periodEnd,
      createdByUserId: data.createdByUserId,
      employees,
    });

    // 4. Publish PAYROLL_RUN_CREATED.v1
    await eventBus.publish({
      eventType: 'PAYROLL_RUN_CREATED.v1',
      aggregateType: 'PayrollRun',
      aggregateId: run.id,
      tenantId,
      payload: {
        payrollRunId: run.id,
        tenantId,
        periodStart: run.periodStart,
        periodEnd: run.periodEnd,
        grossTotal: Number(run.grossTotal),
        netTotal: Number(run.netTotal),
        employeeCount: run.employees.length,
      },
    });

    return run;
  }

  async approvePayrollRun(tenantId: string, id: string, approvedByUserId?: string) {
    const run = await this.getRunById(tenantId, id);
    if (run.status !== PayrollStatus.DRAFT && run.status !== PayrollStatus.PENDING_APPROVAL) {
      throw new BadRequestError(`Cannot approve payroll run in status ${run.status}`);
    }

    const approved = await this.payrollRepo.approveRun(tenantId, id, approvedByUserId);

    // Publish PAYROLL_COMPLETED.v1
    await eventBus.publish({
      eventType: 'PAYROLL_COMPLETED.v1',
      aggregateType: 'PayrollRun',
      aggregateId: approved.id,
      tenantId,
      payload: {
        payrollRunId: approved.id,
        tenantId,
        netTotal: Number(approved.netTotal),
        approvedByUserId,
      },
    });

    return approved;
  }
}
