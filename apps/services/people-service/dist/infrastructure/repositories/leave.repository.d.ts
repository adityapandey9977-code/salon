import type { LeaveBalanceSummary } from '../../domain/entities/staff.dto';
import { type LeaveStatus, type LeaveType } from '../prisma/generated-client';
export interface LeaveRequestDto {
    id: string;
    tenantId: string;
    employeeId: string;
    leaveType: LeaveType;
    startDate: string;
    endDate: string;
    reason: string | null;
    status: LeaveStatus;
    requestedAt: string;
    approvedAt: string | null;
    rejectedAt: string | null;
    approvedByIdentityUserId: string | null;
    rejectedByIdentityUserId: string | null;
    reviewNote: string | null;
    createdAt: string;
    updatedAt: string;
}
export declare class LeaveRepository {
    private toRequestDto;
    private toBalanceDto;
    findRequestById(tenantId: string, id: string): Promise<LeaveRequestDto | null>;
    createLeaveRequest(data: {
        tenantId: string;
        employeeId: string;
        leaveType: LeaveType;
        startDate: Date;
        endDate: Date;
        reason?: string | null;
    }): Promise<LeaveRequestDto>;
    updateLeaveRequest(tenantId: string, id: string, data: {
        leaveType?: LeaveType;
        startDate?: Date;
        endDate?: Date;
        reason?: string | null;
    }): Promise<LeaveRequestDto>;
    approveLeaveRequest(params: {
        tenantId: string;
        id: string;
        approverUserId?: string | null;
        reviewNote?: string | null;
    }): Promise<LeaveRequestDto>;
    rejectLeaveRequest(params: {
        tenantId: string;
        id: string;
        rejecterUserId?: string | null;
        reviewNote?: string | null;
    }): Promise<LeaveRequestDto>;
    cancelLeaveRequest(tenantId: string, id: string, employeeId?: string): Promise<LeaveRequestDto>;
    queryLeaveRequests(params: {
        tenantId: string;
        employeeId?: string;
        status?: LeaveStatus;
        startDate?: Date;
        endDate?: Date;
        page?: number;
        limit?: number;
    }): Promise<{
        items: LeaveRequestDto[];
        total: number;
        page: number;
        limit: number;
    }>;
    getLeaveBalances(tenantId: string, employeeId: string, year?: number): Promise<LeaveBalanceSummary[]>;
    adjustLeaveBalance(params: {
        tenantId: string;
        employeeId: string;
        leaveType: LeaveType;
        year: number;
        adjustmentAmount: number;
        reason: string;
        adjustedByUserId?: string | null;
    }): Promise<LeaveBalanceSummary>;
}
export declare const leaveRepository: LeaveRepository;
//# sourceMappingURL=leave.repository.d.ts.map