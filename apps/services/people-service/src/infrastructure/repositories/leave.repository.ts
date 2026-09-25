import { ConflictError, NotFoundError } from '@salon-spa-saas/common-types';
import type { LeaveBalanceSummary } from '../../domain/entities/staff.dto';
import { prisma } from '../prisma/client';
import {
  Prisma,
  type LeaveBalance,
  type LeaveRequest,
  type LeaveStatus,
  type LeaveType,
} from '../prisma/generated-client';

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

export class LeaveRepository {
  private toRequestDto(item: LeaveRequest): LeaveRequestDto {
    return {
      id: item.id,
      tenantId: item.tenantId,
      employeeId: item.employeeId,
      leaveType: item.leaveType,
      startDate: item.startDate.toISOString().split('T')[0],
      endDate: item.endDate.toISOString().split('T')[0],
      reason: item.reason,
      status: item.status,
      requestedAt: item.requestedAt.toISOString(),
      approvedAt: item.approvedAt ? item.approvedAt.toISOString() : null,
      rejectedAt: item.rejectedAt ? item.rejectedAt.toISOString() : null,
      approvedByIdentityUserId: item.approvedByIdentityUserId,
      rejectedByIdentityUserId: item.rejectedByIdentityUserId,
      reviewNote: item.reviewNote,
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
    };
  }

  private toBalanceDto(item: LeaveBalance): LeaveBalanceSummary {
    const opening = Number(item.openingBalance);
    const accrued = Number(item.accrued);
    const used = Number(item.used);
    const adjusted = Number(item.adjusted);
    return {
      id: item.id,
      employeeId: item.employeeId,
      leaveType: item.leaveType,
      year: item.year,
      openingBalance: opening,
      accrued,
      used,
      adjusted,
      currentBalance: opening + accrued + adjusted - used,
    };
  }

  public async findRequestById(tenantId: string, id: string): Promise<LeaveRequestDto | null> {
    const record = await prisma.leaveRequest.findFirst({
      where: { id, tenantId },
    });
    return record ? this.toRequestDto(record) : null;
  }

  public async createLeaveRequest(data: {
    tenantId: string;
    employeeId: string;
    leaveType: LeaveType;
    startDate: Date;
    endDate: Date;
    reason?: string | null;
  }): Promise<LeaveRequestDto> {
    const record = await prisma.leaveRequest.create({
      data: {
        tenantId: data.tenantId,
        employeeId: data.employeeId,
        leaveType: data.leaveType,
        startDate: data.startDate,
        endDate: data.endDate,
        reason: data.reason || null,
        status: 'PENDING',
      },
    });
    return this.toRequestDto(record);
  }

  public async updateLeaveRequest(
    tenantId: string,
    id: string,
    data: {
      leaveType?: LeaveType;
      startDate?: Date;
      endDate?: Date;
      reason?: string | null;
    },
  ): Promise<LeaveRequestDto> {
    const existing = await prisma.leaveRequest.findFirst({
      where: { id, tenantId },
    });

    if (!existing) {
      throw new NotFoundError('Leave request not found');
    }

    if (existing.status !== 'PENDING') {
      throw new ConflictError(`Cannot update leave request in ${existing.status} status`);
    }

    const updated = await prisma.leaveRequest.update({
      where: { id },
      data: {
        ...(data.leaveType ? { leaveType: data.leaveType } : {}),
        ...(data.startDate ? { startDate: data.startDate } : {}),
        ...(data.endDate ? { endDate: data.endDate } : {}),
        ...(data.reason !== undefined ? { reason: data.reason } : {}),
      },
    });

    return this.toRequestDto(updated);
  }

  public async approveLeaveRequest(params: {
    tenantId: string;
    id: string;
    approverUserId?: string | null;
    reviewNote?: string | null;
  }): Promise<LeaveRequestDto> {
    const result = await prisma.$transaction(async (tx) => {
      const existing = await tx.leaveRequest.findFirst({
        where: { id: params.id, tenantId: params.tenantId },
      });

      if (!existing) {
        throw new NotFoundError('Leave request not found');
      }

      if (existing.status !== 'PENDING') {
        throw new ConflictError(
          `Leave request cannot be approved because it is already ${existing.status}`,
        );
      }

      // Calculate days count
      const startMs = existing.startDate.getTime();
      const endMs = existing.endDate.getTime();
      const daysCount = Math.max(1, Math.round((endMs - startMs) / (1000 * 60 * 60 * 24)) + 1);
      const leaveYear = existing.startDate.getFullYear();

      // Update Leave Request
      const updatedRequest = await tx.leaveRequest.update({
        where: { id: params.id },
        data: {
          status: 'APPROVED',
          approvedAt: new Date(),
          approvedByIdentityUserId: params.approverUserId || null,
          reviewNote: params.reviewNote || null,
        },
      });

      // Update Leave Balance
      await tx.leaveBalance.upsert({
        where: {
          tenantId_employeeId_leaveType_year: {
            tenantId: params.tenantId,
            employeeId: existing.employeeId,
            leaveType: existing.leaveType,
            year: leaveYear,
          },
        },
        create: {
          tenantId: params.tenantId,
          employeeId: existing.employeeId,
          leaveType: existing.leaveType,
          year: leaveYear,
          openingBalance: 0,
          accrued: 0,
          used: daysCount,
          adjusted: 0,
        },
        update: {
          used: { increment: daysCount },
        },
      });

      return updatedRequest;
    });

    return this.toRequestDto(result);
  }

