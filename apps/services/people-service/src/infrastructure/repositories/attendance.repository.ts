import { prisma } from '../prisma/client';
import {
  Prisma,
  type AttendanceMethod,
  type AttendanceRecord,
  type AttendanceStatus,
} from '../prisma/generated-client';

export interface AttendanceRecordDto {
  id: string;
  tenantId: string;
  employeeId: string;
  branchId: string;
  attendanceDate: string;
  clockInAt: string | null;
  clockOutAt: string | null;
  status: AttendanceStatus;
  lateMinutes: number;
  earlyLeaveMinutes: number;
  overtimeMinutes: number;
  clockInMethod: AttendanceMethod | null;
  clockOutMethod: AttendanceMethod | null;
  clockInLatitude: number | null;
  clockInLongitude: number | null;
  clockOutLatitude: number | null;
  clockOutLongitude: number | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export class AttendanceRepository {
  private toDto(item: AttendanceRecord): AttendanceRecordDto {
    return {
      id: item.id,
      tenantId: item.tenantId,
      employeeId: item.employeeId,
      branchId: item.branchId,
      attendanceDate: item.attendanceDate.toISOString().split('T')[0],
      clockInAt: item.clockInAt ? item.clockInAt.toISOString() : null,
      clockOutAt: item.clockOutAt ? item.clockOutAt.toISOString() : null,
      status: item.status,
      lateMinutes: item.lateMinutes,
      earlyLeaveMinutes: item.earlyLeaveMinutes,
      overtimeMinutes: item.overtimeMinutes,
      clockInMethod: item.clockInMethod,
      clockOutMethod: item.clockOutMethod,
      clockInLatitude: item.clockInLatitude ? Number(item.clockInLatitude) : null,
      clockInLongitude: item.clockInLongitude ? Number(item.clockInLongitude) : null,
      clockOutLatitude: item.clockOutLatitude ? Number(item.clockOutLatitude) : null,
      clockOutLongitude: item.clockOutLongitude ? Number(item.clockOutLongitude) : null,
      notes: item.notes,
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
    };
  }

  public async findByEmployeeAndDate(
    tenantId: string,
    employeeId: string,
    attendanceDate: Date,
  ): Promise<AttendanceRecordDto | null> {
    const record = await prisma.attendanceRecord.findUnique({
      where: {
        tenantId_employeeId_attendanceDate: {
          tenantId,
          employeeId,
          attendanceDate,
        },
      },
    });
    return record ? this.toDto(record) : null;
  }

  public async findActiveClockIn(
    tenantId: string,
    employeeId: string,
    attendanceDate: Date,
  ): Promise<AttendanceRecordDto | null> {
    const record = await prisma.attendanceRecord.findFirst({
      where: {
        tenantId,
        employeeId,
        attendanceDate,
        clockInAt: { not: null },
        clockOutAt: null,
      },
    });
    return record ? this.toDto(record) : null;
  }

  public async createClockIn(data: {
    tenantId: string;
    employeeId: string;
    branchId: string;
    attendanceDate: Date;
    clockInAt: Date;
    method?: AttendanceMethod;
    latitude?: number | null;
    longitude?: number | null;
    notes?: string | null;
  }): Promise<AttendanceRecordDto> {
    const record = await prisma.attendanceRecord.create({
      data: {
        tenantId: data.tenantId,
        employeeId: data.employeeId,
        branchId: data.branchId,
        attendanceDate: data.attendanceDate,
        clockInAt: data.clockInAt,
        status: 'PRESENT',
        clockInMethod: data.method || 'WEB',
        clockInLatitude: data.latitude !== undefined && data.latitude !== null ? new Prisma.Decimal(data.latitude) : null,
        clockInLongitude: data.longitude !== undefined && data.longitude !== null ? new Prisma.Decimal(data.longitude) : null,
        notes: data.notes || null,
      },
    });
    return this.toDto(record);
  }

  public async updateClockOut(
    id: string,
    data: {
      clockOutAt: Date;
      status: AttendanceStatus;
      lateMinutes: number;
      earlyLeaveMinutes: number;
      overtimeMinutes: number;
      method?: AttendanceMethod;
      latitude?: number | null;
      longitude?: number | null;
      notes?: string | null;
    },
  ): Promise<AttendanceRecordDto> {
    const updated = await prisma.attendanceRecord.update({
      where: { id },
      data: {
        clockOutAt: data.clockOutAt,
        status: data.status,
        lateMinutes: data.lateMinutes,
        earlyLeaveMinutes: data.earlyLeaveMinutes,
        overtimeMinutes: data.overtimeMinutes,
        clockOutMethod: data.method || 'WEB',
        clockOutLatitude: data.latitude !== undefined && data.latitude !== null ? new Prisma.Decimal(data.latitude) : null,
        clockOutLongitude: data.longitude !== undefined && data.longitude !== null ? new Prisma.Decimal(data.longitude) : null,
        ...(data.notes ? { notes: data.notes } : {}),
      },
    });
    return this.toDto(updated);
  }

  public async recordManualAttendance(data: {
    tenantId: string;
    employeeId: string;
    branchId: string;
    attendanceDate: Date;
    clockInAt?: Date | null;
    clockOutAt?: Date | null;
    status: AttendanceStatus;
    lateMinutes?: number;
    earlyLeaveMinutes?: number;
    overtimeMinutes?: number;
    notes?: string | null;
  }): Promise<AttendanceRecordDto> {
    const record = await prisma.attendanceRecord.upsert({
      where: {
        tenantId_employeeId_attendanceDate: {
          tenantId: data.tenantId,
          employeeId: data.employeeId,
          attendanceDate: data.attendanceDate,
        },
      },
      create: {
        tenantId: data.tenantId,
        employeeId: data.employeeId,
        branchId: data.branchId,
        attendanceDate: data.attendanceDate,
        clockInAt: data.clockInAt || null,
        clockOutAt: data.clockOutAt || null,
        status: data.status,
        lateMinutes: data.lateMinutes ?? 0,
        earlyLeaveMinutes: data.earlyLeaveMinutes ?? 0,
        overtimeMinutes: data.overtimeMinutes ?? 0,
        clockInMethod: 'MANUAL',
        clockOutMethod: data.clockOutAt ? 'MANUAL' : null,
        notes: data.notes || null,
      },
      update: {
        branchId: data.branchId,
        clockInAt: data.clockInAt || null,
        clockOutAt: data.clockOutAt || null,
        status: data.status,
        lateMinutes: data.lateMinutes ?? 0,
        earlyLeaveMinutes: data.earlyLeaveMinutes ?? 0,
        overtimeMinutes: data.overtimeMinutes ?? 0,
        notes: data.notes || null,
      },
    });

    return this.toDto(record);
  }

  public async queryAttendance(params: {
    tenantId: string;
    branchId?: string;
    employeeId?: string;
    startDate?: Date;
    endDate?: Date;
    status?: AttendanceStatus;
    page?: number;
    limit?: number;
  }): Promise<{ items: AttendanceRecordDto[]; total: number; page: number; limit: number }> {
    const page = params.page || 1;
    const limit = Math.min(params.limit || 20, 100);
    const skip = (page - 1) * limit;

    const where: Prisma.AttendanceRecordWhereInput = {
      tenantId: params.tenantId,
    };

    if (params.branchId) where.branchId = params.branchId;
    if (params.employeeId) where.employeeId = params.employeeId;
    if (params.status) where.status = params.status;
    if (params.startDate && params.endDate) {
      where.attendanceDate = {
        gte: params.startDate,
        lte: params.endDate,
      };
    } else if (params.startDate) {
      where.attendanceDate = { gte: params.startDate };
    }

    const [records, total] = await Promise.all([
      prisma.attendanceRecord.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ attendanceDate: 'desc' }, { createdAt: 'desc' }],
      }),
      prisma.attendanceRecord.count({ where }),
    ]);

    return {
      items: records.map((r) => this.toDto(r)),
      total,
      page,
      limit,
    };
  }
}

export const attendanceRepository = new AttendanceRepository();
