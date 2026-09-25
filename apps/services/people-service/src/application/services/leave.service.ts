import { NotFoundError, ValidationError } from '@salon-spa-saas/common-types';
import type {
  AdjustLeaveBalanceRequest,
  CreateLeaveRequest,
  LeaveStatus,
  UpdateLeaveRequest,
} from '@salon-spa-saas/contracts';
import type { LeaveBalanceSummary } from '../../domain/entities/staff.dto';
import { eventPublisher } from '../../infrastructure/messaging/publisher';
import { employeeRepository } from '../../infrastructure/repositories/employee.repository';
import {
  type LeaveRequestDto,
  leaveRepository,
} from '../../infrastructure/repositories/leave.repository';

export class LeaveService {
  public async createLeaveRequest(
    tenantId: string,
    employeeId: string,
    data: CreateLeaveRequest,
  ): Promise<LeaveRequestDto> {
    const employee = await employeeRepository.findById(tenantId, employeeId);
    if (!employee) {
      throw new NotFoundError('Employee not found');
    }

    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);

    if (endDate < startDate) {
      throw new ValidationError('End date cannot be earlier than start date');
    }

    const request = await leaveRepository.createLeaveRequest({
      tenantId,
      employeeId,
      leaveType: data.leaveType,
      startDate,
      endDate,
      reason: data.reason,
    });

    await eventPublisher.publishEvent({
      eventType: 'LeaveRequested',
      aggregateType: 'LeaveRequest',
      aggregateId: request.id,
      tenantId,
      payload: {
        tenantId,
        employeeId,
        leaveRequestId: request.id,
        leaveType: request.leaveType,
        startDate: request.startDate,
        endDate: request.endDate,
        requestedAt: request.requestedAt,
      },
    });

    return request;
  }

  public async getLeaveRequestById(tenantId: string, id: string): Promise<LeaveRequestDto> {
    const request = await leaveRepository.findRequestById(tenantId, id);
    if (!request) {
      throw new NotFoundError('Leave request not found');
    }
    return request;
  }

  public async updateLeaveRequest(
    tenantId: string,
    id: string,
    data: UpdateLeaveRequest,
  ): Promise<LeaveRequestDto> {
    const startDate = data.startDate ? new Date(data.startDate) : undefined;
    const endDate = data.endDate ? new Date(data.endDate) : undefined;

    if (startDate && endDate && endDate < startDate) {
      throw new ValidationError('End date cannot be earlier than start date');
    }

    return leaveRepository.updateLeaveRequest(tenantId, id, {
      leaveType: data.leaveType,
      startDate,
      endDate,
      reason: data.reason,
    });
  }

  public async approveLeave(
    tenantId: string,
    id: string,
    approverUserId?: string | null,
    reviewNote?: string | null,
  ): Promise<LeaveRequestDto> {
    const approved = await leaveRepository.approveLeaveRequest({
      tenantId,
      id,
      approverUserId,
      reviewNote,
    });

    await eventPublisher.publishEvent({
      eventType: 'LeaveApproved',
      aggregateType: 'LeaveRequest',
      aggregateId: id,
      tenantId,
      userId: approverUserId,
      payload: {
        tenantId,
        employeeId: approved.employeeId,
        leaveRequestId: id,
        status: 'APPROVED',
        decidedBy: approverUserId || null,
        decidedAt: approved.approvedAt!,
        reviewNote: approved.reviewNote || undefined,
      },
    });

    return approved;
  }

  public async rejectLeave(
    tenantId: string,
    id: string,
    rejecterUserId?: string | null,
    reviewNote?: string | null,
  ): Promise<LeaveRequestDto> {
    const rejected = await leaveRepository.rejectLeaveRequest({
      tenantId,
      id,
      rejecterUserId,
      reviewNote,
    });

    await eventPublisher.publishEvent({
      eventType: 'LeaveRejected',
      aggregateType: 'LeaveRequest',
      aggregateId: id,
      tenantId,
      userId: rejecterUserId,
      payload: {
        tenantId,
        employeeId: rejected.employeeId,
        leaveRequestId: id,
        status: 'REJECTED',
        decidedBy: rejecterUserId || null,
        decidedAt: rejected.rejectedAt!,
        reviewNote: rejected.reviewNote || undefined,
      },
    });

    return rejected;
  }

  public async cancelLeave(
    tenantId: string,
    id: string,
    employeeId?: string,
  ): Promise<LeaveRequestDto> {
    return leaveRepository.cancelLeaveRequest(tenantId, id, employeeId);
  }

  public async queryLeave(params: {
    tenantId: string;
    employeeId?: string;
    status?: LeaveStatus;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }): Promise<{ items: LeaveRequestDto[]; total: number; page: number; limit: number }> {
    return leaveRepository.queryLeaveRequests({
      tenantId: params.tenantId,
      employeeId: params.employeeId,
      status: params.status,
      startDate: params.startDate ? new Date(params.startDate) : undefined,
      endDate: params.endDate ? new Date(params.endDate) : undefined,
      page: params.page,
      limit: params.limit,
    });
  }

  public async getLeaveBalances(
    tenantId: string,
    employeeId: string,
    year?: number,
  ): Promise<LeaveBalanceSummary[]> {
    const employee = await employeeRepository.findById(tenantId, employeeId);
    if (!employee) {
      throw new NotFoundError('Employee not found');
    }
    return leaveRepository.getLeaveBalances(tenantId, employeeId, year);
  }

  public async adjustLeaveBalance(
    tenantId: string,
    employeeId: string,
    data: AdjustLeaveBalanceRequest,
    adjustedByUserId?: string | null,
  ): Promise<LeaveBalanceSummary> {
    const employee = await employeeRepository.findById(tenantId, employeeId);
    if (!employee) {
      throw new NotFoundError('Employee not found');
    }

    return leaveRepository.adjustLeaveBalance({
      tenantId,
      employeeId,
      leaveType: data.leaveType,
      year: data.year,
      adjustmentAmount: data.adjustmentAmount,
      reason: data.reason,
      adjustedByUserId,
    });
  }
}

export const leaveService = new LeaveService();
