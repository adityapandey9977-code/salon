import type { AdjustLeaveBalanceRequest, CreateLeaveRequest, LeaveStatus, UpdateLeaveRequest } from '@salon-spa-saas/contracts';
import type { LeaveBalanceSummary } from '../../domain/entities/staff.dto';
import { type LeaveRequestDto } from '../../infrastructure/repositories/leave.repository';
export declare class LeaveService {
    createLeaveRequest(tenantId: string, employeeId: string, data: CreateLeaveRequest): Promise<LeaveRequestDto>;
    getLeaveRequestById(tenantId: string, id: string): Promise<LeaveRequestDto>;
    updateLeaveRequest(tenantId: string, id: string, data: UpdateLeaveRequest): Promise<LeaveRequestDto>;
    approveLeave(tenantId: string, id: string, approverUserId?: string | null, reviewNote?: string | null): Promise<LeaveRequestDto>;
    rejectLeave(tenantId: string, id: string, rejecterUserId?: string | null, reviewNote?: string | null): Promise<LeaveRequestDto>;
    cancelLeave(tenantId: string, id: string, employeeId?: string): Promise<LeaveRequestDto>;
    queryLeave(params: {
        tenantId: string;
        employeeId?: string;
        status?: LeaveStatus;
        startDate?: string;
        endDate?: string;
        page?: number;
        limit?: number;
    }): Promise<{
        items: LeaveRequestDto[];
        total: number;
        page: number;
        limit: number;
    }>;
    getLeaveBalances(tenantId: string, employeeId: string, year?: number): Promise<LeaveBalanceSummary[]>;
    adjustLeaveBalance(tenantId: string, employeeId: string, data: AdjustLeaveBalanceRequest, adjustedByUserId?: string | null): Promise<LeaveBalanceSummary>;
}
export declare const leaveService: LeaveService;
//# sourceMappingURL=leave.service.d.ts.map