  public async rejectLeaveRequest(params: {
    tenantId: string;
    id: string;
    rejecterUserId?: string | null;
    reviewNote?: string | null;
  }): Promise<LeaveRequestDto> {
    const existing = await prisma.leaveRequest.findFirst({
      where: { id: params.id, tenantId: params.tenantId },
    });

    if (!existing) {
      throw new NotFoundError('Leave request not found');
    }

    if (existing.status !== 'PENDING') {
      throw new ConflictError(
        `Leave request cannot be rejected because it is already ${existing.status}`,
      );
    }

    const updated = await prisma.leaveRequest.update({
      where: { id: params.id },
      data: {
        status: 'REJECTED',
        rejectedAt: new Date(),
        rejectedByIdentityUserId: params.rejecterUserId || null,
        reviewNote: params.reviewNote || null,
      },
    });

    return this.toRequestDto(updated);
  }

  public async cancelLeaveRequest(tenantId: string, id: string, employeeId?: string): Promise<LeaveRequestDto> {
    const where: Prisma.LeaveRequestWhereInput = { id, tenantId };
    if (employeeId) where.employeeId = employeeId;

    const existing = await prisma.leaveRequest.findFirst({ where });

    if (!existing) {
      throw new NotFoundError('Leave request not found');
    }

    if (existing.status !== 'PENDING') {
      throw new ConflictError(`Cannot cancel leave request in ${existing.status} status`);
    }

    const updated = await prisma.leaveRequest.update({
      where: { id },
      data: { status: 'CANCELLED' },
    });

    return this.toRequestDto(updated);
  }

  public async queryLeaveRequests(params: {
    tenantId: string;
    employeeId?: string;
    status?: LeaveStatus;
    startDate?: Date;
    endDate?: Date;
    page?: number;
    limit?: number;
  }): Promise<{ items: LeaveRequestDto[]; total: number; page: number; limit: number }> {
    const page = params.page || 1;
    const limit = Math.min(params.limit || 20, 100);
    const skip = (page - 1) * limit;

    const where: Prisma.LeaveRequestWhereInput = {
      tenantId: params.tenantId,
    };

    if (params.employeeId) where.employeeId = params.employeeId;
    if (params.status) where.status = params.status;
    if (params.startDate && params.endDate) {
      where.startDate = { gte: params.startDate, lte: params.endDate };
    }

    const [items, total] = await Promise.all([
      prisma.leaveRequest.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ requestedAt: 'desc' }],
      }),
      prisma.leaveRequest.count({ where }),
    ]);

    return {
      items: items.map((r) => this.toRequestDto(r)),
      total,
      page,
      limit,
    };
  }

  public async getLeaveBalances(
    tenantId: string,
    employeeId: string,
    year?: number,
  ): Promise<LeaveBalanceSummary[]> {
    const targetYear = year || new Date().getFullYear();
    const balances = await prisma.leaveBalance.findMany({
      where: {
        tenantId,
        employeeId,
        year: targetYear,
      },
    });
    return balances.map((b) => this.toBalanceDto(b));
  }

  public async adjustLeaveBalance(params: {
    tenantId: string;
    employeeId: string;
    leaveType: LeaveType;
    year: number;
    adjustmentAmount: number;
    reason: string;
    adjustedByUserId?: string | null;
  }): Promise<LeaveBalanceSummary> {
    const result = await prisma.$transaction(async (tx) => {
      const balance = await tx.leaveBalance.upsert({
        where: {
          tenantId_employeeId_leaveType_year: {
            tenantId: params.tenantId,
            employeeId: params.employeeId,
            leaveType: params.leaveType,
            year: params.year,
          },
        },
        create: {
          tenantId: params.tenantId,
          employeeId: params.employeeId,
          leaveType: params.leaveType,
          year: params.year,
          openingBalance: 0,
          accrued: 0,
          used: 0,
          adjusted: params.adjustmentAmount,
        },
        update: {
          adjusted: { increment: params.adjustmentAmount },
        },
      });

      await tx.leaveAdjustmentHistory.create({
        data: {
          tenantId: params.tenantId,
          employeeId: params.employeeId,
          leaveType: params.leaveType,
          year: params.year,
          adjustmentAmount: new Prisma.Decimal(params.adjustmentAmount),
          reason: params.reason,
          adjustedByIdentityUserId: params.adjustedByUserId || null,
        },
      });

      return balance;
    });

    return this.toBalanceDto(result);
  }
}

export const leaveRepository = new LeaveRepository();
